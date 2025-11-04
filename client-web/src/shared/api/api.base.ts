// src/api/api.base.ts

import type { ApiResponse, ApiResponsePaginated, ErrorResponse } from "@shared/types/api.types";

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
  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json().catch(() => ({})) : await response.text();

  if (!response.ok) {
    const error: ErrorResponse = {
      statusCode: response.status,
      message:
        typeof body === "object"
          ? body.message || response.statusText
          : String(body),
      cause: body,
    };
    throw error;
  }

  return body;
}


export async function GET_ALL<T>(endpoint: string): Promise<ApiResponsePaginated<T>> {
  const res = await fetch(`${API_URL}/${endpoint}`);
  return handleResponse(res);
}

export async function GET_ONE<T>(endpoint: string, id: string | number): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}/${endpoint}/${id}`);
  return handleResponse(res);
}

export async function POST<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function UPDATE<T>(
  endpoint: string,
  id: string | number,
  data: any
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function DELETE<T>(
  endpoint: string,
  id: string | number
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}/${endpoint}/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

