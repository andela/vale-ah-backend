import db from '../models';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse
} from '../utils/helpers';
import recipeSchema from '../utils/recipes';
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
}

export default RecipeController;
