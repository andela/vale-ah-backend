import db from '../models';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse
} from '../utils/helpers';
import { recipeSchema } from '../utils/validators';
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
   * @param {Funtion} next
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
          successResponse(res, { recipe: dataValues }, 201);
        })
        .catch(err => errorResponse(res, err, 400));
    } catch (error) {
      validationErrorResponse(res, error.details);
    }
  }

  /**
   * Update Recipe
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Funtion} next
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async updateRecipe(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    const { body } = req;
    const { title, ingrident, steps, cookingTime, preparationTime } = req.body;
    try {
      await validate(body, recipeSchema);
      const recipe = await Recipe.findOne({ where: { slug } });
      if (!recipe) {
        errorResponse(res, 'recipe not found');
      }
      const newSlug = `${slugifyTitle(title)}-${recipe.id}`;

      const data = await recipe.update(
        {
          title,
          ingrident,
          cookingTime,
          preparationTime,
          slug: newSlug,
          steps
        },
        { returning: true, where: { id } }
      );
      successResponse(res, { message: 'update successful', data }, 200);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  /**
   * Delete Recipe
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {Funtion} next
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async deleteRecipe(req, res) {
    const { slug } = req.params;
    try {
      const data = await Recipe.findOne({ where: { slug } });
      if (!data) {
        return errorResponse(res, 'data not found ', 400);
      }
      const deleted = await data.destroy();
      if (!deleted) {
        return errorResponse(res, 'could not delete data');
      }
      return successResponse(res, 'data has been deleted');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default RecipeController;
