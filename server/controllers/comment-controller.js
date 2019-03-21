import db from '../models';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse
} from '../utils/helpers';
import { commentSchema } from '../utils/validators';

const { Comment, Recipe } = db;

// const userFilter = {
//   attributes: {
//     include: [],
//     exclude: []
//   }
// };

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
   * @memberof RecipeController
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
      const recipe = await Recipe.findOne({ where: { slug } });
      if (!recipe) {
        return errorResponse(res, 'does not exist', 400);
      }
      const {
        dataValues: { id: recipeId }
      } = recipe;
      Comment.create({ userId, recipeId, body }, { returning: true })
        .then(({ dataValues }) => {
          successResponse(res, dataValues, 201);
        })
        .catch(err => errorResponse(res, err, 400));
    } catch (err) {
      return validationErrorResponse(res, err.details);
    }
  }
}

export default CommentController;
