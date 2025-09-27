import { Router } from "express";
import {
  clearCache,
  getCacheKeys,
  getCacheKeysByPattern,
  getCacheStatus,
} from "../controllers/cache.js";

const router = Router();

router.get("/status", getCacheStatus);
router.get("/keys", getCacheKeys);
router.get("/keys/:pattern", getCacheKeysByPattern);
router.get("/clear", clearCache);

export default router;
