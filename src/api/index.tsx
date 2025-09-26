/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL;
import { decrypt } from "@/utils/crypto";

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = decrypt(localStorage.getItem("authToken") || "");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token expirado ou inválido
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    window.location.href = "/login?expired=true";

    return;
  }

  // Tratar erros HTTP
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido" }));
    const error = new Error(errorData.message || "Erro desconhecido");
    (error as any).response = { data: errorData, status: res.status };
    throw error;
  }

  // Tenta retornar JSON
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Atalhos para cada método HTTP
export const api = {
  get: (url: string) => apiFetch(url),
  post: (url: string, body?: any) =>
    apiFetch(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: (url: string, body?: any) =>
    apiFetch(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (url: string) => apiFetch(url, { method: "DELETE" }),
};
