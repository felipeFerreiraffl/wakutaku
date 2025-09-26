import { Router } from "express";
import {
  getSeasonStats,
  getTopAnimesSeason,
  getTrendingData,
} from "../controllers/jikan.js";
import jikanProxy, { cacheFirst } from "../middlewares/proxy.js";
import { globalRateLimiter } from "../middlewares/rateLimiter.js";
import { conditionalRateLimiter } from "../utils/conditionalRateLimiter.js";

// Rota do Express
const router = Router();

/* ========== Rotas de animes ========== */

// TOP animes por categoria, tipo ou classificação
router.get("/top/anime", globalRateLimiter, cacheFirst, jikanProxy);

// Reviews recentes
router.get("/reviews/anime", globalRateLimiter, cacheFirst, jikanProxy);

// Anime aleatório
router.get("/random/anime", globalRateLimiter, cacheFirst, jikanProxy);

// Temporada atual
router.get("/seasons/now", globalRateLimiter, cacheFirst, jikanProxy);

// Temporada seguinte
router.get("/seasons/upcoming", globalRateLimiter, cacheFirst, jikanProxy);

// Calendário
router.get("/schedules", globalRateLimiter, cacheFirst, jikanProxy);

// Gêneros
router.get("/genres/anime", globalRateLimiter, cacheFirst, jikanProxy);

// Estúdios
router.get("/producers", globalRateLimiter, cacheFirst, jikanProxy);

// Pesquisa de animes
router.get("/anime", conditionalRateLimiter, cacheFirst, jikanProxy);

// Detalhes de um anime
router.get("/anime/:id", globalRateLimiter, cacheFirst, jikanProxy);

// Personagens
router.get("/anime/:id/characters", globalRateLimiter, cacheFirst, jikanProxy);

// Notícias
router.get("/anime/:id/news", globalRateLimiter, cacheFirst, jikanProxy);

// Reviews
router.get("/anime/:id/reviews", globalRateLimiter, cacheFirst, jikanProxy);

// Estatísticas (quantidade de notas dos usuários)
router.get("/anime/:id/statistics", globalRateLimiter, cacheFirst, jikanProxy);

// Staff
router.get("/anime/:id/staff", globalRateLimiter, cacheFirst, jikanProxy);

// Relações
router.get("/anime/:id/relations", globalRateLimiter, cacheFirst, jikanProxy);

// Recomendações
router.get(
  "/anime/:id/recommendations",
  globalRateLimiter,
  cacheFirst,
  jikanProxy
);

// Imagens (fundo)
router.get("/anime/:id/pictures", globalRateLimiter, cacheFirst, jikanProxy);

/* ========== Rotas de mangás ========== */

// TOP mangás por categoria, tipo ou classificação
router.get("/top/manga", globalRateLimiter, cacheFirst, jikanProxy);

// Reviews recentes
router.get("/reviews/manga", globalRateLimiter, cacheFirst, jikanProxy);

// Mangá aleatório
router.get("/random/manga", globalRateLimiter, cacheFirst, jikanProxy);

// Gêneros
router.get("/genres/manga", globalRateLimiter, cacheFirst, jikanProxy);

// Revistas
router.get("/magazines", globalRateLimiter, cacheFirst, jikanProxy);

// Pesquisa de mangás
router.get("/manga", conditionalRateLimiter, cacheFirst, jikanProxy);

// Detalhes de um mangás
router.get("/manga/:id", globalRateLimiter, cacheFirst, jikanProxy);

// Personagens
router.get("/manga/:id/characters", globalRateLimiter, cacheFirst, jikanProxy);

// Notícias
router.get("/manga/:id/news", globalRateLimiter, cacheFirst, jikanProxy);

// Reviews
router.get("/manga/:id/reviews", globalRateLimiter, cacheFirst, jikanProxy);

// Relações
router.get("/manga/:id/relations", globalRateLimiter, cacheFirst, jikanProxy);

// Recomendações
router.get(
  "/manga/:id/recommendations",
  globalRateLimiter,
  cacheFirst,
  jikanProxy
);

// Estatísticas (quantidade de notas dos usuários)
router.get("/manga/:id/statistics", globalRateLimiter, cacheFirst, jikanProxy);

/* ========== Rotas personalizadas ========== */

// Estatísticas da temporada
router.get("/season_stats", globalRateLimiter, getSeasonStats);

// Melhores animes da temporada
router.get("/season_top", globalRateLimiter, getTopAnimesSeason);

// Mangás ou animes tendências (em alta)
router.get("/trending/:type", globalRateLimiter, getTrendingData);

export default router;
