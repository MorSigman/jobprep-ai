import type { QuestionCategory, ProfessionalQuestion } from "../types/professionalQuestion";

// ─── Keyword rules ────────────────────────────────────────────────────────────

type CategoryRule = {
  keywords: string[];
  category: QuestionCategory;
};

const CATEGORY_RULES: CategoryRule[] = [
  {
    keywords: ["data analyst", "data analysis", "analyst", "דאטה", "dashboard", "sql", "bi", "excel", "power bi", "tableau", "superset", "נתונים", "ניתוח נתונים"],
    category: "Data Analyst",
  },
  {
    keywords: ["sql", "query", "database", "mysql", "postgresql", "sqlite", "joins", "בסיס נתונים"],
    category: "SQL",
  },
  {
    keywords: ["qa", "quality assurance", "testing", "tester", "automation", "manual", "bug", "test case", "selenium", "bddיqa", "playwright", "בדיקות"],
    category: "QA",
  },
  {
    keywords: ["frontend", "react", "vue", "angular", "html", "css", "ui", "ux", "client side", "javascript", "typescript", "פיתוח ממשק", "צד לקוח"],
    category: "Frontend",
  },
  {
    keywords: ["javascript", "js", "typescript", "ts", "node", "async", "promises", "es6", "dom"],
    category: "JavaScript",
  },
  {
    keywords: ["backend", "server", "api", "rest", "graphql", "node.js", "python", "java", "go", "microservices", "שרת", "צד שרת"],
    category: "Backend",
  },
  {
    keywords: ["cyber", "security", "soc", "logs", "phishing", "vulnerability", "incident", "firewall", "siem", "penetration", "אבטחה", "סייבר"],
    category: "Cyber",
  },
  {
    keywords: ["git", "github", "gitlab", "version control", "branch", "pull request", "merge", "commit", "גיט"],
    category: "Git",
  },
  {
    keywords: ["protocol", "http", "https", "tcp", "udp", "dns", "network", "websocket", "ssl", "tls", "פרוטוקול", "רשתות", "תקשורת"],
    category: "Protocols",
  },
  {
    keywords: ["architecture", "system design", "scalable", "microservices", "distributed", "monolith", "load balancer", "cache", "ארכיטקטורה", "תכנון מערכת"],
    category: "Architecture",
  },
  {
    keywords: ["machine learning", "ml", "model", "prediction", "scikit", "feature engineering", "data science", "regression", "classification", "למידת מכונה"],
    category: "Machine Learning",
  },
  {
    keywords: ["deep learning", "neural network", "cnn", "rnn", "transformer", "pytorch", "tensorflow", "computer vision", "nlp", "למידה עמוקה", "רשת עצבית"],
    category: "Deep Learning",
  },
  {
    keywords: ["ai", "artificial intelligence", "generative ai", "llm", "gpt", "prompt", "rag", "chatbot", "openai", "claude", "gemini", "בינה מלאכותית", "genai"],
    category: "AI",
  },
  {
    keywords: ["project", "github project", "portfolio", "side project", "פרויקט", "פורטפוליו"],
    category: "Projects",
  },
];

// ─── Template questions per category ─────────────────────────────────────────

type QuestionTemplate = Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">;

