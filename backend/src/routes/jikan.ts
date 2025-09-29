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

router.get("/top/anime", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/reviews/anime", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/random/anime", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/seasons/now", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/seasons/upcoming", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/schedules", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/genres/anime", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/producers", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/anime", conditionalRateLimiter, cacheFirst, jikanProxy);
router.get("/anime/:id", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/anime/:id/characters", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/anime/:id/news", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/anime/:id/reviews", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/anime/:id/statistics", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/anime/:id/staff", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/anime/:id/relations", globalRateLimiter, cacheFirst, jikanProxy);
router.get(
  "/anime/:id/recommendations",
  globalRateLimiter,
  cacheFirst,
  jikanProxy
);
router.get("/anime/:id/pictures", globalRateLimiter, cacheFirst, jikanProxy);

/* ========== Rotas de mangás ========== */

router.get("/top/manga", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/reviews/manga", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/random/manga", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/genres/manga", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/magazines", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/manga", conditionalRateLimiter, cacheFirst, jikanProxy);
router.get("/manga/:id", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/manga/:id/characters", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/manga/:id/news", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/manga/:id/reviews", globalRateLimiter, cacheFirst, jikanProxy);
router.get("/manga/:id/relations", globalRateLimiter, cacheFirst, jikanProxy);
router.get(
  "/manga/:id/recommendations",
  globalRateLimiter,
  cacheFirst,
  jikanProxy
);
router.get("/manga/:id/statistics", globalRateLimiter, cacheFirst, jikanProxy);

/* ========== Rotas personalizadas ========== */

router.get("/season_stats", globalRateLimiter, getSeasonStats);
router.get("/season_top", globalRateLimiter, getTopAnimesSeason);
router.get("/trending/:type", globalRateLimiter, getTrendingData);

export default router;
