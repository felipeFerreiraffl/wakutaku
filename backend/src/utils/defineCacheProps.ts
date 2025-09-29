import { CacheService } from "../services/cacheService.js";

// Define o TTL do cache
export const defineCacheTtl = (url: string): number => {
  if (url.includes("random") || url.includes("cache")) {
    return 0;
  }

  if (url.match(/\/(genres|producers|magazines)/)) {
    return CacheService.TTL.MAX;
  }

  if (url.match(/\/(anime|manga)\/\d+/)) {
    return CacheService.TTL.LONG;
  }

  if (url.includes("q=")) {
    return CacheService.TTL.MEDIUM;
  }

  if (url.match(/\/(top|seasons|schedules)/)) {
    return CacheService.TTL.SHORT;
  }

  return CacheService.TTL.MIN;
};
