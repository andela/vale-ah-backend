import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import env from '../config/env-config';

/**
 * Synchronously sign the given payload into a JSON Web Token string
 * @param {string | object | Buffer} payload
 * @returns {string}
 */
export const generateToken = payload => jwt.sign(payload, env.SECRET);

/**
 * Synchronously verify given token
 * @returns {string | object}
 * @param {string} token
 */
export const verifyToken = token => jwt.verify(token, env.SECRET);

/**
 * Sends a success response to the client
 * @param {Response} res
 * @param {*} data
 * @param {number} statusCode
 */
export const successResponse = (res, data, statusCode = 200) => res.status(statusCode).json(data);

/**
 * Sends an error response to the client
 * @param {Response} res Response object
 * @param {Array} errors Error messages
 * @param {number} statusCode
 */
export const errorResponse = (res, errors = ['An error ocurred'], statusCode = 500) => res.status(statusCode).json({ errors: errors instanceof Array ? errors : [errors] });

/**
 * Hashes a password
 * @param {string} password
 * @returns {string}
 */
export const hashPassword = password => bcrypt.hashSync(password, 10);

/**
 * Compares a password with a given hash
 * @param {string} password
 * @param {string} hash
 * @returns {boolean}
 */
export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

/**
 * Validates a value using the given schema
 * @param {*} value
 * @param {Joi.SchemaLike} schema
 * @returns {Promise}
 */
export const validate = (value, schema) => Joi.validate(value, schema, { abortEarly: false, allowUnknown: true });
