import { envVar } from "../types/env.js";

// Variáveis de ambiente
export const env = {
  NODE_ENV: envVar.NODE_ENV,
  PORT: envVar.PORT,
  API_URL: envVar.API_URL,
  REDIS_URL: envVar.REDIS_URL,
  REDIS_USERNAME: envVar.REDIS_USERNAME,
  REDIS_PASSWORD: envVar.REDIS_PASSWORD,
};
