import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isClientError =
    err.message.includes('not found') ||
    err.message.includes('required') ||
    err.message.includes('does not exist') ||
    err.message.includes('must be');

  const statusCode = isClientError ? 400 : 500;

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    statusCode,
  });
}
