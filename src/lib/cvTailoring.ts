import type { JobApplication } from "../types/job";
import type { UserProfile } from "../types/profile";

export type CvTailoringSuggestions = {
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendedToHighlight: string[];
  addOnlyIfTrue: string[];
  suggestedSimplePhrases: string[];
  recommendedToReduceOrRemove: string[];
  warnings: string[];
};

// Known skill/tech keywords common in Israeli hi-tech job descriptions.
// Simple substring matching works well for English tech terms embedded in Hebrew text.
const SKILL_KEYWORDS: string[] = [
  // Languages
  "python", "javascript", "typescript", "java", "c#", "c++", "go", "r",
  // Testing / QA
  "selenium", "cypress", "playwright", "testng", "junit", "pytest",
  "postman", "jmeter", "newman",
  "automation", "qa", "quality assurance",
  "regression", "test plan", "test case", "bug tracking", "manual testing",
  // Data
  "sql", "mysql", "postgresql", "mongodb",
  "excel", "tableau", "power bi",
  "pandas", "numpy", "matplotlib",
  "bigquery", "snowflake", "spark", "looker",
  "data analysis", "ניתוח נתונים", "etl",
  // Frontend
  "react", "vue", "angular", "html", "css", "sass", "figma",
  // Backend
  "node.js", "django", "flask", "spring",
  "rest api", "graphql",
  // DevOps / Tools
  "docker", "kubernetes", "jenkins", "ci/cd", "linux",
  "git", "github", "gitlab",
  "jira", "confluence",
  // Process
  "agile", "scrum", "kanban",
  // Concepts
  "oop", "microservices",
  // Soft
  "אנגלית", "עבודת צוות", "תקשורת",
];

// Phrase templates: all listed keywords must appear in the match set for the phrase to apply.
// Multi-keyword templates come first so they have priority over single-keyword ones.
type PhraseTemplate = { keywords: string[]; phrase: string };

const PHRASE_TEMPLATES: PhraseTemplate[] = [
  { keywords: ["selenium", "python"], phrase: "כתיבת בדיקות אוטומטיות עם Selenium ו-Python" },
  { keywords: ["react", "typescript"], phrase: "פיתוח ממשק משתמש עם React ו-TypeScript" },
  { keywords: ["react", "javascript"], phrase: "פיתוח קומפוננטות React עם JavaScript" },
  { keywords: ["pandas", "python"], phrase: "עיבוד ונקיון נתונים עם Pandas ו-Python" },
  { keywords: ["tableau", "sql"], phrase: "שאילתות SQL ובניית לוחות מחוונים ב-Tableau" },
  { keywords: ["power bi", "sql"], phrase: "שאילתות SQL ודוחות ב-Power BI" },
  { keywords: ["agile", "scrum"], phrase: "עבודה בסביבת Agile ו-Scrum" },
  { keywords: ["jenkins", "git"], phrase: "ניהול גרסאות ו-CI/CD עם Git ו-Jenkins" },
  { keywords: ["jira", "confluence"], phrase: "ניהול משימות ותיעוד עם Jira ו-Confluence" },
  { keywords: ["docker", "git"], phrase: "עבודה עם Docker ו-Git בסביבת פיתוח" },
  // Single keyword
  { keywords: ["selenium"], phrase: "פיתוח בדיקות אוטומטיות עם Selenium" },
  { keywords: ["cypress"], phrase: "כתיבת בדיקות E2E עם Cypress" },
  { keywords: ["playwright"], phrase: "אוטומציה של בדיקות עם Playwright" },
  { keywords: ["postman"], phrase: "בדיקות API עם Postman" },
  { keywords: ["sql"], phrase: "ניתוח ושליפת נתונים בעזרת SQL" },
  { keywords: ["python"], phrase: "כתיבת סקריפטים ואוטומציה ב-Python" },
  { keywords: ["react"], phrase: "פיתוח קומפוננטות ב-React" },
  { keywords: ["tableau"], phrase: "בניית לוחות מחוונים ב-Tableau" },
  { keywords: ["power bi"], phrase: "הכנת דוחות ב-Power BI" },
  { keywords: ["excel"], phrase: "ניתוח נתונים ב-Excel כולל פורמולות מורכבות ו-Pivot" },
  { keywords: ["git"], phrase: "ניהול גרסאות עם Git ועבודה שיתופית" },
  { keywords: ["jira"], phrase: "מעקב באגים וניהול משימות ב-Jira" },
  { keywords: ["agile"], phrase: "עבודה בסביבה אג'ילית" },
  { keywords: ["docker"], phrase: "עבודה עם Docker לבניית סביבות מבודדות" },
  { keywords: ["figma"], phrase: "עיצוב ממשקים ו-Wireframing עם Figma" },
  { keywords: ["linux"], phrase: "עבודה בסביבת Linux" },
  { keywords: ["typescript"], phrase: "פיתוח עם TypeScript לקוד מסוג ובטוח" },
  { keywords: ["java"], phrase: "פיתוח ב-Java" },
  { keywords: ["node.js"], phrase: "פיתוח שרת עם Node.js" },
  { keywords: ["pandas"], phrase: "עיבוד נתונים עם Pandas" },
  { keywords: ["junit"], phrase: "כתיבת בדיקות יחידה עם JUnit" },
  { keywords: ["pytest"], phrase: "כתיבת בדיקות עם Pytest ב-Python" },
];

