import db from '../models';
import {
  successResponse,
  validate,
  validationErrorResponse,
  dbErrorResponse,
  stringArrayToLowerCase
} from '../utils/helpers';
import { recipeSchema, tagSchema } from '../utils/validators';
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
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async create(req, res) {
    const { body, user } = req;
    try {
      await validate(req.body, recipeSchema);
      const slug = slugifyTitle(body.title);
      Recipe.create({ ...body, slug, userId: user.id })
        .then(({ dataValues: recipe }) => {
          successResponse(res, { recipe }, 201);
        })
        .catch(err => dbErrorResponse(res, err));
    } catch (error) {
      validationErrorResponse(res, error.details);
    }
  }

  /**
   * Tag recipe controller
   * @param {Request} req request object
   * @param {Response} res response object
   * @returns {undefined}
   */
  static async tag(req, res) {
    const { user, recipe, body } = req;
    try {
      await validate(body, tagSchema);
      Recipe.update(
        {
          tags: [
            ...new Set([
              ...stringArrayToLowerCase(body.tags),
              ...stringArrayToLowerCase(recipe.tags || [])
            ])
          ]
        },
        { where: { id: recipe.id, userId: user.id }, returning: true }
      )
        .then(data => {
          successResponse(res, { recipe: data[1][0] });
        })
        .catch(err => {
          dbErrorResponse(res, err);
        });
    } catch (err) {
      return validationErrorResponse(res, err.details);
    }
  }
}

export default RecipeController;
