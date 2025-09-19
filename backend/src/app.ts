import express from "express";
import jikanRouter from "./routes/jikan.js";
import { errorHandler, notFoundHandler } from "./middlewares/statusHandler.js";

const app = express();
app.use(express.json());

// Rotas
app.use("/api", jikanRouter);

// Middleware de status
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
