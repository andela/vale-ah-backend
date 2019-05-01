import sequelize from 'sequelize';
import db from '../models';
import {
  successResponse,
  errorResponse,
  validate,
  validationErrorResponse,
  rowArrayToObjectList
} from '../utils/helpers';
import {
  recipeSchema,
  paginationSchema,
  recipeUpdateSchema
} from '../utils/validators';

const { Recipe, User, RecipeReaction } = db;

const defaultRecipeDbFilter = {
  attributes: {
    exclude: ['userId'],
    include: [
      [
        sequelize.fn('COUNT', sequelize.col('RecipeReactions.isLike')),
        'like(s)'
      ]
    ]
  },
  include: [
    {
      model: User,
      attributes: {
        exclude: ['hash', 'id', 'email', 'verified', 'createdAt', 'updatedAt']
      }
    },
    {
      model: RecipeReaction,
      attributes: []
    }
  ],
  group: ['Recipe.id', 'User.id', 'RecipeReactions.id'],
  subQuery: false
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
      preparationTime,
      videoList
    } = req.body;
    try {
      await validate(req.body, recipeSchema);
      Recipe.create({
        userId: req.user.id,
        title,
        ingredients,
        steps,
        cookingTime,
        preparationTime,
        videoList
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
      preparationTime,
      videoList
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
          title,
          ingredients,
          steps,
          cookingTime,
          preparationTime,
          videoList
        },
        { returning: true }
      );
      return successResponse(
        res,
        { message: 'update successful', recipe: data },
        200
      );
    } catch (error) {
      return validationErrorResponse(res, error.details);
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

  /**
   * Fetch all recipes
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @returns {undefined}
   */
  static async getRecipes(req, res) {
    let { limit, offset } = req.query;
    try {
      await validate(req.query, paginationSchema);
    } catch (error) {
      return validationErrorResponse(res, error.details);
    }
    limit = offset && !limit ? 20 : limit;
    offset = offset || 0;

    Recipe.findAll({ ...defaultRecipeDbFilter, offset, limit })
      .then(recipeRows =>
        recipeRows.length
          ? successResponse(res, {
              recipes: rowArrayToObjectList(recipeRows)
            })
          : successResponse(res, {
              recipes: [],
              message: 'no recipes found'
            })
      )
      .catch(() => {
        errorResponse(res, 'Oops, an error occurred. Please try again', 500);
      });
  }

  /**
   * Fetch recipe by slug
   * @param {string} req.params.slug Request URL Slug param
   * @param {Object} res Express response object
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
          : errorResponse(res, 'Recipe not found', 404)
      )
      .catch(() => {
        errorResponse(res);
      });
  }
}

export default RecipeController;
