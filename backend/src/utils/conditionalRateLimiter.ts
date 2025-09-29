import type { NextFunction, Request, Response } from "express";
import {
  globalRateLimiter,
  searchRateLimiter,
} from "../middlewares/rateLimiter.js";

// Condição para rotas múltiplas (pesquisa e lista de animes/mangás)
export const conditionalRateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Caso um dos queries seja q (busca), seleciona o limitador de busca
  const rateLimiter = req.query.q ? searchRateLimiter : globalRateLimiter;
  rateLimiter(req, res, next);
};
