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

// Rotas

async function startServer() {
  try {
    console.log("🔄️ Conectando-se ao Redis...");
    await connectToRedis();

    console.log(`✅ Conexão feita com sucesso`);

    // Rota do estado do cache Redis
    app.use("/api/cache", cacheRouter);

    // Rotas da Jikan
    app.use("/api", jikanRouter);

    // Middleware de status
    app.use(errorHandler);
    app.use(notFoundHandler);
  } catch (error) {
    console.error(`❌ Erro ao inicar o servidor: ${error}`);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("🛑 Fechando aplicação...");
  await disconnectFromRedis();
  process.exit(0);
});

startServer();

export default app;
