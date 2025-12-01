import Joi from "joi";
import JoiObjectid from "joi-objectid";
Joi.objectId = JoiObjectid(Joi);

export const createPostValitation = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  location: Joi.string().min(3).max(20).required(),
  date: Joi.date().required(),
  imageUrl: Joi.string().uri().required(),
  body: Joi.string().min(3).max(200).required(),
  author_id: Joi.objectId().optional(), // אז ככה אנחנו מוודאים בוולידציה שזה ערך נכוןobjectId בגלל שזה מסוג של
  tags: Joi.array().items(Joi.objectId()).optional(), // אז ככה אנחנו מוודאים בוולידציה שזה ערך נכוןobjectId בגלל שזה רשימה שיש בה פריטים שהם מסוג של
});

export const updatePostValitation = Joi.object({
  title: Joi.string().min(3).max(20).optional(),
  location: Joi.string().min(3).max(20).optional(),
  date: Joi.date().optional(),
  imageUrl: Joi.string().uri().optional(),
  body: Joi.string().min(3).max(200).optional(),
});
