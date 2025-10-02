import { describe, expect, it } from "vitest";
import { errorHandler } from "../__mocks__/handlers/jikan.js";
import { mockServer } from "../__mocks__/node.js";
import { envVar } from "../config/envConfig";

describe("Testes de rotas da JIKAN", () => {
  describe("GET /season_stats", () => {
    it("retorna as estatísticas da temporada atual de animes", async () => {
      const response = await fetch(
        `http://localhost:${envVar.PORT}/api/season_stats`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get("X-Cache")).toBeDefined();
      expect(response.headers.get("Content-Type")).toContain(
        "application/json"
      );
      expect(data.data).toMatchSnapshot({
        totalCount: expect.any(Number),
        frequentGenre: expect.any(String),
        frequentDemography: expect.any(String),
        averageScore: expect.any(Number),
      });
    });
  });

  describe("GET /season_top", () => {
    it("retorna uma lista com os melhores animes da temporada", async () => {
      const response = await fetch(
        `http://localhost:${envVar.PORT}/api/season_top`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("data");
      expect(response.headers.get("X-Cache")).toBeDefined();
      expect(response.headers.get("Content-Type")).toContain(
        "application/json"
      );

      // Verificação de Array
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);

      expect(data.data[0]).toMatchObject({
        mal_id: expect.any(Number),
        type: expect.any(String),
        status: expect.any(String),
        score: expect.any(Number),
        year: expect.any(Number),
      });

      const currentYear = new Date().getFullYear();

      // Verifcação de todos os itens possuem mal_id e o ano seja igual ao ano atual
      data.data.forEach((anime: any) => {
        expect(anime).toHaveProperty("mal_id");
        expect(anime.mal_id).toBeGreaterThan(0);
        expect(anime.year).toBe(currentYear);
      });

      // Verificação de ordem por nota
      const scores = data.data.map((anime: any) => anime.score);

      // Espera que a nota do anime seguinte seja menor que o do atual
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
      }
    });
  });

  describe.each([
    { type: "anime", expectedType: "TV" },
    { type: "manga", expectedType: "Manga" },
  ])("GET /trending/$type", ({ type, expectedType }) => {
    it(`retorna uma lista dos ${type}s em alta`, async () => {
      const response = await fetch(
        `http://localhost:${envVar.PORT}/api/trending/${type}`
      );

      const data = await response.json();

      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("data");

      expect(data.data[0]).toMatchObject({
        mal_id: expect.any(Number),
        type: expect.any(String),
        status: expect.any(String),
        score: expect.any(Number),
        year: expect.any(Number),
      });

      // Verifcação de todos os itens possuem mal_id e o tipo seja TV (anime)
      data.data.forEach((item: any) => {
        expect(item).toHaveProperty("mal_id");
        expect(item.mal_id).toBeGreaterThan(0);
        expect(item.type).toBe(expectedType);
      });
    });
  });

  describe("Rota não encontrada", () => {
    it("retorna 404 (NOT_FOUND) ao digitar uma rota não existente", async () => {
      mockServer.use(
        errorHandler(
          `${envVar.JIKAN_API_URL}/not-found`,
          404,
          "NOT_FOUND",
          "Rota não encontrada"
        )
      );

      const response = await fetch("http://localhost:3000/not-found");

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("type", "NOT_FOUND");
      expect(data).toHaveProperty("message");
    });
  });
});
