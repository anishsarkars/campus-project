// Users API module — profile fetch and update

import api from "./client";
import type { StudentProfile, OrganisationProfile } from "@/types";

export interface MeResponse {
  user: {
    id: string;
    email: string;
    role: "student" | "organisation";
    provider: "local" | "google" | "github";
  };
  profile: StudentProfile | OrganisationProfile;
}

// GET /users/me — fetch authenticated user's profile
export async function getMe(): Promise<MeResponse> {
  return api.get<MeResponse>("/users/me");
}

// PATCH /users/update — partial profile update
export async function updateProfile(
  updates: Partial<StudentProfile> | Partial<OrganisationProfile>
): Promise<{ user: StudentProfile | OrganisationProfile }> {
  return api.patch("/users/update", updates);
}
