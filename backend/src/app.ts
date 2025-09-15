import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(express.json());

// Criação de uma proxy
const apiProxy = createProxyMiddleware({
  target: "https://api.jikan.moe/v4",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
});

app.use("/api", apiProxy);

export default app;
