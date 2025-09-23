import { Router } from "express";
import { deleteCache, getCacheStatus } from "../controllers/cache.js";

const router = Router();

router.get("/status", getCacheStatus);
router.delete("/clear", deleteCache);

export default router;
