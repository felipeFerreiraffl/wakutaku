import { describe, expect, it } from "vitest";
import { envVar } from "../config/envConfig.js";

describe("Testes de rotas da JIKAN", () => {
  describe("GET /season_stats", () => {
    it("retorna as estatísticas da temporada atual de animes", async () => {
      const response = await fetch(
        `http://localhost:${envVar.PORT}/api/season_stats`
      );
      expect(response.headers.get("Content-Type")).toContain(
        "application/json"
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get("X-Cache")).toBeDefined();
      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("data");

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
      expect(response.headers.get("Content-Type")).toContain(
        "application/json"
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("data");
      expect(response.headers.get("X-Cache")).toBeDefined();

      // Verificação de Array
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);

      const currentYear = new Date().getFullYear();

      // Verifcação de todos os itens possuem mal_id e o ano seja igual ao ano atual
      data.data.forEach((anime: any) => {
        expect(anime).toHaveProperty("mal_id");
        expect(anime).toHaveProperty("score");
        expect(anime.mal_id).toBeGreaterThan(0);
        expect(anime.year).toBeGreaterThanOrEqual(currentYear);
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
    { type: "manga", expectedType: "manga" },
  ])("GET /trending/$type", ({ type, expectedType }) => {
    it(`retorna uma lista dos ${type}s em alta`, async () => {
      const response = await fetch(
        `http://localhost:${envVar.PORT}/api/trending/${type}`
      );
      expect(response.headers.get("Content-Type")).toContain(
        "application/json"
      );
      const data = await response.json();

      const year = new Date().getFullYear();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("data");
      expect(response.headers.get("X-Cache")).toBeDefined();
      expect(data.data.length).toBeGreaterThan(0);

      // Verifcação de todos os itens possuem mal_id e o tipo seja TV (anime)
      data.data.forEach((item: any) => {
        expect(item).toHaveProperty("mal_id");
        expect(item).toHaveProperty("popularity");
        expect(item).toHaveProperty("favorites");
        expect(item).toHaveProperty("score");
        expect(item.mal_id).toBeGreaterThan(0);
        expect(item.type).toBe(expectedType);
        expect(item.year).toBeGreaterThanOrEqual(year);
      });
    });
  });
});
