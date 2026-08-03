const SERVER_URL = "http://localhost:8787";

async function apiFetch(path: string, body: unknown): Promise<Response> {
  try {
    return await fetch(`${SERVER_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("השרת לא פעיל — הפעלי מחדש את JobPrep.bat");
    }
    throw err;
  }
}

async function parseErrorBody(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? "שגיאת שרת";
  } catch {
    return "שגיאת שרת";
  }
}

export type AIRawQuestion = {
  question: string;
  shortAnswer: string;
  simpleExplanation: string;
  example: string;
  whatToMention: string[];
  commonMistakes: string[];
  tags: string[];
  category: string;
  topic: string;
  difficulty: "basic" | "intermediate" | "advanced";
};

export type AIJobQuestionsPayload = {
  jobTitle?: string;
  jobCategory?: string;
  jobDescription: string;
  optionalProfileSummary?: string;
  taskType: "job-questions";
};

export async function fetchAIJobQuestions(
  payload: AIJobQuestionsPayload
): Promise<AIRawQuestion[]> {
  const res = await apiFetch("/api/ai/job-questions", payload);
  if (!res.ok) throw new Error(await parseErrorBody(res));
  const data = (await res.json()) as { questions?: AIRawQuestion[] };
  return data.questions ?? [];
}

export type AICvTailoringPayload = {
  jobTitle?: string;
  jobDescription: string;
  profileSummary?: string;
};

export type AICvTailoringResult = {
  matchingStrengths: string[];
  missingKeywords: string[];
  recommendedHighlights: string[];
  suggestedPhrases: string[];
  projectsToMention: string[];
  warnings: string[];
};

export type AIInterviewPrepPayload = {
  jobTitle?: string;
  jobDescription: string;
  profileSummary?: string;
};

export type AIInterviewPrepResult = {
  likelyQuestions: string[];
  topicsToReview: string[];
  personalPitch: string;
  projectsToPrepare: string[];
  questionsToAskInterviewer: string[];
  weakSpotsToPrepare: string[];
};

export async function fetchAICvTailoring(
  payload: AICvTailoringPayload
): Promise<AICvTailoringResult> {
  const res = await apiFetch("/api/ai/cv-tailoring", payload);
  if (!res.ok) throw new Error(await parseErrorBody(res));
  return (await res.json()) as AICvTailoringResult;
}

export async function fetchAIInterviewPrep(
  payload: AIInterviewPrepPayload
): Promise<AIInterviewPrepResult> {
  const res = await apiFetch("/api/ai/interview-prep", payload);
  if (!res.ok) throw new Error(await parseErrorBody(res));
  return (await res.json()) as AIInterviewPrepResult;
}

export type AIAnswerPayload = {
  question: string;
};

export type AIAnswerResult = {
  answer: string;
  keyPoints: string[];
  example: string;
  relatedTopics: string[];
  commonMistakes: string[];
  suggestedCategory: string;
  suggestedDifficulty: "basic" | "intermediate" | "advanced";
  suggestedTopic: string;
};

export async function fetchAIAnswer(
  payload: AIAnswerPayload
): Promise<AIAnswerResult> {
  const res = await apiFetch("/api/ai/answer-question", payload);
  if (!res.ok) throw new Error(await parseErrorBody(res));
  return (await res.json()) as AIAnswerResult;
}

export type AIPersonalQuestion = {
  question: string;
  type: "behavioral" | "motivational" | "situational" | "personal";
  suggestedAnswer: string;
  tips: string[];
  followUpQuestions: string[];
};

export type AIPrepSuggestions = {
  keyRequirements: string;
  skillsToLearn: string;
  phoneScreenNotes: string;
  companyResearch: string;
  suggestedSalary?: string;
};

export type AICvFullAnalysisResult = {
  strengths: string[];
  areasToImprove: string[];
  focusPerJobType: { jobType: string; focus: string }[];
  questions: AIRawQuestion[];
};

export async function fetchAICvFullAnalysis(
  profileSummary: string
): Promise<AICvFullAnalysisResult> {
  const res = await apiFetch("/api/ai/cv-full-analysis", { profileSummary });
  if (!res.ok) throw new Error(await parseErrorBody(res));
  return (await res.json()) as AICvFullAnalysisResult;
}

export type AIJobFullAnalysisPayload = {
  jobTitle?: string;
  jobDescription: string;
  companyInfo?: string;
  profileSummary?: string;
};

export type AICvReview = {
  overallFit: "strong" | "moderate" | "weak";
  strengthsToHighlight: string[];
  suggestedChanges: string[];
  keywordsToAdd: string[];
  projectsToFeature: string[];
};

export type AIJobFullAnalysisResult = {
  professionalQuestions: AIRawQuestion[];
  personalQuestions: AIPersonalQuestion[];
  prepSuggestions: AIPrepSuggestions;
  cvReview?: AICvReview;
};

export async function fetchAIJobFullAnalysis(
  payload: AIJobFullAnalysisPayload
): Promise<AIJobFullAnalysisResult> {
  const res = await apiFetch("/api/ai/job-full-analysis", payload);
  if (!res.ok) throw new Error(await parseErrorBody(res));
  return (await res.json()) as AIJobFullAnalysisResult;
}

export type AICvParseResult = {
  targetRoles: string;
  targetCategories: string;
  skills: string;
  technologies: string;
  tools: string;
  projectsSummary: string;
  experienceSummary: string;
  educationSummary: string;
  strengths: string;
};

export async function fetchAICvParse(cvText: string): Promise<AICvParseResult> {
  const res = await apiFetch("/api/ai/parse-cv", { cvText });
  if (!res.ok) throw new Error(await parseErrorBody(res));
  return (await res.json()) as AICvParseResult;
}

export type AIProjectRepo = {
  name: string;
  description: string | null;
  language: string | null;
};

export type AIProjectAnalysis = {
  name: string;
  simpleExplanation: string;
  interviewTip: string;
};

export type AIProjectAnalysisResult = {
  projects: AIProjectAnalysis[];
  questions: AIRawQuestion[];
};

export async function fetchAIProjectAnalysis(
  repos: AIProjectRepo[]
): Promise<AIProjectAnalysisResult> {
  const res = await apiFetch("/api/ai/analyze-projects", { repos });
  if (!res.ok) throw new Error(await parseErrorBody(res));
  const data = (await res.json()) as AIProjectAnalysisResult;
  return { projects: data.projects ?? [], questions: data.questions ?? [] };
}

export async function fetchAIPersonalInterviewPrep(
  profileSummary: string
): Promise<AIPersonalQuestion[]> {
  const res = await apiFetch("/api/ai/personal-interview-prep", { profileSummary });
  if (!res.ok) throw new Error(await parseErrorBody(res));
  const data = (await res.json()) as { questions?: AIPersonalQuestion[] };
  return data.questions ?? [];
}

export type AISingleProjectResult = {
  analysis: string;
  architecture: string;
  whatWasBuilt: string;
  technologiesExplained: string;
  questions: AIRawQuestion[];
};

export async function fetchAISingleProjectAnalysis(project: {
  name: string;
  description: string;
  language: string;
}): Promise<AISingleProjectResult> {
  const res = await apiFetch("/api/ai/analyze-single-project", project);
  if (!res.ok) throw new Error(await parseErrorBody(res));
  return (await res.json()) as AISingleProjectResult;
}

export type AIProjectQAPayload = {
  projectName: string;
  description: string;
  language: string;
  analysis: string;
  architecture: string;
  whatWasBuilt: string;
  technologiesExplained: string;
  question: string;
};

export async function fetchAIProjectQuestion(
  payload: AIProjectQAPayload
): Promise<string> {
  const res = await apiFetch("/api/ai/project-question", payload);
  if (!res.ok) throw new Error(await parseErrorBody(res));
  const data = (await res.json()) as { answer: string };
  return data.answer ?? "";
}

export type AIPersonalAnswerResult = {
  type: AIPersonalQuestion["type"];
  suggestedAnswer: string;
  tips: string[];
  followUpQuestions: string[];
};

export async function fetchAIPersonalAnswer(
  question: string,
  profileSummary: string
): Promise<AIPersonalAnswerResult> {
  const res = await apiFetch("/api/ai/personal-answer", { question, profileSummary });
  if (!res.ok) throw new Error(await parseErrorBody(res));
  return (await res.json()) as AIPersonalAnswerResult;
}

export async function fetchAISalaryEstimate(
  roleTitle: string,
  category?: string,
  location?: string
): Promise<string> {
  try {
    const res = await apiFetch("/api/ai/salary-estimate", { roleTitle, category, location });
    if (!res.ok) return "";
    const data = (await res.json()) as { estimate?: string };
    return data.estimate ?? "";
  } catch {
    return "";
  }
}

export async function fetchAICompanyInfo(companyName: string): Promise<string> {
  try {
    const res = await apiFetch("/api/ai/company-info", { companyName });
    if (!res.ok) return "";
    const data = (await res.json()) as { summary?: string };
    return data.summary ?? "";
  } catch {
    return "";
  }
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${SERVER_URL}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