const TEMPLATES: Record<QuestionCategory, QuestionTemplate[]> = {
  "Data Analyst": [
    {
      category: "Data Analyst",
      topic: "תקשורת תובנות",
      difficulty: "basic",
      question: "איך היית מסבירה תובנה מתוך נתונים למנהל שלא טכני?",
      shortAnswer: "הייתי מתחילה מהמסקנה ולא מהמתודה — מה זה אומר לעסק, לא איך חישבתי.",
      simpleExplanation: "מנהלים רוצים לדעת: מה לעשות עם המידע הזה?\nמשפט פתיחה: 'גילינו שלקוחות שרכשו X חוזרים פי 2 — אפשר לנצל זאת.'\nאחר כך אפשר להציג גרף פשוט.\nמנהלים לא רוצים לשמוע על p-values ו-quartiles — הם רוצים פעולות.",
      example: "במקום 'ה-churn rate עלה ב-12% מ-Q1 ל-Q2' — 'כל חודש אנחנו מאבדים 1,200 לקוחות יותר מהרגיל — כדאי לבדוק למה.'",
      whatToMention: ["לדבר על השפעה עסקית", "להשתמש בגרפים פשוטים", "לתרגם מספרים לפעולות"],
      commonMistakes: ["להתחיל מהמתודה", "להשתמש בז'רגון טכני עם מנהלים"],
      tags: ["data analyst", "תקשורת", "תובנות"],
    },
    {
      category: "Data Analyst",
      topic: "איכות נתונים",
      difficulty: "basic",
      question: "איך היית בודקת איכות נתונים לפני ניתוח?",
      shortAnswer: "הייתי בודקת ערכי NULL, כפילויות, טווחי ערכים חריגים, ועקביות פורמטים.",
      simpleExplanation: "שלב 1: COUNT(*) vs COUNT(column) — כמה NULL יש?\nשלב 2: GROUP BY לאיתור כפילויות.\nשלב 3: MIN/MAX לזיהוי outliers.\nשלב 4: בדיקת פורמטים (תאריכים, מספרי טלפון).\nנתונים גרועים = מסקנות גרועות — better to find it early.",
      example: "לפני ניתוח מכירות: בדיקה שאין order_id כפול, שכל המחירים חיוביים, ושהתאריכים הגיוניים.",
      whatToMention: ["NULL checks", "כפילויות", "outliers", "עקביות פורמטים"],
      commonMistakes: ["לדלג על בדיקת איכות ולגלות בסוף", "לא לתעד בעיות שנמצאו"],
      tags: ["data quality", "sql", "data analyst"],
    },
  ],
  SQL: [
    {
      category: "SQL",
      topic: "שאילתת ניתוח",
      difficulty: "intermediate",
      question: "איזו שאילתת SQL היית בונה כדי לנתח את נתוני המשרה הזו?",
      shortAnswer: "הייתי מתחילה מ-SELECT עם GROUP BY ו-COUNT כדי לראות תמונה כללית, ואז מוסיפה WHERE לסינון ו-ORDER BY לתעדוף.",
      simpleExplanation: "שאילתה טובה מתחילה בשאלה ברורה: מה אני רוצה לדעת?\nSELECT — מה להחזיר.\nFROM/JOIN — מאיפה לשלוף.\nWHERE — לסנן.\nGROUP BY + COUNT/SUM — לצבור.\nORDER BY — לסדר.",
      example: "SELECT category, COUNT(*) as total, AVG(price) as avg_price FROM orders WHERE created_at > '2024-01-01' GROUP BY category ORDER BY total DESC;",
      whatToMention: ["להתחיל מהשאלה העסקית", "לבנות בשלבים", "לאמת תוצאות"],
      commonMistakes: ["לכתוב שאילתה מורכבת מהר מדי", "לא לבדוק את התוצאה הגיונית"],
      tags: ["sql", "analysis", "query"],
    },
  ],
  QA: [
    {
      category: "QA",
      topic: "בדיקת פיצ׳ר",
      difficulty: "basic",
      question: "איך היית בודקת פיצ׳ר חדש שמתואר בתיאור המשרה?",
      shortAnswer: "הייתי כותבת test cases לפני הפיתוח, כולל happy path, מקרי קצה, ובדיקות שלילות.",
      simpleExplanation: "קודם: להבין את הדרישות — מה אמור לקרות?\nHappy path: הפיצ׳ר עובד כרגיל עם קלט תקין.\nNegative tests: קלט שגוי, שדות ריקים, לחיצה כפולה.\nEdge cases: ערכי קצה, מכשירים שונים.\nאחרי: regression שהפיצ׳ר לא שבר כלום אחר.",
      example: "פיצ׳ר: העלאת תמונה. Tests: תמונה תקינה, גדולה מדי, פורמט שגוי, ללא תמונה, שני לחיצות מהירות.",
      whatToMention: ["test cases לפני פיתוח", "happy path + negative tests", "regression testing"],
      commonMistakes: ["לבדוק רק את ה-happy path", "לדלג על regression"],
      tags: ["qa", "test-cases", "feature-testing"],
    },
    {
      category: "QA",
      topic: "מקרי קצה",
      difficulty: "basic",
      question: "אילו מקרי קצה היית מחפשת בבדיקות?",
      shortAnswer: "שדות ריקים, ערכים ארוכים מאוד, תווים מיוחדים, מספרים שליליים, ותאריכים לא תקינים.",
      simpleExplanation: "Edge cases הם המצבים שהמפתח לא חשב עליהם.\nרשימה: שדה ריק, ערך ארוך במיוחד, תו ' \" / \\ בשם, 0 ו-1 ומינוס 1, תאריך עבר/עתיד רחוק.\nהם מוצאים bugs שה-happy path לא מגלה.\nתמיד לשאול: 'מה יקרה אם...?'",
      example: "טופס שם: '' (ריק), 'א' (תו אחד), שם של 500 תווים, 'Robert'); DROP TABLE users;--'",
      whatToMention: ["קלט ריק", "ערכים קיצוניים", "תווים מיוחדים", "גבולות מספריים"],
      commonMistakes: ["לבדוק רק ערכים 'נורמליים'", "לשכוח בדיקות אבטחה בסיסיות"],
      tags: ["edge-cases", "qa", "testing"],
    },
  ],
  Frontend: [
    {
      category: "Frontend",
      topic: "הסבר קומפוננטה",
      difficulty: "basic",
      question: "איך היית מסבירה קומפוננטה שבנית?",
      shortAnswer: "הייתי מתחילה ממה הקומפוננטה עושה למשתמש, אחר כך מה ה-props שלה ואיך להשתמש בה.",
      simpleExplanation: "תבנית: 'הקומפוננטה הזו עושה X. היא מקבלת Y כ-props ומציגה Z.'\nאפשר להראות דוגמת שימוש.\nלהסביר מה state יש ולמה.\nלציין אם יש side effects (useEffect).",
      example: "<JobCard title='Developer' company='Tech Corp' status='applied' onStatusChange={...} /> — כרטיס משרה עם callback לשינוי סטטוס.",
      whatToMention: ["מה הקומפוננטה עושה", "מה ה-props", "מה ה-state", "side effects"],
      commonMistakes: ["להתחיל מהקוד ולא מהתפקוד", "לא להסביר למה בחרת את הפתרון"],
      tags: ["react", "component", "frontend"],
    },
    {
      category: "Frontend",
      topic: "טפסים ושגיאות",
      difficulty: "basic",
      question: "איך היית מטפלת בטופס ובשגיאות משתמש?",
      shortAnswer: "validation בצד הלקוח לפני שליחה, הצגת שגיאות ברורות ליד השדות הרלוונטיים, ו-feedback ברמת הטופס.",
      simpleExplanation: "Validation: לבדוק לפני שליחה — שדה ריק? אימייל לא תקין?\nשגיאות: להציג ליד השדה הספציפי, לא כ-alert.\nDisable שכפתור ה-submit: רק כשהטופס תקין.\nloading state: להראות spinner בזמן שהשרת מגיב.\nSuccess state: לאשר שהפעולה הצליחה.",
      example: "שדה אימייל: border אדום + 'כתובת אימייל לא תקינה' מתחת, submit button מאופשר רק כשהכל תקין.",
      whatToMention: ["validation לפני שליחה", "שגיאות ליד השדה", "loading + success states"],
      commonMistakes: ["לאמת רק בצד השרת", "שגיאות כלליות מדי ('קרתה שגיאה')"],
      tags: ["form", "validation", "ux", "frontend"],
    },
  ],
  JavaScript: [
    {
      category: "JavaScript",
      topic: "async/await",
      difficulty: "intermediate",
      question: "איך היית מטפלת בקריאת API אסינכרונית?",
      shortAnswer: "async/await עם try/catch לטיפול בשגיאות. הוספת loading state לחווית משתמש טובה.",
      simpleExplanation: "async function מאפשרת לחכות לתוצאה עם await.\ntry: לנסות את הקריאה.\ncatch: לתפוס שגיאות (רשת, שרת).\nfinally: לעצור loading state.\nתמיד לטפל בשגיאות — קריאות API יכולות להיכשל.",
      example: "async function fetchUser(id) { try { const res = await fetch('/api/users/' + id); return await res.json(); } catch (e) { console.error(e); } }",
      whatToMention: ["async/await", "try/catch", "loading state", "טיפול בשגיאות"],
      commonMistakes: ["לשכוח try/catch", "לא להציג loading state"],
      tags: ["async", "fetch", "javascript"],
    },
  ],
  Backend: [
    {
      category: "Backend",
      topic: "תכנון API",
      difficulty: "intermediate",
      question: "איך היית מתכננת API לפיצ׳ר שמתואר במשרה?",
      shortAnswer: "הייתי מתחילה מהגדרת endpoints לפי פעולות (GET/POST/PUT/DELETE), עם request/response מוגדרים, קודי שגיאה ברורים ואימות.",
      simpleExplanation: "קודם: מה הפעולות שה-API צריך לתמוך בהן?\nREST: GET לשליפה, POST ליצירה, PUT לעדכון, DELETE למחיקה.\nRequest body: מה שולחים לשרת.\nResponse: מה השרת מחזיר (כולל error codes).\nAuthentication: האם נדרשת הזדהות?",
      example: "POST /api/jobs — יצירת משרה. Request: { title, company, description }. Response: 201 Created + { id, createdAt }.",
      whatToMention: ["REST conventions", "HTTP methods נכונים", "קודי שגיאה (400, 401, 404, 500)", "request/response schema"],
      commonMistakes: ["לשים הכל ב-POST", "להחזיר 200 גם על שגיאות"],
      tags: ["api", "rest", "backend"],
    },
    {
      category: "Backend",
      topic: "validation ושגיאות",
      difficulty: "basic",
      question: "איך היית בודקת שהשרת מחזיר שגיאות בצורה נכונה?",
      shortAnswer: "הייתי שולחת בקשות עם קלט שגוי ומוודאת שהשרת מחזיר קוד שגיאה מתאים והודעה ברורה.",
      simpleExplanation: "קלט חסר: 400 Bad Request.\nלא מורשה: 401 Unauthorized.\nלא נמצא: 404 Not Found.\nשגיאת שרת: 500 Internal Server Error.\nהגוף צריך להיות: { error: 'User not found', code: 'USER_NOT_FOUND' }.",
      example: "POST /api/login עם סיסמה שגויה → 401 Unauthorized { error: 'Invalid credentials' }.",
      whatToMention: ["HTTP status codes נכונים", "הודעת שגיאה ברורה", "לא לחשוף מידע רגיש בשגיאות"],
      commonMistakes: ["להחזיר 200 על כל שגיאה", "לחשוף stack trace בשגיאות ב-production"],
      tags: ["error-handling", "backend", "api"],
    },
  ],
  Cyber: [
    {
      category: "Cyber",
      topic: "לוגים",
      difficulty: "basic",
      question: "איזה לוגים היית בודקת כדי לזהות פעילות חשודה?",
      shortAnswer: "לוגי כניסות כושלות, גישה לנתונים רגישים, שינויים בהרשאות, וניסיונות גישה מכתובת IP חדשה.",
      simpleExplanation: "Authentication logs: ניסיונות כניסה כושלים — כמה? מאיפה?\nAccess logs: מי ניגש לאיזה קובץ/נתון ומתי?\nAdmin logs: שינוי הרשאות, יצירת חשבון חדש.\nNetwork logs: חיבורים לכתובות IP חדשות/חשודות.\nמגמות חשודות: פעילות בשעות לא רגילות, כמות גדולה מהרגיל.",
      example: "5 ניסיונות כניסה כושלים תוך דקה מאותה IP → סימן ל-brute force attack.",
      whatToMention: ["authentication logs", "access logs", "anomaly detection", "baseline behavior"],
      commonMistakes: ["להסתכל רק על לוגי שגיאות", "לא לקבוע baseline של התנהגות רגילה"],
      tags: ["logs", "soc", "cyber", "monitoring"],
    },
    {
      category: "Cyber",
      topic: "תיעדוף התראות",
      difficulty: "basic",
      question: "איך היית מתעדפת התראת אבטחה?",
      shortAnswer: "לפי השפעה פוטנציאלית (מה יכול לקרות), הסתברות (כמה סביר שזה אמיתי), ומהירות תגובה נדרשת.",
      simpleExplanation: "Severity: Critical/High/Medium/Low — עד כמה נזק אפשרי?\nLikelihood: כמה סביר שזה אמיתי ולא false positive?\nAsset value: מה הנכס שנפגע — שרת production או test env?\nUrgency: האם זה קורה עכשיו או היה בעבר?\nCritical first: ransomware > data exfiltration > port scan.",
      example: "כניסה מ-IP חדש לשרת production בשעה 3 בלילה = Critical. פורט scan על test env = Low.",
      whatToMention: ["Severity × Likelihood", "ערך הנכס שנפגע", "האם פעיל עכשיו"],
      commonMistakes: ["לטפל בהתראות לפי סדר הגעה", "לא להתחשב בהקשר"],
      tags: ["incident-response", "triage", "cyber"],
    },
  ],
  Git: [],
  Projects: [
    {
      category: "Projects",
      topic: "הסבר פרויקט",
      difficulty: "basic",
      question: "איך היית מסבירה פרויקט שבנית שרלוונטי למשרה הזו?",
      shortAnswer: "קודם מה הפרויקט עושה ולמי, אחר כך הטכנולוגיות, ולסיום אתגר שפתרת ומה למדת.",
      simpleExplanation: "תבנית: 'בניתי X שפותר בעיה Y. השתמשתי ב-Z. האתגר הגדול היה W.'\nלא להתחיל מהקוד — קודם הבעיה שפתרת.\nלהזכיר אתגר ספציפי — מראה שלמדת ממנו.\nלחבר לדרישות המשרה — 'בדיוק כמו שנדרש כאן...'",
      example: "בניתי אפליקציה לניהול מלאי עם React ו-Node.js. האתגר: sync בין כמה משתמשים בו-זמנית — פתרתי עם WebSockets.",
      whatToMention: ["בעיה שפתרת", "טכנולוגיות", "אתגר ספציפי", "קישור לדרישות המשרה"],
      commonMistakes: ["לומר 'פשוט' על אתגרים", "לא לחבר לדרישות המשרה"],
      tags: ["projects", "interview", "portfolio"],
    },
  ],
  "Technical Thinking": [
    {
      category: "Technical Thinking",
      topic: "פתרון בעיות",
      difficulty: "basic",
      question: "איך היית ניגשת לבעיה טכנית שלא פגשת לפני?",
      shortAnswer: "קודם הייתי מבינה מה הבעיה בדיוק, מחלקת לחלקים קטנים, ומחפשת פתרונות לכל חלק בנפרד.",
      simpleExplanation: "שלב 1: להבין את הבעיה — לא לקפוץ לפתרון.\nשלב 2: לחלק לתת-בעיות.\nשלב 3: לחפש אם מישהו פתר כבר.\nשלב 4: לנסות פתרון פשוט ראשון — לא המושלם.\nשלב 5: לשפר אחרי שעובד.",
      example: "בעיה: אתר איטי. → מחלקים: frontend? שרת? DB? → בודקים כל אחד → מוצאים שאילתת DB איטית → מוסיפים index.",
      whatToMention: ["להבין לפני לפתור", "לחלק לחלקים קטנים", "פתרון פשוט ראשון"],
      commonMistakes: ["לקפוץ לפתרון מורכב מיד", "לא לבדוק הנחות יסוד"],
      tags: ["problem-solving", "technical-thinking"],
    },
  ],
  Protocols: [
    {
      category: "Protocols",
      topic: "HTTP basics",
      difficulty: "basic",
      question: "מה ההבדל בין HTTP ל-HTTPS?",
      shortAnswer: "HTTP לא מוצפן — כל אחד יכול לראות מה עובר. HTTPS מוצפן עם SSL/TLS — בטוח לשליחת סיסמאות ומידע רגיש.",
      simpleExplanation: "HTTP = גלויה — כל מי שמיירט רואה הכל.\nHTTPS = מעטפה סגורה — מוצפן.\nSSL/TLS: פרוטוקול ההצפנה שמאחורי HTTPS.\nמנעול ירוק בדפדפן = HTTPS.\nבכל אתר עם login, תשלום, או נתונים אישיים חייב HTTPS.",
      example: "כניסה לבנק דרך HTTP — מישהו ב-wifi הציבורי יכול לגנוב את הסיסמה. HTTPS מונע זאת.",
      whatToMention: ["HTTP = לא מוצפן", "HTTPS = SSL/TLS encryption", "חיוני לאתרים עם נתונים רגישים"],
      commonMistakes: ["לחשוב שHTTPS = פירוש שהאתר אמין (רק שהתקשורת מוצפנת)"],
      tags: ["http", "https", "ssl", "security", "protocols"],
    },
  ],
  Architecture: [
    {
      category: "Architecture",
      topic: "תיאור מבנה",
      difficulty: "intermediate",
      question: "איך היית מתארת את מבנה מערכת מתיאור המשרה?",
      shortAnswer: "הייתי מחלקת לשכבות: UI, API, Business Logic, Database — ומסבירה מה כל שכבה עושה.",
      simpleExplanation: "Presentation Layer: מה המשתמש רואה.\nAPI Layer: נקודות הכניסה למערכת.\nBusiness Logic: הכללים וה-workflows.\nData Layer: בסיס הנתונים.\nמפה כזו עוזרת לדבר על scalability, security, ו-maintainability.",
      example: "אפליקציית e-commerce: React (UI) → Node API → Order Service + Payment Service → PostgreSQL.",
      whatToMention: ["חלוקה לשכבות", "separation of concerns", "מה אחראי על מה"],
      commonMistakes: ["לשים הכל בשכבה אחת", "לא לחשוב על boundaries בין שכבות"],
      tags: ["architecture", "layers", "system-design"],
    },
    {
      category: "Architecture",
      topic: "trade-offs",
      difficulty: "intermediate",
      question: "איזה trade-off היית שוקלת בתכנון מערכת?",
      shortAnswer: "תמיד יש trade-offs: מהירות vs. עלות, פשטות vs. גמישות, consistency vs. availability.",
      simpleExplanation: "כל החלטה ארכיטקטונית היא trade-off.\nמהירות פיתוח vs. ביצועים ארוכי-טווח.\nRelational DB (עקבי) vs. NoSQL (מהיר ומדרגי).\nMonolith (פשוט) vs. Microservices (מדרגי אבל מורכב).\nלהכיר את ה-trade-off עדיף על 'אין תשובה נכונה'.",
      example: "SQL vs NoSQL: SQL — עקבי ומסודר, טוב לעסק. NoSQL — מהיר ומדרגי, טוב לעומסים גבוהים. תלוי בצורך.",
      whatToMention: ["כל פתרון טוב ל-use case מסוים", "לשאול 'מה הדרישות?'", "לציין את ה-trade-offs"],
      commonMistakes: ["לומר 'X תמיד עדיף על Y'", "לא לשאול על scale, SLA, team size"],
      tags: ["trade-offs", "architecture", "decision-making"],
    },
  ],
  "Machine Learning": [
    {
      category: "Machine Learning",
      topic: "הסבר מודל",
      difficulty: "basic",
      question: "איך היית מסבירה מה המודל מנסה לחזות?",
      shortAnswer: "הייתי מתחילה מהבעיה העסקית — 'המודל מנסה לחזות אם לקוח יעזוב', ואז מסבירה על מה הוא מתבסס.",
      simpleExplanation: "קודם: מה הבעיה? (churn? fraud? המלצות?)\nאחר כך: מה ה-input? (נתוני לקוח, היסטוריית רכישות)\nאחר כך: מה ה-output? (הסתברות, קטגוריה, ציון)\nדוגמה: 'המודל מקבל נתוני שימוש של לקוח ומחזיר ציון 0–1 של הסתברות שיעזוב.'",
      example: "מודל churn: Input — חודשי שימוש, מספר התחברויות, סכום הוצאות. Output — הסתברות לעזוב.",
      whatToMention: ["הבעיה העסקית", "input features", "output ומה הוא מייצג"],
      commonMistakes: ["להתחיל מהאלגוריתם", "לא להסביר מה ה-output אומר בפועל"],
      tags: ["ml", "model", "explanation"],
    },
    {
      category: "Machine Learning",
      topic: "הערכת מודל",
      difficulty: "basic",
      question: "איך היית בודקת אם המודל עובד טוב?",
      shortAnswer: "בבדיקת מדדים כמו accuracy, precision, recall — לפי מה שחשוב לבעיה. ואז בוחנים על נתונים שהמודל לא ראה.",
      simpleExplanation: "Accuracy: כמה % צדקנו.\nPrecision: מכל ה'חיוביים' שניבאנו — כמה נכונים.\nRecall: מכל ה'חיוביים' האמיתיים — כמה מצאנו.\nחשוב לבחור מדד נכון: ב-fraud detection recall חשוב יותר.\nתמיד לבחון על test set שהמודל לא ראה.",
      example: "מודל fraud: recall גבוה חשוב יותר מ-precision (עדיף false alarm מלפספס fraud אמיתי).",
      whatToMention: ["מדדי הערכה מתאימים לבעיה", "test set", "overfitting"],
      commonMistakes: ["לסמוך רק על accuracy", "לבדוק על training set"],
      tags: ["ml", "evaluation", "metrics"],
    },
  ],
  "Deep Learning": [
    {
      category: "Deep Learning",
      topic: "מה זה רשת עצבית",
      difficulty: "basic",
      question: "איך היית מסבירה מה זה רשת עצבית?",
      shortAnswer: "רשת עצבית היא מודל שלומד מדוגמאות על ידי כיוונון אלפי פרמטרים. מתאים לתמונות, שפה, ופטרנים מורכבים.",
      simpleExplanation: "כמו מוח ביולוגי — שכבות של 'נוירונים' שעוברים ביניהם מידע.\nכל שכבה לומדת pattern מסוים: קצוות, צורות, פנים.\nTraining: מראים לה הרבה דוגמאות ומתקנים שגיאות.\nמתאים למשימות שקשה לכתוב להן כללים ידניים (זיהוי תמונה, NLP).",
      example: "רשת לזיהוי חתולים: שכבה 1 מזהה קצוות, שכבה 2 צורות, שכבה 3 אוזניים, שכבה 4 חתול.",
      whatToMention: ["לומדת מדוגמאות", "שכבות", "training", "מתאים ל-vision ו-NLP"],
      commonMistakes: ["לחשוב שצריך להסביר backpropagation בפגישה ראשונה", "לא להסביר למה עדיף על ML קלאסי"],
      tags: ["deep-learning", "neural-network", "basics"],
    },
  ],
  AI: [
    {
      category: "AI",
      topic: "שימוש ב-AI בארגון",
      difficulty: "basic",
      question: "איך היית מסבירה שימוש נכון ב-AI בארגון?",
      shortAnswer: "AI הוא כלי — לא קסם. כדאי להשתמש בו לאוטומציה של משימות חוזרות, ניתוח נתונים, וסיוע — לא להחלפת שיקול דעת.",
      simpleExplanation: "AI טוב ב: סיווג, סיכום, המלצות, ניתוח נתונים, גנרציה של טקסט.\nAI לא טוב ב: שיקול דעת אתי, החלטות עם אחריות גבוהה, עובדות עדכניות.\nחשוב: לאמת תוצאות AI — הוא יכול לטעות.\nהתפקיד שלנו: לפקח, לאמת, ולהחליט בסופו של דבר.",
      example: "שימוש בAI לסיכום emails — מחסך זמן. אבל ההחלטה אם לחתום על חוזה — אנחנו.",
      whatToMention: ["AI כעוזר, לא מחליף", "לאמת תוצאות", "אחריות נשארת אצל האדם"],
      commonMistakes: ["לסמוך עיוור על AI", "לחשוב שAI תמיד צודק"],
      tags: ["ai", "responsible-ai", "organization"],
    },
    {
      category: "AI",
      topic: "אמינות AI",
      difficulty: "basic",
      question: "איך היית בודקת אם תשובת AI אמינה?",
      shortAnswer: "אני בודקת אם AI נותן מקורות, אם זה הגיוני, ואם אני יכולה לאמת בדרכים אחרות.",
      simpleExplanation: "AI יכול להמציא — זה נקרא 'hallucination'.\nבדיקה: האם התשובה הגיונית? האם יש מקורות?\nאמת על ידי חיפוש עצמאי — Google, מסמכים רשמיים.\nאל תשתמשי בתשובת AI כמקור יחיד לעובדות קריטיות.\nעדיף: 'AI עזר לי לנסח, אבל אימתתי את העובדות'.",
      example: "AI אמר 'החברה X נוסדה ב-1990' — אמתת על ויקיפדיה לפני שהכנסת לדוח.",
      whatToMention: ["hallucinations", "לאמת מחוץ ל-AI", "AI כנקודת התחלה לא נקודת סוף"],
      commonMistakes: ["להעתיק תשובת AI ישירות לדוח", "לא לאמת עובדות"],
      tags: ["ai", "hallucinations", "verification"],
    },
    {
      category: "AI",
      topic: "נתונים רגישים",
      difficulty: "basic",
      question: "מה הסיכון בשימוש במידע רגיש בכלי AI?",
      shortAnswer: "מידע שמוכנסים לכלי AI ציבורי עלול לשמש לאימון מודל עתידי — לא להכניס נתוני לקוחות, סיסמאות, או קוד פרופריאטרי.",
      simpleExplanation: "כלי AI ציבוריים (ChatGPT, Gemini) — לא ברור מה קורה עם מה שמכניסים.\nסיכון: נתוני לקוחות = GDPR בעיה.\nקוד פרופריאטרי = דלף רעיון עסקי.\nסיסמאות/מפתחות — לעולם לא.\nפתרון: להשתמש ב-AI פנים-ארגוני או enterprise tier עם הסכם no-train.",
      example: "לא: 'AI, נתח את המכירות של לקוח X עם הנתונים הבאים: [PII]'. כן: 'AI, איך לנתח churn בנתונים אנונימיים?'",
      whatToMention: ["PII וGDPR", "נתוני לקוחות", "קוד פרופריאטרי", "enterprise vs. public AI"],
      commonMistakes: ["להכניס נתוני לקוחות לChatGPT", "לא לבדוק מדיניות הפרטיות של הכלי"],
      tags: ["ai", "privacy", "data-security", "gdpr"],
    },
  ],
  General: [
    {
      category: "General",
      topic: "עצמי",
      difficulty: "basic",
      question: "ספרי על עצמך ועל הרקע הטכני שלך.",
      shortAnswer: "הייתי מתחילה מהרקע הלימודי, הכישורים הטכניים הרלוונטיים, ומה מניע אותי להגיש למשרה הזו.",
      simpleExplanation: "תבנית: 'למדתי X, התמקדתי ב-Y, ובניתי Z. אני מחפשת תפקיד שמשלב A ו-B.'\nלשמור על 2-3 דקות.\nלסיים עם 'ולכן התפקיד הזה מעניין אותי' — לחבר לחברה.",
      example: "לומדת מדעי מחשב, מתמקדת ב-Data Analysis ו-QA. בניתי dashboard עם Python ו-SQL. מחפשת תפקיד שמשלב ניתוח ועבודה עם נתונים.",
      whatToMention: ["רקע לימודי", "כישורים טכניים", "פרויקטים", "קישור לתפקיד"],
      commonMistakes: ["לדבר יותר מ-3 דקות", "לא לחבר לתפקיד הספציפי"],
      tags: ["self-intro", "interview", "general"],
    },
  ],
  Personal: [],
};

