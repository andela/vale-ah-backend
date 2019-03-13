import Joi from 'joi';

const recipeSchema = Joi.object().keys({
  title: Joi.string()
    .required()
    .max(50),
  ingredients: Joi.array()
    .items(Joi.string().required(), Joi.string().required())
    .required(),
  steps: Joi.object()
    .keys({
      1: Joi.object().keys({
        description: Joi.string().required(),
        images: Joi.array().items(Joi.string())
      })
    })
    .required(),
  cookingTime: Joi.number()
    .positive()
    .required(),
  preparationTime: Joi.number()
    .positive()
    .required()
});

export default recipeSchema;
