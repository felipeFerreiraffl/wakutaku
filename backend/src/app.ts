import dotenv from "dotenv";
import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/statusHandler.js";
import jikanRouter from "./routes/jikan.js";

dotenv.config();

const app = express();
app.use(express.json());

// Rotas
app.use("/api", jikanRouter);

// Middleware de status
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
