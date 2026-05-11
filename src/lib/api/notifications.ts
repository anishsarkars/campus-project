// Notifications API module

import api, { getToken } from "./client";
import type { Notification } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://nextup-backend.vercel.app";

// GET /notifications — list all
export async function listNotifications(): Promise<{ notifications: Notification[] }> {
  return api.get("/notifications");
}

// PATCH /notifications/:id — mark as read
export async function markAsRead(id: string): Promise<{ message: string }> {
  return api.patch(`/notifications/${id}`);
}

// GET /notifications/stream — SSE stream connection
// Returns an EventSource instance. Caller is responsible for cleanup.
export function connectSSE(): EventSource | null {
  const token = getToken();
  if (!token) return null;

  // EventSource doesn't support custom headers, so we pass token as query param
  // The backend will need to accept this — for now we use the standard header approach
  // via a polyfill or by passing in URL
  const url = `${BACKEND_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`;
  
  const eventSource = new EventSource(url);
  return eventSource;
}
