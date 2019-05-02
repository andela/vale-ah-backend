import db from '../models/index';
import { successResponse, errorResponse } from '../utils/helpers';

const { Recipe, RecipeRating } = db;

/**
 *
 *
 * @class RecipeReactionController
 */
class RecipeReactionController {
  /**
   *
   * @description Rate a recipe functionality
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof RecipeReactionController
   * @returns {object} response
   */
  static async rating(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    const { score } = req.body;

    const validScore = score <= 5 && score >= 1;

    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      const previousRating = await RecipeRating.findOne({
        where: { userId: id, recipeId: recipe.id }
      });

      if (!recipe) {
        errorResponse(res, { message: 'No article found' }, 404);
      } else if (validScore) {
        if (previousRating) {
          const updatedRating = await previousRating.update({ score });
          const averageRating = await RecipeReactionController.averageRating();
          successResponse(
            res,
            { message: 'rating updated', score: updatedRating, averageRating },
            200
          );
        } else {
          await RecipeRating.create({
            recipeId: recipe.id,
            score,
            userId: id
          });
          successResponse(res, { message: 'rating added', score }, 201);
        }
      } else {
        errorResponse(
          res,
          {
            message: 'You can only rate between the range of 1 - 5'
          },
          400
        );
      }
    } catch (err) {
      errorResponse(res, {
        message: err.message
      });
    }
  }

  /**
   *
   *@function averageRating
   * @static
   * @returns {number} The avergaRating value.
   * @memberof RecipeReactionController
   *
   */
  static async averageRating() {
    const count = await RecipeRating.findAll();
    const overallRating = (
      (await RecipeRating.sum('score')) / count.length
    ).toFixed(1);
    return overallRating;
  }
}

export default RecipeReactionController;
