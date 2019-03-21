import { successResponse, errorResponse } from '../utils/helpers';
import db from '../models';

const { User, Follower } = db;

/**
 * The controllers for users route
 *
 * @class profileController
 */
class ProfileController {
  /**
   * get a particular user by username
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined} .
   */
  static async getProfile(req, res) {
    const { username } = req.params;
    const { id } = req.user;
    try {
      const profile = await User.findOne({
        where: { username },
        include: [
          {
            model: Follower,
            where: {
              followerId: id
            }
          }
        ],
        attributes: ['id', 'username', 'email', 'bio', 'image']
      });
      console.log(profile);
      if (!profile) {
        return errorResponse(res, 'user not found', 404);
      }
      const isFollower = await profile.hasFollower(id);
      return successResponse(res, { user: profile, following: isFollower });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * get all users
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @memberof {Users}
   * @returns {undefined} .
   */
  static async getAll(req, res) {
    try {
      return User.findAll({
        attributes: ['id', 'username', 'email', 'bio', 'image']
      })
        .then(data => {
          if (!data) {
            return errorResponse(res, 'No User(s)', 400);
          }
          return successResponse(
            res,
            {
              user: data
            },
            200
          );
        })
        .catch(error => errorResponse(res, error));
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

export default ProfileController;
