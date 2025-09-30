import { describe, expect, it } from "vitest";
import { errorHandler } from "../__mocks__/handlers.js";
import { server } from "../__mocks__/node.js";
import { envVar } from "../config/envConfig";

describe("GET /season_stats", () => {
  it("retorna as estatísticas da temporada atual de animes", async () => {
    const response = await fetch(
      `http://localhost:${envVar.PORT}/api/season_stats`
    );

    await expect(response.json()).resolves.toEqual({
      success: true,
      data: {
        totalCount: 200,
        frequentGenre: "Action",
        frequentDemography: "Shounen",
        averageScore: 10,
      },
    });
  });

  describe("Error Handling", () => {
    it("retona erro de BAD_REQUEST quando digitada a URL errada", async () => {
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

      const data = response.json();
      expect(response.status).toBe(400);
      await expect(data).resolves.toHaveProperty("success", false);
      await expect(data).resolves.toHaveProperty("type");
      await expect(data).resolves.toHaveProperty("message");
    });

    it("retorna TOO_MANY_REQUESTS quando há muitas requisições", async () => {
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

      const data = response.json();
      expect(response.status).toBe(429);
      await expect(data).resolves.toHaveProperty("success", false);
      await expect(data).resolves.toHaveProperty("type");
      await expect(data).resolves.toHaveProperty("message");
    });
  });
});

describe.skip("GET season_top", () => {
  it("retorna uma lista com os melhores animes da temporada", async () => {});

  describe("Error Handling", () => {
    it("", async () => {});

    it("", async () => {});
  });
});

describe.skip("GET trending/:type", () => {
  it("retorna uma lista dos animes em alta (type = anime)", async () => {});
  it("retorna uma lista dos mangás em alta (type = manga)", async () => {});

  describe("Error Handling", () => {
    it("", async () => {});

    it("", async () => {});
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

    expect(response.status).toBe(404);
  });
});
