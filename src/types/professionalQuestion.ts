export type QuestionCategory =
  | "General"
  | "Data Analyst"
  | "SQL"
  | "QA"
  | "Frontend"
  | "JavaScript"
  | "Backend"
  | "Cyber"
  | "Git"
  | "Projects"
  | "Technical Thinking"
  | "Protocols"
  | "Architecture"
  | "Machine Learning"
  | "Deep Learning"
  | "AI";

export type QuestionDifficulty = "basic" | "intermediate" | "advanced";
export type QuestionSource = "demo" | "user" | "job-description";

export type ProfessionalQuestion = {
  id: string;
  category: QuestionCategory;
  topic: string;
  difficulty: QuestionDifficulty;
  question: string;
  shortAnswer: string;
  simpleExplanation: string;
  example: string;
  whatToMention: string[];
  commonMistakes: string[];
  tags: string[];
  source: QuestionSource;
  createdAt: string;
  updatedAt: string;
};
