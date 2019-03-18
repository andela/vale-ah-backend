import Joi from 'joi';

const email = Joi.string()
  .email()
  .required();

const username = Joi.string()
  .min(3)
  .max(20)
  .required();

const password = Joi.string()
  .alphanum()
  .min(8)
  .required();

const title = Joi.string()
  .required()
  .max(50);

const tags = Joi.array()
  .items(Joi.string())
  .required();

export const registerSchema = Joi.object().keys({ email, username, password });
export const profileSchema = Joi.object().keys({ bio: Joi.string() });
export const loginSchema = Joi.object().keys({ email, password });
export const tagSchema = Joi.object().keys({ tags });
export const recipeSchema = Joi.object().keys({
  title,
  ingredients: Joi.array()
    .items(Joi.string().required())
    .required(),
  steps: Joi.object()
    .keys({
      id: Joi.object().keys({
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
