import db from '../models';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse
} from '../utils/helpers';
import { recipeSchema, recipeUpdateSchema } from '../utils/validators';
import slugifyTitle from '../utils/slugify';

const { Recipe } = db;

/**
 * The controllers for recipe route
 *
 * @class RecipeController
 */
class RecipeController {
  /**
   * Recipe registration controller
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Function} next
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async create(req, res) {
    const {
      title,
      ingredients,
      steps,
      cookingTime,
      preparationTime
    } = req.body;
    try {
      await validate(req.body, recipeSchema);
      const slug = slugifyTitle(title);
      Recipe.create({
        userId: req.user.id,
        title,
        slug,
        ingredients,
        steps,
        cookingTime,
        preparationTime
      })
        .then(({ dataValues }) => {
          return successResponse(res, { recipe: dataValues }, 201);
        })
        .catch(err => errorResponse(res, err, 400));
    } catch (error) {
      return validationErrorResponse(res, error.details);
    }
  }

  /**
   * Update Recipe
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Function} next
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async updateRecipe(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    const {
      title,
      ingredients,
      steps,
      cookingTime,
      preparationTime
    } = req.body;
    try {
      await validate(req.body, recipeUpdateSchema);
      const recipe = await Recipe.findOne({ where: { slug } });

      if (!recipe) {
        return errorResponse(res, 'recipe not found', 404);
      }

      if (recipe.userId !== id) {
        return errorResponse(
          res,
          'You are not allowed to update this recipe',
          403
        );
      }
      const data = await recipe.update(
        {
          title: title || recipe.title,
          ingredients: ingredients || recipe.ingredients,
          cookingTime: cookingTime || recipe.cookingTime,
          preparationTime: preparationTime || recipe.preparationTime,
          steps: steps || recipe.steps
        },
        { returning: true }
      );
      return successResponse(
        res,
        { message: 'update successful', recipe: data },
        200
      );
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * Delete Recipe
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Function} next
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async deleteRecipe(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    try {
      const recipe = await Recipe.findOne({ where: { slug } });
      if (!recipe) {
        return errorResponse(res, 'recipe not found ', 404);
      }
      if (recipe.userId !== id) {
        return errorResponse(res, 'you cannot delete this recipe', 403);
      }
      const deleted = await recipe.destroy();
      return deleted
        ? successResponse(res, 'recipe has been deleted')
        : errorResponse(res, 'could not delete recipe');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default RecipeController;
