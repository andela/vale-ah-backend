import Joi from 'joi';

const registerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(16)
    .required(),
  password: Joi.string().min(6).required().strict()
});

export default registerSchema;
