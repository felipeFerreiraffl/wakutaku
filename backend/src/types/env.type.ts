import z from "zod";

// Definição de schema das variáveis de ambiente
const envSchema = z.object({
  PORT: z.coerce
    .number()
    .refine(
      (port) => port > 0 && port < 65000,
      "Número de porta HTTP inválida"
    ),

  JIKAN_API_URL: z.url("URL Jikan inválida"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  REDIS_URL: z.url("URL do Redis inválida"),
  REDIS_USERNAME: z
    .string()
    .min(1, "Usuário do Redis não pode estar vazio")
    .default("default"),
  REDIS_PASSWORD: z.string().min(1, "Senha do Redis não pode estar vazia"),
});

// Infere o tipo do envSchema
type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = envSchema.parse(process.env);
