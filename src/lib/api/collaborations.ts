// Collaborations API module

import api from "./client";
import type { Collaboration } from "@/types";

// GET /collaborations — list all
export async function getAll(): Promise<{ collaborations: Collaboration[] }> {
  return api.get("/collaborations");
}

// GET /collaborations/:id — get one
export async function getOne(id: string): Promise<{ collaboration: Collaboration }> {
  return api.get(`/collaborations/${id}`);
}

// POST /collaborations — create (students only)
export async function create(fields: {
  title: string;
  description?: string;
  requiredSkills?: string[];
  deadline?: string;
}): Promise<{ collaboration: Collaboration }> {
  return api.post("/collaborations", fields);
}

// PATCH /collaborations/:id — update (owner only)
export async function update(
  id: string,
  updates: Partial<Collaboration>
): Promise<{ collaboration: Collaboration }> {
  return api.patch(`/collaborations/${id}`, updates);
}

// DELETE /collaborations/:id — remove (owner only)
export async function remove(id: string): Promise<{ message: string }> {
  return api.delete(`/collaborations/${id}`);
}

// POST /collaborations/:id/join — join (students only)
export async function join(id: string): Promise<{ message: string }> {
  return api.post(`/collaborations/${id}/join`);
}
