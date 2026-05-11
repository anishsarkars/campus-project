// Auth API module — signup, login, logout, OAuth URLs

import api, { setToken, removeToken } from "./client";

const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return "http://localhost:8080";
    }
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || "https://nextup-backend.vercel.app";
};

const BACKEND_URL = getBackendUrl();

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: "student" | "organisation";
    provider: "local" | "google" | "github";
  };
}

export interface SignupPayload {
  email: string;
  password: string;
  role: "student" | "organisation";
}

export interface LoginPayload {
  email: string;
  password: string;
}

// POST /auth/signup
export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/signup", payload);
  setToken(data.token);
  return data;
}

// POST /auth/login
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/login", payload);
  setToken(data.token);
  return data;
}

// POST /auth/logout
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Even if the API call fails, we still clear the local token
  }
  removeToken();
}

// Get Google OAuth URL — redirects the browser to backend OAuth
export function getGoogleOAuthUrl(role: "student" | "organisation" = "student"): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${BACKEND_URL}/api/auth/google?role=${role}&origin=${encodeURIComponent(origin)}`;
}

// Get GitHub OAuth URL — redirects the browser to backend OAuth
export function getGitHubOAuthUrl(role: "student" | "organisation" = "student"): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${BACKEND_URL}/api/auth/github?role=${role}&origin=${encodeURIComponent(origin)}`;
}
