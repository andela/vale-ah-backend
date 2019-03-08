import { successResponse, errorResponse, uploadImages } from '../utils/helpers';
import { User, Sequelize } from '../models';

/**
 * The controllers for users route
 *
 * @class UsersController
 */
class UsersController {
  /**
   * @param {string} username
   * @param {integer} id
   * @returns {object} user
   */
  static async checkUniqueUserName(username, id) {
    const { Op } = Sequelize;
    const user = await User.findOne({
      where: {
        username,
        id: { [Op.ne]: id }
      }
    });
    return user === null;
  }

  /**
   * update user profile
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined}
   */
  static async updateUser(req, res) {
    try {
      const { authUser } = req;
      const { username, bio } = req.body;
      const user = await User.findOne({ where: { id: authUser.id } });
      if (authUser.id !== user.dataValues.id) {
        return errorResponse(res, 'you cannot edit this entry', 401);
      }
      const isUnique = await UsersController.checkUniqueUserName(
        username,
        authUser.id
      );
      if (!isUnique) {
        return errorResponse(res, 'username already exist', 400);
      }
      let imagePath = '';
      if (req.file) {
        imagePath = await uploadImages(req.file);
      }
      const data = await user.update({
        username,
        bio,
        imagePath
      });
      successResponse(res, { message: 'update successful', user: data }, 200);
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }
}

export default UsersController;
