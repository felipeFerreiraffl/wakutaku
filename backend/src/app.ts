import express from "express";
import { notFoundHandler, tooManyRequestsHandler } from "./middlewares/errorHandler.js";
import jikanRouter from "./routes/jikan.js";

const app = express();
app.use(express.json());

// Rotas
app.use("/api", jikanRouter);

// Middleware de erros
app.use(notFoundHandler);
app.use(tooManyRequestsHandler);

export default app;
