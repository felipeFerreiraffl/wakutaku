import type { NextFunction, Request, Response } from "express";
import { setSuccessMessage } from "../middlewares/statusHandler.js";
import type {
  JikanAnimeListResponse,
  JikanMangaListResponse,
  JikanSeasonResponse,
} from "../types/jikanTypes.js";
import { fetchJikanResponse } from "../utils/fetchJikan.js";
import { mostFrequentTheme } from "../utils/mostFrequentData.js";

// Estatísticas da temporada atual
export const getSeasonStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await fetchJikanResponse<JikanSeasonResponse>(
      "https://api.jikan.moe/v4/seasons/now"
    );

    // Total de animes na temporada
    const totalCount = data.pagination?.items?.total || 0;

    // Atribuição de gênero e sua contagem entre os animes
    const genreMap: Record<string, number> = {};
    const demographyMap: Record<string, number> = {};

    let frequentGenre;
    let frequentDemography;

    frequentGenre = mostFrequentTheme("genres", data, genreMap);
    frequentDemography = mostFrequentTheme("demographics", data, demographyMap);

    // Contagem das avaliações dos animes
    let scoreCount = 0;
    data.data.forEach((anime) => {
      scoreCount += anime.score || 0;
    });
    const averageScore =
      (scoreCount / data.pagination?.items?.count).toFixed(2) || "0.00"; // Média das avaliações

    setSuccessMessage(res, {
      totalCount,
      frequentGenre,
      frequentDemography,
      averageScore,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopAnimesSeason = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await fetchJikanResponse<JikanSeasonResponse>(
      "https://api.jikan.moe/v4/seasons/now"
    );

    // Retorna os dados em ordem descrescente pela nota
    const topAnimes = data.data.sort((a, b) => (b.score || 0) - (a.score || 0));

    setSuccessMessage(res, {
      topAnimes,
    });
  } catch (error) {
    next(error);
  }
};
