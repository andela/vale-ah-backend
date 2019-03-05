import { validate, errorResponse } from '../utils/helpers';
import registerSchema from '../utils/validators';
/**
 *Users endpoint middlewares
 *
 * @export
 * @class UsersMiddleware
 */
export default class UsersMiddleware {
  /**
      *Validates the register endpoint
      * @returns {undefined}
      * @static
      * @param {*} req
      * @param {*} res
      * @param {*} next
      * @memberof UsersMiddleware
      */
  static validateRegister(req, res, next) {
    validate(req.body.user, registerSchema).then(() => next()).catch((err) => {
      const errors = err.details.map(e => e.message);
      errorResponse(res, errors, 400);
    });
  }
}
