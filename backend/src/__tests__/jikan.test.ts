import { describe, expect, it } from "vitest";
import { errorHandler } from "../__mocks__/handlers/jikan.js";
import { server } from "../__mocks__/node.js";
import { envVar } from "../config/envConfig";

describe.skip("Testes de rotas da JIKAN", () => {
  describe("GET /season_stats", () => {
    it("retorna as estatísticas da temporada atual de animes", async () => {
      const response = await fetch(
        `http://localhost:${envVar.PORT}/api/season_stats`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toMatchObject({
        totalCount: expect.any(Number),
        frequentGenre: expect.any(String),
        frequentDemography: expect.any(String),
        averageScore: expect.any(Number),
      });
    });

    describe("Error Handling", () => {
      it("retona erro 400 (BAD_REQUEST)", async () => {
        server.use(
          errorHandler(
            `http://localhost:${envVar.PORT}/api/season_stats`,
            400,
            "BAD_REQUEST",
            "URL inválida"
          )
        );

        const response = await fetch(
          `http://localhost:${envVar.PORT}/api/season_stats`
        );
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toHaveProperty("success", false);
        expect(data).toHaveProperty("type", "BAD_REQUEST");
        expect(data).toHaveProperty("message");
      });

      it("retorna erro 429 (TOO_MANY_REQUESTS)", async () => {
        server.use(
          errorHandler(
            `http://localhost:${envVar.PORT}/api/season_stats`,
            429,
            "TOO_MANY_REQUESTS",
            "Muitas requisições por IP. Tente novamente."
          )
        );

        const response = await fetch(
          `http://localhost:${envVar.PORT}/api/season_stats`
        );
        const data = await response.json();

        expect(response.status).toBe(429);
        expect(data).toHaveProperty("success", false);
        expect(data).toHaveProperty("type", "TOO_MANY_REQUESTS");
        expect(data).toHaveProperty("message");
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

      // Verificação de Array
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data).toHaveLength(3);

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

    describe("Error Handling", () => {
      it("retona erro 400 (BAD_REQUEST)", async () => {
        server.use(
          errorHandler(
            `http://localhost:${envVar.PORT}/api/season_top`,
            400,
            "BAD_REQUEST",
            "URL inválida"
          )
        );

        const response = await fetch(
          `http://localhost:${envVar.PORT}/api/season_top`
        );
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toHaveProperty("success", false);
        expect(data).toHaveProperty("type", "BAD_REQUEST");
        expect(data).toHaveProperty("message");
      });

      it("retorna erro 429 (TOO_MANY_REQUESTS)", async () => {
        server.use(
          errorHandler(
            `http://localhost:${envVar.PORT}/api/season_top`,
            429,
            "TOO_MANY_REQUESTS",
            "Muitas requisições por IP. Tente novamente."
          )
        );

        const response = await fetch(
          `http://localhost:${envVar.PORT}/api/season_top`
        );
        const data = await response.json();

        expect(response.status).toBe(429);
        expect(data).toHaveProperty("success", false);
        expect(data).toHaveProperty("type");
        expect(data).toHaveProperty("message");
      });
    });
  });

  describe("GET /trending/:type", () => {
    it("retorna uma lista dos animes em alta (type = anime)", async () => {
      const response = await fetch(
        `http://localhost:${envVar.PORT}/api/trending/anime`
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
      data.data.forEach((anime: any) => {
        expect(anime).toHaveProperty("mal_id");
        expect(anime.mal_id).toBeGreaterThan(0);
        expect(anime.type).toBe("TV");
      });
    });

    it("retorna uma lista dos mangás em alta (type = manga)", async () => {
      const response = await fetch(
        `http://localhost:${envVar.PORT}/api/trending/manga`
      );

      const data = await response.json();

      expect(data).toHaveProperty("success", true);

      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data).toHaveLength(3);

      expect(data.data[0]).toMatchObject({
        mal_id: expect.any(Number),
        type: expect.any(String),
        status: expect.any(String),
        score: expect.any(Number),
        year: expect.any(Number),
      });

      // Verifcação de todos os itens possuem mal_id
      data.data.forEach((manga: any) => {
        expect(manga).toHaveProperty("mal_id");
        expect(manga.mal_id).toBeGreaterThan(0);
        expect(manga.type).toBe("Manga");
      });
    });

    describe("Error Handling", () => {
      it("retorna erro 400 (BAD_REQUEST) por tipo inválido", async () => {
        server.use(
          errorHandler(
            `http://localhost:${envVar.PORT}/trending/invalid`,
            400,
            "BAD_REQUEST",
            "URL inválida"
          )
        );

        const response = await fetch(
          `http://localhost:${envVar.PORT}/trending/invalid`
        );
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toHaveProperty("success", false);
        expect(data).toHaveProperty("type");
        expect(data).toHaveProperty("message");
      });

      it("retorna erro 429 (TOO_MANY_REQUESTS)", async () => {
        server.use(
          errorHandler(
            `http://localhost:${envVar.PORT}/trending/:type`,
            429,
            "TOO_MANY_REQUESTS",
            "Muitas requisições por IP. Tente novamente."
          )
        );

        const response = await fetch(
          `http://localhost:${envVar.PORT}/trending/:type`
        );

        const data = await response.json();

        expect(response.status).toBe(429);
        expect(data).toHaveProperty("success", false);
        expect(data).toHaveProperty("type");
        expect(data).toHaveProperty("message");
      });
    });
  });

  describe("Rota não encontrada", () => {
    it("retorna 404 (NOT_FOUND) ao digitar uma rota não existente", async () => {
      server.use(
        errorHandler(
          "http://localhost:3000/not-found",
          404,
          "NOT_FOUND",
          "Rota não encontrada"
        )
      );

      const response = await fetch("http://localhost:3000/not-found");

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("type", "NOT_FOUND");
      expect(data).toHaveProperty("message");
    });
  });
});
