import type { Request, Response, NextFunction } from "express";
import { setSuccessMessage } from "../middlewares/statusHandler.js";

// Verificação do status do cacheRedis
export const getCacheStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { redisClient } = await import("../config/redisConnection.js");
    const keyCount = await redisClient.dbSize(); // Número de chaves no cache
    const info = await redisClient.info("memory"); // Uso de memória

    setSuccessMessage(res, {
      cache: {
        connected: redisClient.isReady,
        keys: keyCount,
        memory: info
          .split("\r\n")
          .find((line) => line.startsWith("used_memory_human") || "N/A"),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCacheKeys = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Deleta o cache Redis inteiro
export const deleteCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { redisClient } = await import("../config/redisConnection.js");
    await redisClient.flushDb(); // Limpa todo o banco de dados

    setSuccessMessage(res, {
      message: "Cache limpo",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCacheByKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
