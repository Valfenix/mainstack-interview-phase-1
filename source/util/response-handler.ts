import { Response } from 'express';

class ResponseHandler {
  // Success Response Handler
  public static sendSuccessResponse({
    res,
    code = 200,
    message = 'Operation Successful',
    data = null,
    custom = false,
  }: {
    res: Response;
    code?: number;
    message?: string;
    data?: any;
    custom?: boolean;
  }): Response<any> {
    const response = custom && data ? { ...data } : { success: true, code: code, message, data };

    return res.status(code).json(response);
  }

  // Error Response Handler
  public static sendErrorResponse({
    res,
    code,
    error = 'Operation failed',
    custom = false,
  }: {
    res: Response;
    code: number;
    error?: any;
    custom?: boolean;
  }): Response<any> {
    const response = custom
      ? { code: code, message: error }
      : { success: false, code: code, message: error };

    return res.status(code).json(response);
  }
}

export default ResponseHandler;
