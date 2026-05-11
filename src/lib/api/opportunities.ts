// Opportunities API module

import api from "./client";
import type { Opportunity } from "@/types";

// GET /opportunities — list all
export async function getAll(): Promise<{ opportunities: Opportunity[] }> {
  return api.get("/opportunities");
}

// GET /opportunities/:id — get one
export async function getOne(id: string): Promise<{ opportunity: Opportunity }> {
  return api.get(`/opportunities/${id}`);
}

// POST /opportunities — create
export async function create(fields: {
  title: string;
  type: "internship" | "scholarship" | "event" | "hackathon" | "opportunity";
  description?: string;
  deadline?: string;
  location?: string;
  tags?: string[];
  apply_link?: string;
}): Promise<{ opportunity: Opportunity }> {
  return api.post("/opportunities", fields);
}

// PATCH /opportunities/:id — update
export async function update(
  id: string,
  updates: Partial<Opportunity>
): Promise<{ opportunity: Opportunity }> {
  return api.patch(`/opportunities/${id}`, updates);
}

// DELETE /opportunities/:id — remove
export async function remove(id: string): Promise<{ message: string }> {
  return api.delete(`/opportunities/${id}`);
}

// POST /opportunities/:id/apply — apply (students only)
export async function apply(id: string): Promise<{ message: string }> {
  return api.post(`/opportunities/${id}/apply`);
}

// GET /opportunities/:id/applicants — get applicants (organisations only)
export async function getApplicants(id: string): Promise<{ applicants: unknown[] }> {
  return api.get(`/opportunities/${id}/applicants`);
}
