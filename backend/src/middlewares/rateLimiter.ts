import rateLimit from "express-rate-limit";

// Configuração do limite de requisições (3/seg)
export const globalRateLimiter = rateLimit({
  windowMs: 1000, // Tamanho do window (1 segundo)
  max: 3, // Máximo de requisições por window (seg)
  message: "Muitas requisições por IP. Tente novamente mais tarde.", // Mensagem de excedência de limite
  standardHeaders: true, // Mostra as respostas padrôes do Rate-Limit
});

// Configuração do limite para requisições de busca (1/seg)
export const searchRateLimiter = rateLimit({
  windowMs: 1000,
  max: 1,
  message: "Busca limitada a 1 por segundo. Tente novamente mais tarde.",
  standardHeaders: true,
});
