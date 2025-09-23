import type { NextFunction, Request, Response } from "express";
import { BasicClientSideCache, createClient } from "redis";
import {
  setSuccessMessage,
  type JikanError,
} from "../middlewares/statusHandler.js";

// Configuração do cache
const cacheConfig = new BasicClientSideCache({
  ttl: 0, // Não expira
  maxEntries: 0, // Quantidade máxima de entradas para guardar
  evictPolicy: "FIFO", // Padrão de expurgação de dados do cache (FIFO = First In, First Out)
});

const client = createClient({
  RESP: 3,
  clientSideCache: cacheConfig,
});

// Sucesso
client.on("connection", (res: Response) => {
  const response = res.json({ message: "Conexão feita com sucesso" });
  setSuccessMessage(res, { response });
});

// Erro no Redis
client.on(
  "error",
  (err: JikanError, req: Request, res: Response, next: NextFunction) => {
    console.error(`Erro ao conectar o banco de dados Redis: ${err.message}`);
    res.status(err.status ?? 500).json({ success: false, error: err.message });
  }
);

await client.connect();

await client.set("key", "value");
const value = client.get("key");
console.log(`Valor do Redis: ${value}`);

// await client.expire("key", 60);
