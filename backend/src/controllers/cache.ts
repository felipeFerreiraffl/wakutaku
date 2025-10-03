import type { NextFunction, Request, Response } from "express";
import { envVar } from "../config/envConfig.js";
import { redisClient } from "../config/redisConnection.js";
import { setSuccessMessage } from "../middlewares/statusHandler.js";

export const getCacheStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      setSuccessMessage(res, {
        status: "disconnected",
        message: "Redis não está conectado",
      });
      return;
    }

    const totalKeys = await redisClient.dbSize();

    // Mostra mais detalhes em desenvolvimento
    if (envVar.NODE_ENV !== "production") {
      const info = await redisClient.info();

      // Informações básicas
      const uptime = info.match(/uptime_in_days:(\d+)/)?.[1];
      const memoryUsed = info.match(/used_memory_human:([^\r\n]+)/)?.[1];
      const version = info.match(/redis_version:([^\r\n]+)/)?.[1];

      setSuccessMessage(res, {
        status: "connected",
        totalKeys,
        uptime: `${uptime} dias`,
        memoryUsed,
        version,
      });
      return;
    }

    setSuccessMessage(res, {
      status: "connected",
      totalKeys,
      environment: "production",
    });
  } catch (error) {
    next(error);
  }
};

// Busca todas as chaves de cache
export const getCacheKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Bloqueia em ambiente de produção
    if (envVar.NODE_ENV === "production") {
      setSuccessMessage(res, {
        error: `Busca por chaves apenas em ambiente de desenvolvimento ou teste`,
      });
      return;
    }

    const keys: string[] = [];
    let cursor = "0";

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: "*", // Padrão de chaves (tudo)
        COUNT: 100, // 100 de uma vez
      });

      cursor = result.cursor;
      keys.push(...result.keys);

      if (keys.length > 1000) {
        setSuccessMessage(res, {
          keys: keys.slice(0, 1000), // MAX = 1000
          total: keys.length,
          truncated: true,
          message: "Resultado truncado para 1000 chaves",
        });
        return;
      }
    } while (cursor !== "0");

    setSuccessMessage(res, {
      keys,
      total: keys.length,
    });
  } catch (error) {
    next(error);
  }
};

// Buscar chaves no cache baseado no padrão
export const getCacheKeysByPattern = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (envVar.NODE_ENV === "production") {
      setSuccessMessage(res, {
        error:
          "Busca de chaves por padrão apenas em ambiente de desenvolvimento ou teste",
      });
      return;
    }

    const pattern = req.params.pattern ?? "*";

    const keys: string[] = [];
    let cursor = "0";

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: "*", // Padrão de chaves (tudo)
        COUNT: 100, // 100 de uma vez
      });

      cursor = result.cursor;
      keys.push(...result.keys);

      if (keys.length > 500) break; // Limite menor
    } while (cursor !== "0");

    setSuccessMessage(res, {
      pattern,
      keys,
      total: keys.length,
      truncated: keys.length >= 500,
    });
  } catch (error) {
    next(error);
  }
};

// Deleta todo o cache
export const clearCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (envVar.NODE_ENV === "production") {
      setSuccessMessage(res, {
        error: "Limpeza completa apenas em ambiente de desenvolvimento o teste",
      });
      return;
    }

    // Confirmação de limpeza do cache
    const confirm = req.query.confirm as string;
    if (confirm !== "yes") {
      setSuccessMessage(res, {
        error: "Confirmação necessária",
        message: "Adicione ?confirm=yes",
        warning: "Esta operação irá deletar TODOS os dados",
      });
      return;
    }

    const totalKeysBefore = await redisClient.dbSize();
    await redisClient.flushDb();

    setSuccessMessage(res, {
      message: "Cache apagado com sucesso",
      keysDeleted: totalKeysBefore,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// Deleta chaves de cache por pattern (padrão)
export const clearCacheKeyByPattern = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (envVar.NODE_ENV === "production") {
      setSuccessMessage(res, {
        error:
          "Limpeza de chaves por padrão apenas em ambiente de desenvolvimento",
      });
      return;
    }

    const pattern = req.params.pattern;
    if (!pattern || pattern === "*") {
      setSuccessMessage(res, {
        error: "Padrão específico é obrigatório (não use '*')",
      });
      return;
    }

    const keys: string[] = [];
    let cursor = "0";

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: "*", // Padrão de chaves (tudo)
        COUNT: 50, // 100 de uma vez
      });

      cursor = result.cursor;
      keys.push(...result.keys);

      if (keys.length > 200) break; // Limite menor
    } while (cursor !== "0");

    if (keys.length === 0) {
      setSuccessMessage(res, {
        message: "Nenhuma chave encontrada",
        pattern,
        deleted: 0,
      });
      return;
    }

    // Limpeza em lote
    const batchSize = 50;
    let totalDeleted = 0;

    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize); // Limpa de 50 em 50
      const deleted = await redisClient.del([...batch]);
      totalDeleted += deleted;
    }

    setSuccessMessage(res, {
      message: "Chave(s) deletada(s) com sucesso",
      patternDeleted: pattern,
      keysFound: keys.length,
      keysDeleted: totalDeleted,
      keys: keys.slice(0, 20),
    });
  } catch (error) {
    next(error);
  }
};

// Busca estatísticas de performance
export const getCachePerformanceStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const info = await redisClient.info();

    // Chaves encontradas com sucesso
    const keyspaceHits = parseInt(
      info.match(/keyspace_hits:(\d+)/)?.[1] || "0"
    );

    // Chaves não encontradas com sucesso
    const keyspaceMisses = parseInt(
      info.match(/keyspace_misses:(\d+)/)?.[1] || "0"
    );

    const totalRequests = keyspaceHits + keyspaceMisses;

    // Taxa de acerto
    const hitRate = parseInt(
      ((keyspaceHits / keyspaceMisses) * 100).toFixed(1)
    );

    // Verificação de saúde
    const status =
      hitRate >= 80
        ? "Excelente"
        : hitRate < 80 && hitRate >= 60
        ? "Razoável"
        : hitRate < 60 && hitRate >= 40
        ? "Ruim"
        : "Crítico";

    setSuccessMessage(res, {
      status,
      totalRequests,
      keyspaceHits,
      keyspaceMisses,
      hitRate: `${hitRate}%`,
    });
  } catch (error) {
    next(error);
  }
};
