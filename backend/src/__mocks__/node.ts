import { setupServer } from "msw/node";
import { jikanHandlers } from "./handlers/jikan.js";

// Criação de um server falso
export const server = setupServer(...jikanHandlers);
