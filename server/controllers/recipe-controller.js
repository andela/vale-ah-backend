import { Op } from 'sequelize';
import db from '../models';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse,
  rowArrayToObjectList,
  paginationMeta
} from '../utils/helpers';
import {
  recipeSchema,
  paginationSchema,
  recipeUpdateSchema
} from '../utils/validators';

const { Recipe, User } = db;

const defaultRecipeDbFilter = {
  attributes: {
    exclude: ['userId']
  },
  include: {
    model: User,
    attributes: {
      exclude: ['hash', 'id', 'email', 'verified', 'createdAt', 'updatedAt']
    }
  }
};

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
   * @param {Request} req Express request object
   * @param {Response} res Express response
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
      Recipe.create({
        userId: req.user.id,
        title,
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
   * @param {Request} req Express request object
   * @param {Response} res Express response
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async updateRecipe(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    const { ...newRecipe } = req.body;
    try {
      await validate(newRecipe, recipeUpdateSchema);
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
          title: newRecipe.title || recipe.title,
          ingredients: newRecipe.ingredients || recipe.ingredients,
          cookingTime: newRecipe.cookingTime || recipe.cookingTime,
          preparationTime: newRecipe.preparationTime || recipe.preparationTime,
          steps: newRecipe.steps || recipe.steps
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
   * @param {Request} req Express request object
   * @param {Response} res Express response
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

  /**
   * Fetch all recipes
   * @static
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   * @memberof RecipeController
   * @returns {undefined}
   */
  static async getRecipes(req, res) {
    const { offset = 0, limit: queryLimit, ...filters } = req.query;
    const limit = offset && !queryLimit ? 20 : queryLimit;

    try {
      await validate(req.query, paginationSchema);
    } catch (error) {
      return validationErrorResponse(res, error.details);
    }

    const filterParamKeys = Object.keys(filters);

    if (filterParamKeys.length) {
      req.filterParams = filters;
      req.query.limit = limit;
      req.query.offset = offset;

      return RecipeController.getFilteredRecipes(req, res);
    }
    Recipe.findAndCountAll({ ...defaultRecipeDbFilter, offset, limit })
      .then(({ rows: recipeRows, count }) =>
        recipeRows.length
          ? successResponse(res, {
              recipes: rowArrayToObjectList(recipeRows),
              ...paginationMeta({
                count,
                limit,
                offset,
                itemsOnPage: recipeRows.length
              })
            })
          : successResponse(res, {
              recipes: [],
              message: 'no recipes found'
            })
      )
      .catch(() => {
        errorResponse(res, 'Oops, an error occured. Please try again', 500);
      });
  }

  /**
   * Fetch recipes filtered by params
   * @static
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   * @memberof RecipeController
   * @returns {undefined}
   */
  static getFilteredRecipes(req, res) {
    const {
      filterParams: { minCookTime, maxCookTime, user, searchText },
      query: { limit, offset }
    } = req;

    const dbFilter = {};

    if (user) {
      dbFilter['$User.username$'] = {
        [Op.iLike]: `${user}`
      };
    }

    if (searchText) {
      dbFilter[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${searchText}%`
          }
        },
        {
          slug: {
            [Op.iLike]: `%${searchText}%`
          }
        }
      ];
    }

    if (minCookTime && maxCookTime) {
      dbFilter.cookingTime = {
        [Op.between]: [minCookTime, maxCookTime]
      };
    }

    Recipe.findAndCountAll({
      ...defaultRecipeDbFilter,
      where: dbFilter,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    })
      .then(({ rows: recipeRows, count }) =>
        recipeRows.length
          ? successResponse(res, {
              recipes: rowArrayToObjectList(recipeRows),
              ...paginationMeta({
                count,
                limit,
                offset,
                itemsOnPage: recipeRows.length
              })
            })
          : errorResponse(res, 'no matching recipes found', 404)
      )
      .catch(() => {
        errorResponse(res, 'Oops, an error occured. Please try again', 500);
      });
  }

  /**
   * Fetch recipe by slug
   * @static
   * @param {string} req.params.slug Request URL Slug param
   * @param {Response} res Express response object
   * @memberof RecipeController
   * @returns {undefined}
   */
  static getRecipeBySlug(
    {
      params: { slug }
    },
    res
  ) {
    Recipe.findOne({ ...defaultRecipeDbFilter, where: { slug } })
      .then(recipe =>
        recipe
          ? successResponse(res, { recipe })
          : errorResponse(res, 'recipe not found', 404)
      )
      .catch(() => {
        errorResponse(res, 'Oops, an error occured. Please try again', 500);
      });
  }
}

export default RecipeController;
