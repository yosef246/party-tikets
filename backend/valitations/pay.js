import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

export const payValitation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  cardNumber: Joi.string().min(13).max(19).required(),
  expiry: Joi.string().required(),
  cvv: Joi.string().min(3).max(3).required(),
  author_id: Joi.objectId().optional(), // אז ככה אנחנו מוודאים בוולידציה שזה ערך נכוןobjectId בגלל שזה מסוג של
});
