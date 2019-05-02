import sequelize from 'sequelize';
import db from '../models';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse
} from '../utils/helpers';
import { commentSchema } from '../utils/validators';

const { Comment, Recipe, CommentLike, User } = db;

/**
 * The controllers for comment route
 *
 * @class CommentController
 */
class CommentController {
  /**
   * Comment registeration controller
   * @static
   * @param {*} req Express request object
   * @param {*} res Express request object
   * @memberof CommentController
   * @returns {undefined}
   */
  static async create(req, res) {
    const {
      params: { slug },
      body: { body },
      user: { id: userId }
    } = req;
    try {
      await validate(req.body, commentSchema);
      const recipe = await Recipe.findOne({
        where: { slug }
      });
      if (!recipe) {
        return errorResponse(res, 'This recipe does not exist', 400);
      }
      const {
        dataValues: { id: recipeId }
      } = recipe;
      Comment.create({ userId, recipeId, body }, { returning: true })
        .then(({ dataValues }) => successResponse(res, dataValues, 201))
        .catch(err => errorResponse(res, err, 400));
    } catch (err) {
      return validationErrorResponse(res, err.details);
    }
  }

  /**
   * Fetching all Comments by Recipe
   * @static
   * @param {*} req Express request object
   * @param {*} res Express request object
   * @memberof CommentController
   * @returns {undefined}
   */
  static async getAllComments(req, res) {
    const { slug } = req.params;
    const recipe = await Recipe.findAll({ where: { slug } });
    if (!recipe[0]) {
      return errorResponse(res, 'This recipe does not exist', 400);
    }
    await Comment.findAll({
      attributes: {
        exclude: ['recipeId', 'userId'],
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('CommentLikes.commentId')),
            'like(s)'
          ]
        ]
      },
      include: [
        {
          as: 'author',
          model: User,
          attributes: ['username', 'bio', 'image']
        },
        {
          model: CommentLike,
          attributes: []
        }
      ],
      group: ['CommentLikes.id', 'Comment.id', 'author.id'],
      subQuery: false
    })
      .then(dataValue => successResponse(res, { comments: dataValue }, 200))
      .catch(err => {
        return errorResponse(res, err.message, 400);
      });
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof CommentController
   * @returns {object} response
   */
  static async commentLikes(req, res) {
    const { id } = req.user;
    const { commentId } = req.params;

    try {
      const comment = await Comment.findOne({
        where: { userId: id, id: commentId }
      });
      if (comment === null) {
        return errorResponse(res, 'comment not found', 404);
      }

      const like = await CommentLike.findOne({
        where: {
          userId: id,
          commentId: comment.id
        }
      });

      if (!comment) {
        return errorResponse(res, { message: 'comment not found' }, 404);
      }
      if (!like) {
        await CommentLike.create({
          userId: id,
          commentId: comment.id
        });
        successResponse(res, { message: 'you like this comment' }, 201);
      } else {
        await CommentLike.destroy({
          where: { userId: id, commentId: comment.id }
        });
        successResponse(res, { message: 'you retracted your like' }, 200);
      }
    } catch (err) {
      errorResponse(res);
    }
  }
}

export default CommentController;
