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

export type JobApplication = {
  id: string;
  companyName: string;
  roleTitle: string;
  jobUrl?: string;
  jobDescription: string;
  status: JobStatus;
  source: string;
  resumeVersion?: string;
  appliedAt?: string;
  followUpAt?: string;
  matchScore?: number;
  nextAction?: string;
  notes?: string;
};