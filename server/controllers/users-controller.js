import { successResponse, generateToken, errorResponse } from '../utils/helpers';
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
    User.create({ ...user, hash: user.password }).then(({ dataValues }) => {
      const { id, username } = dataValues;
      const token = generateToken({ id, username });
      dataValues.token = token;
      delete dataValues.hash;
      successResponse(res, { user: dataValues }, 201);
    }).catch((err) => {
      const errors = err.errors ? err.errors.map((e) => {
        if (e.validatorKey === 'not_unique') {
          return `${e.path} already exists`;
        }
        return e.message;
      }) : [err.message];
      errorResponse(res, errors, 409);
    });
  }
}

export default UsersController;
