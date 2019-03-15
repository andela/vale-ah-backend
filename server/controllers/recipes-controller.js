import db from '../models';

const { sequelize, Recipe } = db;

/**
 * Recipes controller
 * @export
 * @class RecipesController
 */
export default class RecipesController {
  /**
   * Tag recipes action
   * @param {Request} req request object
   * @param {Response} res response object
   * @returns {undefined}
   */
  static tagRecipe(req) {
    const { params, user, body } = req;
    Recipe.update(
      { tags: sequelize.fn('array_append', sequelize.col('tags'), body.tags) },
      { where: { slug: params.slug, userId: user.id } }
    );
  }
}
