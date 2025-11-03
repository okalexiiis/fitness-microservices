// src/api/api.base.ts

// URL base de la API
export const API_URL = "http://localhost:4000/api";

// Interface para los parámetros de una request
export interface API_REQUEST {
  endpoint: string;
  data?: any;
  token?: string; // No necesario por el momento
}

// Helper para manejar respuestas y errores
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json().catch(() => ({}));
}

// Método GET para obtener todos los registros
export async function GET_ALL(endpoint: string) {
  const res = await fetch(`${API_URL}/${endpoint}`);
  return handleResponse(res);
}

// Método GET para obtener un solo registro
export async function GET_ONE(endpoint: string, id: string | number) {
  const res = await fetch(`${API_URL}/${endpoint}/${id}`);
  return handleResponse(res);
}

// Método POST para crear un nuevo registro
export async function CREATE(endpoint: string, data: any) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Método PUT/PATCH para actualizar un registro
export async function UPDATE(endpoint: string, id: string | number, data: any) {
  const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "PATCH", // o PATCH si tu API lo usa
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Método DELETE para eliminar un registro
export async function DELETE(endpoint: string, id: string | number) {
  const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}


