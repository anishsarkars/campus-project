// Backend-aligned type definitions for the NextUp frontend

// ── Auth ──────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: "student" | "organisation";
  provider: "local" | "google" | "github";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ── Student Profile ───────────────────────────────────────────────────

export interface StudentProfile {
  _id: string;
  email: string;
  profiles?: {
    linkedin?: string;
    github?: string;
    other_profiles?: Record<string, string>;
  };
  avatar?: string;
  gender?: "Male" | "Female" | "Other";
  location?: string;
  intrested_domains?: string[];
  education?: {
    collegeName?: string;
    course?: string;
    specialization?: string;
    year_of_graduation?: number;
  };
  skills?: string[];
  connections?: string[];
  coin_balance?: number;
  posted_opportunities?: string[];
  collaborations?: string[];
  skillswapRequests?: string[];
  transactions?: string[];
  badges?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ── Organisation Profile ──────────────────────────────────────────────

export interface OrganisationProfile {
  _id: string;
  name?: string;
  email: string;
  avatar?: string;
  profile?: {
    website?: string;
    linkedin?: string;
    github?: string;
    otherProfiles?: Record<string, string>;
  };
  location?: string;
  description?: string;
  posted_opportunities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ── Opportunity ───────────────────────────────────────────────────────

export interface Opportunity {
  _id: string;
  title: string;
  type: "internship" | "scholarship" | "event" | "hackathon" | "opportunity";
  description?: string;
  deadline?: string;
  location?: string;
  tags?: string[];
  postedBy: {
    id: string | StudentProfile | OrganisationProfile;
    role: "Student" | "Organisation";
  };
  applicants?: (string | StudentProfile)[];
  apply_link?: string;
  displayDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ── Collaboration ─────────────────────────────────────────────────────

export interface Collaboration {
  _id: string;
  title: string;
  description?: string;
  requiredSkills?: string[];
  deadline?: string;
  createdBy: {
    id: string | StudentProfile;
    role: string;
  };
  participants?: (string | StudentProfile)[];
  status: "open" | "in-progress" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

// ── Skillswap ─────────────────────────────────────────────────────────

export interface Skillswap {
  _id: string;
  mode: "coin" | "skill";
  skillName: string;
  description?: string;
  coinCost?: number | null;
  skillOffered?: string | null;
  skillRequested?: string | null;
  createdBy: {
    id: string | StudentProfile;
    role: string;
  };
  acceptedBy?: string | StudentProfile | null;
  status: "open" | "accepted" | "completed";
  feedback?: string | null;
  rating?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// ── Connection ────────────────────────────────────────────────────────

export interface Connection {
  _id: string;
  from: {
    id: string | StudentProfile | OrganisationProfile;
    role: "Student" | "Organisation";
  };
  to: {
    id: string | StudentProfile | OrganisationProfile;
    role: "Student" | "Organisation";
  };
  status: "pending" | "accepted" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

// ── Notification ──────────────────────────────────────────────────────

export interface Notification {
  _id: string;
  recipient: {
    id: string;
    role: "Student" | "Organisation";
  };
  type: "connection" | "opportunity" | "skillswap" | "collaboration" | "system";
  message: string;
  relatedId: string;
  status: "unread" | "read";
  createdAt?: string;
  updatedAt?: string;
}

// ── Transaction ───────────────────────────────────────────────────────

export interface Transaction {
  _id: string;
  sender: {
    id: string | StudentProfile | OrganisationProfile;
    role: "Student" | "Organisation";
  };
  receiver: {
    id: string | StudentProfile | OrganisationProfile;
    role: "Student" | "Organisation";
  };
  amount: number;
  reason: "skillswap" | "reward" | "purchase";
  relatedSkillswap?: string | Skillswap | null;
  createdAt?: string;
  updatedAt?: string;
}

// ── API Error ─────────────────────────────────────────────────────────

export interface ApiError {
  status: number;
  message: string;
}

// ── Legacy types kept for Tasks page (standalone feature) ─────────────

export interface Task {
  id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  type: "code" | "design" | "quiz";
  description: string;
  spec: string;
  dueDate: string;
  points: number;
  testCases?: TestCase[];
  quizQuestions?: QuizQuestion[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}