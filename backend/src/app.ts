import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import jikanRouter from "./routes/jikan.js";

const app = express();
app.use(express.json());

// Rotas
app.use("/api", jikanRouter);

// Middleware de erros
app.use(errorHandler);

export default app;
