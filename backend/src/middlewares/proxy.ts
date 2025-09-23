import { createProxyMiddleware } from "http-proxy-middleware";
import { envVar } from "../config/envConfig.js";

// Configuração do middleware do proxy da Jikan
const jikanProxy = createProxyMiddleware({
  target: envVar.JIKAN_API_URL,
  changeOrigin: true, // Muda o header Host para o target
  pathRewrite: {
    "^/api": "",
  },
  timeout: 15000,
  proxyTimeout: 15000,
  on: {
    proxyRes: (proxyRes, req) => {
      const isStatic = req.url?.match(/(genres|producers|magazines)/); // Definição de URLs estáticas
      const maxAge = isStatic ? 86400 : 300; // Definição do max-age do Cache-Control (tempo que a requisição se mantém no Header)
      proxyRes.headers["Cache-Control"] = `public, max-age=${maxAge}`;
    },
    error: (err, req, res) => {
      res.end("Erro os utilizar a proxy para Jikan API");
    },
  },
});

export default jikanProxy;
