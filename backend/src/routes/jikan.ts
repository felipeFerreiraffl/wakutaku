import { Router } from "express";
import apiProxy from "../middlewares/proxy.js";
import { globalRateLimiter } from "../middlewares/rateLimiter.js";

// Rota do Express
const router = Router();

router.get("/top/anime", globalRateLimiter, apiProxy);

export default router;
