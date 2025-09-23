import z from "zod";

// Esquema para os tipos do env
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  API_URL: z
    .url()
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      error: "API_URL deve ser uam URL válida ou string vazia",
    })
    .default(""),
  REDIS_URL: z
    .url()
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      error: "REDIS_URL deve ser uam URL válida ou string vazia",
    })
    .default(""),
  REDIS_USERNAME: z.string().default("default"),
  REDIS_PASSWORD: z.string().default(""),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("Erro nas variáveis de ambiente: ");
    console.error("Variáveis: ", {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      API_URL: process.env.API_URL,
      REDIS_URL: process.env.REDIS_URL,
      REDIS_USERNAME: process.env.REDIS_USERNAME,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    });

    throw error;
  }
};

export const envVar = parseEnv();
