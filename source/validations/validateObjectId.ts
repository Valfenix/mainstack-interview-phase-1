import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ResponseHandler from '../util/response-handler';

const validateObjectId = function (req: Request, res: Response, next: NextFunction) {
  if (!mongoose.Types.ObjectId.isValid(req.params.product_id))
    return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Invalid ID' });

  next();
};

export default { validateObjectId };
