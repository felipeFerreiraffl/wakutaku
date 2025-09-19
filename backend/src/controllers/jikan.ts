import type { NextFunction, Request, Response } from "express";
import type {
  JikanResponse,
  JikanSeasonResponse,
} from "../types/jikanTypes.js";
import { mostFrequentTheme } from "../utils/mostFrequentData.js";

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
    const totalCount = data.pagination.items?.total || 0;

    // Atribuição de gênero e sua contagem entre os animes
    const genreMap: Record<string, number> = {};
    const demographyMap: Record<string, number> = {};
    const frequentGenre = mostFrequentTheme("genres", data, genreMap);
    const frequentDemography = mostFrequentTheme(
      "demographics",
      data,
      demographyMap
    );

    res.status(200).json({
      success: true,
      totalCount,
      frequentGenre,
      frequentDemography,
    });
  } catch (error) {
    console.error(`Erro de servidor: ${error}`);
    next(error);
  }
};
