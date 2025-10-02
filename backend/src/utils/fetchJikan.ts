import type { JikanError } from "../middlewares/statusHandler.js";

// Resposta de fetch padrão
export async function fetchJikanResponse<T>(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error: JikanError = new Error("Erro ao dar fetch na url");
    error.status = response.status;
    throw error;
  }

  // Retorna os dados com o tipo definido
  const data = (await response.json()) as T;
  return data;
}
