import type { NextFunction, Request, Response } from "express";
import type { JikanSeasonResponse } from "../types/jikanTypes.js";
import { mostFrequentTheme } from "../utils/mostFrequentData.js";
import { setSuccessMessage } from "../middlewares/statusHandler.js";

// Estatísticas da temporada atual
export const getSeasonStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response = await fetch("https://api.jikan.moe/v4/seasons/now");

    if (!response.ok) {
      throw new Error("Erro ao buscar estatísticas da temporada atual");
    }

    const data: JikanSeasonResponse = await response.json();

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
    const avarageScore =
      (scoreCount / data.pagination?.items?.count).toFixed(2) || "0.00"; // Média das avaliações

    setSuccessMessage(res, {
      totalCount,
      frequentGenre,
      frequentDemography,
      avarageScore,
    });
  } catch (error) {
    next(error);
  }
};

// export const getSeasonBestAnimes = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {};
