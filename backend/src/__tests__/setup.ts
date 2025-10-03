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
  } catch (error) {
    throw error;
  }

  // Liga o servidor sempre que iniciar os testes
  await new Promise<void>((res) => {
    server = app.listen(envVar.PORT, () => {
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
    } catch (error) {
      throw error;
    }
  }
});

// Desconecta quando tudo acabar
afterAll(async () => {
  mockServer.close();

  // Fecha o servidor
  if (server) {
    await new Promise<void>((res) => server.close(() => res()));
  }

  try {
    // Limpa o cache antes de desconectar
    if (redisClient.isOpen) {
      await redisClient.flushDb();
    }

    await disconnectFromRedis();
  } catch (error) {
    throw error;
  }
}, 10000);

// Verifica se está conectado
beforeEach(async () => {
  if (!redisClient.isOpen) {
    throw new Error("Redis não conectado");
  }

  // Garante que está responsive
  try {
    await redisClient.ping();
  } catch (error) {
    throw error;
  }
});

// Helpers
export const createTestKey = (prefix: string): string => {
  return `test:${prefix}:${Math.random()}`;
};
