import app from "./app.js";
import { envVar } from "./config/envConfig.js";
import {
  connectToRedis,
  disconnectFromRedis,
} from "./config/redisConnection.js";

const PORT = envVar.PORT;

async function startServer() {
  try {
    console.log("🔄️ Conectando-se ao Redis...");
    await connectToRedis();
    console.log(`✅ Conexão feita com sucesso`);

    app.listen(PORT, () => {
      console.log(`✅ [NODE] Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Erro ao inicar o servidor: ${error}`);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("🛑 Fechando aplicação...");
  await disconnectFromRedis();
  process.exit(0);
});

startServer();
