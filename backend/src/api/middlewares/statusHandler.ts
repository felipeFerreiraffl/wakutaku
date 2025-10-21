import { type NextFunction, type Request, type Response } from "express";

// Erro que contempla Error com status
export interface JikanError extends Error {
  status?: number | undefined;
}

// Códigos HTTP
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

// Mensagem de sucesso
export const setSuccessMessage = (res: Response, data: {}): Response => {
  return res.status(200).json({
    success: true,
    data,
  });
};

// Mensagens de erro
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

// Erro 400 -> erro de handler
export const badRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error: JikanError = new Error("Erro de requisição ou sintaxe");
  const type = getStatusCode[400];

  res.status(400).json({
    success: false,
    type,
    message: error.message,
  });
};
