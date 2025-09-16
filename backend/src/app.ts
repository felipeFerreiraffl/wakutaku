import express from "express";
import jikanRouter from "./routes/jikan.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.use("/api", jikanRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
