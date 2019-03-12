import Joi from 'joi';

const recipeSchema = Joi.object().keys({
  title: Joi.string()
    .required()
    .max(50),
  ingredients: Joi.string().required(),
  steps: Joi.string().required(),
  cookingTime: Joi.number()
    .positive()
    .required(),
  preparationTime: Joi.number()
    .positive()
    .required()
});

export default recipeSchema;
