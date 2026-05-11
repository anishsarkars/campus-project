// Connections API module

import api from "./client";
import type { Connection } from "@/types";

// POST /connections/request — send a connection request
export async function sendRequest(toUserId: string): Promise<{ connection: Connection }> {
  return api.post("/connections/request", { toUserId });
}

// POST /connections/:id/accept — accept a connection request
export async function acceptConnection(id: string): Promise<{ message: string }> {
  return api.post(`/connections/${id}/accept`);
}

// POST /connections/:id/reject — reject a connection request
export async function rejectConnection(id: string): Promise<{ message: string }> {
  return api.post(`/connections/${id}/reject`);
}

// GET /connections — list accepted connections
export async function list(): Promise<{ connections: Connection[] }> {
  return api.get("/connections");
}
