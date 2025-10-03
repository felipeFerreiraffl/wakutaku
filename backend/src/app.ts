import "./utils/envLoader";

import express from "express";
import {
  connectToRedis,
  disconnectFromRedis,
} from "./config/redisConnection.js";
import { errorHandler, notFoundHandler } from "./middlewares/statusHandler.js";
import cacheRouter from "./routes/cache.js";
import jikanRouter from "./routes/jikan.js";

const app = express();
app.use(express.json());

// Rota do estado do cache Redis
app.use("/api/cache", cacheRouter);

// Rotas da Jikan
app.use("/api", jikanRouter);

// Middleware de status
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
