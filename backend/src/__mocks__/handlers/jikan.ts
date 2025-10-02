import { http, HttpHandler, HttpResponse } from "msw";
import { envVar } from "../../config/envConfig.js";

const JIKAN_URL = envVar.JIKAN_API_URL;

const mockSeasonNowResponse = {
  data: [
    {
      mal_id: 1,
      type: "TV",
      status: "Finished Airing",
      score: 8.5,
      scored_by: 10000,
      rank: 100,
      popularity: 50,
      members: 50000,
      favorites: 1000,
      genres: [{ mal_id: 1, type: "anime", name: "Action" }],
      demographics: [{ mal_id: 4, type: "anime", name: "Seinen" }],
      year: new Date().getFullYear(),
    },
    {
      mal_id: 2,
      type: "TV",
      status: "Currently Airing",
      score: 9.0,
      scored_by: 20000,
      rank: 50,
      popularity: 25,
      members: 100000,
      favorites: 5000,
      genres: [{ mal_id: 1, type: "anime", name: "Action" }],
      demographics: [{ mal_id: 2, type: "anime", name: "Shoujo" }],
      year: new Date().getFullYear(),
    },
  ],
  pagination: {
    last_visible_page: 1,
    has_next_page: false,
    current_page: 1,
    items: {
      count: 2,
      total: 2,
      per_page: 25,
    },
  },
};

const mockAnimeListReponse = {
  data: [
    {
      mal_id: 1,
      type: "TV",
      status: "Finished Airing",
      score: 8.5,
      scored_by: 10000,
      rank: 100,
      popularity: 50,
      members: 50000,
      favorites: 1000,
      year: new Date().getFullYear(),
    },
    {
      mal_id: 2,
      type: "TV",
      status: "Currently Airing",
      score: 9.0,
      scored_by: 20000,
      rank: 50,
      popularity: 25,
      members: 100000,
      favorites: 5000,
      year: new Date().getFullYear(),
    },
  ],
  pagination: {
    last_visible_page: 1,
    has_next_page: false,
    current_page: 1,
    items: {
      count: 2,
      total: 2,
      per_page: 25,
    },
  },
};

const mockMangaListReponse = {
  data: [
    {
      mal_id: 1,
      type: "Manga",
      status: "Finished",
      score: 8.5,
      scored_by: 10000,
      rank: 100,
      popularity: 50,
      members: 50000,
      favorites: 1000,
      year: new Date().getFullYear(),
    },
    {
      mal_id: 2,
      type: "Manga",
      status: "Publishing",
      score: 9.0,
      scored_by: 20000,
      rank: 50,
      popularity: 25,
      members: 100000,
      favorites: 5000,
      year: new Date().getFullYear(),
    },
  ],
  pagination: {
    last_visible_page: 1,
    has_next_page: false,
    current_page: 1,
    items: {
      count: 2,
      total: 2,
      per_page: 25,
    },
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
export const jikanHandlers = [
  http.get(`${JIKAN_URL}/seasons/now`, () => {
    return HttpResponse.json(mockSeasonNowResponse);
  }),

  http.get(`${JIKAN_URL}/anime`, ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");

    if (startDate) {
      return HttpResponse.json(mockAnimeListReponse);
    }

    return HttpResponse.json(mockAnimeListReponse);
  }),

  http.get(`${JIKAN_URL}/manga`, ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");

    if (startDate) {
      return HttpResponse.json(mockMangaListReponse);
    }

    return HttpResponse.json(mockMangaListReponse);
  }),
];
