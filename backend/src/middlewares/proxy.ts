import { createProxyMiddleware } from "http-proxy-middleware";

// Configuração do middleware do proxy da Jikan
const jikanProxy = createProxyMiddleware({
  target: "https://api.jikan.moe/v4",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
  timeout: 10000,
});

export default jikanProxy;
