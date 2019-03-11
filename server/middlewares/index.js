import db from '../models';
import { errorResponse, verifyToken } from '../utils/helpers';

const { User } = db;
/**
 *Users endpoint middlewares
 *
 * @export
 * @class UsersMiddleware
 */
export default class UsersMiddleware {
  /**
   *Validates token
   * @returns {undefined}
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof UsersMiddleware
   */
  static async validUser(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return errorResponse(res, 'Token is not provided', 400);
    }
    try {
      const decoded = await verifyToken(token, process.env.SECRET);
      const data = await User.findOne({
        where: { id: decoded.id }
      });
      if (!data) {
        return errorResponse(res, 'Token Provided is Invalid', 400);
      }
      delete data.dataValues.hash;
      req.user = data.dataValues;
      return next();
    } catch (error) {
      return errorResponse(res, error, 401);
    }
  }
}
