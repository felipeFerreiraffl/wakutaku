import app from "./app.js";
import { env } from "./config/envConfig.js";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
