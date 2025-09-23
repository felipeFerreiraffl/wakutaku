import { env } from "../types/env.type.js";

// Variáveis do .env
export const envVar = {
  PORT: env.PORT,
  JIKAN_API_URL: env.JIKAN_API_URL,
  NODE_ENV: env.NODE_ENV,
  REDIS_URL: env.REDIS_URL,
  REDIS_USERNAME: env.REDIS_USERNAME,
  REDIS_PASSWORD: env.REDIS_PASSWORD,
};
