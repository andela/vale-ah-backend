// import Sequelize from 'sequelize';
import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { User, Follower } = db;
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
            message: 'you are not allowed to follow yourself'
          },
          400
        );
      } else {
        const followee = await User.findOne({
          where: { username }
        });
        const existingFollower = await Follower.findOne({
          where: { userId: followee.id, followerId: id }
        });

        if (!existingFollower) {
          await Follower.create({
            followerId: id,
            userId: followee.id
          });
          return successResponse(res, {
            message: `you started following ${username}`
          });
        }
        return errorResponse(
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
      const user = await User.findOne({
        where: { id }
      });
      const followers = await user.getFollowers();
      if (followers.length === 0) {
        return errorResponse(res, 'you have no followers yet');
      }
      const followerArr = followers.map(current => {
        return current.Follower;
      });
      return successResponse(res, {
        message: ' Your followers',
        followerArr
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
      const user = await User.findOne({
        where: { id }
      });
      const following = await user.getFollowing();
      if (following.length === 0) {
        return errorResponse(res, 'you are not following anyone');
      }
      const followerArr = following.map(current => {
        return current.Follower;
      });
      return successResponse(res, {
        message: ' Your are currently following',
        followerArr
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
