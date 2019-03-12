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
