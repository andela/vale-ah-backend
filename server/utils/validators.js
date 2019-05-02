import Joi from 'joi';

export const registerSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  username: Joi.string()
    .min(3)
    .max(20)
    .required(),
  password: Joi.string()
    .alphanum()
    .min(8)
    .required()
});

export const profileSchema = Joi.object().keys({
  bio: Joi.string()
});

export const recipeSchema = Joi.object().keys({
  title: Joi.string()
    .required()
    .max(50),
  ingredients: Joi.array()
    .items(Joi.string().required())
    .required(),
  steps: Joi.object()
    .keys({
      id: Joi.object().keys({
        description: Joi.string().required(),
        images: Joi.array().items(Joi.string()),
        videos: Joi.array().items(Joi.string())
      })
    })
    .required(),
  cookingTime: Joi.number()
    .positive()
    .required(),
  preparationTime: Joi.number()
    .positive()
    .required(),
  videoList: Joi.array().items(Joi.string())
});

export const recipeUpdateSchema = Joi.object().keys({
  title: Joi.string().max(50),
  ingredients: Joi.array().items(Joi.string().required()),
  steps: Joi.object().keys({
    id: Joi.object().keys({
      description: Joi.string().required(),
      images: Joi.array().items(Joi.string()),
      videos: Joi.array().items(Joi.string())
    })
  }),
  cookingTime: Joi.number().positive(),
  preparationTime: Joi.number().positive(),
  videoList: Joi.array().items(Joi.string())
});

export const passwordResetSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
});

export const changePasswordSchema = Joi.object().keys({
  password: Joi.string()
    .alphanum()
    .min(8)
});

export const commentSchema = Joi.object().keys({
  body: Joi.string()
    .max(1500)
    .required()
});

export const paginationSchema = Joi.object().keys({
  offset: Joi.number()
    .integer()
    .greater(-1),
  limit: Joi.number()
    .integer()
    .positive()
});

export const ratingSchema = Joi.object().keys({
  score: Joi.number()
    .positive()
    .min(1)
    .max(5)
});
