// import Sequelize from 'sequelize';
import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { User } = db;
/**
 * @description Controller for Following users
 * @return {undefined}
 */
export default class Follow {
  /**
   * @description Follow user controller
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async followUser(req, res) {
    const { id } = req.user;
    const { username } = req.params;
    try {
      const followee = await User.findOne({ where: { username } });
      if (!followee) {
        return errorResponse(res, 'user not found', 404);
      }
      if (followee.dataValues.id === id) {
        return errorResponse(res, 'you cannot follow yourself', 403);
      }
      const isFollower = await followee.hasFollower(id);
      if (isFollower) {
        return errorResponse(res, 'already following this user', 403);
      }
      await followee.addFollower(id);
      return successResponse(res, 'now following', 200);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  /**
   * @description Gets current user's followers
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async fetchFollowers(req, res) {
    const { id } = req.user;
    try {
      const user = await User.findOne({ where: { id } });
      const followers = await user.getFollowers();
      if (!followers) {
        return successResponse(res, 'you have no followers yet');
      }
      const followerArr = followers.map(current => ({
        email: current.email,
        username: current.username
      }));
      return successResponse(res, {
        message: ' Your followers',
        Followers: followerArr
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
        where: {
          id
        }
      });
      const following = await user.getFollowing();
      if (!following) {
        return successResponse(res, 'you are not following anyone yet');
      }
      const followerArr = following.map(current => ({
        email: current.email,
        username: current.username
      }));
      return successResponse(res, {
        message: ' Your are currently following',
        following: followerArr
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
      const following = await User.findOne({ where: { username } });
      if (!following) {
        return errorResponse(res, 'user not found', 404);
      }
      if (following.id === id) {
        return errorResponse(res, 'you cannot unfollow yourself', 403);
      }
      const isFollower = await following.hasFollower(id);
      if (isFollower) {
        await following.removeFollower(id);
        return successResponse(res, 'unfollow successful', 200);
      }
      errorResponse(res, 'you are not a follower');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }
}
