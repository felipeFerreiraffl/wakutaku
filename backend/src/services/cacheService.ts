import { redisClient } from "../config/redisConnection.js";

// Serviço contralizado cache Redis
export class CacheService {
  // Configuração do TTL (Time-to-live)
  static readonly TTL = {
    MIN: 2 * 60, // 2 min
    SHORT: 5 * 60, // 5 min
    MEDIUM: 30 * 60, // 30 min
    LONG: 60 * 60, // 1 hr
    MAX: 24 * 60 * 60, // 24 hrs
  };

  // Busca os dados de uma chave
  static async getCache<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await redisClient.get(key);

      if (!cachedData) {
        return null;
      }

      // Recebe os dados do cache (JSON) e tranforma em objeto JS (com o tipo T)
      return JSON.parse(cachedData) as T;
    } catch (error) {
      return null;
    }
  }

  // Salva dados no cache com tempo de expiração
  static async setCache(key: string, data: any, ttl: number): Promise<void> {
    try {
      // Transforma o objeto (data) em JSON
      const jsonData = JSON.stringify(data);

      // Salvamento com expiração (EX)
      await redisClient.setEx(key, ttl, jsonData);
    } catch (error) {
      throw error;
    }
  }

  // Exclui dados de um cache
  static async delCache(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      throw error;
    }
  }

  // Exclui dados em lote através de um padrão (api:*, season:*, etc)
  static async delPattern(pattern: string): Promise<number> {
    try {
      // Busca as chaves pelo padrão (retorna um [])
      const keys = await redisClient.keys(pattern);

      if (keys.length === 0) {
        return 0;
      }

      // Deleta cada dado do cache
      const deletedPattern = await redisClient.del([...keys]);
      return deletedPattern;
    } catch (error) {
      return 0;
    }
  }

  // Verifica se o cache existe (get() -> busca e retorna os dados)
  static async existsCache(key: string): Promise<boolean> {
    try {
      // Verifica se existe o cache, retornando um número
      const result = await redisClient.exists(key);
      return result === 1; // True
    } catch (error) {
      return false;
    }
  }

  // Obtém quanto tempo falta para o cache expirar
  static async getTtlExpiringTime(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key); // Números positivos ou -1 (não expira)
    } catch (error) {
      return -2; // Não existe TTL para o cache
    }
  }
}
