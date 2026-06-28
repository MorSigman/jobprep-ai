export type JobStatus =
  | "saved"
  | "applied"
  | "waiting"
  | "phone_screen"
  | "home_assignment"
  | "technical_interview"
  | "personal_interview"
  | "offer"
  | "rejected";

export type JobCategory =
  | "Frontend"
  | "Backend"
  | "QA"
  | "Data Analyst"
  | "Cyber"
  | "Product"
  | "Other";

export type JobApplication = {
  id: string;
  companyName: string;
  roleTitle: string;
  jobUrl?: string;
  jobDescription: string;
  status: JobStatus;
  source: string;
  category?: JobCategory;
  resumeVersion?: string;
  appliedAt?: string;
  followUpAt?: string;
  matchScore?: number;
  nextAction?: string;
  notes?: string;
  updatedAt?: string;
};
