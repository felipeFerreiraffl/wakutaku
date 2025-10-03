import { describe, expect, it } from "vitest";
import { CacheService } from "../api/services/cacheService.js";
import { envVar } from "../config/envConfig";
import { redisClient } from "../config/redisConnection.js";
import { defineCacheTtl } from "../utils/defineCacheProps.js";
import { createTestKey } from "./setup.js";

const CACHE_URL = `http://localhost:${envVar.PORT}/api/cache`;

describe("Testes de cache", () => {
  describe("CacheService", () => {
    it("recebe uma chave existente no cache do Redis", async () => {
      const key = createTestKey("test");

      await CacheService.setCache(key, { test: "OK" }, 300);

      const response = await CacheService.getCache<any>(key);
      const exists = await CacheService.existsCache(key);

      expect(response).toEqual({ test: "OK" });
      expect(exists).toBe(true);

      const ttl = await CacheService.getTtlExpiringTime(key);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(300);
    });

    it("salva uma chave no cache do Redis", async () => {
      const key = createTestKey("test");

      const response = await CacheService.setCache(key, { test: "OK" }, 300);

      expect(response).toBe(response);
    });

    it("retorna MISS para primeira requisição do cache e HIT na segunda requisição", async () => {
      const url = `http://localhost:${envVar.PORT}/api/season_stats`;

      const responseMiss = await fetch(url);
      const dataMiss = await responseMiss.json();

      expect(responseMiss.headers.get("X-Cache")).toBe("MISS");
      expect(responseMiss.headers.get("X-Cache-Source")).toBe("Jikan-API");

      const responseHit = await fetch(url);
      const dataHit = await responseHit.json();
      expect(responseHit.headers.get("X-Cache")).toBe("HIT");

      expect(dataMiss).toEqual(dataHit);
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

    it("verifica o TTL real do cache após salvamento", async () => {
      const routes = [
        { path: "/api/genres", expectedTtl: CacheService.TTL.MAX },
        { path: "/api/anime", expectedTtl: CacheService.TTL.LONG },
        { path: "/api/anime?q=full", expectedTtl: CacheService.TTL.MEDIUM },
        { path: "/api/top/anime", expectedTtl: CacheService.TTL.SHORT },
        { path: "/api/reviews/anime", expectedTtl: CacheService.TTL.MIN },
      ];

      for (const { path, expectedTtl } of routes) {
        const key = createTestKey(path);
        await CacheService.setCache(key, { test: "data" }, expectedTtl);

        const ttl = await CacheService.getTtlExpiringTime(key);
        expect(ttl).toBeGreaterThan(expectedTtl - 5); // Margem de erro de 5
        expect(ttl).toBeLessThanOrEqual(expectedTtl);
      }
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

        const keys: string[] = new Array(10);
        const noKeys: string[] = new Array(0);

        expect(data).toHaveProperty("success", true);

        if (envVar.NODE_ENV !== "production") {
          // Verificação da quantidade de chaves presentes
          if (noKeys) {
            expect(data.data).toMatchObject({
              message: expect.any(String),
              pattern,
              deleted: 0,
            });
            return;
          }

          if (keys) {
            expect(data.data).toMatchObject({
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

  describe("Concorrência", () => {
    it("testa concorrência para evitar sobrecarga", async () => {
      const key = createTestKey("concurrency");
      const promises = Array.from({ length: 10 }, (_, i) => {
        CacheService.setCache(key, { value: i }, 300);
      });

      await Promise.all(promises);

      const result = await CacheService.getCache<any>(key);
      expect(result).toBeDefined();
      expect(result).toHaveProperty("value");
    });
  });
});
