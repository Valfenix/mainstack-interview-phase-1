import { NextFunction, Response } from 'express';
import Joi from 'joi';
import { ExpressRequest } from '../server';
import ResponseHandler from '../util/response-handler';

export async function validateCreateProduct(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const schema = Joi.object().keys({
    product_name: Joi.string().required(),
    price: Joi.string().required(),
    quantity: Joi.number().required(),
    description: Joi.string().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;

    return ResponseHandler.sendErrorResponse({ res, code: 400, error });
  }

  return next();
}
