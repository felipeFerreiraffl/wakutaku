const BASE_URL = import.meta.env.BASE_URL;

// Erro personalizado
export class ApiError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Fetch global da API
export const apiFetch = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new ApiError(response.status, "Erro ao requisitar API");
  }

  const data = await response.json();
  return data.data as T;
};
