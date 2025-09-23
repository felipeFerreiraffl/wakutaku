import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number(),
  API_URL: z.url().or(z.string()),
  REDIS_URL: z.url().or(z.string()),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
});

export const envVars = envSchema.parse(process.env);
