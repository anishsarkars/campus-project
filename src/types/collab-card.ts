export type CollabType = "Skill Swap" | "Team Up" | "Idea/Partner";

export interface CollabCard {
  id: string;
  type: CollabType;
  title: string;
  description: string;
  tags: string[];
  timeSlots: string[]; // e.g., ["Mon 2-4pm", "Fri 10-12am"]
  contactNumber: string; // private
  createdBy: string; // user id or email
  createdAt: Date;
} 