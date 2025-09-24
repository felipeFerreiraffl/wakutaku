import type { Request, Response, NextFunction } from "express";
import { setSuccessMessage } from "../middlewares/statusHandler.js";
import { redisClient } from "../config/redisConnection.js";

// Verificação do status do cacheRedis
export const getCacheStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const keyCount = await redisClient.dbSize(); // Lista o tamanho do banco de dados
    const info = await redisClient.info("memory"); // Recebe as informações da memória

    setSuccessMessage(res, {
      connected: redisClient.isReady,
      keyCount,
      memory: info
        .split("\r\n")
        .find((line) => line.startsWith("used-memory-human") || "N/A"),
    });
  } catch (error) {
    next(error);
  }
};

export const getCacheKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pattern = (req.query.pattern as string) || "*"; // Pega o padrão das chaves
    const keys = await redisClient.keys(pattern); // Busca as chaves do banco de dados

    setSuccessMessage(res, {
      keys: keys.sort(),
      total: keys.length,
      pattern,
    });
  } catch (error) {
    next(error);
  }
};

// Deleta o cache Redis inteiro
export const deleteCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await redisClient.flushDb(); // Limpa todo o banco de dados

    setSuccessMessage(res, {
      message: "Cache limpo",
    });
  } catch (error) {
    next(error);
  }
};

// Exclui uma chave do cache Redis
export const deleteCacheByKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.params.key ?? ""; // Pega a chave dos parâmetros
    const deleted = await redisClient.del(key); // Deleta a chave, caso exista

    setSuccessMessage(res, {
      message: deleted
        ? `Chave ${key} deletada com sucesso`
        : `Chave ${key} não encontrada`,
      deleted: deleted === 1,
    });
  } catch (error) {
    next(error);
  }
};
