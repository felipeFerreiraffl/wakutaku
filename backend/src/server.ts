import app from "./app.js";
import { envVar } from "./config/envConfig.js";

const PORT = envVar.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
