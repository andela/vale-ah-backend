import jwt from 'jsonwebtoken';
import { User } from '../models';
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
  static async verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).send({
        message: 'Token is not provided'
      });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const rows = await User.findOne({
        where: { id: decoded.id }
      });
      if (!rows) {
        return res.status(400).send({
          message: 'The token you provided is invalid'
        });
      }
      req.authUser = rows.dataValues;
      return next();
    } catch (error) {
      return res.status(401).send(error);
    }
  }
}
