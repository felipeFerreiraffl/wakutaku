import { http, HttpHandler, HttpResponse } from "msw";
import { envVar } from "../config/envConfig.js";

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
export const handlers = [
  http.get(`http://localhost:${envVar.PORT}/api/season_stats`, () => {
    return HttpResponse.json(mockSeasonStatsSuccess, { status: 200 });
  }),
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
