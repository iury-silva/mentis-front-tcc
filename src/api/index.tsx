const API_URL = import.meta.env.VITE_API_URL;

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");

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
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
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
    apiFetch(url, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: (url: string, body?: any) =>
    apiFetch(url, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: (url: string) => apiFetch(url, { method: "DELETE" }),
};
