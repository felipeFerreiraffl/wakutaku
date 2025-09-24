import type { Response } from "express";
import { CacheService } from "../services/cacheService.js";
import { setSuccessMessage } from "../middlewares/statusHandler.js";

export const getCachedData = async (
  key: string,
  res: Response
): Promise<void> => {
  const cachedData = await CacheService.get<any>(key);
  if (cachedData) {
    res.setHeader("X-Cache", "HIT");
    setSuccessMessage(res, cachedData);
    return;
  }
};
