import {
  getAuthHeaderToken,
  verifyToken,
  errorResponse
} from '../utils/helpers';
import db from '../models';

const { User } = db;

export default (req, res, next) => {
  const errorMessage = 'You are not authenticated!';
  const token = getAuthHeaderToken(req);
  const payload = verifyToken(token);
  if (!payload) return errorResponse(res, errorMessage, 401);
  User.findOne({ where: { id: payload.id } })
    .then(({ dataValues: user }) => {
      req.user = user;
      next();
    })
    .catch(() => {
      errorResponse(res, errorMessage, 401);
    });
};