export function isProfileEmpty(profile: UserProfile): boolean {
  return [
    profile.skills,
    profile.technologies,
    profile.tools,
    profile.projectsSummary,
    profile.experienceSummary,
    profile.educationSummary,
  ].every((f) => !f.trim());
}

function buildProfileText(profile: UserProfile): string {
  return [
    profile.targetRoles,
    profile.targetCategories,
    profile.skills,
    profile.technologies,
    profile.tools,
    profile.projectsSummary,
    profile.experienceSummary,
    profile.educationSummary,
    profile.strengths,
    profile.notes,
  ].join(" ");
}

function buildJobText(job: JobApplication): string {
  return [
    job.roleTitle,
    job.jobDescription,
    job.category ?? "",
    job.notes ?? "",
  ].join(" ");
}

function findKeywords(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw.toLowerCase()));
}

function buildPhrases(matchSet: Set<string>): string[] {
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const { keywords, phrase } of PHRASE_TEMPLATES) {
    if (phrases.length >= 5) break;
    if (keywords.every((kw) => matchSet.has(kw.toLowerCase())) && !seen.has(phrase)) {
      phrases.push(phrase);
      seen.add(phrase);
    }
  }
  return phrases;
}

export function generateCvTailoringSuggestions(
  job: JobApplication,
  profile: UserProfile
): CvTailoringSuggestions {
  const jobKws = findKeywords(buildJobText(job), SKILL_KEYWORDS);
  const profileKws = findKeywords(buildProfileText(profile), SKILL_KEYWORDS);

  const profileSet = new Set(profileKws.map((k) => k.toLowerCase()));
  const jobSet = new Set(jobKws.map((k) => k.toLowerCase()));

  const matchingKeywords = jobKws.filter((kw) => profileSet.has(kw.toLowerCase()));
  const missingKeywords = jobKws
    .filter((kw) => !profileSet.has(kw.toLowerCase()))
    .slice(0, 10);

  const matchSet = new Set(matchingKeywords.map((k) => k.toLowerCase()));

  const recommendedToHighlight = matchingKeywords.slice(0, 6).map(
    (kw) => `הדגישי ניסיון עם ${kw} — הוסיפי דוגמה ספציפית או שם פרויקט`
  );

  const addOnlyIfTrue = missingKeywords.map(
    (kw) => `${kw} — מופיע בדרישות, לא נמצא בפרופיל. הוסיפי רק אם יש לך ניסיון ממשי.`
  );

  const suggestedSimplePhrases = buildPhrases(matchSet);

  const onlyInProfile = profileKws.filter((kw) => !jobSet.has(kw.toLowerCase()));
  const recommendedToReduceOrRemove =
    onlyInProfile.length > 0
      ? [
          `הכישורים הבאים אינם מוזכרים בדרישות המשרה: ${onlyInProfile.join(", ")}. ` +
            "בגרסה ייעודית של קורות החיים לתפקיד זה, ניתן להעביר אותם לחלק פחות מרכזי.",
        ]
      : [];

  const warnings: string[] = [
    "אל תוסיפי כישורים שאין לך בפועל — אפילו אם הם מוזכרים בדרישות המשרה.",
    "הניסוחים המוצעים נועדו לסייע בניסוח — יש להשתמש בהם רק אם הם נכונים עבורך.",
    "הבדיקה מבוססת על מידע שהוזן ידנית בפרופיל — לא על ניתוח AI או מקורות חיצוניים.",
  ];

  if (missingKeywords.length >= 5) {
    warnings.push(
      `זוהו ${missingKeywords.length} מילות מפתח מהמשרה שאינן בפרופיל. ` +
        "בדקי האם הפרופיל מפורט ומעודכן, או האם המשרה מתאימה לרמת הניסיון הנוכחית שלך."
    );
  }

  return {
    matchingKeywords,
    missingKeywords,
    recommendedToHighlight,
    addOnlyIfTrue,
    suggestedSimplePhrases,
    recommendedToReduceOrRemove,
    warnings,
  };
}
