// Skillswap API module

import api from "./client";
import type { Skillswap } from "@/types";

// GET /skillswap — list all
export async function getAll(): Promise<{ skillswaps: Skillswap[] }> {
  return api.get("/skillswap");
}

// GET /skillswap/:id — get one
export async function getOne(id: string): Promise<{ skillswap: Skillswap }> {
  return api.get(`/skillswap/${id}`);
}

// POST /skillswap — create (students only)
export async function create(fields: {
  mode: "coin" | "skill";
  skillName: string;
  description?: string;
  coinCost?: number;
  skillOffered?: string;
  skillRequested?: string;
}): Promise<{ skillswap: Skillswap }> {
  return api.post("/skillswap", fields);
}

// PATCH /skillswap/:id — update (owner only, while open)
export async function update(
  id: string,
  updates: Partial<Skillswap>
): Promise<{ skillswap: Skillswap }> {
  return api.patch(`/skillswap/${id}`, updates);
}

// DELETE /skillswap/:id — remove (owner only)
export async function remove(id: string): Promise<{ message: string }> {
  return api.delete(`/skillswap/${id}`);
}

// POST /skillswap/:id/accept — accept (students only, not own)
export async function accept(id: string): Promise<{ message: string; skillswap: Skillswap }> {
  return api.post(`/skillswap/${id}/accept`);
}

// POST /skillswap/:id/complete — mark complete with optional feedback
export async function complete(
  id: string,
  data?: { feedback?: string; rating?: number }
): Promise<{ message: string; skillswap: Skillswap }> {
  return api.post(`/skillswap/${id}/complete`, data);
}
