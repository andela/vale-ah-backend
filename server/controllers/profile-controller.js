import { successResponse, errorResponse } from '../utils/helpers';
import db from '../models';

const { User } = db;

/**
 * The controllers for profile route
 *
 * @class profileController
 */
class ProfileController {
  /**
   * get a particular user by username
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined} .
   */
  static async getProfile(req, res) {
    const { username } = req.params;
    try {
      return User.findOne({ where: { username } })
        .then(data => {
          if (!data) {
            return errorResponse(res, 'username does not exist', 404);
          }
          delete data.dataValues.hash;
          return successResponse(
            res,
            {
              user: data.dataValues
            },
            200
          );
        })
        .catch(() => errorResponse(res));
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * get all users
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined} .
   */
  static async getAll(req, res) {
    try {
      return User.findAll({
        attributes: ['id', 'username', 'email', 'bio', 'image']
      })
        .then(data => {
          if (!data) {
            return errorResponse(res, 'No User(s)', 400);
          }
          return successResponse(
            res,
            {
              user: data
            },
            200
          );
        })
        .catch(error => errorResponse(res, error));
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

export default ProfileController;
