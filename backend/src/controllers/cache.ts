import type { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redisConnection.js";
import { setSuccessMessage } from "../middlewares/statusHandler.js";

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
