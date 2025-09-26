import { CacheService } from "../services/cacheService.js";

// Define o TTL do cache
export const defineCacheTtl = (url: string): number => {
  // Sem cache
  if (url.includes("random") || url.includes("cache")) {
    return 0;
  }

  // Cache longo
  if (url.match(/\/(genres|producers|magazines)/)) {
    return CacheService.TTL.MAX;
  }

  // Cache médio-longo
  if (url.match(/\/(anime|manga)\/\d+/)) {
    return CacheService.TTL.LONG;
  }

  // Cache médio
  if (url.includes("q=")) {
    return CacheService.TTL.MEDIUM;
  }

  // Cache curto
  if (url.match(/\/(top|seasons|schedules)/)) {
    return CacheService.TTL.SHORT;
  }

  // Por padrão, retorna cache mínimo
  return CacheService.TTL.MIN;
};
