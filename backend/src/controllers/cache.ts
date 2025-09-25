import type { Request, Response, NextFunction } from "express";
import { setSuccessMessage } from "../middlewares/statusHandler.js";
import { redisClient } from "../config/redisConnection.js";

// Verificação do status do cacheRedis

