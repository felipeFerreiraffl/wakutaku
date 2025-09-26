import type { NextFunction, Request, Response } from "express";
import { CacheService } from "../services/cacheService.js";
import { defineCacheTtl } from "../utils/defineCacheProps.js";

// Define o cache da proxy da Jikan
export const smartProxyCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const url = req.originalUrl;
    const ttl = defineCacheTtl(url);

    // Pula o middleware se TTL = 0
    if (ttl === 0) {
      console.log(`[PROXY CACHE] Sem cache para a rota ${url}`);
      return next();
    }

    const type = url.includes("anime")
      ? "anime"
      : url.includes("manga")
      ? "manga"
      : null;
    const cacheKey = `proxy:${url}`;
    const cachedData = await CacheService.getCache(cacheKey);

    if (cachedData) {
      console.log(`[PROXY CACHE] HIT: ${cacheKey}`);

      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-Cache-Key", cacheKey);
      res.setHeader("X-Cache-TTL", ttl);
      res.setHeader("X-Cache-Source", "Redis");

      res.json(cachedData);
      return;
    }

    console.log(`[PROXY CACHE] MISS: ${cacheKey}`);

    // Evita múltiplas interceptações
    let intercepted = false;

    // Três respostas da Proxy
    const originalJson = res.json;
    const originalSend = res.send;
    // const originalEnd = res.end;

    const processAndCache = async (data: any, method: string) => {
      if (intercepted) false;
      intercepted = true;

      try {
        let processedData = data;

        // Caso a resposta vier como um Buffer
        if (Buffer.isBuffer(data)) {
          const stringData = data.toString("utf-8"); // Converte para string

          try {
            processedData = JSON.parse(stringData);
          } catch (error) {
            console.warn(`[PROXY CACHE] Buffer não é JSON válido: ${cacheKey}`);
            return; // Não cacheia
          }
        } else if (typeof data === "string") {
          // Tenta parsear como JSON
          try {
            processedData = JSON.parse(data);
          } catch (error) {
            console.warn(`[PROXY CACHE] String não é JSON válido: ${cacheKey}`);
            return;
          }
        }

        // Verifica se é uma resposta de erro
        if (processedData && typeof processedData === "object") {
          // Não cacheia se der erro
          if (processedData.success === false || processedData.error) {
            console.warn(
              `[PROXY CACHE] Mensagem de erro, não cachear ${cacheKey}`
            );
            return;
          }

          // Depois de tudo, pode salvar
          CacheService.setCache(cacheKey, processedData, ttl).catch((err) =>
            console.error(`[PROXY CACHE] Erro ao salvar ${cacheKey}: ${err}`)
          );

          res.setHeader("X-Cache", "MISS");
          res.setHeader("X-Cache-Key", cacheKey);
          res.setHeader("X-Cache-TTL", ttl);
          res.setHeader("X-Cache-Source", "Jikan");

          console.log(
            `[PROXY CACHE] Salvando ${method}: ${cacheKey} (TTL: ${ttl}s)`
          );
        }
      } catch (error) {
        console.error(`[PROXY CACHE] Erro de processamento de MISS: ${error}`);
      }
    };

    // Intercepta as respostas da Proxy (apenas JSON)
    res.json = function (data: any) {
      processAndCache(data, "json");

      // Chama o método original (json)
      return originalJson.call(this, data);
    };

    // Fallback com send() caso o json() não seja chamado
    res.send = function (data: any) {
      if (!intercepted) {
        processAndCache(data, "send");
      }

      // Chama o método original (send)
      return originalSend.call(this, data);
    };

    

    next();
  } catch (error) {
    console.error(`[PROXY CACHE] Erro no middleware: ${error}`);
    next(); // Sem cache
  }
};
