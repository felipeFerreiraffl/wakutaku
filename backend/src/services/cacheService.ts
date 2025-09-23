import { redisClient } from "../config/redisConnection.js";

// Métodos de cache Redis reutilizável
export class CacheService {
  // Salva os dados no cache
  static async set(
    key: string,
    data: any,
    ttlSeconds: number = 300
  ): Promise<void> {
    try {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
      console.log(`✅ [CACHE] Cache salvo -> ${key} expira em ${ttlSeconds}`);
    } catch (error) {
      console.error(`❌ [CACHE] Falha ao salvar ${key}: ${error}`);
    }
  }

  // Busca as chaves de cache
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      if (value) {
        console.log(`✅ [CACHE] Cache encontrado: ${key}`);
        return JSON.parse(value) as T;
      }

      console.log(`🚫 [CACHE] Cache não encontrado: ${key}`);
      return null;
    } catch (error) {
      console.error(`❌ [CACHE] Falha ao buscar ${key}: ${error}`);
      return null;
    }
  }

  // Deleta as chaves do cache
  static async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
      console.log(`🗑️ [CACHE] Cache deletado: ${key}`);
    } catch (error) {
      console.error(`❌ [CACHE] Falha ao deletar ${key}: ${error}`);
    }
  }
}
