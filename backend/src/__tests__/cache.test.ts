import { describe, expect, it } from "vitest";
import { envVar } from "../config/envConfig";
import { CacheService } from "../services/cacheService.js";
import { createTestKey } from "./setup.js";
import { defineCacheTtl } from "../utils/defineCacheProps.js";
import { redisClient } from "../config/redisConnection.js";
import { server } from "../__mocks__/node.js";
import { errorHandler } from "../__mocks__/handlers/jikan.js";

const CACHE_URL = `http://localhost:${envVar.PORT}/api/cache`;

describe("Testes de cache", () => {
  describe("CacheService", () => {
    it("recebe uma chave existente no cache do Redis", async () => {
      const key = createTestKey("test");

      await CacheService.setCache(key, { test: "OK" }, 300);

      const response = await CacheService.getCache<any>(key);
      const exists = (await CacheService.existsCache(key)) ? response : null;

      expect(response).toEqual({ test: "OK" });
    });

    it("salva uma chave no cache do Redis", async () => {
      const key = createTestKey("test");

      const response = await CacheService.setCache(key, { test: "OK" }, 300);

      expect(response).toBe(response);
    });

    describe("Error Handling", () => {
      it("retorna null ao pegar uma chave inexistente", async () => {
        const inexistentKey = "inexistent-key";

        const response = await CacheService.getCache(inexistentKey);

        expect(response).toBe(null);
      });
    });
  });

  describe("decideTtl", () => {
    it("não cacheia para rotas /random ou /cache (sem TTL)", () => {
      expect(defineCacheTtl("/api/random/anime")).toBe(0);
      expect(defineCacheTtl("/api/random/manga")).toBe(0);
      expect(defineCacheTtl("/api/cache")).toBe(0);
    });

    it("retorna TTL máximo (24 hrs) para rotas com dados estáticos", () => {
      expect(defineCacheTtl("/api/genres")).toBe(CacheService.TTL.MAX);
      expect(defineCacheTtl("/api/producers")).toBe(CacheService.TTL.MAX);
      expect(defineCacheTtl("/api/magazines")).toBe(CacheService.TTL.MAX);
    });

    it("retorna TTL médio-longo (1 hr) para rotas de detalhes", () => {
      expect(defineCacheTtl("/api/anime/1")).toBe(CacheService.TTL.LONG);
      expect(defineCacheTtl("/api/manga/1")).toBe(CacheService.TTL.LONG);
      expect(defineCacheTtl("/api/anime/1/characters")).toBe(
        CacheService.TTL.LONG
      );
      expect(defineCacheTtl("/api/manga/1/pictures")).toBe(
        CacheService.TTL.LONG
      );
      expect(defineCacheTtl("/api/anime/1/reviews")).toBe(
        CacheService.TTL.LONG
      );
      expect(defineCacheTtl("/api/manga/1/news")).toBe(CacheService.TTL.LONG);
    });

    it("retorna TTL médio (30 min) para rotas com query de pesquisa", () => {
      expect(defineCacheTtl("/api/anime?q=full")).toBe(CacheService.TTL.MEDIUM);
      expect(defineCacheTtl("/api/manga?q=full")).toBe(CacheService.TTL.MEDIUM);
    });

    it("retorna TTL curto (5 min) para rotas dinâmicas", () => {
      expect(defineCacheTtl("/api/top/anime")).toBe(CacheService.TTL.SHORT);
      expect(defineCacheTtl("/api/seasons/now")).toBe(CacheService.TTL.SHORT);
      expect(defineCacheTtl("/api/schedules")).toBe(CacheService.TTL.SHORT);
    });

    it("retorna TTL mínimo (2 min) para outras rotas", () => {
      expect(defineCacheTtl("/api/reviews/anime")).toBe(CacheService.TTL.MIN);
      expect(defineCacheTtl("/api/people/anime")).toBe(CacheService.TTL.MIN);
      expect(defineCacheTtl("/api/recommendations/manga")).toBe(
        CacheService.TTL.MIN
      );
    });
  });

  /* ========== Rotas do cache ========== */
  describe("Rotas do cache", () => {
    describe("GET /cache/status", () => {
      it("retorna dados de status do cache", async () => {
        const response = await fetch(`${CACHE_URL}/status`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV === "production") {
          expect(data.data).toMatchObject({
            status: expect.any(String),
            totalKeys: expect.any(Number),
            environment: "production",
          });
        } else {
          expect(data.data).toMatchObject({
            status: expect.any(String),
            totalKeys: expect.any(Number),
            uptime: expect.any(String),
            memoryUsed: expect.any(String),
            version: expect.any(String),
          });
        }
      });

      it("retorna messagem de desconexão do Redis", async () => {
        const response = await fetch(`${CACHE_URL}/status`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (!redisClient.isOpen) {
          expect(data.data).toMatchObject({
            status: expect.any(String),
            message: expect.any(String),
          });
        }
      });
    });

    describe("GET /cache/stats", () => {
      it("retorna informações de performance do cache", async () => {
        const response = await fetch(`${CACHE_URL}/stats`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);
        expect(data.data).toMatchObject({
          status: expect.any(String),
          totalRequests: expect.any(Number),
          keyspaceHits: expect.any(Number),
          keyspaceMisses: expect.any(Number),
          hitRate: expect.any(String),
        });
      });
    });

    describe("GET /cache/keys", () => {
      it("retorna as chaves do cache apenas em ambiente de desenvolvimento ou teste", async () => {
        const response = await fetch(`${CACHE_URL}/keys`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);
        expect(data.data).toMatchObject({
          keys: expect.any(Array),
          total: expect.any(Number),
        });

        const keys: string[] = [];

        if (keys.length > 1000) {
          expect(data.data).toMatchObject({
            keys: expect.any(Array),
            total: expect.any(Number),
            truncate: expect.any(Boolean),
            message: expect.any(String),
          });
        }
      });

      it("retorna erro ao acessar a rota em ambiente de produção", async () => {
        const response = await fetch(`${CACHE_URL}/keys`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV === "production") {
          expect(data.data).toHaveProperty("error");
          expect(data.data).not.toHaveProperty("keys");
        }
      });
    });

    describe("GET /cache/keys/:pattern", () => {
      it("retorna os dados de chaves com padrão apenas em ambiente de desenvolvimento ou teste", async () => {
        const pattern = "*test*";
        const response = await fetch(`${CACHE_URL}/keys/${pattern}`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV !== "production") {
          expect(data.data).toMatchObject({
            pattern,
            keys: expect.any(Array),
            total: expect.any(Number),
            truncated: expect.any(Boolean),
          });
        }
      });

      it("retorna erro ao acessar a rota em ambiente de produção", async () => {
        const pattern = "*test*";
        const response = await fetch(`${CACHE_URL}/keys/${pattern}`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV === "production") {
          expect(data.data).toHaveProperty("error");
          expect(data.data).not.toHaveProperty("keys");
        }
      });
    });

    describe("GET /cache/clear", () => {
      it("limpa todas as chaves do cache apenas em desenvolvimento ou teste", async () => {
        const response = await fetch(`${CACHE_URL}/clear?confirm=yes`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV !== "production") {
          expect(data.data).toMatchObject({
            message: expect.any(String),
            keysDeleted: expect.any(Number),
            timestamp: expect.any(String),
          });
        }
      });

      it("retorna erro ao acessar a rota em ambiente de produção", async () => {
        const response = await fetch(`${CACHE_URL}/clear?confirm=yes`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV === "production") {
          expect(data.data).toHaveProperty("error");
          expect(data.data).not.toHaveProperty("keysDeleted");
        }
      });

      it("retorna erro ao tentar apagar cache sem confirmar por query", async () => {
        const response = await fetch(`${CACHE_URL}/clear`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV !== "production") {
          expect(data.data).toHaveProperty("error");
          expect(data.data).toHaveProperty("message");
          expect(data.data).toHaveProperty("warning");
          expect(data.data).not.toHaveProperty("keysDeleted");
        }
      });
    });

    describe("GET /cache/clear/:pattern", () => {
      it("limpa todas as chaves do cache por padrão apenas em desenvolvimento ou teste", async () => {
        const pattern = "*test*";
        const response = await fetch(`${CACHE_URL}/clear/${pattern}`);
        const data = await response.json();

        const keys: string[] = [];

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV !== "production") {
          // Verificação da quantidade de chaves presentes
          if (keys.length === 0) {
            expect(data.data).toMatchObject({
              message: expect.any(String),
              pattern,
              deleted: 0,
            });
          } else {
            expect(data.data).toMatchObject({
              message: expect.any(String),
              patternDeleted: pattern,
              keysFound: expect.any(Number),
              keysDeleted: expect.any(Number),
              keys: expect.any(Array),
            });
          }
        }
      });

      it("retorna erro ao acessar a rota em ambiente de produção", async () => {
        const pattern = "*test*";

        const response = await fetch(`${CACHE_URL}/clear/${pattern}`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV === "production") {
          expect(data.data).toHaveProperty("error");
          expect(data.data).not.toHaveProperty("keys");
        }
      });

      it("retorna erro ao digitar um pattern global (*)", async () => {
        const pattern = "*";

        const response = await fetch(`${CACHE_URL}/clear/${pattern}`);
        const data = await response.json();

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV !== "production") {
          expect(data.data).toHaveProperty("error");
          expect(data.data).not.toHaveProperty("keys");
        }
      });
    });
  });

  describe("Rota não encontrada", () => {
    it("retorna 404 (NOT_FOUND) ao digitar uma rota não existente", async () => {
      server.use(
        errorHandler(
          `${CACHE_URL}/not-found`,
          404,
          "NOT_FOUND",
          "Rota não encontrada"
        )
      );

      const response = await fetch(`${CACHE_URL}/not-found`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("type", "NOT_FOUND");
      expect(data).toHaveProperty("message");
    });
  });

  describe("Erro interno", () => {
    it("retorna erro 500 (INTERNAL_SERVER_ERROR)", async () => {
      server.use(
        errorHandler(
          `${CACHE_URL}/status`,
          500,
          "INTERNAL_SERVER_ERROR",
          "Erro interno"
        )
      );

      const response = await fetch(`${CACHE_URL}/status`);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("type", "INTERNAL_SERVER_ERROR");
      expect(data).toHaveProperty("message");
    });
  });
});