// ─── Analysis ─────────────────────────────────────────────────────────────────

export type AnalysisResult = {
  detectedCategories: QuestionCategory[];
  matchingExistingQuestions: ProfessionalQuestion[];
  suggestedNewQuestions: QuestionTemplate[];
};

function detectCategories(text: string): QuestionCategory[] {
  const lower = text.toLowerCase();
  const found = new Set<QuestionCategory>();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      found.add(rule.category);
    }
  }

  // Always include General if nothing else matched
  if (found.size === 0) {
    found.add("General");
  }

  // Always add Projects and Technical Thinking
  found.add("Projects");
  found.add("Technical Thinking");

  return Array.from(found);
}

export function analyzeJobDescription(
  jobTitle: string,
  jobDescription: string,
  allQuestions: ProfessionalQuestion[]
): AnalysisResult {
  const text = `${jobTitle} ${jobDescription}`;
  const detectedCategories = detectCategories(text);

  const matchingExistingQuestions = allQuestions.filter(
    (q) => detectedCategories.includes(q.category) && q.difficulty === "basic"
  ).slice(0, 8);

  const suggestedNewQuestions: QuestionTemplate[] = [];
  for (const cat of detectedCategories) {
    const templates = TEMPLATES[cat] ?? [];
    for (const t of templates) {
      const alreadyInBank = allQuestions.some(
        (q) => q.question === t.question
      );
      if (!alreadyInBank) {
        suggestedNewQuestions.push(t);
      }
    }
  }

  return {
    detectedCategories,
    matchingExistingQuestions,
    suggestedNewQuestions: suggestedNewQuestions.slice(0, 10),
  };
}
