import { type NextFunction, type Request, type Response } from "express";
import { success } from "zod";

// Erro que contempla Error com status
interface JikanError extends Error {
  status?: number | undefined;
}

// Erro 404 -> rota não encontrada
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error: JikanError = new Error(`Rota ${req.originalUrl} não encontrada`);

  res.status(404).json({
    success: false,
    message: error.message,
  });
};

// Erro 429 -> muitas requisições
export const tooManyRequestsHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: JikanError = new Error(
    "Muitas requisições. Tente novamente mais tarde."
  );

  res.status(429).json({
    success: false,
    message: error.message,
  });
};
