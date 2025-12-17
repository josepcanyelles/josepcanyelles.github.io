import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.name === 'MulterError') {
    if (err.message.includes('File too large')) {
      return errorResponse(res, 'File size exceeds the limit of 10MB', 413);
    }
    return errorResponse(res, err.message, 400);
  }

  if (err.message.includes('Invalid file type')) {
    return errorResponse(res, err.message, 400);
  }

  return errorResponse(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    500
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  return errorResponse(res, 'Route not found', 404);
};
