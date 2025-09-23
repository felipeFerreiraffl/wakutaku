import { envVars } from "../types/env.js";

export const env = {
  NODE_ENV: envVars.NODE_ENV,
  API_URL: envVars.API_URL,
  PORT: envVars.PORT,
  REDIS_URL: envVars.REDIS_URL,
  REDIS_USERNAME: envVars.REDIS_USERNAME,
  REDIS_PASSWORD: envVars.REDIS_PASSWORD,
};
