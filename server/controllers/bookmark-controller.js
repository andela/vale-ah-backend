import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { Recipe, User } = db;

/**
 * The controllers for bookmark route
 *
 * @class BookmarkController
 */
class BookmarkController {
  /**
   * create and remove bookmark controller
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Function} next
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async createBookmark(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      if (!recipe) {
        return errorResponse(res, 'recipe not found', 404);
      }
      const check = await recipe.hasBookmark(id);
      if (check) {
        const deleted = await recipe.removeBookmark(id);
        return deleted
          ? successResponse(res, 'delete successful')
          : errorResponse(res, 'could not delete', 500);
      }
      await recipe.addBookmark(id);
      return successResponse(res, 'bookmarked successful', 200);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  /**
   * Get user bookmark controller
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Function} next
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async getBookmarks(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findOne({ where: { id } });
      const bookmarks = await user.getBookmark();
      if (!bookmarks) {
        return successResponse(res, 'you do not have any bookmark');
      }
      const bookmarkArr = bookmarks.map(lists => ({
        slug: lists.slug
      }));
      return successResponse(res, bookmarkArr);
    } catch (err) {
      errorResponse(res, err.message);
    }
  }
}
export default BookmarkController;
