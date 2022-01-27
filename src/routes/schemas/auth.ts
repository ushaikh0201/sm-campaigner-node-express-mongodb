import Joi from "joi";

export default {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).alphanum().required(),
  }),
  register: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).alphanum().required(),
  }),
  // define all the other schemas below
};
