import { ErrorRequestHandler } from 'express';

type AppError = Error & {
  httpStatusCode: number;
};

// End route for handling errors
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  return res.status(status).json({ message: message });
};

// Throwable app error
export const AppError = (message: string, httpStatusCode: number = 500) => {
  const error = new Error(message) as AppError;
  error.httpStatusCode = httpStatusCode;
  return error;
};
