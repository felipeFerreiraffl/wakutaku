import { http, HttpResponse } from "msw";
import { envVar } from "../config/envConfig.js";

// Mock de dados
export const handlers = [
  http.get(`http://localhost:${envVar.PORT}/api/season_stats`, () => {
    return HttpResponse.json(
      {
        success: true,
        data: {
          totalCount: 200,
          frequentGenre: "Action",
          frequentDemography: "Shounen",
          averageScore: 10,
        },
      },
      { status: 200 }
    );
  }),
];
