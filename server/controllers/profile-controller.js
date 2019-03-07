import { successResponse, errorResponse } from '../utils/helpers';
import db from '../models';

const { User } = db;

/**
 * The controllers for users route
 *
 * @class UsersController
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
            errorResponse(res, 'username does not exist');
          }
          delete data.dataValues.hash;
          successResponse(
            res,
            {
              user: data
            },
            200
          );
        })
        .catch(error => res.send(error.message));
    } catch (error) {
      errorResponse(res, error.message);
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
        attributes: ['username', 'email', 'bio', 'image']
      })
        .then(data => {
          if (!data) {
            errorResponse(res, 'No User(s)', 400);
          }
          successResponse(
            res,
            {
              user: data
            },
            200
          );
        })
        .catch(error => errorResponse(res, error));
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }
}

export default ProfileController;
