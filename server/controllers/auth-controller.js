import db from '../models';
import {
  registerSchema,
  passwordResetSchema,
  changePasswordSchema
} from '../utils/validators';
import env from '../config/env-config';
import mailer from '../utils/mailer';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse,
  comparePassword,
  generateToken,
  generateVerificationLink,
  verifyToken,
  generateResetLink,
  hashPassword
} from '../utils/helpers';

const { User } = db;

const { AUTH_TOKEN_EXPIRY, VERIFICATION_LINK_EXPIRY } = env;

/**
 * The controllers for user route
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
    validate(body, registerSchema)
      .then(async () => {
        try {
          const { dataValues: user } = await User.create({
            ...body,
            hash: body.password
          });
          const { id, username } = user;

          const token = generateToken({ id, username }, AUTH_TOKEN_EXPIRY);
          const verificationToken = generateToken(
            { id, username },
            VERIFICATION_LINK_EXPIRY || '1d'
          );

          user.token = token;
          delete user.hash;

          mailer
            .sendVerificationMail({
              email: user.email,
              username: user.username,
              verificationLink: generateVerificationLink(verificationToken)
            })
            .then(() => {
              return successResponse(res, { user, emailSent: true }, 201);
            })
            .catch(() => {
              successResponse(res, { user, emailSent: false }, 201);
            });
        } catch (err) {
          const errors = err.errors
            ? err.errors.map(e => {
                if (e.validatorKey === 'not_unique') {
                  return `${e.path} already exists`;
                }
                return e.message;
              })
            : [err.message];
          return errorResponse(res, errors, 409);
        }
      })
      .catch(({ details }) => {
        validationErrorResponse(res, details, 400);
      });
  }

  /**
   * Verify email
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof UsersController
   * @returns {undefined}
   */
  static verifyEmail(req, res) {
    const { token } = req.query;
    try {
      const { id } = verifyToken(token);
      User.update({ verified: true }, { where: { id }, returning: true }).then(
        ([rowsAffected]) => {
          if (!rowsAffected) errorResponse(res, 'no user found to verify', 400);
          else if (rowsAffected === 1) {
            return successResponse(res, { verified: true }, 200);
          }
        }
      );
    } catch (e) {
      if (
        [
          'jwt must be provided',
          'jwt expired',
          'jwt malformed',
          'jwt not active',
          'invalid signature',
          'invalid token'
        ].includes(e.message)
      ) {
        errorResponse(res, 'Invalid token, verification unsuccessful', 400);
      } else {
        errorResponse(
          res,
          'Something went wrong, verification unsuccessful',
          500
        );
      }
    }
  }

  /**
   * User Login
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Function} next
   * @memberof UsersController
   * @returns {undefined}
   */
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!(email && password)) {
        return errorResponse(res, 'missing Email/Password', 400);
      }
      const rows = await User.findOne({ where: { email } });
      if (!rows) {
        return errorResponse(res, 'incorrect Email/Password', 400);
      }
      const { id, username, hash } = rows.dataValues;
      if (!comparePassword(password, hash)) {
        return errorResponse(res, 'incorrect Email/Password', 400);
      }
      const token = generateToken({ id, username });
      rows.dataValues.token = token;
      delete rows.dataValues.hash;
      successResponse(res, { user: rows.dataValues }, 200);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof UsersController
   * @returns {undefined}
   */
  static sendResetEmail(req, res) {
    const { email } = req.body;

    validate(req.body, passwordResetSchema)
      .then(() => {
        User.findOne({ where: { email } }).then(user => {
          if (!user) {
            return errorResponse(res, 'User not found!', 404);
          }
          const { username, id } = user;
          const token = generateToken({ username, id });
          mailer
            .sendResetMail({
              email,
              username,
              resetPasswordLink: generateResetLink(token)
            })
            .then(() => {
              successResponse(
                res,
                {
                  message: 'Password reset link sent successfully'
                },
                200
              );
            })
            .catch(() => {
              errorResponse(
                res,
                { message: 'Cannot send password reset link' },
                500
              );
            });
        });
      })
      .catch(({ details }) => {
        validationErrorResponse(res, details, 400);
      });
  }

  /**
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof UsersController
   * @returns {undefined}
   */
  static changePassword(req, res) {
    const token = req.headers.authorization || req.body.token;
    const { password } = req.body;

    try {
      const { username } = verifyToken(token);
      validate(req.body, changePasswordSchema)
        .then(() => {
          User.update(
            {
              hash: hashPassword(password)
            },
            { where: { username }, returning: true }
          )
            .then(([rowsAffected]) => {
              if (rowsAffected === 1) {
                return successResponse(
                  res,
                  { message: 'Password has been changed' },
                  200
                );
              }
              errorResponse(
                res,
                { message: 'An error occured! Kindly try again' },
                400
              );
            })
            .catch(() => {
              errorResponse(
                res,
                { message: 'An error occurred! kindly try again' },
                400
              );
            });
        })
        .catch(({ details }) => {
          validationErrorResponse(res, details, 400);
        });
    } catch (err) {
      errorResponse(res, err, 400);
    }
  }
}

export default UsersController;
