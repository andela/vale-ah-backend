// import Sequelize from 'sequelize';
import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { User, Follower, Sequelize } = db;

const { Op } = Sequelize;

/**
 * @description Controller to authenticate users
 * @return {undefined}
 */
export default class Follow {
  /**
   * @description To follow a user
   *
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
            message: 'you cannot follow yourself'
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
          successResponse(res, {
            message: `you just followed ${username}`
          });
        } else {
          errorResponse(
            res,
            {
              message: `you are already following ${username}`
            },
            400
          );
        }
      }
    } catch (err) {
      return errorResponse(res, { message: 'Could not follow user' });
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
