import { createProxyMiddleware } from "http-proxy-middleware";

// Configuração do middleware do proxy da Jikan
const apiProxy = createProxyMiddleware({
  target: "https://api.jikan.moe/v4",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
});

export default apiProxy;
