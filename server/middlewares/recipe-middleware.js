import { dbErrorResponse, errorResponse } from '../utils/helpers';
import db from '../models';

const { Recipe } = db;

export const loadRecipe = (req, res, next) => {
  const { params } = req;
  Recipe.findOne({ where: { slug: params.slug } })
    .then(({ dataValues: recipe }) => {
      req.recipe = recipe;
      next();
    })
    .catch(err => dbErrorResponse(res, err));
};

export const isRecipeOwner = (req, res, next) => {
  const { user, recipe } = req;
  return user.id === recipe.userId
    ? next()
    : errorResponse(res, 'You are not authorized', 403);
};
