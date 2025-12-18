import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export const successResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  error: string,
  statusCode: number = 500
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T,
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    message,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  };
  return res.status(200).json(response);
};
