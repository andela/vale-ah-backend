import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { Comment } = db;

/**
 * The controllers for comment route
 *
 * @class CommentController
 */
class CommentController {
  /**
   * Comment registeration controller
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Funtion} next
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async create(req, res) {
    const { body } = req.body;
    Comment.create({ body })
      .then(({ dataValues }) => {
        successResponse(res, dataValues, 201);
      })
      .catch(err => errorResponse(res, err, 400));
  }
}

export default CommentController;
