// import Sequelize from 'sequelize';
import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { User } = db;
/**
 * @description Controller to Following users
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
      const followee = await User.findOne({
        where: {
          username
        }
      });
      const follower = await User.findOne({
        where: {
          id
        }
      });
      if (!followee) {
        return errorResponse(res, 'user not found', 404);
      }
      if (followee.dataValues.id === id) {
        return errorResponse(res, 'you cannot follow yourself', 403);
      }
      // req.user.hasFollower
      // req.user.getFollowers
      // req.user.setFollowers
      // req.user.addFollower
      // req.user.addFollowers

      const existingFollower = await followee.getFollowers();
      let isFollower = false;
      existingFollower.forEach(element => {
        if (element.id === Number(follower.dataValues.id)) {
          isFollower = true;
        }
      });
      if (isFollower) {
        return errorResponse(res, 'you cannot follow user twice', 403);
      }
      await followee.addFollower(follower);
      return successResponse(res, 'follow successful', 200);
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
        where: {
          id
        }
      });
      const followers = await user.getFollowers();
      if (followers.length === 0) {
        return successResponse(res, 'you have no followers yet');
      }
      const followerArr = followers.map(current => {
        return {
          email: current.email,
          username: current.username
        };
      });
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
      if (following.length === 0) {
        return successResponse(res, 'you are not following anyone yet');
      }
      const followerArr = following.map(current => {
        return {
          email: current.email,
          username: current.username
        };
      });
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
      const following = await User.findOne({
        where: {
          username
        }
      });
      if (!following) {
        return errorResponse(res, 'user not found', 404);
      }
      if (following.id === id) {
        return errorResponse(res, 'you cannot unfollow yourself', 403);
      }
      const follower = await User.findOne({
        where: {
          id
        }
      });

      // const existingFollower = await following.getFollowers();
      // let isFollower = false;
      // existingFollower.forEach(element => {
      //   if (element.id === follower.dataValues.id) isFollower = true;
      // });

      const isFollower = await following.hasFollower(follower);
      if (isFollower) {
        await following.removeFollower(follower);
        return successResponse(res, 'unfollow successful', 200);
      }
      errorResponse(res, 'you are not a follower');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }
}
