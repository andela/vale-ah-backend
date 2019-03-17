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
   * @description like a user's recipe.
   * @function likeRecipe
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof RecipeReactionController
   * @returns {object} response
   */
  static async likeRecipe(req, res) {
    const { id } = req.user;
    const { slug } = req.params;

    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      const like = await RecipeReaction.findOne({
        where: { userId: id, recipeId: recipe.id }
      });

      if (!like) {
        await RecipeReaction.create({
          userId: id,
          recipeId: recipe.id,
          isLike: true
        });
        successResponse(
          res,
          {
            message: 'you like this recipe'
          },
          201
        );
      } else {
        if (like && like.isLike === false) {
          await RecipeReaction.update(
            {
              userId: id,
              recipeId: recipe.id,
              isLike: true
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
            { message: 'you like this recipe (updated)' },
            200
          );
        }
        if (like && like.isLike === true) {
          await RecipeReaction.destroy({
            where: { recipeId: recipe.id }
          });
          successResponse(
            res,
            {
              message: 'you unlike this recipe'
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
   * @description dislike a user's recipe.
   * @function dislikeRecipe
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof RecipeReactionController
   * @returns {object} response
   */
  static async dislikeRecipe(req, res) {
    const { id } = req.user;
    const { slug } = req.params;

    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      const like = await RecipeReaction.findOne({
        where: { userId: id, recipeId: recipe.id }
      });

      if (!like) {
        await RecipeReaction.create({
          userId: id,
          recipeId: recipe.id,
          isLike: false
        });
        successResponse(
          res,
          {
            message: 'you dislike this recipe'
          },
          201
        );
      } else {
        if (like && like.isLike === true) {
          await RecipeReaction.update(
            {
              userId: id,
              recipeId: recipe.id,
              isLike: false
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
            { message: 'you dislike this recipe (updated)' },
            200
          );
        }
        if (like && like.isLike === false) {
          await RecipeReaction.destroy({
            where: { recipeId: recipe.id }
          });

          successResponse(
            res,
            {
              message: 'you undislike this recipe:) '
            },
            200
          );
        }
      }
    } catch (err) {
      errorResponse(res, 'Something went wrong', 500);
    }
  }

  /**
   * @description  get all recipe dislikes.
   * @function fetchAllRecipeReaction
   * @static
   * @param {*} req
   * @param {*} res
   * @returns
   * @memberof RecipeReactionController
   * @returns {object} response
   */
  static async fetchAllRecipeLike(req, res) {
    const { slug } = req.params;

    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      const allRecipeReactions = await RecipeReaction.findAll({
        where: {
          recipeId: recipe.id,
          isLike: true
        }
      });

      if (!allRecipeReactions.length) {
        return errorResponse(
          res,
          {
            message: 'no recipe like found'
          },
          404
        );
      }
      successResponse(
        res,
        {
          message: 'Recipe like retrieved successfully',
          likes: allRecipeReactions.length
        },
        200
      );
    } catch (err) {
      errorResponse(res, 'Error retrieving recipe likes', 500);
    }
  }

  /**
   * @description  get all recipe dislikes.
   * @function fetchAllRecipeReaction
   * @static
   * @param {*} req
   * @param {*} res
   * @returns
   * @memberof RecipeReactionController
   * @returns {object} response
   */
  static async fetchAllRecipeDislike(req, res) {
    const { slug } = req.params;

    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      const allRecipeDislikes = await RecipeReaction.findAll({
        where: {
          recipeId: recipe.id,
          isLike: false
        }
      });

      if (!allRecipeDislikes.length) {
        return errorResponse(
          res,
          {
            message: 'no recipe dislike found'
          },
          404
        );
      }
      successResponse(
        res,
        {
          message: 'Recipe dislikes retrieved successfully',
          dislikes: allRecipeDislikes.length
        },
        200
      );
    } catch (err) {
      errorResponse(res, 'Error retrieving recipe dislikes', 500);
    }
  }
}
export default RecipeReactionController;
