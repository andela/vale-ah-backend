import db from '../models';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse
} from '../utils/helpers';
import { commentSchema } from '../utils/validators';

const { Comment, Recipe, User } = db;

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
      const parentId = recipeId;
      Comment.create({ userId, recipeId, parentId, body })
        .then(dataValues => {
          successResponse(res, dataValues, 201);
        })
        .catch(err => errorResponse(res, err, 400));
    } catch (err) {
      return validationErrorResponse(res, err.details);
    }
  }

  /**
   * Child comment registeration controller
   * @static
   * @param {*} req Express request object
   * @param {*} res Express request object
   * @memberof CommentController
   * @returns {undefined}
   */
  static async createChildComment(req, res) {
    const {
      params: { parentId },
      body: { body },
      user: { id: userId }
    } = req;
    try {
      await validate(req.body, commentSchema);
      const comment = await Comment.findOne({
        where: { parentId }
      });
      if (!comment) {
        return errorResponse(res, 'This comment does not exist', 400);
      }
      const {
        dataValues: { id: commentId }
      } = comment;
      Comment.create({ userId, commentId, parentId, body })
        .then(({ dataValues }) => successResponse(res, dataValues, 201))
        .catch(err => errorResponse(res, err.message, 400));
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
        exclude: ['recipeId', 'userId']
      },
      include: [
        {
          as: 'chef',
          model: User,
          attributes: ['username', 'bio', 'image']
        },
        {
          as: 'threaded',
          model: Comment,
          attributes: ['id', 'createdAt', 'updatedAt', 'body']
        }
      ]
    })
      .then(dataValue => {
        successResponse(res, { comments: dataValue }, 200);
      })
      .catch(err => errorResponse(res, err.message, 400));
  }
}

export default CommentController;
