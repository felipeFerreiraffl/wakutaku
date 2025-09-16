import { type NextFunction, type Request, type Response } from "express";
import type { CustomError } from "../utils/customError.js";

// Erro personalizado
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Envia mensagem padrão com a resposta já dada
  if (res.headersSent) {
    return next(err); // Envia resposta padrão
  }

  const name = err.name;
  const status = err.status || 500;
  const message = err.message || "Erro interno de servidor";

  res.status(status).json({
    success: false,
    name,
    status,
    message,
  });
};

// Erro 404
export const notFoundHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.status = 404;
  err.message = `Rota ${req.originalUrl} não encontrada`;
  next(err);
};
