import db from '../models/index';
import { successResponse, errorResponse } from '../utils/helpers';

const { RecipeReaction, Recipe } = db;

/**
 *
 *
 * @class RecipeReactionController
 */
class RecipeReactionController {
  /**
   * @description like or dislike a recipe
   * @function likeOrDislike
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof RecipeReactionController
   *@returns {object} response
   */
  static async likeOrDislike(req, res) {
    const { id } = req.user;
    const { slug, reaction } = req.params;

    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      const likeOrDislike = await RecipeReaction.findOne({
        where: { userId: id, recipeId: recipe.id }
      });

      if (!likeOrDislike) {
        await RecipeReaction.create({
          userId: id,
          recipeId: recipe.id,
          isLike: reaction === 'like'
        });
        successResponse(
          res,
          {
            message: `you ${reaction}d this recipe`
          },
          201
        );
      } else {
        if (
          likeOrDislike &&
          likeOrDislike.isLike === (reaction === 'dislike')
        ) {
          await RecipeReaction.update(
            {
              userId: id,
              recipeId: recipe.id,
              isLike: reaction === 'like'
            },
            {
              where: {
                userId: id,
                recipeId: recipe.id
              }
            }
          );
          return successResponse(
            res,
            { message: `you ${reaction}d this recipe (updated)` },
            200
          );
        }
        if (likeOrDislike && likeOrDislike.isLike === (reaction === 'like')) {
          await RecipeReaction.destroy({
            where: { recipeId: recipe.id }
          });
          successResponse(
            res,
            {
              message: `you retracted your ${reaction}`
            },
            200
          );
        }
      }
    } catch (err) {
      errorResponse(res, 'Ooops! Something went wrong.', 500);
    }
  }

  /**
   * @description gets all the like or dislikes a recipe has.
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} response
   * @memberof RecipeReactionController
   */
  static async fetchAllRecipeLikeOrDislike(req, res) {
    const { slug, reaction } = req.params;

    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      const allRecipeDislikes = await RecipeReaction.findAll({
        where: {
          recipeId: recipe.id,
          isLike: reaction === 'like'
        }
      });

      if (!allRecipeDislikes.length) {
        return errorResponse(
          res,
          {
            message: `no recipe ${reaction} found`
          },
          404
        );
      }
      successResponse(
        res,
        {
          message: `Recipe ${reaction} retrieved successfully`,
          reaction: `${allRecipeDislikes.length} ${reaction}(s)`
        },
        200
      );
    } catch (err) {
      errorResponse(res, `Error retrieving recipe ${reaction}`, 500);
    }
  }
}
export default RecipeReactionController;
