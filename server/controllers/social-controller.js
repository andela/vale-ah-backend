import { generateToken, errorResponse } from '../utils/helpers';
import db from '../models';

const { User } = db;

/**
 * @param {*} req Express request object
 * @param {*} res Express request object
 * @returns{undefined}
 */
const authUser = (req, res) => {
  const userInfo = req.user;
  if (userInfo.emails === undefined) {
    return errorResponse(res, 'No email found. Add email', 400);
  }
  User.findOrCreate({
    where: { email: userInfo.emails[0].value },
    defaults: {
      username: userInfo.displayName,
      email: userInfo.emails[0].value,
      image: userInfo.photos[0].value,
      socialProvider: userInfo.provider
    }
  }).then(([user]) => {
    const { id, email } = user;
    user.username = userInfo.displayName;
    user.image = userInfo.photos[0].value;
    user.email = userInfo.emails[0].value;
    user.socialProvider = userInfo.provider;
    const verificationToken = generateToken({ id, email }, '1d');
    user.token = verificationToken;
    return res.redirect(
      `${process.env.UI_CLIENT_HOST}/api/auth?token=${user.token}`
    );
  });
};

export default authUser;
