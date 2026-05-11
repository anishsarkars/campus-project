// Central HTTP client for all backend API calls.
// Handles JWT injection, error parsing, and auto-logout on 401.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://nextup-backend.vercel.app/api";

export interface ApiError {
  status: number;
  message: string;
}

// Retrieve the stored JWT token
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nextup:token");
}

// Store JWT token
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("nextup:token", token);
}

// Remove JWT token
export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("nextup:token");
}

// Build headers with optional auth
function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Parse error response from backend
async function parseError(res: Response): Promise<ApiError> {
  try {
    const data = await res.json();
    return { status: res.status, message: data.message || "An error occurred" };
  } catch {
    return { status: res.status, message: "An error occurred" };
  }
}

// Handle 401 — auto logout
function handleUnauthorized() {
  removeToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("nextup:user");
    window.dispatchEvent(new CustomEvent("nextup:logout"));
    // Only redirect if not already on auth page
    if (!window.location.pathname.startsWith("/auth")) {
      window.location.href = "/auth";
    }
  }
}

// Generic request method
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  extraHeaders?: Record<string, string>
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const options: RequestInit = {
    method,
    headers: buildHeaders(extraHeaders),
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    if (res.status === 401) {
      handleUnauthorized();
    }
    const error = await parseError(res);
    throw error;
  }

  // Handle empty responses (204, etc.)
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {} as T;
  }

  return res.json();
}

// Convenience methods
export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};

export default api;
