/* eslint-disable no-console */
/* eslint-disable no-undef */

import model from '../models';
import Helper from '../helpers/helper';

const { User } = model;

/**
 * @class UserController
 *  @override
 * @export
 *
 */
class Users {
  /**
   * Sign up user
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined} .
   */
  static signUp(req, res) {
    const {
      username, email, password
    } = req.body;

    return User
      .create({
        username,
        email,
        password
      })
      .then(data => res.status(201).send({
        success: true,
        message: 'user created successfully',
        data
      }));
  }

  /**
   * update user profile
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined}
   */
  static async updateprofile(req, res) {
    let imagePath = '';
    if (req.file) {
      imagePath = await Helper.uploadImages(req.file);
    }
    const {
      username, email, bio
    } = req.body;
    return User
      .findByPk(req.params.id)
      .then((user) => {
        user.update({
          username: username || user.username,
          email: email || user.email,
          bio: bio || user.bio,
          image: imagePath || user.image
        })
          .then((data) => {
            res.status(200).send({
              message: 'update successful',
              data
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  /**
   * get all Authors
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined} .
   */
  static allAuthors(req, res) {
    return User
      .findAll()
      .then(data => res.status(200).send(
        data
      ))
      .catch(err => console.log(err));
  }

  /**
   * get a particular author
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined} .
   */
  static getAuthor(req, res) {
    return User
      .findOne({ where: { id: req.params.id } })
      .then(data => res.status(200).send({
        data
      }))
      .catch(error => res.send(error));
  }
}

export default Users;
