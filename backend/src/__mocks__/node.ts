import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";

// Criação de um server falso
export const server = setupServer(...handlers);
