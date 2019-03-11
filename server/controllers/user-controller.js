import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse,
  checkUniqueUserName
} from '../utils/helpers';
import db from '../models';
import { profileSchema } from '../utils/validators';

const { User } = db;

/**
 * The controllers for users route
 *
 * @class UsersController
 */
class UsersController {
  /**
   * update user profile
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined}
   */
  static async updateUser(req, res) {
    validate(req.body, profileSchema)
      .then(async () => {
        const { id } = req.user;
        try {
          const { username, bio, image } = req.body;
          const user = await User.findOne({
            where: { id }
          });
          if (id !== user.dataValues.id) {
            errorResponse(res, 'You are not allowed to edit this Profile', 400);
          }
          const isUnique = await checkUniqueUserName(username, id);
          if (!isUnique) {
            return errorResponse(res, 'username already exist', 409);
          }
          const data = await user.update(
            { username, bio, image },
            { returning: true, where: { id } }
          );
          successResponse(
            res,
            { message: 'update successful', user: data },
            200
          );
        } catch (error) {
          errorResponse(res, error.message, 500);
        }
      })
      .catch(({ details }) => {
        validationErrorResponse(res, details, 400);
      });
  }

  /**
   * update user profile
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined}
   */
  static async getProfile(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findOne({ where: { id } });
      if (user) {
        successResponse(res, { data: user }, 200);
      }
    } catch (err) {
      errorResponse(res, err.message, 500);
    }
  }
}

export default UsersController;