// Adiciona um erro com Status
export interface CustomError extends Error {
  status: number;
}
