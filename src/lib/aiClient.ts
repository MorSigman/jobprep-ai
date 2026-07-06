const SERVER_URL = "http://localhost:8787";

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
  const res = await fetch(`${SERVER_URL}/api/ai/job-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errMsg = "שגיאת שרת";
    try {
      const body = (await res.json()) as { error?: string };
      errMsg = body.error ?? errMsg;
    } catch {
      /* ignore */
    }
    throw new Error(errMsg);
  }

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
  const res = await fetch(`${SERVER_URL}/api/ai/cv-tailoring`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errMsg = "שגיאת שרת";
    try {
      const body = (await res.json()) as { error?: string };
      errMsg = body.error ?? errMsg;
    } catch {
      /* ignore */
    }
    throw new Error(errMsg);
  }

  return (await res.json()) as AICvTailoringResult;
}

export async function fetchAIInterviewPrep(
  payload: AIInterviewPrepPayload
): Promise<AIInterviewPrepResult> {
  const res = await fetch(`${SERVER_URL}/api/ai/interview-prep`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errMsg = "שגיאת שרת";
    try {
      const body = (await res.json()) as { error?: string };
      errMsg = body.error ?? errMsg;
    } catch {
      /* ignore */
    }
    throw new Error(errMsg);
  }

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
  const res = await fetch(`${SERVER_URL}/api/ai/answer-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errMsg = "שגיאת שרת";
    try {
      const body = (await res.json()) as { error?: string };
      errMsg = body.error ?? errMsg;
    } catch {
      /* ignore */
    }
    throw new Error(errMsg);
  }

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
};

export type AIJobFullAnalysisPayload = {
  jobTitle?: string;
  jobDescription: string;
  companyInfo?: string;
  profileSummary?: string;
};

export type AIJobFullAnalysisResult = {
  professionalQuestions: AIRawQuestion[];
  personalQuestions: AIPersonalQuestion[];
  prepSuggestions: AIPrepSuggestions;
};

export async function fetchAIJobFullAnalysis(
  payload: AIJobFullAnalysisPayload
): Promise<AIJobFullAnalysisResult> {
  const res = await fetch(`${SERVER_URL}/api/ai/job-full-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errMsg = "שגיאת שרת";
    try {
      const body = (await res.json()) as { error?: string };
      errMsg = body.error ?? errMsg;
    } catch {
      /* ignore */
    }
    throw new Error(errMsg);
  }

  return (await res.json()) as AIJobFullAnalysisResult;
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
