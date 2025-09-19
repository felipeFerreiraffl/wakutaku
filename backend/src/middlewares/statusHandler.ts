import { type NextFunction, type Request, type Response } from "express";
import { success } from "zod";

// Erro que contempla Error com status
interface JikanError extends Error {
  status?: number | undefined;
}

const getStatusCode: Record<number, string> = {
  200: "OK",
  400: "BAD_REQUEST",
  404: "NOT_FOUND",
  429: "TOO_MANY_REQUESTS",
  500: "INTERNAL_SERVER_ERROR",
  502: "BAD_GATEWAY",
  503: "SERVICE UNAVAILABLE",
  504: "GATEWAY_TIMEOUT",
};

export const setSuccessMessage = (res: Response, data: {}): Response => {
  return res.status(200).json({
    success: true,
    data,
  });
};

export const errorHandler = (
  err: JikanError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;
  const type = getStatusCode[status];

  res.status(status).json({
    success: false,
    type,
    message: err.message,
  });
};

// Erro 404 -> rota não encontrada
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error: JikanError = new Error(`Rota ${req.originalUrl} não encontrada`);

  const type = getStatusCode[404];

  res.status(404).json({
    success: false,
    type,
    message: error.message,
  });
};
