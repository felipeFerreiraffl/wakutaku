import { http, HttpResponse } from "msw";
import { envVar } from "../../config/envConfig.js";

const mockAnimeListResponse = {
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
      genres: [{ mal_id: 1, type: "anime", name: "Action", url: "" }],
      demographics: [{ mal_id: 4, type: "anime", name: "Seinen", url: "" }],
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
      genres: [{ mal_id: 1, type: "anime", name: "Action", url: "" }],
      demographics: [{ mal_id: 4, type: "anime", name: "Seinen", url: "" }],
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
      type: "manga",
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
      type: "manga",
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

// Mock de dados
export const jikanHandlers = [
  http.get(/.*\/seasons\/now/, () => {
    console.log("[MSW] Interceptando /seasons/now (regex)");
    return HttpResponse.json(mockAnimeListResponse, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.get(/.*\/anime(\?.*)?$/, ({ request }) => {
    console.log("[MSW] Interceptando /anime");
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");

    if (startDate) {
      return HttpResponse.json(mockAnimeListResponse);
    }

    return HttpResponse.json(mockAnimeListResponse);
  }),

  http.get(/.*\/manga(\?.*)?$/, ({ request }) => {
    console.log("[MSW] Interceptando /manga");
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");

    if (startDate) {
      return HttpResponse.json(mockMangaListReponse);
    }

    return HttpResponse.json(mockMangaListReponse);
  }),
];
