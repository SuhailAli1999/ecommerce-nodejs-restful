import Joi from "joi";
import { schemas } from "../../../utils/schema.js";

export const addOrderSchema = Joi.object({
  body: {
    phone_number: Joi.string(),
  },
  params: {},
  query: {},
});

export const deleteOrderSchema = Joi.object({
  body: { order_id: schemas.modelId.required() },
  params: {},
  query: {},
});
