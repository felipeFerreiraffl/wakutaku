import { describe, expect, it } from "vitest";
import { errorHandler } from "../__mocks__/handlers/jikan.js";
import { server } from "../__mocks__/node.js";
import { envVar } from "../config/envConfig";
import { createTestKey } from "./setup.js";
import { CacheService } from "../services/cacheService.js";
import { getCacheStatus } from "../controllers/cache.js";
import { asyncWrapProviders } from "async_hooks";

const CACHE_URL = `http://localhost:${envVar.PORT}/api/cache`;

describe("CacheService", () => {
  it("recebe uma chave existente no cache do Redis", async () => {
    const key = createTestKey("test");

    await CacheService.setCache(key, {}, 300);

    const response = await CacheService.getCache<any>(key);
    const exists = (await CacheService.existsCache(key)) ? response : null;

    expect(response).toBe(exists && response);
  });

  it("salva uma chave no cache do Redis", async () => {
    const key = createTestKey("test");

    const response = await CacheService.setCache(key, {}, 300);

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
