import { Router } from "express";
import {
  getSeasonStats,
  getTopAnimesSeason,
  getTrendingData,
} from "../controllers/jikan.js";
import jikanProxy from "../middlewares/proxy.js";
import { globalRateLimiter } from "../middlewares/rateLimiter.js";
import { conditionalRateLimiter } from "../utils/conditionalRateLimiter.js";

// Rota do Express
const router = Router();

/* ========== Rotas de animes ========== */

// TOP animes por categoria, tipo ou classificação
router.get("/top/anime", globalRateLimiter, jikanProxy);

// Reviews recentes
router.get("/reviews/anime", globalRateLimiter, jikanProxy);

// Anime aleatório
router.get("/random/anime", globalRateLimiter, jikanProxy);

// Temporada atual
router.get("/seasons/now", globalRateLimiter, jikanProxy);

// Temporada seguinte
router.get("/seasons/upcoming", globalRateLimiter, jikanProxy);

// Calendário
router.get("/schedules", globalRateLimiter, jikanProxy);

// Gêneros
router.get("/genres/anime", globalRateLimiter, jikanProxy);

// Estúdios
router.get("/producers", globalRateLimiter, jikanProxy);

// Pesquisa de animes
router.get("/anime", conditionalRateLimiter, jikanProxy);

// Detalhes de um anime
router.get("/anime/:id", globalRateLimiter, jikanProxy);

// Personagens
router.get("/anime/:id/characters", globalRateLimiter, jikanProxy);

// Notícias
router.get("/anime/:id/news", globalRateLimiter, jikanProxy);

// Reviews
router.get("/anime/:id/reviews", globalRateLimiter, jikanProxy);

// Estatísticas (quantidade de notas dos usuários)
router.get("/anime/:id/statistics", globalRateLimiter, jikanProxy);

// Staff
router.get("/anime/:id/staff", globalRateLimiter, jikanProxy);

// Relações
router.get("/anime/:id/relations", globalRateLimiter, jikanProxy);

// Recomendações
router.get("/anime/:id/recommendations", globalRateLimiter, jikanProxy);

// Imagens (fundo)
router.get("/anime/:id/pictures", globalRateLimiter, jikanProxy);

/* ========== Rotas de mangás ========== */

// TOP mangás por categoria, tipo ou classificação
router.get("/top/manga", globalRateLimiter, jikanProxy);

// Reviews recentes
router.get("/reviews/manga", globalRateLimiter, jikanProxy);

// Mangá aleatório
router.get("/random/manga", globalRateLimiter, jikanProxy);

// Gêneros
router.get("/genres/manga", globalRateLimiter, jikanProxy);

// Revistas
router.get("/magazines", globalRateLimiter, jikanProxy);

// Pesquisa de mangás
router.get("/manga", conditionalRateLimiter, jikanProxy);

// Detalhes de um mangás
router.get("/manga/:id", globalRateLimiter, jikanProxy);

// Personagens
router.get("/manga/:id/characters", globalRateLimiter, jikanProxy);

// Notícias
router.get("/manga/:id/news", globalRateLimiter, jikanProxy);

// Reviews
router.get("/manga/:id/reviews", globalRateLimiter, jikanProxy);

// Relações
router.get("/manga/:id/relations", globalRateLimiter, jikanProxy);

// Recomendações
router.get("/manga/:id/recommendations", globalRateLimiter, jikanProxy);

// Estatísticas (quantidade de notas dos usuários)
router.get("/manga/:id/statistics", globalRateLimiter, jikanProxy);

/* ========== Rotas personalizadas ========== */

// Estatísticas da temporada
router.get("/season_stats", globalRateLimiter, getSeasonStats);

// Melhores animes da temporada
router.get("/season_top", globalRateLimiter, getTopAnimesSeason);

// Mangás ou animes tendências (em alta)
router.get("/trending/:type", globalRateLimiter, getTrendingData);

export default router;
