import { Router } from "express";
import {
  deleteCache,
  deleteCacheByKey,
  getCacheKeys,
  getCacheStatus,
} from "../controllers/cache.js";

const router = Router();

router.get("/status", getCacheStatus);
router.get("/keys", getCacheKeys);
router.delete("/clear", deleteCache);
router.delete("/clear/:key", deleteCacheByKey);

export default router;
