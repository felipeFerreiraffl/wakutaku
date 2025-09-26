import { Router } from "express";
import { getCacheStatus } from "../controllers/cache.js";

const router = Router();

router.get("/status", getCacheStatus);

export default router;
