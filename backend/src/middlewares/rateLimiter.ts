import rateLimit from "express-rate-limit";

// Configuração do limite de requisições (3/seg)
const rateLimiter = rateLimit({
  windowMs: 1000, // Tamanho do window (1 segundo)
  max: 3, // Máximo de requisições por window (seg)
  message: "Muitas requisições por IP. Tente novamente mais tarde.", // Mensagem de excedência de limite
  standardHeaders: true, // Mostra as respostas padrôes do Rate-Limit
});

export default rateLimiter;
