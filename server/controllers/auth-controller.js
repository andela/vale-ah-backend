import db from '../models';
import { registerSchema, loginSchema } from '../utils/validators';
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
  dbErrorResponse
} from '../utils/helpers';

const { User } = db;

const { AUTH_TOKEN_EXPIRY, VERIFICATION_LINK_EXPIRY } = env;

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
            .sendVerificationMail(
              user.email,
              generateVerificationLink(verificationToken)
            )
            .then(() => {
              return successResponse(res, { user, emailSent: true }, 201);
            })
            .catch(() => {
              successResponse(res, { user, emailSent: false }, 201);
            });
        } catch (err) {
          dbErrorResponse(res, err);
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
            successResponse(res, { verified: true }, 200);
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
        return errorResponse(
          res,
          'Invalid token, verification unsuccessful',
          400
        );
      }
      return errorResponse(
        res,
        'Something went wrong, verification unsuccessful',
        500
      );
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
      await validate(req.body, loginSchema);
      User.findOne({ where: { email } })
        .then(({ dataValues: user }) => {
          if (comparePassword(password, user.hash)) {
            user.token = generateToken({
              id: user.id,
              username: user.username
            });
            delete user.hash;
            successResponse(res, { user });
          } else errorResponse(res, 'Incorrect password');
        })
        .catch(err => dbErrorResponse(res, err));
    } catch (err) {
      validationErrorResponse(res, err.details);
    }
  }
}

export default UsersController;
