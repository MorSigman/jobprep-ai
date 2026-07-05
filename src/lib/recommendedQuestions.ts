import type { JobApplication } from "../types/job";
import type { ProfessionalQuestion, QuestionCategory } from "../types/professionalQuestion";

type CategoryRule = {
  keywords: string[];
  categories: QuestionCategory[];
};

const RULES: CategoryRule[] = [
  {
    keywords: ["data analyst", "data", "analyst", "dashboard", "sql", "bi", "excel", "power bi", "tableau", "superset"],
    categories: ["Data Analyst", "SQL", "Projects", "Technical Thinking"],
  },
  {
    keywords: ["qa", "testing", "tester", "automation", "manual", "bugs", "test cases"],
    categories: ["QA", "Technical Thinking", "Projects", "Git"],
  },
  {
    keywords: ["frontend", "react", "javascript", "ui", "html", "css", "client"],
    categories: ["Frontend", "JavaScript", "Projects", "Git", "Technical Thinking"],
  },
  {
    keywords: ["backend", "server", "api", "database", "node", "rest"],
    categories: ["Backend", "SQL", "Git", "Projects", "Technical Thinking"],
  },
  {
    keywords: ["cyber", "security", "soc", "logs", "phishing", "vulnerability", "incident"],
    categories: ["Cyber", "Technical Thinking", "Projects"],
  },
  {
    keywords: ["protocol", "http", "https", "network", "dns", "tcp", "udp", "תקשורת", "רשתות"],
    categories: ["Protocols", "Backend", "Technical Thinking"],
  },
  {
    keywords: ["architecture", "system design", "scalable", "microservices", "distributed", "ארכיטקטורה"],
    categories: ["Architecture", "Backend", "Technical Thinking", "Projects"],
  },
  {
    keywords: ["machine learning", "ml", "model", "prediction", "data science", "למידת מכונה"],
    categories: ["Machine Learning", "Data Analyst", "AI", "Projects"],
  },
  {
    keywords: ["deep learning", "neural network", "computer vision", "nlp", "transformer", "למידה עמוקה"],
    categories: ["Deep Learning", "Machine Learning", "AI", "Projects"],
  },
  {
    keywords: ["ai", "generative ai", "llm", "prompt", "rag", "chatbot", "בינה מלאכותית"],
    categories: ["AI", "Machine Learning", "Projects", "Technical Thinking"],
  },
];

const ALWAYS_INCLUDE: QuestionCategory[] = ["Projects", "Technical Thinking"];
const FALLBACK: QuestionCategory[] = ["General", "Projects", "Technical Thinking"];

function buildTextCorpus(job: JobApplication): string {
  return [
    job.category ?? "",
    job.roleTitle,
    job.jobDescription,
    job.notes ?? "",
    job.keyRequirements ?? "",
    job.skillsToLearn ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function getRecommendedQuestionsForJob(
  job: JobApplication,
  questions: ProfessionalQuestion[]
): ProfessionalQuestion[] {
  const text = buildTextCorpus(job);
  const matched = new Set<QuestionCategory>();

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      rule.categories.forEach((c) => matched.add(c));
    }
  }

  ALWAYS_INCLUDE.forEach((c) => matched.add(c));

  const targetCategories =
    matched.size > ALWAYS_INCLUDE.length
      ? matched
      : new Set<QuestionCategory>(FALLBACK);

  const pool = questions.filter((q) => targetCategories.has(q.category));
  const basic = pool.filter((q) => q.difficulty === "basic");
  const intermediate = pool.filter((q) => q.difficulty === "intermediate");

  return [...basic, ...intermediate].slice(0, 12);
}
