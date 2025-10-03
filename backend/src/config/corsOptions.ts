import cors from "cors";

const origins = ["*"]; // Adicionar a URL da Vercel no final
export const corsOptions: cors.CorsOptions = {
  origin: origins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "X-Cache"],
  credentials: false,
  optionsSuccessStatus: 200,
};
