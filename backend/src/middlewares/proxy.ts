import { createProxyMiddleware } from "http-proxy-middleware";
import { type Request, type Response } from "express";

// Configuração do middleware do proxy da Jikan
const jikanProxy = createProxyMiddleware({
  target: "https://api.jikan.moe/v4",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
});

export default jikanProxy;
