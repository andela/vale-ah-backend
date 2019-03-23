import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import env from '../config/env-config';

const { SECRET, UI_CLIENT_HOST, HEROKU_APP_NAME } = env;

const API_SERVER_HOST = HEROKU_APP_NAME
  ? `https://${HEROKU_APP_NAME}.herokuapp.com`
  : env.API_SERVER_HOST;

/**
 * Synchronously sign the given payload into a JSON Web Token string
 * @param {string | number | Buffer} payload payload to sign
 * @param {string | number} expiresIn expressed in seconds or a string describing a
 * time span. Eg: 60, "2 days", "10h", "7d"
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = '7d') =>
  jwt.sign(payload, SECRET, { expiresIn });

/**
 * Synchronously verify given JWT token
 * @param {string} token JWT token
 * @returns {string | object} decoded JWT payload
 */
export const verifyToken = token => jwt.verify(token, SECRET);

/**
 * Sends a success response to the client
 * @param {Response} res Response object
 * @param {object} data data to send
 * @param {number} statusCode status code
 * @returns {Response} success response
 */
export const successResponse = (res, data, statusCode = 200) =>
  res.status(statusCode).json(data);

/**
 * Sends an error response to the client
 * @param {Response} res Response object
 * @param {Array} errors error messages
 * @param {number} statusCode status code
 * @returns {Response} error response
 */
export const errorResponse = (
  res,
  errors = ['An error ocurred'],
  statusCode = 500
) =>
  res
    .status(statusCode)
    .json({ errors: errors instanceof Array ? errors : [errors] });

/**
 * Sends a validation error response to the user
 * @param {Response} res Response object
 * @param {Array} errorDetails array of error details
 * @returns {undefined}
 */
export const validationErrorResponse = (res, errorDetails = []) => {
  const errors = errorDetails.reduce((acc, e) => {
    const { key } = e.context;
    if (acc[key]) {
      acc[key].push(e.message.replace(`"${key}" `, ''));
    } else {
      acc[key] = [e.message.replace(`"${key}" `, '')];
    }
    return acc;
  }, {});
  res.status(400).json({ errors });
};

/**
 * Hashes a password
 * @param {string} password password to encrypt
 * @returns {string} encrypted password
 */
export const hashPassword = password => bcrypt.hashSync(password, 10);

/**
 * Compares a password with a given hash
 * @param {string} password
 * @param {string} hash
 * @returns {boolean} match?
 */
export const comparePassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

/**
 * Validates a value using the given Joi schema
 * @param {object} value
 * @param {Joi.SchemaLike} schema
 * @returns {Promise} Validation result
 */
export const validate = (value, schema) =>
  Joi.validate(value, schema, { abortEarly: false, allowUnknown: true });

/**
 * Generate a user account verification link
 * @param {string} token Verification token
 * @returns {URL} Verification url
 */
export const generateVerificationLink = token =>
  UI_CLIENT_HOST
    ? `${UI_CLIENT_HOST}/users/verify?token=${token}`
    : `${API_SERVER_HOST}/api/users/verify?token=${token}`;

/**
 * Generate a user account password reset link
 * @param {string} token password reset token
 * @returns {URL} Verification url
 */
export const generateResetLink = token =>
  UI_CLIENT_HOST
    ? `${UI_CLIENT_HOST}/users/reset-password?token=${token}`
    : `${API_SERVER_HOST}/api/users/reset-password?token=${token}`;

/**
 * Returns a slugified variant of a given string
 *
 * @param {string} string
 * @returns {string} Slugified string
 */
/* eslint-disable no-useless-escape */
export const slugifyTitle = string =>
  string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export default slugifyTitle;

/**
 * Returns a list of dataValue objects from an array of sequelize rows
 * @param {Array} sequelizeRowArray Array of rows from Sequelize query
 * @returns {Array} Array of dataValue objects
 */
export const rowArrayToObjectList = sequelizeRowArray =>
  sequelizeRowArray.reduce(
    (dataValueArray, { dataValues }) => [...dataValueArray, dataValues],
    []
  );

/**
 * Generate a random hexadecimal string
 * @returns {string} random alphanumeric string
 */
export const randomHex = () =>
  Math.floor(Math.random() * Date.now()).toString(16);

/**
 * Test if arg parses into an integer
 * @param {*} arg  arg to parse
 * @returns {boolean} isInt?
 */
export const jsonParsedInt = arg => {
  let isInt = false;
  try {
    const parsed = JSON.parse(arg);
    isInt = typeof parsed === 'number';
  } catch (e) {
    //
  }
  return isInt;
};

/**
 * Compute pagination data based pn value of supplied args
 * @param {Object} computeArgs pagination meradata config arguments
 * @param {string} computeArgs.count total objectcount
 * @param {number} computeArgs.limit max objects per page
 * @param {number} computeArgs.offset records to skip
 * @param {number} computeArgs.itemsOnPage records on current page
 * @returns {Object} pagination metadata { page, pageCount }
 */
export const paginationMeta = ({ count, limit, offset, itemsOnPage }) =>
  jsonParsedInt(limit)
    ? {
        page: Math.floor(offset / limit) + 1,
        pageCount: Math.ceil(count / limit),
        itemsOnPage
      }
    : {
        page: 1,
        pageCount: 1,
        itemsOnPage
      };
