// import Sequelize from 'sequelize';
import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { User, Follower, Sequelize } = db;

const { Op } = Sequelize;

/**
 * @description Controller to Following users
 * @return {undefined}
 */
export default class Follow {
  /**
   * @description Follow user contoller
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async followUser(req, res) {
    const { id } = req.user;
    const { username } = req.params;
    try {
      if (username === req.user.username) {
        errorResponse(
          res,
          {
            message: 'you are not allowed to yourself'
          },
          400
        );
      } else {
        const followee = await User.findOne({
          where: { username }
        });
        const checkFollower = await Follower.findAll({
          where: { [Op.and]: [{ userId: id }, { followerId: followee.id }] }
        });
        if (followee && checkFollower.length < 1) {
          await Follower.create({
            userId: id,
            followerId: followee.id
          });
          return successResponse(res, {
            message: `you started following ${username}`
          });
        }
        errorResponse(
          res,
          {
            message: `you are already following ${username}`
          },
          400
        );
      }
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  /**
   * @description Gets current users followers
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async fetchFollowers(req, res) {
    const { id } = req.user;
    try {
      const users = await Follower.findAll({
        where: { followerId: id },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['username', 'email', 'bio']
          }
        ]
      });
      if (users.length < 1) {
        return successResponse(res, {
          message: 'nobody following you currently'
        });
      }
      const num = users.length;
      return successResponse(res, {
        message: ' Your followers',
        total: num,
        followers: users.map(list => list.follower)
      });
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  /**
   * @description Get everyone current user is following
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async fetchFollowing(req, res) {
    const { id } = req.user;
    try {
      const following = await Follower.findAll({
        where: { userId: id },
        include: [
          {
            model: User,
            as: 'following',
            attributes: ['email', 'username']
          }
        ]
      });
      if (following.length < 1) {
        return successResponse(res, {
          message: 'you are currently not following anyone',
          following
        });
      }
      successResponse(res, {
        message: 'people you are following',
        following: following.map(list => list.following)
      });
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  /**
   * @description To Unfollow User
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async unfollowUser(req, res) {
    const { id } = req.user;

    const { username } = req.params;
    try {
      if (username === req.user.username) {
        return errorResponse(res, {
          message: 'you are not allowed to unfollow yourself'
        });
      }

      await Follower.destroy({ where: { userId: id } });
      return successResponse(res, {
        message: `you just unfollowed ${username}`
      });
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }
}
