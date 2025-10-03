import "./utils/envLoader";

import express from "express";
import { errorHandler, notFoundHandler } from "./api/middlewares/statusHandler.js";
import cacheRouter from "./api/routes/cache.js";
import jikanRouter from "./api/routes/jikan.js";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";

const app = express();
app.use(express.json());

app.use(cors(corsOptions));

// Rota do estado do cache Redis
app.use("/api/cache", cacheRouter);

// Rotas da Jikan
app.use("/api", jikanRouter);

// Middleware de status
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
