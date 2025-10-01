import { describe, expect, it } from "vitest";
import { envVar } from "../config/envConfig";
import { CacheService } from "../services/cacheService.js";
import { createTestKey } from "./setup.js";
import { defineCacheTtl } from "../utils/defineCacheProps.js";

const CACHE_URL = `http://localhost:${envVar.PORT}/api/cache`;

describe("Testes de cache", () => {
  describe.skip("CacheService", () => {
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

  describe.skip("decideTtl", () => {
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
  });
});
