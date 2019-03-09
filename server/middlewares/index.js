import jwt from 'jsonwebtoken';
import db from '../models';

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
  static async verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).send({
        message: 'Token is not provided'
      });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const data = await User.findOne({
        where: { id: decoded.id }
      });
      if (!data) {
        return res.status(400).send({
          message: 'The token you provided is invalid'
        });
      }
      req.authUser = {
        id: decoded.id,
        username: decoded.username
      };
      return next();
    } catch (error) {
      return res.status(401).send(error);
    }
  }
}
