import type { ProfessionalQuestion } from "../types/professionalQuestion";

export const demoProfessionalQuestions: ProfessionalQuestion[] = [
  // ─── General Technical ─────────────────────────────────────────────────────
  {
    id: "gen-001",
    category: "General",
    topic: "API",
    difficulty: "basic",
    question: "מה זה API?",
    shortAnswer:
      "API הוא ממשק שמאפשר לשתי תוכנות לתקשר זו עם זו. האפליקציה שולחת בקשה, ה-API מחזיר תגובה.",
    simpleExplanation:
      "תארי לעצמך שאת במסעדה: את לא נכנסת למטבח — את מזמינה מהכלכלה שמעביר לך את האוכל. ה-API הוא הכלכלה שמחבר בין הלקוח לבין מה שמאחורה.",
    example:
      "אפליקציית מזג אוויר שולחת בקשת GET ל-API של OpenWeather ומקבלת JSON עם טמפרטורה ותחזית.",
    whatToMention: [
      "ממשק תקשורת בין שתי מערכות",
      "בקשה ותגובה (request & response)",
      "REST API נפוץ ב-web",
      "JSON הוא פורמט תגובה נפוץ",
    ],
    commonMistakes: [
      "לבלבל API עם UI (ממשק משתמש)",
      "לחשוב ש-API הוא רק צד שרת — גם צד לקוח",
    ],
    tags: ["api", "http", "rest", "json", "תקשורת"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "gen-002",
    category: "General",
    topic: "ארכיטקטורה",
    difficulty: "basic",
    question: "מה זה ארכיטקטורת לקוח-שרת?",
    shortAnswer:
      "הלקוח (דפדפן / אפליקציה) שולח בקשות, השרת מעבד ומחזיר תגובות. מתקשרים דרך HTTP/HTTPS.",
    simpleExplanation:
      "הלקוח הוא מה שרואים — הדפדפן שלך. השרת הוא מה שמאחורה — מחשב שמחזיר נתונים. כשאת פותחת אתר, הדפדפן שולח בקשה ומקבל חזרה HTML, CSS ו-JavaScript.",
    example:
      "פתיחת אתר חדשות: דפדפן (לקוח) שולח GET ל-server. השרת מחזיר HTML. הדפדפן מציג אותו.",
    whatToMention: [
      "לקוח = צד המשתמש",
      "שרת = מעבד ומחזיר נתונים",
      "תקשורת דרך HTTP/HTTPS",
      "Frontend / Backend מתייחסים לחלוקה זו",
    ],
    commonMistakes: [
      "לבלבל בין frontend לבין client",
      "לשכוח שהשרת יכול לתקשר גם עם שרתים אחרים",
    ],
    tags: ["client", "server", "http", "ארכיטקטורה"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "gen-003",
    category: "General",
    topic: "debugging",
    difficulty: "basic",
    question: "איך את מתחילה לדבג בעיה?",
    shortAnswer:
      "משחזרים את הבעיה, בודקים הודעות שגיאה ו-console logs, מצמצמים את מקור הבעיה בשלבים, מתקנים ובודקים שוב.",
    simpleExplanation:
      "Debugging הוא חקירה: מה קרה? מתי? למה? מתחילים מהשגיאה, מחפשים רמזים ב-logs, מנסים להבין מה השתנה לאחרונה.",
    example:
      "פונקציה מחזירה undefined. מוסיפה console.log לכניסה — מגלה שפרמטר מגיע כ-null כי קריאת API נכשלה.",
    whatToMention: [
      "שחזור הבעיה",
      "קריאת error message בשלמותה",
      "בדיקת console/logs",
      "צמצום שלבי הבעיה (bisect)"],
    commonMistakes: [
      "לשנות הרבה דברים בו-זמנית",
      "לדלג על קריאת הודעת השגיאה עצמה",
    ],
    tags: ["debugging", "console", "logs", "פתרון בעיות"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "gen-004",
    category: "General",
    topic: "frontend vs backend",
    difficulty: "basic",
    question: "מה ההבדל בין frontend לבין backend?",
    shortAnswer:
      "Frontend הוא מה שהמשתמש רואה — HTML, CSS, JavaScript בדפדפן. Backend הוא הלוגיקה שמאחורה — שרת, בסיס נתונים, API.",
    simpleExplanation:
      "Frontend הוא 'חדר הקדמי' — עיצוב, כפתורים, מה שאת רואה. Backend הוא 'המטבח' — הלוגיקה, מה שמחשב ומאחסן.",
    example:
      "בטופס התחברות: שדות הקלט הם Frontend. בדיקת הסיסמה מול בסיס הנתונים היא Backend.",
    whatToMention: [
      "Frontend = UI בדפדפן",
      "Backend = שרת + לוגיקה + DB",
      "מתקשרים דרך API",
      "Fullstack = שניהם יחד",
    ],
    commonMistakes: [
      "לחשוב ש-JavaScript הוא רק Frontend — הוא גם Backend (Node.js)",
      "לשכוח שבסיס הנתונים הוא חלק מה-Backend",
    ],
    tags: ["frontend", "backend", "fullstack", "ארכיטקטורה"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "gen-005",
    category: "General",
    topic: "בסיס נתונים",
    difficulty: "basic",
    question: "מה זה בסיס נתונים?",
    shortAnswer:
      "בסיס נתונים הוא מערכת לאחסון וניהול מידע בצורה מסודרת. SQL מאפשר לשאול, לעדכן ולמחוק נתונים בצורה יעילה.",
    simpleExplanation:
      "דמייני Excel ענקי ומאורגן מאוד. כל שורה היא רשומה (משתמש), כל עמודה היא שדה (שם, מייל). SQL מאפשר לחפש ולסנן מהר.",
    example:
      "בצייצנית, כל ציוץ נשמר בטבלה: עמודות id, user_id, text, created_at.",
    whatToMention: [
      "אחסון מידע מסודר",
      "SQL לשאילתות",
      "טבלאות, שדות ושורות",
      "Relational (SQL) מול NoSQL",
    ],
    commonMistakes: [
      "לבלבל בסיס נתונים עם שרת",
      "לשכוח שיש גם NoSQL (MongoDB, Redis)",
    ],
    tags: ["database", "sql", "storage", "נתונים"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "gen-006",
    category: "General",
    topic: "user flow",
    difficulty: "basic",
    question: "מה זה user flow?",
    shortAnswer:
      "User flow הוא המסלול שמשתמש עובר בתוך מוצר — מנקודת כניסה ועד השלמת המטרה.",
    simpleExplanation:
      "User flow הוא כמו מפת נסיעה: המשתמש מגיע מ-A, עובר דרך B ו-C, ומגיע ל-D. שימושי לעיצוב ולבדיקות.",
    example:
      "User flow לרכישה: עמוד ראשי → חיפוש מוצר → עמוד מוצר → הוספה לסל → תשלום → אישור.",
    whatToMention: [
      "תיאור נסיעת המשתמש",
      "נקודות כניסה ויציאה",
      "עוזר לזיהוי נקודות כאב",
      "שימושי ל-QA ולעיצוב",
    ],
    commonMistakes: [
      "לבלבל עם user story",
      "לא לכלול מצבי שגיאה בזרימה",
    ],
    tags: ["ux", "user-flow", "עיצוב", "בדיקות"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "gen-007",
    category: "General",
    topic: "הצגת פרויקט",
    difficulty: "basic",
    question: "איך מסבירים פרויקט בראיון?",
    shortAnswer:
      "מתחילים ממה הפרויקט עושה ולמי, אחר כך הטכנולוגיות, ולבסוף האתגר המרכזי והפתרון.",
    simpleExplanation:
      "תבנית: 'בניתי X כדי לפתור Y. השתמשתי ב-Z. האתגר הגדול היה W ופתרתי על ידי V.' לא להתחיל מהקוד.",
    example:
      "'בניתי אפליקציית מעקב משרות ב-React ו-TypeScript. האתגר היה שמירת נתונים מקומית — פתרתי עם IndexedDB.'",
    whatToMention: [
      "מה הפרויקט עושה ולמי",
      "טכנולוגיות",
      "אתגר ופתרון",
      "מה למדת",
    ],
    commonMistakes: [
      "להתחיל מהקוד לפני שמסבירים מה הפרויקט עושה",
      "להגיד 'פשוט' — מוריד מהישג",
    ],
    tags: ["פרויקט", "הצגה", "ראיון", "soft-skills"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },

  // ─── Data Analyst ──────────────────────────────────────────────────────────
  {
    id: "da-001",
    category: "Data Analyst",
    topic: "SQL בסיסי",
    difficulty: "basic",
    question: "לאיזה שימוש SQL מיועדת?",
    shortAnswer:
      "SQL היא שפה לניהול ושאילתת בסיסי נתונים. משתמשים בה לשליפה, סינון, עדכון ומחיקה של נתונים.",
    simpleExplanation:
      "SQL היא כמו שפת שאלות לבסיס הנתונים. אומרים לו: 'תביא לי את כל המכירות של החודש האחרון', ומקבלים טבלה.",
    example:
      "SELECT name, salary FROM employees WHERE department = 'Sales' ORDER BY salary DESC;",
    whatToMention: [
      "SELECT לשליפה",
      "WHERE לסינון",
      "JOIN לחיבור טבלאות",
      "GROUP BY + SUM/COUNT/AVG לצבירה",
    ],
    commonMistakes: [
      "לבלבל SQL (שפה) עם MySQL (מסד נתונים)",
      "לשכוח שאפשר גם לעדכן (UPDATE) ולמחוק (DELETE)",
    ],
    tags: ["sql", "select", "database", "שאילתות"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "da-002",
    category: "Data Analyst",
    topic: "SQL מתקדם",
    difficulty: "intermediate",
    question: "מה ההבדל בין WHERE לבין HAVING?",
    shortAnswer:
      "WHERE מסנן שורות לפני GROUP BY. HAVING מסנן קבוצות אחרי GROUP BY ועובד עם aggregate functions.",
    simpleExplanation:
      "WHERE הוא בוחר ראשוני — פועל לפני כל חישוב. HAVING הוא בוחר שני — פועל על הקבוצות לאחר שה-GROUP BY הקבץ אותן.",
    example:
      "SELECT dept, COUNT(*) cnt FROM employees WHERE salary > 5000 GROUP BY dept HAVING COUNT(*) > 3;",
    whatToMention: [
      "WHERE לפני GROUP BY",
      "HAVING אחרי GROUP BY",
      "HAVING עם aggregate functions (COUNT, SUM...)",
      "ניתן להשתמש בשניהם יחד",
    ],
    commonMistakes: [
      "לנסות aggregate function ב-WHERE",
      "להשתמש ב-HAVING בלי GROUP BY",
    ],
    tags: ["sql", "where", "having", "group-by"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "da-003",
    category: "Data Analyst",
    topic: "SQL joins",
    difficulty: "intermediate",
    question: "מה סוגי ה-JOIN ב-SQL?",
    shortAnswer:
      "INNER JOIN — שורות שתואמות בשתי טבלאות. LEFT JOIN — הכל מהשמאל + תואמים מהימין. FULL JOIN — הכל מהשתיים.",
    simpleExplanation:
      "LEFT JOIN מחזיר את כל המשתמשים גם אם לא הזמינו — אם לא הזמינו, עמודות ההזמנה יהיו NULL.",
    example:
      "SELECT u.name, o.order_id FROM users u LEFT JOIN orders o ON u.id = o.user_id;",
    whatToMention: [
      "INNER JOIN = חיתוך (רק תואמים)",
      "LEFT JOIN = כל השמאל + NULL אם אין תואם",
      "RIGHT JOIN = כל הימין",
      "FULL OUTER JOIN = כל השורות",
    ],
    commonMistakes: [
      "לשכוח שב-LEFT JOIN שורות ללא תואם מקבלות NULL",
      "לבלבל LEFT ו-RIGHT",
    ],
    tags: ["sql", "join", "inner", "left-join"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "da-004",
    category: "Data Analyst",
    topic: "דשבורד",
    difficulty: "basic",
    question: "מה זה דשבורד?",
    shortAnswer:
      "דשבורד הוא תצוגה ויזואלית מרכזית של KPIs ומדדים מרכזיים שמאפשרת קבלת החלטות מהירה.",
    simpleExplanation:
      "דשבורד הוא כמו לוח מחוונים של מכונית — מהירות, דלק, מצב. בעסקים — מכירות, לקוחות פעילים, הכנסות. הכל במקום אחד.",
    example:
      "דשבורד מכירות: גרף מכירות לפי יום, TOP 5 מוצרים, KPI הכנסה החודש מול החודש שעבר.",
    whatToMention: [
      "ריכוז מדדים מרכזיים (KPIs)",
      "ויזואליזציה מהירה",
      "Tableau, Power BI, Looker — כלים נפוצים",
      "עדכון בזמן אמת או תזמון",
    ],
    commonMistakes: [
      "לעשות דשבורד עם יותר מדי גרפים — מבלבל",
      "להציג נתונים ללא הקשר (מה הנורמה?)",
    ],
    tags: ["dashboard", "kpi", "ויזואליזציה", "tableau"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "da-005",
    category: "Data Analyst",
    topic: "תובנות נתונים",
    difficulty: "basic",
    question: "איך מסבירים data insight?",
    shortAnswer:
      "מציגים: מה גילינו + מה המשמעות + מה ההמלצה. לא מספיק להגיד 'המכירות ירדו ב-10%'.",
    simpleExplanation:
      "Insight = גילוי + משמעות + המלצה. צריך לחבר את הנתון לפעולה שניתן לעשות.",
    example:
      "'משתמשים שעוברים onboarding נשארים 3× יותר זמן. המלצה: לחזק את תהליך ה-onboarding ולמדוד השפעה על retention.'",
    whatToMention: [
      "מה גילית (finding)",
      "מה המשמעות (so what?)",
      "מה ההמלצה",
      "להתאים לקהל — עסקי vs. טכני",
    ],
    commonMistakes: [
      "להציג נתונים בלי הסבר",
      "להשתמש בז'רגון טכני מול קהל עסקי",
    ],
    tags: ["insight", "analysis", "storytelling", "נתונים"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "da-006",
    category: "Data Analyst",
    topic: "נתונים חסרים",
    difficulty: "basic",
    question: "מה זה missing data ואיך מטפלים בו?",
    shortAnswer:
      "Missing data הם שדות ריקים (NULL) בטבלה. צריך להחליט: להסיר, להחליף בממוצע/מצב (imputation), או לסמן.",
    simpleExplanation:
      "דמייני טבלת לקוחות שב-200 שורות עמודת 'גיל' ריקה. חישוב ממוצע גיל יהיה מוטה. חייבים לטפל לפני ניתוח.",
    example:
      "30% מהשורות חסרות גיל. אפשרות א': הסרת שורות אלו. אפשרות ב': החלפה בממוצע הגיל. בוחרים לפי ההקשר.",
    whatToMention: [
      "זיהוי NULL עם IS NULL",
      "אפשרויות: הסרה, imputation, סימון",
      "השפעה על ניתוח",
      "לתעד את ההחלטה",
    ],
    commonMistakes: [
      "להתעלם מנתונים חסרים ולנתח בכל זאת",
      "להחליף NULL ב-0 ללא הצדקה",
    ],
    tags: ["missing-data", "null", "cleaning", "איכות נתונים"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "da-007",
    category: "Data Analyst",
    topic: "איכות נתונים",
    difficulty: "basic",
    question: "איך בודקים איכות נתונים?",
    shortAnswer:
      "בודקים: נתונים חסרים, ערכים כפולים, outliers, עקביות פורמטים, וטווחים הגיוניים.",
    simpleExplanation:
      "בדיקת איכות נתונים היא כמו ביקורת לפני שימוש בחומרי גלם — מה חסר? מה פג תוקף? מה לא נראה נכון?",
    example:
      "COUNT(DISTINCT id) לכפילויות. MIN/MAX לטווחים. COUNT(*) WHERE col IS NULL לחסרים.",
    whatToMention: [
      "נתונים חסרים (NULL)",
      "כפילויות",
      "outliers וטווחי הגיון",
      "עקביות פורמטים (תאריכים, טלפונים)",
    ],
    commonMistakes: [
      "לדלג על בדיקת כפילויות",
      "להניח שנתונים ממסד נתונים הם נכונים",
    ],
    tags: ["data-quality", "null", "duplicates", "cleaning"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },

  // ─── QA ────────────────────────────────────────────────────────────────────
  {
    id: "qa-001",
    category: "QA",
    topic: "test case",
    difficulty: "basic",
    question: "מה זה test case?",
    shortAnswer:
      "מקרה בדיקה הוא תיאור מפורט של תרחיש: מה בודקים, מה הקלט, מה הפלט הצפוי, ומה קרה בפועל.",
    simpleExplanation:
      "Test case הוא כמו מתכון: שלב 1 — לחץ על כניסה. שלב 2 — הזן פרטים. תוצאה צפויה — מועבר לדשבורד.",
    example:
      "TC01: כניסה עם פרטים תקינים. קלט: user@email.com / 123456. צפוי: redirect לדשבורד. בפועל: כצפוי. סטטוס: PASS.",
    whatToMention: [
      "שם ומזהה",
      "תנאי מוקדם (preconditions)",
      "שלבי הביצוע",
      "תוצאה צפויה vs. בפועל",
    ],
    commonMistakes: [
      "לא להגדיר תוצאה צפויה ברורה",
      "לדלג על תנאים מוקדמים",
    ],
    tags: ["test-case", "qa", "בדיקות", "תיעוד"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "qa-002",
    category: "QA",
    topic: "מינוח",
    difficulty: "basic",
    question: "מה ההבדל בין bug לבין defect?",
    shortAnswer:
      "Bug הוא שגיאה בקוד שגורמת להתנהגות לא נכונה. Defect הוא כל סטייה מהדרישה — גם ללא שגיאת קוד.",
    simpleExplanation:
      "Bug = טעות שנעשתה בכתיבת הקוד. Defect = כל סטייה ממה שהוגדר. בפועל, השניים משמשים לעיתים לסירוגין.",
    example:
      "דרישה: כפתור ירוק. פיתוח: כפתור אדום — defect. כפתור שמירה לא שומר בכלל — bug.",
    whatToMention: [
      "Bug = שגיאת קוד",
      "Defect = סטייה מדרישה",
      "Error = פעולה שגויה של מפתח",
      "Failure = תוצאה שגויה בזמן ריצה",
    ],
    commonMistakes: [
      "להחליף bug ב-error",
      "לחשוב שהם תמיד אותו דבר",
    ],
    tags: ["bug", "defect", "מינוח", "qa"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "qa-003",
    category: "QA",
    topic: "סוגי בדיקות",
    difficulty: "basic",
    question: "מה ההבדל בין manual testing לבין automation testing?",
    shortAnswer:
      "Manual — בדיקה ידנית על ידי אדם. Automation — הרצת בדיקות אוטומטית. לכל אחד יתרונות שונים.",
    simpleExplanation:
      "Manual טוב לבדיקות חקרניות, UI ו-UX. Automation טוב לחזרה על בדיקות רבות פעמים — כמו regression לפני כל release.",
    example:
      "Checkout flow: manual לבדיקת UX. Selenium לבדיקות regression שרצות בכל deploy.",
    whatToMention: [
      "Manual = גמישות ויצירתיות",
      "Automation = מהירות וחזרתיות",
      "Automation דורשת השקעה ראשונית",
      "בדרך כלל משתמשים בשניהם",
    ],
    commonMistakes: [
      "לומר ש-Automation עדיפה תמיד",
      "לחשוב ש-Manual מיושנת",
    ],
    tags: ["automation", "manual", "selenium", "testing"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "qa-004",
    category: "QA",
    topic: "regression",
    difficulty: "basic",
    question: "מה זה regression testing?",
    shortAnswer:
      "Regression testing בודקת שתיקון או שינוי חדש לא שבר פונקציונליות קיימת. מריצים אחרי כל שינוי בקוד.",
    simpleExplanation:
      "תיקנת לוגין — regression testing בודקת שגם הרשמה, logout, ועמודים קשורים עדיין עובדים.",
    example:
      "הוספת שדה טלפון בהרשמה → regression suite: כניסה, הרשמה, פרופיל, שחזור סיסמה.",
    whatToMention: [
      "מריצים אחרי כל שינוי בקוד",
      "מוודאים שלא 'שברנו' משהו",
      "בדרך כלל אוטומטי",
      "חלק מ-CI/CD",
    ],
    commonMistakes: [
      "לדלג על regression כשמשנים 'קוד לא קשור'",
      "לא לעדכן את ה-suite עם features חדשים",
    ],
    tags: ["regression", "testing", "qa", "automation"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "qa-005",
    category: "QA",
    topic: "smoke testing",
    difficulty: "basic",
    question: "מה זה smoke testing?",
    shortAnswer:
      "Smoke testing היא בדיקה מהירה ושטחית שמוודאת שהפונקציות הקריטיות ביותר עובדות, לפני בדיקה מעמיקה.",
    simpleExplanation:
      "השם מגיע מהנדסת חומרה: מדליקים מכשיר ובודקים שלא יוצא עשן. בתוכנה — האפליקציה עולה? לוגין עובד? מסכים ראשיים נטענים?",
    example:
      "Smoke test: האתר נפתח? לוגין עובד? עמוד ראשי נטען? אם כן — ממשיכים לבדיקות עמוקות.",
    whatToMention: [
      "בדיקה מהירה של basic functionality",
      "מריצים לפני full regression",
      "בדרך כלל 10–20 בדיקות בלבד",
      "נקרא גם sanity testing",
    ],
    commonMistakes: [
      "לבצע smoke test שלוקח שעות — זה לא smoke test",
      "לדלג עליה לחלוטין לפני release",
    ],
    tags: ["smoke", "sanity", "qa", "testing"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "qa-006",
    category: "QA",
    topic: "בדיקות לדוגמה",
    difficulty: "basic",
    question: "איך תבדקי דף לוגין?",
    shortAnswer:
      "פרטים תקינים, סיסמה שגויה, שם משתמש שגוי, שדות ריקים, סיסמה ארוכה מדי, SQL injection, עיצוב ונגישות.",
    simpleExplanation:
      "לא מספיק לבדוק שלוגין עם פרטים נכונים עובד. צריך לבדוק גם כשלונות: הודעת שגיאה ברורה? חשבון ננעל אחרי ניסיונות?",
    example:
      "TC01-לוגין תקין. TC02-סיסמה שגויה. TC03-שם משתמש לא קיים. TC04-שדות ריקים. TC05-SQL injection.",
    whatToMention: [
      "Happy path (פרטים תקינים)",
      "Negative tests (פרטים שגויים)",
      "אבטחה (SQL injection, נעילה)",
      "UI ונגישות",
    ],
    commonMistakes: [
      "לבדוק רק את ה-happy path",
      "לדלג על בדיקות אבטחה בסיסיות",
    ],
    tags: ["login", "test-case", "negative-testing", "security"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "qa-007",
    category: "QA",
    topic: "דיווח באגים",
    difficulty: "basic",
    question: "מה צריך להיות בדוח באג?",
    shortAnswer:
      "כותרת ברורה, שלבי שחזור, תוצאה בפועל, תוצאה צפויה, חומרה (severity), environment, ותיעוד (screenshot/log).",
    simpleExplanation:
      "דוח באג טוב הוא כזה שמפתח יכול לשחזר את הבעיה לבד. כמו הנחיות בישול — אם שלב חסר, לא ניתן לשחזר.",
    example:
      "כותרת: 'כפתור שמירה לא מגיב בנייד'. שלבים: 1.התחבר. 2.פרופיל. 3.שנה שם. 4.לחץ שמירה. בפועל: כלום. צפוי: שמירה.",
    whatToMention: [
      "כותרת ברורה",
      "שלבי שחזור מדויקים",
      "תוצאה בפועל vs. צפויה",
      "environment ו-screenshot",
    ],
    commonMistakes: [
      "כותרת כללית מדי ('הכל שבור')",
      "לשכוח לציין environment (גרסה, דפדפן, מכשיר)",
    ],
    tags: ["bug-report", "jira", "documentation", "qa"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },

  // ─── Frontend ──────────────────────────────────────────────────────────────
  {
    id: "fe-001",
    category: "Frontend",
    topic: "React בסיסי",
    difficulty: "basic",
    question: "מה זה React?",
    shortAnswer:
      "React היא ספריית JavaScript לבניית ממשקי משתמש. מאפשרת לבנות UI מ-components עצמאיים לשימוש חוזר.",
    simpleExplanation:
      "React היא כמו ערכת לגו לאינטרנט. במקום לכתוב HTML ישיר, בונים 'לבנים' (components) שניתן לשים בכל מקום. כשנתון משתנה, React מעדכנת רק את החלק הרלוונטי.",
    example:
      "<JobCard company='Google' role='Developer' /> — component שניתן להשתמש בו פעמים רבות עם נתונים שונים.",
    whatToMention: [
      "Component-based",
      "Virtual DOM לעדכונים יעילים",
      "JSX — שילוב HTML ב-JavaScript",
      "ספרייה (לא framework)",
    ],
    commonMistakes: [
      "לקרוא לה framework — היא ספרייה (library)",
      "לבלבל React עם React Native",
    ],
    tags: ["react", "component", "jsx", "frontend"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "fe-002",
    category: "Frontend",
    topic: "component",
    difficulty: "basic",
    question: "מה זה component ב-React?",
    shortAnswer:
      "Component הוא יחידה עצמאית של UI — כמו כפתור, טופס, או כרטיס. מכיל לוגיקה, תצוגה, וסגנון.",
    simpleExplanation:
      "Component הוא בלוק לגו. יש לך 'Header', 'Button', 'Card' — כל אחד עצמאי, ניתן לשימוש חוזר.",
    example:
      "<Button text='שמירה' onClick={handleSave} /> — component עצמאי שמקבל props ומציג כפתור.",
    whatToMention: [
      "יחידה עצמאית ולוגית",
      "ניתן לשימוש חוזר",
      "מקבל props",
      "יכול לנהל state פנימי",
    ],
    commonMistakes: [
      "לכתוב component ענק שעושה הכל",
      "לא להפריד לוגיקה מתצוגה",
    ],
    tags: ["component", "react", "props", "ui"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "fe-003",
    category: "Frontend",
    topic: "state",
    difficulty: "basic",
    question: "מה זה state ב-React?",
    shortAnswer:
      "State הוא המידע הפנימי של component שיכול להשתנות. כשהוא משתנה, React מרנדרת מחדש את ה-component.",
    simpleExplanation:
      "State הוא 'הזיכרון' של הcomponent. כשלוחצים כפתור, state משתנה ו-React מציגה את המצב החדש.",
    example:
      "const [count, setCount] = useState(0); — לחיצה על כפתור קוראת ל-setCount(count+1) ומעדכנת את התצוגה.",
    whatToMention: [
      "מידע פנימי שמשתנה",
      "שינוי state = re-render",
      "useState hook",
      "שונה מ-props (מגיע מבחוץ)",
    ],
    commonMistakes: [
      "לשנות state ישירות (state.value = x) במקום דרך setter",
      "לשים הכל ב-state גם כשלא צריך",
    ],
    tags: ["state", "usestate", "react", "hooks"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "fe-004",
    category: "Frontend",
    topic: "props",
    difficulty: "basic",
    question: "מה זה props ב-React?",
    shortAnswer:
      "Props הם נתונים שמועברים מהורה לילד ב-React. הם read-only — ה-component לא אמור לשנות אותם.",
    simpleExplanation:
      "Props הם כמו פרמטרים של פונקציה. ה-parent שולח, ה-child מקבל ומציג.",
    example:
      "function Greeting({ name }) { return <h1>שלום {name}</h1>; } — name הוא prop: <Greeting name='יעל' />",
    whatToMention: [
      "מועברים מהורה לילד",
      "read-only בתוך ה-child",
      "כל סוג נתון — מחרוזת, פונקציה, אובייקט",
      "שונה מ-state (חיצוני vs. פנימי)",
    ],
    commonMistakes: [
      "לנסות לשנות props בתוך ה-child",
      "לבלבל props עם state",
    ],
    tags: ["props", "react", "component", "data-flow"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "fe-005",
    category: "Frontend",
    topic: "responsive design",
    difficulty: "basic",
    question: "מה זה responsive design?",
    shortAnswer:
      "Responsive design הוא עיצוב שמתאים את עצמו לגדלים שונים של מסכים — מובייל, טאבלט, דסקטופ.",
    simpleExplanation:
      "במקום לבנות אתר נפרד לכל מכשיר, בונים אחד שמשתנה לפי רוחב המסך באמצעות CSS media queries.",
    example:
      "@media (max-width: 768px) { .sidebar { display: none; } } — מסתיר sidebar במסכים קטנים.",
    whatToMention: [
      "CSS media queries",
      "Flexbox ו-Grid",
      "Mobile-first approach",
      "viewport meta tag",
    ],
    commonMistakes: [
      "לתכנן רק לדסקטופ ולהוסיף מובייל בסוף",
      "לא לבדוק במכשירים אמיתיים",
    ],
    tags: ["responsive", "css", "media-query", "mobile"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "fe-006",
    category: "Frontend",
    topic: "CSS",
    difficulty: "basic",
    question: "מה תפקיד ה-CSS?",
    shortAnswer:
      "CSS מגדיר את העיצוב של HTML — צבעים, גדלים, פונטים, מרווחים, פריסה.",
    simpleExplanation:
      "HTML הוא השלד, CSS הוא הבגדים. HTML אומר 'כאן יש כפתור', CSS אומר 'הכפתור כחול ועגול עם 16px'.",
    example:
      ".btn { background: #6b5548; color: white; padding: 10px 20px; border-radius: 8px; }",
    whatToMention: [
      "Selector, property, value",
      "Specificity — מה מנצח",
      "Flexbox ו-Grid לפריסה",
      "Box model",
    ],
    commonMistakes: [
      "לבלבל HTML עם CSS",
      "לא להבין specificity",
    ],
    tags: ["css", "styling", "flexbox", "design"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },

  // ─── JavaScript ────────────────────────────────────────────────────────────
  {
    id: "js-001",
    category: "JavaScript",
    topic: "הצהרת משתנים",
    difficulty: "basic",
    question: "מה ההבדל בין var, let ו-const?",
    shortAnswer:
      "var ישן, function scope, עם hoisting בעייתי. let מאפשר שינוי, block scope. const לערך שלא משתנה, block scope.",
    simpleExplanation:
      "var הוא הישן עם quirks. let לערכים שמשתנים. const לערכים קבועים. ב-2024 משתמשים בעיקר ב-const ו-let.",
    example:
      "const PI = 3.14; // קבוע. let count = 0; count++; // משתנה. var x = 5; // נמנעים.",
    whatToMention: [
      "const לערכים קבועים",
      "let לערכים משתנים",
      "var הוא function scope (לא block)",
      "hoisting שונה בין השלושה",
    ],
    commonMistakes: [
      "לחשוב ש-const אומר שאובייקט לא ניתן לשינוי פנימי",
      "להשתמש ב-var בקוד חדש",
    ],
    tags: ["javascript", "var", "let", "const", "scope"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "js-002",
    category: "JavaScript",
    topic: "array methods",
    difficulty: "basic",
    question: "מה ההבדל בין map, filter ו-find?",
    shortAnswer:
      "map — מחזיר מערך חדש עם טרנספורמציה. filter — מחזיר אלמנטים שעוברים תנאי. find — מחזיר אלמנט ראשון שמתאים.",
    simpleExplanation:
      "map = שינוי. filter = סינון (מחזיר מערך). find = חיפוש של אחד (מחזיר ערך). כולם לא משנים את המקור.",
    example:
      "[10,20,30].map(p => p*2) // [20,40,60]. .filter(p => p>15) // [20,30]. .find(p => p>15) // 20",
    whatToMention: [
      "map = מחזיר מערך באותו גודל",
      "filter = מחזיר מערך קטן יותר",
      "find = מחזיר ערך אחד או undefined",
      "כולם immutable — לא משנים המקור",
    ],
    commonMistakes: [
      "לבלבל filter (מחזיר מערך) עם find (מחזיר ערך)",
      "לשכוח שהמערך המקורי לא משתנה",
    ],
    tags: ["javascript", "map", "filter", "find", "array"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "js-003",
    category: "JavaScript",
    topic: "async",
    difficulty: "intermediate",
    question: "מה זה async/await?",
    shortAnswer:
      "async/await היא דרך לכתוב קוד אסינכרוני בצורה קריאה. await מחכה לסיום Promise לפני שממשיכה.",
    simpleExplanation:
      "בלי async/await, קוד שמחכה לשרת נראה מסובך עם callbacks. עם async/await הקוד קריא כמו קוד רגיל מלמעלה למטה.",
    example:
      "async function getUser(id) { const res = await fetch('/api/users/'+id); return await res.json(); }",
    whatToMention: [
      "בנויה על Promises",
      "await מחכה ל-Promise",
      "try/catch לטיפול בשגיאות",
      "לא חוסם את ה-main thread",
    ],
    commonMistakes: [
      "לשכוח await לפני Promise",
      "לא לטפל בשגיאות עם try/catch",
      "להשתמש ב-await מחוץ ל-async function",
    ],
    tags: ["javascript", "async", "await", "promise"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "js-004",
    category: "JavaScript",
    topic: "events",
    difficulty: "basic",
    question: "מה זה events ב-JavaScript?",
    shortAnswer:
      "Events הם אירועים שקורים בדפדפן — לחיצה, הקלדה, גלילה. addEventListener מגדיר פונקציה שתרוץ כשהאירוע יקרה.",
    simpleExplanation:
      "Event הוא כמו מינגן לפעולה. לחיצה על כפתור יוצרת event 'click'. addEventListener מחכה לאירוע ומריץ פונקציה.",
    example:
      "button.addEventListener('click', () => { console.log('נלחץ!'); });",
    whatToMention: [
      "addEventListener לרישום handler",
      "event object עם מידע על האירוע",
      "event.preventDefault() למניעת התנהגות ברירת מחדל",
      "event bubbling",
    ],
    commonMistakes: [
      "לא להסיר event listeners (memory leaks)",
      "לבלבל onclick (HTML attribute) עם addEventListener",
    ],
    tags: ["javascript", "events", "dom", "listener"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "js-005",
    category: "JavaScript",
    topic: "array vs object",
    difficulty: "basic",
    question: "מה ההבדל בין Array לבין Object ב-JavaScript?",
    shortAnswer:
      "Array הוא אוסף סדור בנגישה לפי אינדקס מספרי. Object הוא אוסף של זוגות key-value בנגישה לפי מפתח.",
    simpleExplanation:
      "Array = רשימה ממוספרת. Object = מילון עם שמות. [1,2,3] — אינדקסים 0,1,2. { name: 'יעל' } — מפתח name.",
    example:
      "const colors = ['red','blue']; colors[0]; // 'red'. const person = { name: 'יעל' }; person.name; // 'יעל'",
    whatToMention: [
      "Array — סדר חשוב, אינדקס מספרי",
      "Object — key-value, סדר לא מובטח",
      "Array: length, map, filter",
      "Object: Object.keys(), Object.values()",
    ],
    commonMistakes: [
      "לנסות לגשת לאובייקט באינדקס מספרי",
      "לא לדעת מתי Array ומתי Object",
    ],
    tags: ["javascript", "array", "object", "data-structures"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "js-006",
    category: "JavaScript",
    topic: "functions",
    difficulty: "basic",
    question: "מה ההבדל בין function declaration לבין arrow function?",
    shortAnswer:
      "Function declaration מוגבהת (hoisted). Arrow function קצרה יותר ולא מגדירה this משלה.",
    simpleExplanation:
      "Function declaration אפשר לקרוא לפני שהוגדרה (hoisting). Arrow function כתוב קצר יותר וירשה this מהמקיף.",
    example:
      "function add(a,b) { return a+b; } // declaration. const add = (a,b) => a+b; // arrow",
    whatToMention: [
      "Function declaration = hoisted",
      "Arrow function = this מהמקיף",
      "Arrow קצרה יותר לקוד קצר",
      "Arrow לא ניתן לשימוש כ-constructor",
    ],
    commonMistakes: [
      "לבלבל this ב-arrow function",
      "לחשוב ש-arrow function תמיד עדיפה",
    ],
    tags: ["javascript", "function", "arrow", "this"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },

  // ─── Cyber ─────────────────────────────────────────────────────────────────
  {
    id: "cyber-001",
    category: "Cyber",
    topic: "phishing",
    difficulty: "basic",
    question: "מה זה phishing?",
    shortAnswer:
      "Phishing היא מתקפה שבה תוקף מתחזה לגורם לגיטימי (בנק, חברה) כדי לגנוב פרטים רגישים.",
    simpleExplanation:
      "Phishing הוא כמו 'דיג' — התוקף זורק פיתיון (מייל מזויף) ומחכה שמישהו ייפול. המייל לרוב מוביל לאתר מזויף.",
    example:
      "מייל 'מבנק לאומי': 'חשבונך ננעל. לחץ לאיפוס סיסמה.' הקישור מוביל לאתר מזויף שגונב פרטים.",
    whatToMention: [
      "התחזות לגורם לגיטימי",
      "בדרך כלל דרך מייל/SMS",
      "מטרה: גניבת פרטים רגישים",
      "Spear phishing = ממוקד לאדם ספציפי",
    ],
    commonMistakes: [
      "לחשוב שרק 'אנשים נאיביים' נפגעים",
      "לא לבדוק URL לפני לחיצה",
    ],
    tags: ["phishing", "social-engineering", "cyber", "אבטחה"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "cyber-002",
    category: "Cyber",
    topic: "auth",
    difficulty: "basic",
    question: "מה ההבדל בין authentication לבין authorization?",
    shortAnswer:
      "Authentication (אימות) = מי אתה? Authorization (הרשאה) = מה מותר לך? קודם מאמתים, אחר כך בודקים הרשאות.",
    simpleExplanation:
      "Authentication = בדיקת תעודת זהות בכניסה. Authorization = בדיקה אם יש גישה לאזורים מסוימים.",
    example:
      "כניסה לג'ימייל = Authentication. ניסיון לפתוח מייל של מישהו אחר = Authorization (נדחה).",
    whatToMention: [
      "Authentication = זיהוי זהות",
      "Authorization = בדיקת הרשאות",
      "קודם Auth, אחר כך Authz",
      "JWT לאימות, RBAC לניהול הרשאות",
    ],
    commonMistakes: [
      "לבלבל ביניהם",
      "לחשוב שהם אותו דבר",
    ],
    tags: ["authentication", "authorization", "security", "auth"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "cyber-003",
    category: "Cyber",
    topic: "MFA",
    difficulty: "basic",
    question: "מה זה MFA?",
    shortAnswer:
      "MFA (Multi-Factor Authentication) דורשת שתי ראיות לפחות לאימות: סיסמה + טלפון, לדוגמה.",
    simpleExplanation:
      "MFA כמו בית עם שני מנעולים. גם אם מישהו גנב את הסיסמה שלך, הוא עדיין צריך גם את הטלפון.",
    example:
      "כניסה לפייסבוק: שלב 1 — סיסמה. שלב 2 — קוד חד-פעמי ב-SMS. שניהם נדרשים.",
    whatToMention: [
      "שלוש קטגוריות: יודע (סיסמה), יש (טלפון), הוא (ביומטרי)",
      "מגן גם אם סיסמה נגנבה",
      "TOTP (Google Authenticator) יותר בטוח מ-SMS",
      "חשוב לחשבונות רגישים",
    ],
    commonMistakes: [
      "לחשוב ש-SMS הוא MFA הכי מאובטח",
      "לא להפעיל MFA על חשבונות חשובים",
    ],
    tags: ["mfa", "2fa", "authentication", "security"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "cyber-004",
    category: "Cyber",
    topic: "הצפנה",
    difficulty: "basic",
    question: "מה זה הצפנה (Encryption)?",
    shortAnswer:
      "הצפנה היא המרת נתונים לפורמט בלתי קריא שניתן לפענח רק עם מפתח מתאים.",
    simpleExplanation:
      "הצפנה היא כמו שליחת מכתב בשפה סודית שרק הנמען יכול לפענח. ה-HTTPS מצפין את התקשורת בין הדפדפן לשרת.",
    example:
      "SSL/TLS מצפין תקשורת (HTTPS). סיסמאות נשמרות כ-hash בבסיס הנתונים.",
    whatToMention: [
      "Symmetric = מפתח אחד",
      "Asymmetric = ציבורי + פרטי",
      "HTTPS = הצפנת תקשורת",
      "Hash != הצפנה (hash חד-כיווני)",
    ],
    commonMistakes: [
      "לבלבל hash עם encryption",
      "לחשוב ש-base64 זה הצפנה (רק קידוד)",
    ],
    tags: ["encryption", "https", "hash", "security"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "cyber-005",
    category: "Cyber",
    topic: "לוגים",
    difficulty: "intermediate",
    question: "מה נחשב התנהגות חשודה בלוגים?",
    shortAnswer:
      "כניסות כושלות חוזרות, גישה בשעות חריגות, עליות חריגות בתעבורה, גישה לנתונים רגישים ממיקום חדש.",
    simpleExplanation:
      "לוגים הם יומן המערכת. התנהגות חשודה = 100 ניסיונות כניסה בדקה (brute force), גישה מסין ב-3 לפנות בוקר, גישה לקבצים לא רגילים.",
    example:
      "100 ניסיונות כניסה כושלים מ-IP אחד בדקה = חשד לbrute force. גישה ל-API פנימי ב-3 לפנות בוקר = אנומליה.",
    whatToMention: [
      "ניסיונות כניסה כושלים חוזרים",
      "גישה בשעות חריגות",
      "עליות חריגות בתעבורה",
      "גישה ממיקום/IP חדש",
    ],
    commonMistakes: [
      "להתעלם מ'רעש' שחוזר שוב ושוב",
      "לא לשמור לוגים מספיק זמן",
    ],
    tags: ["logs", "siem", "anomaly", "security", "monitoring"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },

  // ─── Git ───────────────────────────────────────────────────────────────────
  {
    id: "git-001",
    category: "Git",
    topic: "בסיסי",
    difficulty: "basic",
    question: "מה זה Git?",
    shortAnswer:
      "Git הוא מערכת לניהול גרסאות. עוקב אחרי שינויים בקוד לאורך זמן ומאפשר שיתוף עבודה בין מפתחים.",
    simpleExplanation:
      "Git הוא כמו 'שמור' חכם שמכיל את כל ההיסטוריה. אם שברת משהו, ניתן לחזור לגרסה ישנה. עם GitHub — צוות שלם יכול לעבוד על אותו קוד.",
    example:
      "git init → git add . → git commit -m 'הוספת לוגין' → git push → הקוד ב-GitHub.",
    whatToMention: [
      "מעקב שינויים",
      "חזרה לגרסות ישנות",
      "עבודה צוותית מקבילה",
      "GitHub = שירות אחסון מרוחק",
    ],
    commonMistakes: [
      "לבלבל Git (הכלי) עם GitHub (השירות)",
      "לא לכתוב commit messages משמעותיות",
    ],
    tags: ["git", "version-control", "github", "בסיסי"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "git-002",
    category: "Git",
    topic: "פקודות",
    difficulty: "basic",
    question: "מה ההבדל בין commit לבין push?",
    shortAnswer:
      "commit שומר שינויים מקומית. push שולח את ה-commits ל-remote repository (GitHub).",
    simpleExplanation:
      "commit = שמירת קובץ Word מקומית. push = העלאה ל-Google Drive כדי שאחרים יראו.",
    example:
      "git add file.ts → git commit -m 'תיקון באג' → git push origin main. עד push — רק אצלך.",
    whatToMention: [
      "commit = שמירה מקומית",
      "push = שליחה ל-remote",
      "pull = משיכה מה-remote",
      "commit לפני push תמיד",
    ],
    commonMistakes: [
      "לשכוח push ולחשוב שהאחרים רואים",
      "לעשות push ל-main ישירות בלי PR",
    ],
    tags: ["git", "commit", "push", "workflow"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "git-003",
    category: "Git",
    topic: "branch",
    difficulty: "basic",
    question: "מה זה branch ב-Git?",
    shortAnswer:
      "Branch היא ענף נפרד שמאפשר לפתח תכונה חדשה בלי להשפיע על הקוד הראשי.",
    simpleExplanation:
      "Main branch = הגרסה הרשמית. Branch חדש = עובדים בבידוד, ואחרי שמוכן — מאחדים חזרה.",
    example:
      "git checkout -b feature/login → עובדת על לוגין. git checkout main → חוזרת לקוד שלא הושפע.",
    whatToMention: [
      "פיתוח מבודד",
      "מאפשר עבודה מקבילה",
      "merge מחזיר לmain",
      "best practice: branch לכל feature/bugfix",
    ],
    commonMistakes: [
      "לעבוד ישירות על main",
      "לא לסנכרן לפני עדכון",
    ],
    tags: ["git", "branch", "workflow", "merge"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "git-004",
    category: "Git",
    topic: "merge conflict",
    difficulty: "intermediate",
    question: "מה זה merge conflict ואיך פותרים?",
    shortAnswer:
      "Merge conflict קורה כששני מפתחים שינו את אותן שורות. Git מסמן את הסתירות וצריך לבחור את הגרסה הנכונה.",
    simpleExplanation:
      "שניכם ערכתם שורה 42 לדברים שונים. Git לא יודע מי צודק — מסמן את שני הגרסאות וצריך להחליט.",
    example:
      "<<<<<<< HEAD | color = 'blue' | ======= | color = 'red' | >>>>>>> feature — בוחרים ומוחקים ה-syntax.",
    whatToMention: [
      "קורה עם שינויים סותרים",
      "Git מסמן עם <<<< ==== >>>>",
      "פותרים ידנית",
      "git status לבדיקה אחרי",
    ],
    commonMistakes: [
      "להיבהל — זה נורמלי",
      "לבחור 'שלי' תמיד בלי לבדוק",
    ],
    tags: ["git", "merge", "conflict", "collaboration"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "git-005",
    category: "Git",
    topic: "פקודות",
    difficulty: "basic",
    question: "מה עושה git pull?",
    shortAnswer:
      "git pull מושך שינויים מה-remote ומאחד אותם עם ה-branch המקומי. שילוב של git fetch + git merge.",
    simpleExplanation:
      "git pull = 'סנכרן' — מוריד שינויים אחרונים של הצוות ומשלב עם הקוד שלך. כדאי לפני תחילת עבודה.",
    example:
      "git pull origin main — מושך שינויים מ-main ב-remote. יכול לגרום ל-merge conflict.",
    whatToMention: [
      "fetch + merge בפעולה אחת",
      "כדאי לפני תחילת עבודה",
      "יכול לגרום ל-merge conflict",
      "pull request != git pull",
    ],
    commonMistakes: [
      "לבלבל git pull עם pull request",
      "לא לעשות pull לפני push",
    ],
    tags: ["git", "pull", "sync", "remote"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "git-006",
    category: "Git",
    topic: "למה Git",
    difficulty: "basic",
    question: "למה חשוב להשתמש ב-version control?",
    shortAnswer:
      "Version control שומר היסטוריית שינויים, מאפשר חזרה לגרסות ישנות, ועבודה צוותית מקבילה.",
    simpleExplanation:
      "בלי version control, שברת משהו — אין דרך חזרה. Git שומר כל snapshot. חזרה לגרסה ישנה = שניות.",
    example:
      "פרסמת גרסה עם באג קריטי. עם Git: git revert — חוזרים לגרסה הקודמת תוך שניות.",
    whatToMention: [
      "היסטוריית שינויים",
      "חזרה לגרסות ישנות",
      "עבודה מקבילה (branches)",
      "תיעוד מה השתנה ולמה",
    ],
    commonMistakes: [
      "לחשוב ש-Ctrl+Z מספיק",
      "לא להשתמש ב-version control בפרויקטים אישיים",
    ],
    tags: ["git", "version-control", "best-practices"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },

  // ─── Projects ──────────────────────────────────────────────────────────────
  {
    id: "proj-001",
    category: "Projects",
    topic: "הצגה",
    difficulty: "basic",
    question: "איך מציגים פרויקט בראיון?",
    shortAnswer:
      "מה הפרויקט עושה ולמי → טכנולוגיות → אתגר מרכזי + פתרון. 2–3 משפטים כבסיס, הרחבה לפי שאלות.",
    simpleExplanation:
      "תבנית: 'בניתי X כדי לפתור Y. השתמשתי ב-Z. האתגר היה W ופתרתי ב-V.' לא להתחיל מהקוד.",
    example:
      "'בניתי אפליקציית מעקב משרות ב-React ו-TypeScript. האתגר: שמירת נתונים מקומית — פתרתי עם IndexedDB.'",
    whatToMention: [
      "מה הפרויקט עושה ולמי",
      "טכנולוגיות",
      "אתגר ופתרון",
      "מה למדת",
    ],
    commonMistakes: [
      "להתחיל מהקוד לפני שמסבירים מה הפרויקט עושה",
      "להגיד 'פרויקט פשוט' — מוריד מהישג",
    ],
    tags: ["פרויקט", "הצגה", "ראיון", "elevator-pitch"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "proj-002",
    category: "Projects",
    topic: "בחירת טכנולוגיה",
    difficulty: "basic",
    question: "למה בחרת טכנולוגיה מסוימת?",
    shortAnswer:
      "מסבירים את הצורך שהוביל לבחירה — ביצועים, קהילה, זמן למידה, מתאימות. לא 'כי לא ידעתי אחר'.",
    simpleExplanation:
      "ממראיין רוצה לדעת שחשבת: למה React ולא Vue? יש סיבות — קהילה גדולה, ecosystem עשיר, מה שנדרש בשוק.",
    example:
      "'בחרתי TypeScript כי הוא מוסיף type safety שעזר לי לתפוס שגיאות בזמן פיתוח ולא בזמן ריצה.'",
    whatToMention: [
      "הצורך שהוביל לבחירה",
      "יתרונות ספציפיים",
      "אלטרנטיבות ששקלת",
      "מה היית בוחרת היום?",
    ],
    commonMistakes: [
      "להגיד 'כי זה מה שלמדתי' בלי הסבר נוסף",
      "לא להכיר חלופות בכלל",
    ],
    tags: ["פרויקט", "טכנולוגיה", "החלטות", "ראיון"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "proj-003",
    category: "Projects",
    topic: "אתגרים",
    difficulty: "basic",
    question: "מה האתגר הגדול שפתרת בפרויקט?",
    shortAnswer:
      "בוחרים אתגר ספציפי ומתארים: מה הבעיה, מה ניסינו, מה לא עבד, ואיך פתרנו.",
    simpleExplanation:
      "ממראיין רוצה לראות תהליך חשיבה: זיהוי בעיה, ניסיונות, כישלון ולמידה, פתרון. זה מה שמבדיל מפתחות טובות.",
    example:
      "'האתגר: state management מורכב. ניסיתי prop drilling — לא הסתדר. עברתי ל-Context API — פתר ועשה הקוד נקי.'",
    whatToMention: [
      "מה הבעיה",
      "מה ניסית",
      "מה לא עבד ולמה",
      "מה פתר בסוף",
    ],
    commonMistakes: [
      "להגיד שלא היו אתגרים — לא אמין",
      "לתאר אתגר בלי פתרון",
    ],
    tags: ["פרויקט", "אתגרים", "problem-solving", "ראיון"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "proj-004",
    category: "Projects",
    topic: "למידה",
    difficulty: "basic",
    question: "מה למדת מהפרויקט?",
    shortAnswer:
      "תארי למידה טכנית (טכנולוגיה, כלי) ולמידה תהליכית (ארכיטקטורה, ניהול זמן). שניהם חשובים.",
    simpleExplanation:
      "השאלה בודקת self-awareness. לא רק 'למדתי React' — גם 'למדתי שחשוב לתכנן ארכיטקטורה לפני שמתחילים לקודד'.",
    example:
      "'למדתי ש-TypeScript שווה את ההשקעה. גם למדתי שכשמשנים ארכיטקטורה באמצע, עדיף rewrite נקי.'",
    whatToMention: [
      "למידה טכנית ספציפית",
      "למידה על תהליך/ארגון",
      "מה היית עושה אחרת",
      "self-awareness",
    ],
    commonMistakes: [
      "תשובה גנרית מדי",
      "לא להזכיר דבר ספציפי",
    ],
    tags: ["פרויקט", "למידה", "reflection", "ראיון"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "proj-005",
    category: "Projects",
    topic: "שיפורים",
    difficulty: "basic",
    question: "איך היית משפרת את הפרויקט?",
    shortAnswer:
      "שיפורים קונקרטיים: בדיקות, accessibility, refactoring, טיפול בשגיאות. זה מראה שאת חושבת על איכות.",
    simpleExplanation:
      "ממראיין לא מצפה לפרויקט מושלם, הם מצפים לראות שאת יודעת מה חסר. זה סימן לבשלות.",
    example:
      "'הייתי מוסיפה unit tests — אין כרגע. מפרידה API calls ל-layer נפרד. מטפלת טוב יותר במצבי שגיאה.'",
    whatToMention: [
      "בדיקות (testing)",
      "accessibility",
      "טיפול בשגיאות",
      "refactoring ושיפור ביצועים",
    ],
    commonMistakes: [
      "להגיד שאין מה לשפר",
      "לציין רק features חדשות ולא שיפורי איכות",
    ],
    tags: ["פרויקט", "שיפורים", "איכות", "ראיון"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    id: "proj-006",
    category: "Projects",
    topic: "ארכיטקטורה",
    difficulty: "basic",
    question: "איך ארגנת את הקוד בפרויקט?",
    shortAnswer:
      "חלוקה לתיקיות לפי סוג — components, hooks, utils, types — ועקרון separation of concerns.",
    simpleExplanation:
      "ארגון קוד טוב הוא כמו ארגון מחסן — כל דבר במקום הגיוני. components לכאן, לוגיקה לכאן, types לכאן.",
    example:
      "'src/components לקומפוננטות, src/hooks ל-custom hooks, src/types לטיפוסים, src/lib לפונקציות עזר.'",
    whatToMention: [
      "חלוקה לוגית לתיקיות",
      "separation of concerns",
      "שמות משמעותיים",
      "קל להרחיב ולתחזק",
    ],
    commonMistakes: [
      "לשים הכל בקובץ אחד",
      "שמות קבצים לא ברורים",
    ],
    tags: ["פרויקט", "ארכיטקטורה", "code-structure", "ראיון"],
    source: "demo",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
];
