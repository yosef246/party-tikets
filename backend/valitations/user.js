import Joi from "joi";

export const registerValitation = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(5).max(20).required(),
  isAdmin: Joi.boolean(),
});

export const loginValitation = Joi.object({
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(5).max(20).required(),
});
