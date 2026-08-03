import type {
  QuestionCategory,
  QuestionDifficulty,
  QuestionSource,
} from "../types/professionalQuestion";

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  General: "כללי טכני",
  "Data Analyst": "דאטה אנליסט",
  SQL: "SQL",
  QA: "QA / בדיקות תוכנה",
  Frontend: "פיתוח צד לקוח",
  JavaScript: "JavaScript",
  Backend: "צד שרת",
  Cyber: "סייבר",
  Git: "Git / GitHub",
  Projects: "פרויקטים",
  "Technical Thinking": "חשיבה טכנית",
  Protocols: "פרוטוקולים ותקשורת",
  Architecture: "ארכיטקטורה",
  Cpp: "C / C++",
  Embedded: "Embedded / RTOS / Real Time",
  "Machine Learning": "למידת מכונה",
  "Deep Learning": "למידה עמוקה",
  AI: "בינה מלאכותית",
  Personal: "שאלות אישיות / התנהגותיות",
};

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  basic: "בסיסי",
  intermediate: "בינוני",
  advanced: "מתקדם",
};

export const SOURCE_LABELS: Record<QuestionSource, string> = {
  demo: "דמו",
  user: "נוסף ידנית",
  "job-description": "נוצר מתיאור משרה",
  ai: "נוצר בעזרת AI",
};
