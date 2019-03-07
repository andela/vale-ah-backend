import {
  successResponse, generateToken, errorResponse, validate, validationErrorResponse
} from '../utils/helpers';
import db from '../models';
import registerSchema from '../utils/validators';

const { User } = db;

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
    const { body } = req;
    validate(body, registerSchema).then(async () => {
      try {
        const { dataValues: user } = await User.create({ ...body, hash: body.password });
        const { id, username } = user;
        const token = generateToken({ id, username });
        user.token = token;
        delete user.hash;
        successResponse(res, { user }, 201);
      } catch (err) {
        const errors = err.errors ? err.errors.map((e) => {
          if (e.validatorKey === 'not_unique') {
            return `${e.path} already exists`;
          }
          return e.message;
        }) : [err.message];
        errorResponse(res, errors, 409);
      }
    }).catch(({ details }) => {
      validationErrorResponse(res, details, 400);
    });
  }
}

export default UsersController;
