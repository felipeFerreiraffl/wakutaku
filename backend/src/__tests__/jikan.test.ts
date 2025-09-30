import { describe, expect, it, vi } from "vitest";
import { envVar } from "../config/envConfig";

vi.stubGlobal(
  "fetch",
  vi.fn(() => {})
);

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

  it.skip("retorna TOO_MANY_REQUESTS quando há muitas requisições", async () => {});
});
