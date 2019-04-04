import {
  generateToken,
  successResponse,
  errorResponse
} from '../utils/helpers';
import db from '../models';

const { User } = db;

/**
 * @param {*} req Express request object
 * @param {*} res Express request object
 * @returns{undefined}
 */
function authUser(req, res) {
  const userInfo = req.user;
  if (userInfo.emails === undefined) {
    return errorResponse(res, 'No email found. Add email', 500);
  }
  User.findOrCreate({
    where: { email: userInfo.emails[0].value },
    default: {
      username: userInfo.displayName.split(' ')[0],
      email: userInfo.emails,
      image: userInfo.photos[0].value,
      provider: userInfo.provider
    }
  }).then(([user]) => {
    const { email } = user;
    const verificationToken = generateToken({ email }, '1d');
    user.token = verificationToken;
    return successResponse(res, user, 200);
  });
}

export default authUser;
