import {
  successResponse,
  generateToken,
  errorResponse,
  comparePassword,
  uploadImages,
  verifyToken
} from '../utils/helpers';
import { User } from '../models';

/**
 * The controllers for users route
 *
 * @class UsersController
 */
class UsersController {
  /**
   * User registration controller
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Function} next
   * @memberof UsersController
   * @returns {undefined}
   */
  static register(req, res) {
    const { user } = req.body;
    User.create({ ...user, hash: user.password })
      .then(({ dataValues }) => {
        const { id, username } = dataValues;
        const token = generateToken({ id, username });
        dataValues.token = token;
        delete dataValues.hash;
        successResponse(res, { user: dataValues }, 201);
      })
      .catch(err => {
        const errors = err.errors
          ? err.errors.map(e => {
              if (e.validatorKey === 'not_unique') {
                return `${e.path} already exists`;
              }
              return e.message;
            })
          : [err.message];
        errorResponse(res, errors, 409);
      });
  }

  /**
   * User Login
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Function} next
   * @memberof UsersController
   * @returns {undefined}
   */
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return errorResponse(res, 'missing Email/Password', 400);
      }
      const rows = await User.findOne({ where: { email } });
      const { id, username, hash } = rows.dataValues;
      if (!rows || !comparePassword(hash, password)) {
        return errorResponse(res, 'incorrect Email/Password', 400);
      }
      const token = generateToken({ id, username });
      rows.dataValues.token = token;
      delete rows.dataValues.hash;
      successResponse(res, { user: rows.dataValues }, 200);
    } catch (error) {
      return errorResponse(res, error.message);
    }
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
      const users = verifyToken(req.headers['x-access-token']);
      const { email, username, bio } = req.body;
      const rows = await User.findOne({ where: { id: users.id } });
      if (!rows) {
        errorResponse(res, 'record not found', 404);
      } else if (rows && email !== rows.dataValues.email) {
        return errorResponse(res, 'you cannot edit this entry', 401);
      }
      let imagePath = '';
      if (req.file) {
        imagePath = await uploadImages(req.file);
      }
      return User.findByPk(users.id).then(user => {
        user
          .update({
            username,
            bio,
            imagePath
          })
          .then(data => {
            successResponse(
              res,
              { status: 200, message: 'update successful', user: data },
              200
            );
          })
          .catch(err => errorResponse(res, err.message));
      });
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
  }
}

export default UsersController;
