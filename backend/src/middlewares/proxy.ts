import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { envVar } from "../config/envConfig.js";
import { defineCacheTtl } from "../utils/defineCacheProps.js";
import { CacheService } from "../services/cacheService.js";

// Cacheia antes da proxy
export const cacheFirst = async (req: any, res: any, next: any) => {
  try {
    // Busca a URL e define seu TTL
    const url = req.originalUrl;
    const ttl = defineCacheTtl(url);

    if (ttl === 0) {
      console.log(`[PROXY CACHE] Sem cache para a rota ${url}`);
      return next();
    }

    // Busca no cache para não precisar da proxy
    const cacheKey = `proxy:${url}`;
    const cachedData = await CacheService.getCache(cacheKey);

    if (cachedData) {
      console.log(`[PROXY CACHE] HIT: ${cacheKey}`);

      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-Cache-Key", cacheKey);
      res.setHeader("X-Cache-TTL", ttl);
      res.setHeader("X-Cache-Source", "Redis");

      return res.json(cachedData);
    }

    console.log(`[PROXY CACHE] MISS: ${cacheKey}`);

    // Anexa as informações ao request antes da proxy
    req.cacheKey = cacheKey;
    req.cacheTtl = ttl;

    next();
  } catch (error) {
    console.error(`[PROXY CACHE] Erro no middleware: ${error}`);
    next(); // Sem cache
  }
};

// Configuração do middleware do proxy da Jikan
const jikanProxy = createProxyMiddleware({
  target: envVar.JIKAN_API_URL,
  changeOrigin: true, // Muda o header Host para o target
  pathRewrite: {
    "^/api": "",
  },
  timeout: 15000,
  proxyTimeout: 15000,

  selfHandleResponse: true, // Permite interceptar respostas (evita end())

  on: {
    // Interceptação de resposta
    proxyRes: responseInterceptor(
      async (responseBuffer, proxyRes, req, res) => {
        try {
          // Headers para respostas estáticas
          const isStatic = req.url?.match(/(genres|producers|magazines)/);
          const maxAge = isStatic ? 86400 : 300;
          proxyRes.headers["cache-control"] = `public, max-age=${maxAge}`;

          const response = responseBuffer.toString("utf-8");

          // Parse para JSON
          let jsonData;
          try {
            jsonData = JSON.parse(response);
          } catch (error) {
            console.warn(`[PROXY CACHE] Resposta não é um JSON válido`);
            return response; // Resposta original
          }

          // Verifica se não é erro
          if (jsonData && typeof jsonData === "object" && !jsonData.error) {
            const cacheKey = (req as any).cacheKey;
            const cacheTtl = (req as any).cacheTtl;

            if (
              jsonData.error ||
              jsonData.success === false ||
              res.statusCode >= 400
            ) {
              console.warn(`[PROXY CACHE] Erro da API: ${res.statusCode}`);
              return response;
            }

            if (cacheKey && cacheTtl) {
              // Depois de tudo, pode salvar
              CacheService.setCache(cacheKey, jsonData, cacheTtl).catch((err) =>
                console.error(
                  `[PROXY CACHE] Erro ao salvar ${cacheKey}: ${err}`
                )
              );

              res.setHeader("X-Cache", "MISS");
              res.setHeader("X-Cache-Key", cacheKey);
              res.setHeader("X-Cache-TTL", cacheTtl.toString());
              res.setHeader("X-Cache-Source", "Jikan-API");

              console.log(
                `[PROXY CACHE] Salvando: ${cacheKey} (TTL: ${cacheTtl}s)`
              );
            }
          }

          return response; // Resposta original
        } catch (error) {
          console.log(`[PROXY] Erro de interceptação: ${error}`);
          return responseBuffer.toString("utf-8"); // Fallback
        }
      }
    ),
    error: (err, req, res) => {
      console.error(`[PROXY] Erro de proxy: ${err.message}`);
      (res as any).status(502).json({
        success: false,
        type: "BAD_GATEWAY",
        message: "Erro ao acessar a Jikan API",
      });
    },
  },
});

export default jikanProxy;
