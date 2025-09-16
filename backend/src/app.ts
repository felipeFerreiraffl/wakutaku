import express from "express";
import rateLimiter from "./middlewares/rateLimiter.js";
import apiProxy from "./middlewares/proxy.js";

const app = express();
app.use(express.json());

app.use(apiProxy);
app.use(rateLimiter);

export default app;
