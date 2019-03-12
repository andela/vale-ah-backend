// import Sequelize from 'sequelize';
import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { User, Follower } = db;

/**
 * @description Controller to authenticate users
 * @return {undefined}
 */
export default class Follow {
  /**
   * @description This controller method handles follow a user
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async followUser(req, res) {
    const { id } = req.authUser;
    const { username } = req.params;
    try {
      if (username === req.authUser.username) {
        errorResponse(res, {
          message: 'you cannot follow yourself'
        });
      } else {
        const followee = await User.findAll({
          where: { username }
        });
        if (followee) {
          await Follower.create({
            userId: id,
            followerId: followee.id
            // followee: username
          });
          successResponse(res, {
            message: `you just followed ${username}`
          });
        } else {
          errorResponse(res, {
            message: `you are already following ${username}`
          });
        }
      }
    } catch (err) {
      return errorResponse(res, { message: 'Could not follow user' });
    }
  }

  /**
   * @description This controller method gets all users followers
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async fetchFollowers(req, res) {
    const { id } = req.authUser;
    try {
      const users = await Follower.findAll({
        where: { followerId: id },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['username', 'email', 'bio', 'image']
          }
        ]
      });
      if (users.length < 1) {
        return successResponse(res, {
          message: 'nobody is currently following you',
          followers: users
        });
      }
      const num = users.length;
      return successResponse(res, {
        message: 'these are your followers',
        total: num,
        followers: users.map(u => u.follower)
      });
    } catch (err) {
      return errorResponse(res, { message: 'Could not get followers' });
    }
  }

  /**
   * @description This controller method gets all users you're following
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async fetchFollowing(req, res) {
    const { id } = req.authUser;
    try {
      const following = await Follower.findAll({
        where: { userId: id },
        include: [
          {
            model: User,
            as: 'following',
            attributes: ['email', 'username', 'image']
          }
        ]
      });
      if (following.length < 1) {
        successResponse(res, {
          message: 'you are not following anyone',
          following
        });
      } else {
        successResponse(res, {
          message: 'people you are following',
          following: following.map(u => u.following)
        });
      }
    } catch (err) {
      return errorResponse(res, { message: 'Could not get following' });
    }
  }

  /**
   * @description This controller method handles unfollow user
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async unfollowUser(req, res) {
    const { id } = req.authUser;

    const { username } = req.params;
    try {
      if (username === req.authUser.username) {
        errorResponse(res, {
          message: 'you cannot unfollow yourself'
        });
      }

      await Follower.destroy({ where: { userId: id } });
      successResponse(res, {
        message: `${username} has been unfollowed`
      });
    } catch (err) {
      return errorResponse(res, { message: 'Could not unfollow user' });
    }
  }
}
