import { createClient } from "redis";
import { envVar } from "./envConfig.js";

// Criação do cliente Redis
const redisClient = createClient({
  url: envVar.REDIS_URL, // URL da Redis,
  username: envVar.REDIS_USERNAME, // Nome do usuário
  password: envVar.REDIS_PASSWORD, // Senha

  socket: {
    connectTimeout: 60000, // Tempo limite de conexão com o banco de dados (60s)
    reconnectStrategy: (retries) => Math.min(retries * 50, 500), // Como reconecta após cair (espera 50ms, 100ms, ..., até 500ms)
  },
});

// Inicia a conexão
redisClient.on("connect", () => {
  console.log("🔄️ [REDIS] Conectando ao servidor...");
});

// Conexão feita
redisClient.on("ready", () => {
  console.log("✅ [REDIS] Cliente conectado");
});

// Erro de conexão
redisClient.on("error", (err: Error) => {
  console.log(`❌ [REDIS] Erro ao conectar cliente: ${err.message}`);
});

// Reconexão
redisClient.on("reconnecting", () => {
  console.log("🔄️ [REDIS] Reconectando ao servidor...");
});

// Função de teste
const testConnection = async (): Promise<void> => {
  await redisClient.ping(); // Envia um comando ping, respondendo pong

  // Comandos básicos (SET, GET e DEL)
  await redisClient.set("test:connection", "WakuTaku conectado");
  await redisClient.get("test:connection");
  await redisClient.del("test:connection");
};

// Função de conexão
export const connectToRedis = async (): Promise<void> => {
  try {
    // Verificação de conexão aberta
    if (!redisClient.isOpen) {
      await redisClient.connect(); // Conecta ao banco de dados
      await testConnection();
    }
  } catch (error) {
    console.error(`❌ [REDIS] Falha ao conectar com o Redis: ${error}`);
    throw error;
  }
};

// Função de desconexão
export const disconnectFromRedis = async (): Promise<void> => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit(); // Desconecta esperando funções pendentes terminarem
    }
  } catch (error) {
    console.error(`⚠️ [REDIS] Falha ao desconectar do Redis: ${error}`);
  }
};

export { redisClient };
