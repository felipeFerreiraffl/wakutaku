import "../utils/envLoader.js";

import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { mockServer } from "../__mocks__/node.js";
import {
  connectToRedis,
  disconnectFromRedis,
  redisClient,
} from "../config/redisConnection.js";
import app from "../app.js";
import { envVar } from "../config/envConfig.js";
import type { Server } from "http";

let server: Server;

// Conecta ao Redis antes de iniciar os testes
beforeAll(async () => {
  console.log("[TEST SETUP] Inicando setup de testes...");

  // Ativa o mock
  mockServer.listen({
    // Ignora URLs localhost
    onUnhandledRequest: (req, print) => {
      const url = new URL(req.url);

      if (url.hostname === "localhost") return;

      print.warning();
    },
  });

  try {
    await connectToRedis();
    console.log("[TEST SETUP] Redis conectado");
  } catch (error) {
    console.error(`[TEST SETUP] Erro ao configurar testes: ${error}`);
    throw error;
  }

  // Liga o servidor sempre que iniciar os testes
  await new Promise<void>((res) => {
    server = app.listen(envVar.PORT, () => {
      console.log(
        `[TEST SETUP] Servidor de teste rodando na porta ${envVar.PORT}`
      );
      res();
    });
  });
}, 15000);

// Limpeza de todos os caches
afterEach(async () => {
  mockServer.resetHandlers();

  if (redisClient.isOpen) {
    try {
      await redisClient.flushDb();
      console.log("[TEST SETUP] Cache limpo após o teste");
    } catch (error) {
      console.warn(`[TEST SETUP] Erro ao limpar cache após o teste: ${error}`);
      throw error;
    }
  }
});

// Desconecta quando tudo acabar
afterAll(async () => {
  console.log("[TEST SETUP] Encerrando testes...");
  mockServer.close();

  // Fecha o servidor
  if (server) {
    await new Promise<void>((res) => server.close(() => res()));
  }

  try {
    // Limpa o cache antes de desconectar
    if (redisClient.isOpen) {
      await redisClient.flushDb();
      console.log("[TEST SETUP] Cache limpo antes de desconexão");
    }

    await disconnectFromRedis();
    console.log("[TEST SETUP] Redis desconectado");
  } catch (error) {
    console.error(`[TEST SETUP] Erro ao desconectar do Redis: ${error}`);
    throw error;
  }
}, 10000);

// Verifica se está conectado
beforeEach(async () => {
  if (!redisClient.isOpen) {
    console.error("[TEST SETUP] Redis desconectado durante os testes");
    throw new Error("Redis não conectado");
  }

  // Garante que está responsive
  try {
    await redisClient.ping();
  } catch (error) {
    console.error(`[TEST SETUP] Redis não responde: ${error}`);
    throw error;
  }
});

// Helpers
export const createTestKey = (prefix: string): string => {
  return `test:${prefix}:${Math.random()}`;
};
