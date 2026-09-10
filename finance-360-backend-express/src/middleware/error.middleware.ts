import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';

export class AppError extends Error {
  public statusCode: number;
  public errors?: any;

  constructor(message: string, statusCode: number = 400, errors: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Unhandled Error:', err);

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err instanceof ZodError) {
    const issue = err.issues[0];
    const message = issue ? issue.message : 'Validation Error';
    sendError(res, message, 422, err.format());
    return;
  }

  // Prisma Known Request Errors
  if (err.code === 'P2002') {
    const target = err.meta?.target;
    const field = Array.isArray(target) ? target.join(', ') : 'field';
    sendError(res, `A record with this ${field} already exists.`, 409);
    return;
  }

  if (err.code === 'P2025') {
    sendError(res, 'Requested record was not found.', 404);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid authentication token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Authentication token has expired. Please log in again.', 401);
    return;
  }

  const message = err.message && typeof err.message === 'string'
    ? err.message
    : 'An unexpected internal server error occurred';

  sendError(res, message, 500);
}
