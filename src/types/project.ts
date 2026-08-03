export type ProjectDeepAnalysis = {
  analysis: string;
  architecture: string;
  whatWasBuilt: string;
  technologiesExplained: string;
  analyzedAt: string;
};

export type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  language: string;
  githubUrl: string;
  simpleExplanation: string;
  interviewTip: string;
  deepAnalysis: ProjectDeepAnalysis | null;
  createdAt: string;
};
