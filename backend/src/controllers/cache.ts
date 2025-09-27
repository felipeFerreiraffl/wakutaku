import type { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redisConnection.js";
import { setSuccessMessage } from "../middlewares/statusHandler.js";
import { CacheService } from "../services/cacheService.js";

export const getCacheStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      setSuccessMessage(res, {
        status: "disconnected",
        message: "Redis não está conectado",
      });
    }

    const totalKeys = await redisClient.dbSize();
    const info = await redisClient.info();

    console.log(`Informações: ${[info]}`);

    // Informações básicas
    const uptime = info.match(/uptime_in_days:(\d+)/)?.[1];
    const uptimeInSeconds = info.match(/uptime_in_seconds:(\d+)/)?.[1];
    const memoryUsed = info.match(/used_memory_human:([^\r\n]+)/)?.[1];
    const version = info.match(/redis_version:([^\r\n]+)/)?.[1];

    setSuccessMessage(res, {
      status: redisClient.isOpen && "connected",
      totalKeys,
      uptime: `${uptime} dias`,
      uptimeInSeconds: `${uptimeInSeconds} segundos`,
      memoryUsed,
      version,
    });
  } catch (error) {
    next(error);
  }
};

// Busca todas as chaves de cache
export const getCacheKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const keys = (await redisClient.keys("*")) ?? "N/A";

    setSuccessMessage(res, keys);
  } catch (error) {
    next(error);
  }
};

// Buscar chaves no cache baseado no padrão
export const getCacheKeysByPattern = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pattern = req.params.pattern ?? "*";
    console.log(`[CACHE] Padrão da chave de cache: ${pattern}`);

    const keysFound = await redisClient.keys(pattern);

    setSuccessMessage(res, { keys: keysFound });
  } catch (error) {
    next(error);
  }
};

// Deleta todo o cache
export const clearCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await redisClient.flushDb();

    setSuccessMessage(res, {
      deleted,
      message: "Cache apagado com sucesso",
    });
  } catch (error) {
    next(error);
  }
};
