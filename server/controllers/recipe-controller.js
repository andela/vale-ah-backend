import debug from 'debug';
import db from '../models';
import {
  successResponse,
  errorResponse,
  verifyToken,
  validate
} from '../utils/helpers';
import recipeSchema from '../utils/recipes';
import slugifyTitle from '../utils/slugify';

const { Recipe } = db;
const logger = debug('test::recipe ');

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
      preparationTime,
      tagList
    } = req.body;
    validate(req.body, recipeSchema);
    const { accesstoken } = req.headers;
    if (!accesstoken) {
      return errorResponse(res, 'Not allowed', 403);
    }
    const token = verifyToken(accesstoken);
    logger(token.id);
    Recipe.create({
      userId: token.id,
      title,
      slug: slugifyTitle(title),
      ingredients,
      steps,
      cookingTime,
      preparationTime,
      tagList
    })
      .then(({ dataValues }) => {
        logger(dataValues);
        successResponse(res, { recipe: dataValues }, 201);
      })
      .catch(err => {
        logger(err);
        return errorResponse(res, err, 400);
      });
  }
}

export default RecipeController;
