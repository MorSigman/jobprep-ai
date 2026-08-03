export type JobStatus =
  | "saved"
  | "applied"
  | "waiting"
  | "phone_screen"
  | "home_assignment"
  | "technical_interview"
  | "digital_interview"
  | "personal_interview"
  | "offer"
  | "rejected";

export type JobCategory =
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "QA"
  | "Data Analyst"
  | "Cyber"
  | "Product"
  | "UX/UI"
  | "Other";

export type JobApplication = {
  id: string;
  companyName: string;
  roleTitle: string;
  jobNumber?: string;
  location?: string;
  jobUrl?: string;
  jobDescription: string;
  status: JobStatus;
  source: string;
  category?: string;
  resumeVersion?: string;
  appliedAt?: string;
  followUpAt?: string;
  matchScore?: number;
  salaryRange?: string;
  nextAction?: string;
  notes?: string;
  updatedAt?: string;
  companyResearch?: string;
  keyRequirements?: string;
  skillsToLearn?: string;
  phoneScreenNotes?: string;
  technicalQuestions?: string;
  personalQuestions?: string;
  relevantProjects?: string;
  interviewNotes?: string;
  followUpMessageDraft?: string;
};
