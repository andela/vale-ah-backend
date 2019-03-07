import Joi from 'joi';

const registerSchema = Joi.object().keys({
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

export default registerSchema;
