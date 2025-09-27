import { Router } from "express";
import {
  clearCache,
  clearCacheKeyByPattern,
  getCacheKeys,
  getCacheKeysByPattern,
  getCacheStatus,
} from "../controllers/cache.js";

const router = Router();

router.get("/status", getCacheStatus);
router.get("/keys", getCacheKeys);
router.get("/keys/:pattern", getCacheKeysByPattern);
router.get("/clear", clearCache);
router.get("/clear/:pattern", clearCacheKeyByPattern);

export default router;
