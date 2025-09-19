import { type NextFunction, type Request, type Response } from "express";

// Erro que contempla Error com status
interface JikanError extends Error {
  status?: number | undefined;
}

// Erro personalizado
export const errorHandler = (
  err: JikanError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || 500;

  console.error(`Erro ${status}: ${message}`);

  res.status(status).json({
    success: false,
    status,
    message,
  });
};
