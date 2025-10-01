import { http, HttpHandler, HttpResponse } from "msw";
import { envVar } from "../../config/envConfig.js";

const JIKAN_URL = envVar.JIKAN_API_URL;

const mockSeasonStatsSuccess = {
  success: true,
  data: {
    totalCount: 200,
    frequentGenre: "Action",
    frequentDemography: "Shounen",
    averageScore: 10,
  },
};

const mockSeasonResponseSuccess = {
  success: true,
  data: [
    {
      mal_id: 1,
      type: "TV",
      status: "Finished Airing",
      score: 10,
      year: new Date().getFullYear(),
    },
    {
      mal_id: 2,
      type: "TV",
      status: "Airing",
      score: 9,
      year: new Date().getFullYear(),
    },
    {
      mal_id: 3,
      type: "Movie",
      status: "Finished",
      score: 8,
      year: new Date().getFullYear(),
    },
  ],
};

const mockTrendingAnimeSuccess = {
  success: true,
  data: [
    {
      mal_id: 1,
      type: "TV",
      status: "Finished Airing",
      score: Math.random() * 10 + 10,
      year: new Date().getFullYear(),
    },
    {
      mal_id: 2,
      type: "TV",
      status: "Airing",
      score: Math.random() * 10 + 10,
      year: new Date().getFullYear(),
    },
    {
      mal_id: 3,
      type: "TV",
      status: "Finished",
      score: Math.random() * 10 + 10,
      year: new Date().getFullYear(),
    },
  ],
};

const mockTrendingMangaSuccess = {
  success: true,
  data: [
    {
      mal_id: 1,
      type: "Manga",
      status: "Publishing",
      score: Math.random() * 10 + 10,
      year: new Date().getFullYear(),
    },
    {
      mal_id: 2,
      type: "Manga",
      status: "Finished",
      score: Math.random() * 10 + 10,
      year: new Date().getFullYear(),
    },
    {
      mal_id: 3,
      type: "Manga",
      status: "Finished",
      score: Math.random() * 10 + 10,
      year: new Date().getFullYear(),
    },
  ],
};

// Tipos de erro
type errorType =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"
  | "BAD_GATEWAY"
  | "SERVICE UNAVAILABLE"
  | "GATEWAY_TIMEOUT";

// Mock de dados
export const jikanHandlers = [
  http.get(`http://localhost:${envVar.PORT}/api/season_stats`, () => {
    return HttpResponse.json(mockSeasonStatsSuccess, { status: 200 });
  }),
  http.get(`http://localhost:${envVar.PORT}/api/season_top`, () => {
    return HttpResponse.json(mockSeasonResponseSuccess, { status: 200 });
  }),
  http.get(
    `http://localhost:${envVar.PORT}/api/trending/:type`,
    ({ params }) => {
      return params.type === "anime"
        ? HttpResponse.json(mockTrendingAnimeSuccess, { status: 200 })
        : HttpResponse.json(mockTrendingMangaSuccess, { status: 200 });
    }
  ),
];

// Lida com diversos tipos de erro
export const errorHandler = (
  url: string,
  statusCode: number,
  type: errorType,
  message: string
): HttpHandler => {
  return http.get(url, () => {
    return HttpResponse.json(
      { success: false, type, message },
      { status: statusCode }
    );
  });
};
