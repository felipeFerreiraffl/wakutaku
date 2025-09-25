import type { NextFunction, Request, Response } from "express";
import { envVar } from "../config/envConfig.js";
import { setSuccessMessage } from "../middlewares/statusHandler.js";
import { CacheService } from "../services/cacheService.js";
import type {
  JikanAnimeListResponse,
  JikanMangaListResponse,
  JikanSeasonResponse,
} from "../types/jikanTypes.js";
import { fetchJikanResponse } from "../utils/fetchJikan.js";
import { mostFrequentTheme } from "../utils/mostFrequentData.js";

const API_URL = envVar.JIKAN_API_URL;

// Estatísticas da temporada atual
export const getSeasonStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await fetchJikanResponse<JikanSeasonResponse>(
      `${API_URL}/seasons/now`
    );

    // Total de animes na temporada
    const totalCount = data.pagination?.items?.total ?? 0;

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
      scoreCount += anime.score ?? 0;
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

// Buscar os melhores animes da temporada atual
export const getTopAnimesSeason = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await fetchJikanResponse<JikanSeasonResponse>(
      `${API_URL}/seasons/now`
    );

    // Retorna os dados em ordem descrescente pela nota
    const topAnimes = data.data?.sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0)
    );

    setSuccessMessage(res, topAnimes);
  } catch (error) {
    next(error);
  }
};

// Busca animes ou mangás em alta
export const getTrendingData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Pega o query para o tipo de anime/mangá
    const type = req.params.type as "anime" | "manga";

    // Inicia uma data limite
    const startDateLimit = new Date();
    startDateLimit.setMonth(startDateLimit.getMonth() - 6);

    // Formatação do mês
    const month = String(startDateLimit.getMonth() + 1).padStart(2, "0");

    // String para start_date do rota (YYYY-MM-DD)
    const startDate = `${startDateLimit.getFullYear()}-${month}-01`;

    const data = await fetchJikanResponse<
      JikanMangaListResponse | JikanAnimeListResponse
    >(`${API_URL}/${type}?start_date=${startDate}&order_by=popularity`);

    // Cálculo de têndencia
    const trendingScore = (
      score: number,
      favorites: number,
      popularity: number,
      members: number
    ): number => {
      return score * 0.4 + favorites * 0.2 + popularity * 0.2 + members * 0.2;
    };

    // Filtragem dos dados
    const trendingData = data.data
      .filter((item) => item.score !== null && item) // Apenas dados com score com valor
      .sort(
        // Ordenação dos dados
        (a, b) =>
          trendingScore(
            b.score ?? 0,
            b.favorites ?? 0,
            b.popularity ?? 0,
            b.members ?? 0
          ) -
          trendingScore(
            a.score ?? 0,
            a.favorites ?? 0,
            a.popularity ?? 0,
            a.members ?? 0
          )
      );

    setSuccessMessage(res, trendingData);
  } catch (error) {
    next(error);
  }
};
