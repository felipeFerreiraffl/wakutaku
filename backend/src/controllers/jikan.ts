import type { NextFunction, Request, Response } from "express";
import type {
  JikanResponse,
  JikanSeasonResponse,
} from "../types/jikanTypes.js";

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

    // Gênero predominante
    const genreMap: Record<string, number> = {};
    data.data.forEach((list) =>
      list.genres.forEach(
        // Busca os gêneros de todos os animes e inicia uma contagem relacionada ao gênero
        (genre) => (genreMap[genre.name] = (genreMap[genre.name] || 0) + 1)
      )
    );

    let mostFrequentGenre = "";
    let genreCount = 0;

    // Loop que busca a contagem de cada gênero
    for (const [genre, count] of Object.entries(genreMap)) {
      // Verifica se a contagem do gênero for maior que outras
      if (count > genreCount) {
        // Atribui aos valores de contagem e gênero
        mostFrequentGenre = genre;
        genreCount = count;
      }
    }

    res.status(200).json({
      success: true,
      totalCount,
      mostFrequentGenre,
    });
  } catch (error) {
    console.error(`Erro de servidor: ${error}`);
    next(error);
  }
};
