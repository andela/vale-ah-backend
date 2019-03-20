import db from '../models';
import { successResponse, errorResponse } from '../utils/helpers';

const { Recipe, Bookmark } = db;

const defaultRecipeDbFilter = {
  // attributes: {
  //   exclude: ['userId']
  // },
  include: {
    model: Recipe,
    attributes: ['slug']
  }
};

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
      const check = await Bookmark.findOne({
        where: { userId: id, recipeId: recipe.id }
      });
      if (check) {
        const deleted = await check.destroy();
        return deleted
          ? successResponse(res, 'delete successful')
          : errorResponse(res, 'could not delete', 500);
      }
      await Bookmark.create({
        recipeId: recipe.id,
        userId: id
      });
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
      const bookmarks = await Bookmark.findAll(defaultRecipeDbFilter);
      if (bookmarks) {
        return successResponse(res, bookmarks, 200);
      }
      return errorResponse(res, 'you have no bookmark');
    } catch (err) {
      errorResponse(res, err.message);
    }
  }
}
export default BookmarkController;
