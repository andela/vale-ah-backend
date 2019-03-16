import db from '../models';
import { errorResponse, verifyToken, getBearerToken } from '../utils/helpers';

const { User } = db;
/**
 *Users endpoint middleware
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
    try {
      const decoded = await verifyToken(getBearerToken(req));
      const { dataValues: user } = await User.findOne({
        where: { id: decoded.id }
      });
      delete user.hash;
      req.user = user;
      return next();
    } catch (error) {
      return errorResponse(res, 'Authentication failed', 401);
    }
  }
}
