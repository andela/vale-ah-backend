import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../server/models';
import server from '../server';
import { generateRandomUser } from './fixtures';

chai.use(chaiHttp);

/**
 * Send a request to create a new recipe
 * @param {string} url API route
 * @param {string} token Auth token
 * @param {object} recipe Recipe to create
 * @returns {Promise} Request Response
 */
export const createRecipe = async (url = '/api/recipes', token, recipe) =>
  chai
    .request(server)
    .post(url)
    .set({ authorization: token })
    .send(recipe);

/**
 * Send a request to create a new user
 * @param {string} url API route
 * @param {object} user user to create
 * @returns {Promise} Request Response
 */
export const createUser = async (
  url = '/api/users',
  user = generateRandomUser()
) =>
  chai
    .request(server)
    .post(url)
    .send(user);

/**
 * clear/delete table
 * @param {string} table table to destroy
 * @param {object} options destroy options
 * @returns {undefined}
 */
export const destroyTable = async (table, options) =>
  db[table].destroy(options);

export const testGet = (name, url, callback) => {
  it(name, done => {
    chai
      .request(server)
      .get(url)
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testPost = (name, url, data, callback) => {
  it(name, done => {
    chai
      .request(server)
      .post(url)
      .send(data)
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testAuthGet = (name, url, token, callback) => {
  it(name, done => {
    chai
      .request(server)
      .get(url)
      .set({ authorization: `Bearer ${token}` })
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testAuthPost = (name, url, token, data, callback) => {
  it(name, done => {
    chai
      .request(server)
      .post(url)
      .set({ authorization: `Bearer ${token}` })
      .send(data)
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testAuthPut = (name, url, token, data, callback) => {
  it(name, done => {
    chai
      .request(server)
      .put(url)
      .set({ authorization: `Bearer ${token}` })
      .send(data)
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};

export const testAuthDelete = (name, url, token, callback) => {
  it(name, done => {
    chai
      .request(server)
      .delete(url)
      .set({ authorization: `Bearer ${token}` })
      .end((err, res) => {
        callback(res);
        done(err);
      });
  });
};
