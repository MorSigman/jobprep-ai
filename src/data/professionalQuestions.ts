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

  // ─── SQL ───────────────────────────────────────────────────────────────────
  {
    id: "sql-001",
    category: "SQL",
    topic: "בסיסי",
    difficulty: "basic",
    question: "מה עושה פקודת SELECT?",
    shortAnswer:
      "SELECT שולפת נתונים מטבלה. ניתן לבחור עמודות ספציפיות או את כולן עם *.  ",
    simpleExplanation:
      "SELECT היא כמו בקשה: 'תראה לי את הנתונים האלה מהטבלה הזאת.' זו הפקודה הנפוצה ביותר ב-SQL.",
    example:
      "SELECT name, email FROM users; — שולף רק את שמות ומיילים של כל המשתמשים.",
    whatToMention: [
      "SELECT בוחרת עמודות",
      "FROM מציינת את הטבלה",
      "* שולף את כל העמודות",
    ],
    commonMistakes: [
      "לשכוח את FROM",
      "להשתמש ב-* בטבלאות גדולות — פוגע בביצועים",
    ],
    tags: ["sql", "select", "שאילתה", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-002",
    category: "SQL",
    topic: "סינון",
    difficulty: "basic",
    question: "איך מסננים רשומות בטבלה?",
    shortAnswer:
      "משתמשים ב-WHERE כדי להגדיר תנאי. רק שורות שעומדות בתנאי יוחזרו.",
    simpleExplanation:
      "WHERE היא כמו מסנן — 'תציג לי רק את המשתמשים שגרים בתל אביב.' בלי WHERE מקבלים הכל.",
    example:
      "SELECT * FROM users WHERE city = 'תל אביב'; — מחזיר רק משתמשים מתל אביב.",
    whatToMention: [
      "WHERE מגדיר את תנאי הסינון",
      "ניתן לשלב תנאים עם AND ו-OR",
      "ניתן להשתמש ב-LIKE לחיפוש טקסט חלקי",
    ],
    commonMistakes: [
      "לכתוב WHERE אחרי GROUP BY",
      "לבלבל בין = לבין == — SQL משתמש ב-=",
    ],
    tags: ["sql", "where", "סינון", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-003",
    category: "SQL",
    topic: "מיון",
    difficulty: "basic",
    question: "איך ממיינים תוצאות לפי עמודה מסוימת?",
    shortAnswer:
      "משתמשים ב-ORDER BY. ניתן לציין ASC לסדר עולה או DESC לסדר יורד.",
    simpleExplanation:
      "ORDER BY היא כמו מיון רשימה — ניתן לבקש שהתוצאות יגיעו מהקטן לגדול או ההפך.",
    example:
      "SELECT * FROM products ORDER BY price DESC; — מציג מוצרים מהיקר לזול.",
    whatToMention: [
      "ASC — סדר עולה (ברירת מחדל)",
      "DESC — סדר יורד",
      "ניתן למיין לפי כמה עמודות",
    ],
    commonMistakes: [
      "לשכוח שברירת המחדל היא ASC",
      "למיין לפי עמודה שלא נמצאת ב-SELECT",
    ],
    tags: ["sql", "order by", "מיון"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-004",
    category: "SQL",
    topic: "JOIN",
    difficulty: "intermediate",
    question: "מה ההבדל בין INNER JOIN ל-LEFT JOIN?",
    shortAnswer:
      "INNER JOIN מחזיר רק שורות שיש להן התאמה בשתי הטבלאות. LEFT JOIN מחזיר את כל שורות הטבלה השמאלית, גם אם אין התאמה בימנית.",
    simpleExplanation:
      "INNER JOIN הוא חיתוך — רק מה שמשותף לשתי הטבלאות. LEFT JOIN הוא כמו לשמור את כל הלקוחות, גם אלה שעוד לא ביצעו הזמנה.",
    example:
      "LEFT JOIN orders ON users.id = orders.user_id — מציג את כל המשתמשים, ולמי שיש הזמנות גם את פרטיהן.",
    whatToMention: [
      "INNER JOIN — שורות עם התאמה בשתי טבלאות",
      "LEFT JOIN — כל שורות הטבלה השמאלית + התאמות",
      "NULL יופיע בעמודות הימניות כשאין התאמה",
    ],
    commonMistakes: [
      "לבלבל LEFT JOIN עם RIGHT JOIN",
      "לא לטפל ב-NULL שנוצר ב-LEFT JOIN",
    ],
    tags: ["sql", "join", "inner join", "left join", "בינוני"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-005",
    category: "SQL",
    topic: "פונקציות צבירה",
    difficulty: "basic",
    question: "למה משתמשים ב-COUNT, SUM, AVG?",
    shortAnswer:
      "COUNT סופר שורות, SUM מחשב סכום, AVG מחשב ממוצע. הן נקראות פונקציות צבירה ומאפשרות לנתח קבוצות של נתונים.",
    simpleExplanation:
      "הן כמו מחשבון שעובד על כל הטבלה — כמה משתמשים יש, מה סכום המכירות, מה המחיר הממוצע.",
    example:
      "SELECT COUNT(*) FROM orders; — מחזיר כמה הזמנות יש בסך הכל.",
    whatToMention: [
      "COUNT — ספירת שורות",
      "SUM — סכום ערכים",
      "AVG — ממוצע",
      "MIN / MAX — ערך מינימלי ומקסימלי",
    ],
    commonMistakes: [
      "COUNT(*) לעומת COUNT(column) — ההבדל ב-NULL",
      "להשתמש בפונקציות צבירה בלי GROUP BY כשנדרש",
    ],
    tags: ["sql", "count", "sum", "avg", "aggregate"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-006",
    category: "SQL",
    topic: "קיבוץ",
    difficulty: "intermediate",
    question: "מתי צריך להשתמש ב-GROUP BY?",
    shortAnswer:
      "כשרוצים לחשב סטטיסטיקה לפי קבוצה, למשל מספר הזמנות לכל לקוח. GROUP BY מקבץ שורות לפי ערך עמודה.",
    simpleExplanation:
      "GROUP BY הוא כמו לסדר נתונים לתאים — 'כמה מכירות היו בכל חודש?' מחלק את הנתונים לחודשים ומחשב לכל אחד.",
    example:
      "SELECT city, COUNT(*) FROM users GROUP BY city; — מציג כמה משתמשים יש בכל עיר.",
    whatToMention: [
      "GROUP BY מאגד שורות לפי עמודה",
      "לרוב משולב עם פונקציות צבירה",
      "HAVING מסנן אחרי הקיבוץ (במקום WHERE)",
    ],
    commonMistakes: [
      "לשים WHERE אחרי GROUP BY — צריך HAVING",
      "לשכוח לכלול עמודות ב-SELECT שאינן ב-GROUP BY",
    ],
    tags: ["sql", "group by", "קיבוץ", "בינוני"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-007",
    category: "SQL",
    topic: "NULL",
    difficulty: "basic",
    question: "איך מתמודדים עם ערכי NULL?",
    shortAnswer:
      "NULL הוא ערך חסר — לא אפס ולא מחרוזת ריקה. משתמשים ב-IS NULL / IS NOT NULL לבדיקה, וב-COALESCE להחלפה בערך ברירת מחדל.",
    simpleExplanation:
      "NULL הוא כמו שדה ריק בטופס — לא ידוע. לא ניתן להשוות NULL עם = ; חייבים להשתמש ב-IS NULL.",
    example:
      "SELECT * FROM users WHERE phone IS NULL; — מוצא משתמשים ללא טלפון.",
    whatToMention: [
      "IS NULL / IS NOT NULL לבדיקה",
      "COALESCE מחזיר ערך ברירת מחדל אם הערך הוא NULL",
      "פונקציות צבירה מתעלמות מ-NULL",
    ],
    commonMistakes: [
      "לכתוב WHERE phone = NULL — לא עובד",
      "לא לטפל ב-NULL בחיבור מחרוזות",
    ],
    tags: ["sql", "null", "is null", "coalesce"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-008",
    category: "SQL",
    topic: "כפילויות",
    difficulty: "intermediate",
    question: "איך תמצאי רשומות כפולות בטבלה?",
    shortAnswer:
      "משתמשים ב-GROUP BY על העמודה הרלוונטית ו-HAVING COUNT(*) > 1 כדי לסנן קבוצות עם יותר מרשומה אחת.",
    simpleExplanation:
      "מקבצים לפי הערך שאנחנו חושדים שהוא כפול, ואז מסננים רק קבוצות עם יותר מאחד.",
    example:
      "SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1; — מוצא מיילים שמופיעים פעמיים או יותר.",
    whatToMention: [
      "GROUP BY + HAVING COUNT(*) > 1",
      "DISTINCT למניעת כפילויות בפלט",
      "ניתן למחוק כפילויות עם DELETE + subquery",
    ],
    commonMistakes: [
      "לשכוח HAVING ולנסות לסנן עם WHERE",
      "לחפש כפילויות לפי עמודה לא ייחודית",
    ],
    tags: ["sql", "duplicates", "group by", "having", "בינוני"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-009",
    category: "SQL",
    topic: "שאילתות מורכבות",
    difficulty: "intermediate",
    question: "איך היית בונה שאילתה שמציגה מכירות לפי חודש?",
    shortAnswer:
      "חולצים את החודש מתאריך המכירה עם DATE_TRUNC או MONTH(), מקבצים לפי חודש, ומחשבים סכום.",
    simpleExplanation:
      "לוקחים את כל המכירות, שואלים 'לאיזה חודש שייכת כל מכירה?', מקבצים לפי חודש, ומחשבים כמה נמכר בכל אחד.",
    example:
      "SELECT MONTH(sale_date) AS month, SUM(amount) FROM sales GROUP BY MONTH(sale_date) ORDER BY month;",
    whatToMention: [
      "חילוץ חודש מתאריך — MONTH() / DATE_TRUNC",
      "GROUP BY לקיבוץ לפי חודש",
      "SUM לסיכום הסכומים",
      "ORDER BY להצגה כרונולוגית",
    ],
    commonMistakes: [
      "לשכוח לקבץ לפי אותה פונקציה שבה מציגים",
      "להשוות תאריכים עם = במקום BETWEEN",
    ],
    tags: ["sql", "group by", "date", "sum", "בינוני"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "sql-010",
    category: "SQL",
    topic: "ביצועים",
    difficulty: "intermediate",
    question: "מה יכול לגרום לשאילתה להיות איטית?",
    shortAnswer:
      "שאילתה איטית יכולה לנבוע מטבלה גדולה ללא אינדקס, שימוש ב-SELECT *, JOIN על עמודות לא ממופתחות, או סינון לא יעיל.",
    simpleExplanation:
      "SQL חייב לעבור על נתונים כדי למצוא מה שביקשת. בלי אינדקס, הוא עובר על כל שורה — כמו לחפש בספר בלי תוכן עניינים.",
    example:
      "SELECT * FROM orders WHERE YEAR(created_at) = 2024 — לא מנצל אינדקס; עדיף: WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'.",
    whatToMention: [
      "היעדר אינדקס על עמודות JOIN / WHERE",
      "שימוש ב-SELECT * בטבלאות גדולות",
      "N+1 queries",
      "חישובים על עמודות ב-WHERE מונעים שימוש באינדקס",
    ],
    commonMistakes: [
      "להוסיף אינדקס לכל עמודה — פוגע בביצועי כתיבה",
      "לא לבדוק את ה-EXPLAIN לפני אופטימיזציה",
    ],
    tags: ["sql", "ביצועים", "index", "optimize", "בינוני"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },

  // ─── Backend ────────────────────────────────────────────────────────────────
  {
    id: "be-001",
    category: "Backend",
    topic: "תפקיד השרת",
    difficulty: "basic",
    question: "מה תפקיד השרת במערכת?",
    shortAnswer:
      "השרת מקבל בקשות מהלקוח, מעבד אותן, שולח לבסיס הנתונים אם צריך, ומחזיר תשובה. הוא האמצע בין ה-UI לבין הנתונים.",
    simpleExplanation:
      "השרת הוא כמו מלצר במסעדה — הלקוח מזמין, המלצר מעביר למטבח (מסד נתונים), ומחזיר את האוכל (התשובה).",
    example:
      "הדפדפן שולח GET /users — השרת מושך מהDB ומחזיר JSON עם רשימת המשתמשים.",
    whatToMention: [
      "מקבל HTTP requests",
      "מבצע לוגיקה עסקית",
      "מתקשר עם מסד נתונים",
      "מחזיר תשובה ללקוח",
    ],
    commonMistakes: [
      "לשים לוגיקה עסקית בצד הלקוח",
      "לבלבל בין שרת לבין מסד נתונים",
    ],
    tags: ["backend", "server", "client-server", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-002",
    category: "Backend",
    topic: "API ו-Database",
    difficulty: "basic",
    question: "מה ההבדל בין API לבין Database?",
    shortAnswer:
      "API הוא ממשק תקשורת שחושף פעולות. Database הוא מקום אחסון הנתונים. השרת קורא לAPI שלו עצמו או לשירותים חיצוניים, ושומר / שולף נתונים מה-DB.",
    simpleExplanation:
      "API הוא כמו תפריט המסעדה — מה ניתן לבקש. Database הוא המחסן שבו המצרכים שמורים.",
    example:
      "POST /api/users שולח נתונים לשרת (API). השרת שומר את זה ב-users table (Database).",
    whatToMention: [
      "API — ממשק לתקשורת",
      "Database — אחסון נתונים",
      "השרת הוא שמחבר ביניהם",
    ],
    commonMistakes: [
      "לחשוב שAPI הוא בסיס נתונים",
      "לגשת ישירות ל-DB מהצד של הלקוח",
    ],
    tags: ["backend", "api", "database", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-003",
    category: "Backend",
    topic: "זרימת בקשה",
    difficulty: "basic",
    question: "מה קורה כשמשתמש לוחץ על כפתור ששולח מידע לשרת?",
    shortAnswer:
      "הדפדפן שולח HTTP request עם הנתונים. השרת מקבל, מאמת, מעבד ושומר ב-DB, ואז מחזיר תשובה. הממשק מתעדכן לפי התשובה.",
    simpleExplanation:
      "זה כמו לשלוח מכתב — הדפדפן שולח בקשה, השרת פותח, מעבד, ושולח חזרה תשובה. הכל קורה תוך מילישניות.",
    example:
      "לחיצה על 'שמור' שולחת POST עם הנתונים. השרת בודק, שומר ב-DB, ומחזיר {success: true}.",
    whatToMention: [
      "HTTP request מהלקוח",
      "אימות ועיבוד בשרת",
      "שמירה ב-DB",
      "HTTP response חזרה ללקוח",
    ],
    commonMistakes: [
      "לשכוח לטפל בשגיאות בצד הלקוח",
      "לחשוב שהפעולה מיידית — יש latency",
    ],
    tags: ["backend", "http", "request", "response", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-004",
    category: "Backend",
    topic: "חיבור ל-DB",
    difficulty: "basic",
    question: "למה שרת צריך להתחבר לבסיס נתונים?",
    shortAnswer:
      "כדי לשמור ולשלוף נתונים באופן קבוע. בלי DB, הנתונים נמחקים עם כל הפעלה מחדש של השרת.",
    simpleExplanation:
      "זיכרון השרת הוא זמני — כמו לוח מחיק. DB הוא קבוע — כמו פנקס. כל נתון שצריך לשרוד חייב להישמר ב-DB.",
    example:
      "משתמש נרשם → השרת שומר את הפרטים ב-users table ב-DB → בהתחברות הבאה שולף אותם משם.",
    whatToMention: [
      "אחסון קבוע לעומת זיכרון זמני",
      "שאילתות לשליפה ועדכון",
      "connection pool לניהול חיבורים",
    ],
    commonMistakes: [
      "לשמור נתונים קריטיים בזיכרון השרת",
      "לפתוח חיבור DB חדש לכל בקשה",
    ],
    tags: ["backend", "database", "connection", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-005",
    category: "Backend",
    topic: "אבטחה",
    difficulty: "basic",
    question: "מה זה Authentication?",
    shortAnswer:
      "Authentication היא אימות זהות — 'מי את?' השרת בודק שהמשתמש הוא מי שהוא טוען להיות, בדרך כלל עם שם משתמש וסיסמה.",
    simpleExplanation:
      "Authentication הוא כמו כניסה לבניין עם תעודת זהות — מוכיחים מי אנחנו. אחרי שמוכיחים, מקבלים token לשימוש עתידי.",
    example:
      "POST /login עם email + password → השרת בודק מה שב-DB → מחזיר JWT token אם הפרטים נכונים.",
    whatToMention: [
      "אימות זהות המשתמש",
      "שימוש נפוץ: JWT, session cookies",
      "הסיסמה מאוחסנת כ-hash, לא כטקסט",
    ],
    commonMistakes: [
      "לשמור סיסמאות כטקסט רגיל",
      "לבלבל בין Authentication ל-Authorization",
    ],
    tags: ["backend", "authentication", "security", "jwt"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-006",
    category: "Backend",
    topic: "אבטחה",
    difficulty: "basic",
    question: "מה זה Authorization?",
    shortAnswer:
      "Authorization היא הרשאה — 'מה מותר לך לעשות?' אחרי שהמשתמש זוהה, השרת בודק האם יש לו הרשאה לפעולה המבוקשת.",
    simpleExplanation:
      "Authentication הוא 'מי אתה', Authorization הוא 'מה מותר לך'. לדוגמה, כל משתמש יכול להיכנס, אבל רק admin יכול למחוק תוכן.",
    example:
      "משתמש מחובר מנסה למחוק משתמש אחר → השרת בודק תפקיד → מחזיר 403 Forbidden כי הוא לא admin.",
    whatToMention: [
      "הרשאה לפעולה לאחר אימות",
      "תפקידים (roles): admin, user, editor",
      "HTTP 403 Forbidden כשאין הרשאה",
    ],
    commonMistakes: [
      "לסמוך רק על הצד הלקוח לבדיקת הרשאות",
      "לבלבל 401 Unauthorized עם 403 Forbidden",
    ],
    tags: ["backend", "authorization", "security", "roles", "permissions"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-007",
    category: "Backend",
    topic: "אבטחה",
    difficulty: "basic",
    question: "למה צריך לבדוק קלט שמגיע מהמשתמש?",
    shortAnswer:
      "כדי למנוע מתקפות כמו SQL Injection ו-XSS. תמיד להניח שקלט ממשתמש עלול להיות זדוני.",
    simpleExplanation:
      "אם שדה שם מקבל כל טקסט, תוקף יכול לשים SQL בתוכו ולמחוק את כל הDB. Validation ו-sanitization מונעים את זה.",
    example:
      "שם משתמש שהוגש: 'Alice'; DROP TABLE users; — בלי validation זה יכול לקרוס את כל ה-DB.",
    whatToMention: [
      "SQL Injection — קלט זדוני בשאילתות",
      "XSS — סקריפט זדוני בפלט HTML",
      "validation — בדיקת פורמט וארוך",
      "sanitization — ניקוי תווים מסוכנים",
    ],
    commonMistakes: [
      "לסמוך רק על validation בצד הלקוח",
      "לשרשר קלט משתמש ישירות לשאילתת SQL",
    ],
    tags: ["backend", "security", "validation", "sql injection", "xss"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-008",
    category: "Backend",
    topic: "טיפול בשגיאות",
    difficulty: "basic",
    question: "איך שרת צריך להגיב אם משהו נכשל?",
    shortAnswer:
      "להחזיר קוד HTTP מתאים (4xx לשגיאת לקוח, 5xx לשגיאת שרת) עם הודעה ברורה. לא לחשוף פרטים טכניים רגישים.",
    simpleExplanation:
      "כשמשהו נכשל, השרת לא אמור להתעלם ולא לקרוס שקט. הוא מחזיר קוד מתאים עם הסבר — כמו שלט 'לא נמצא' על דלת.",
    example:
      "משתמש לא נמצא → 404 Not Found עם { error: 'User not found' }. שגיאה בDB → 500 Internal Server Error.",
    whatToMention: [
      "4xx — שגיאה של הלקוח",
      "5xx — שגיאה של השרת",
      "הודעת שגיאה ברורה אך לא חושפת פרטים פנימיים",
      "לוגים לניתוח שגיאות",
    ],
    commonMistakes: [
      "להחזיר 200 OK עם שגיאה בתוך הגוף",
      "לחשוף stack trace ללקוח",
    ],
    tags: ["backend", "error handling", "http status", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-009",
    category: "Backend",
    topic: "REST API",
    difficulty: "basic",
    question: "מה זה REST API?",
    shortAnswer:
      "REST הוא סגנון ארכיטקטורה לבניית API. משתמש ב-HTTP methods (GET, POST, PUT, DELETE) ובנתיבים (endpoints) להגדרת פעולות על משאבים.",
    simpleExplanation:
      "REST API הוא כמו שפה מוסכמת בין הדפדפן לשרת — GET שולף, POST יוצר, PUT מעדכן, DELETE מוחק. הכל דרך URL ברור.",
    example:
      "GET /users — רשימת משתמשים. POST /users — יצירת משתמש. DELETE /users/5 — מחיקת משתמש 5.",
    whatToMention: [
      "HTTP methods: GET, POST, PUT, DELETE",
      "Stateless — כל בקשה עצמאית",
      "JSON כפורמט נתונים נפוץ",
      "Endpoints מייצגים משאבים",
    ],
    commonMistakes: [
      "להשתמש ב-GET לפעולות שמשנות נתונים",
      "לערבב שמות פעולות בURL כמו /getUser",
    ],
    tags: ["backend", "rest", "api", "http", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "be-010",
    category: "Backend",
    topic: "HTTP Status Codes",
    difficulty: "basic",
    question: "מה ההבדל בין 200, 400 ו-500?",
    shortAnswer:
      "200 — הצלחה. 400 — שגיאה של הלקוח (בקשה לא תקינה). 500 — שגיאה בשרת.",
    simpleExplanation:
      "קודי HTTP הם כמו תגובות במסעדה: 200 'הנה ההזמנה שלך', 400 'הזמנת משהו שלא קיים בתפריט', 500 'המטבח נשרף'.",
    example:
      "POST /login עם מייל לא תקין → 400. שגיאה בDB → 500. התחברות הצליחה → 200 עם token.",
    whatToMention: [
      "2xx — הצלחה",
      "4xx — שגיאת לקוח (404 not found, 401 unauthorized, 403 forbidden)",
      "5xx — שגיאת שרת",
      "301 / 302 — redirect",
    ],
    commonMistakes: [
      "להחזיר 200 עם שגיאה בתוכן",
      "לבלבל 401 (לא מזוהה) עם 403 (אין הרשאה)",
    ],
    tags: ["backend", "http", "status codes", "בסיסי"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },

  // ─── Technical Thinking ─────────────────────────────────────────────────────
  {
    id: "tt-001",
    category: "Technical Thinking",
    topic: "פירוק בעיה",
    difficulty: "basic",
    question: "איך היית מפרקת בעיה גדולה לשלבים קטנים?",
    shortAnswer:
      "מתחילים להבין מה הפלט הרצוי, אחר כך שוברים את הדרך לשם לצעדים קטנים שניתן לבצע ולבדוק אחד אחד.",
    simpleExplanation:
      "כמו לבנות פאזל — לא מנסים לפתור הכל בבת אחת. קודם מסדרים את המסגרת, אחר כך ממלאים פנימה.",
    example:
      "'בנה דף הרשמה' → פרוק: 1. HTML form. 2. validation. 3. שליחה לשרת. 4. טיפול בתשובה. 5. הצגת הודעת הצלחה.",
    whatToMention: [
      "להבין את המטרה לפני שמתחילים",
      "לפרק לצעדים ניתנים לבדיקה",
      "לפתור ולאמת כל שלב לפני הבא",
    ],
    commonMistakes: [
      "להתחיל לכתוב קוד לפני שמבינים את הבעיה",
      "לנסות לפתור הכל בו-זמנית",
    ],
    tags: ["חשיבה", "problem solving", "פירוק", "תכנון"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tt-002",
    category: "Technical Thinking",
    topic: "Debugging",
    difficulty: "basic",
    question: "איך תחליטי מה לבדוק קודם כשמשהו לא עובד?",
    shortAnswer:
      "מתחילים מהסיבות הכי סבירות — האם הנתונים מגיעים? האם ה-network request עבר? מצמצמים בהדרגה עד שמוצאים את נקודת הכשל.",
    simpleExplanation:
      "Debugging הוא כמו לחפש חשמל שנכבה — בודקים קודם את האביזר, אחר כך השקע, אחר כך המפסק. עוברים מהסבירות הגבוהה לנמוכה.",
    example:
      "כפתור לא שומר: 1. בדיקת console.log שהנתונים קיימים. 2. בדיקת Network tab שה-request יצא. 3. בדיקת שגיאת שרת.",
    whatToMention: [
      "להתחיל מהכי סביר",
      "לבדוק שלב אחד בכל פעם",
      "להשתמש ב-console.log / breakpoints",
      "לקרוא הודעות שגיאה לפני לנחש",
    ],
    commonMistakes: [
      "לשנות כמה דברים בו זמנית ולא לדעת מה עזר",
      "להתעלם מהודעות שגיאה",
    ],
    tags: ["debugging", "חשיבה", "problem solving"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tt-003",
    category: "Technical Thinking",
    topic: "אימות פתרון",
    difficulty: "basic",
    question: "איך תוודאי שהפתרון שלך באמת עובד?",
    shortAnswer:
      "בודקים את ה-happy path, אחר כך קלט לא תקין, מקרי קצה, ובאגים שהיו בעבר. לא מסתמכים רק על 'נראה טוב'.",
    simpleExplanation:
      "לבדוק פתרון זה לא רק 'האם עובד עם קלט רגיל?' — גם 'מה קורה אם הקלט ריק? שגוי? קצה?'",
    example:
      "טופס הרשמה: בדיקת הרשמה רגילה, הרשמה עם מייל כפול, הרשמה בלי שם, ובהתחברות מחדש אחר כך.",
    whatToMention: [
      "Happy path",
      "קלט לא תקין ומקרי קצה",
      "regression — לוודא שלא שברנו משהו אחר",
      "אחרים מבינים ומשתמשים בזה?",
    ],
    commonMistakes: [
      "לבדוק רק את הנתיב המוצלח",
      "להכריז שהפיצ'ר 'מוכן' לפני בדיקה ידנית",
    ],
    tags: ["testing", "validation", "קצה", "חשיבה"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tt-004",
    category: "Technical Thinking",
    topic: "למידה עצמאית",
    difficulty: "basic",
    question: "איך תתמודדי עם משימה בטכנולוגיה שלא עבדת איתה?",
    shortAnswer:
      "מתחילים בתיעוד הרשמי ודוגמאות קצרות. בונים proof of concept פשוט לפני שנוגעים בקוד הראשי. שואלים כשתקועים.",
    simpleExplanation:
      "כמו לנהוג ברכב חדש — לא עוזב את חניה בלי להבין את הבסיס. קוראים, מנסים קטן, ואז בונים.",
    example:
      "צריך לעבוד עם Redis לראשונה → קוראים את quick start, בונים hello world, מנסים פקודה פשוטה, ורק אז מכניסים לפרויקט.",
    whatToMention: [
      "תיעוד רשמי כנקודת התחלה",
      "proof of concept מינימלי לפני אינטגרציה",
      "לא להתבייש לשאול",
      "לפרק לחתיכות קטנות",
    ],
    commonMistakes: [
      "לצלול לקוד ייצור בלי הבנה בסיסית",
      "להסתמך רק על Stack Overflow בלי להבין את הפתרון",
    ],
    tags: ["למידה", "עצמאות", "חשיבה", "טכנולוגיה חדשה"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tt-005",
    category: "Technical Thinking",
    topic: "תקשורת",
    difficulty: "basic",
    question: "איך תסבירי משהו טכני לאדם לא טכני?",
    shortAnswer:
      "משתמשים באנלוגיות מהחיים, נמנעים מז'רגון, ומתמקדים בתוצאה ולא בפרטים הטכניים.",
    simpleExplanation:
      "מדברים על 'מה זה עושה עבורך' ולא 'איך זה עובד מבפנים'. אנלוגיה טובה שווה אלף מילים טכניות.",
    example:
      "API: 'דמיין שאת בשאלה בסגנון. האדם השואל הוא הלקוח, המלצר הוא ה-API, והמטבח הוא המערכת.'",
    whatToMention: [
      "אנלוגיות מהחיים",
      "להימנע מז'רגון",
      "להתמקד ב-'מה זה עושה' ולא 'איך'",
      "לשאול האם הסבר הובן",
    ],
    commonMistakes: [
      "להניח שכולם יודעים את המינוחים הטכניים",
      "להסביר יותר מדי — לאבד את הקהל",
    ],
    tags: ["תקשורת", "חשיבה", "הסבר", "soft skills"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tt-006",
    category: "Technical Thinking",
    topic: "עדיפויות",
    difficulty: "basic",
    question: "אם יש לך כמה באגים, איך תחליטי במה לטפל קודם?",
    shortAnswer:
      "לפי חומרה והשפעה — באג שמונע שימוש בפיצ'ר קריטי קודם לפני באג אסתטי. שואלים מה פוגע הכי הרבה במשתמש.",
    simpleExplanation:
      "כמו רופא מיון — לא מטפלים לפי סדר הגעה אלא לפי חומרה. קודם מה שמסוכן, אחר כך מה שמציק.",
    example:
      "באג שמונע כניסה למערכת — דחוף. באג שמציג תאריך בפורמט שגוי — פחות דחוף.",
    whatToMention: [
      "חומרה — כמה פוגע במשתמש",
      "תדירות — כמה משתמשים נפגעים",
      "מורכבות התיקון",
      "תלויות — האם חוסם דברים אחרים",
    ],
    commonMistakes: [
      "לתקן מה שקל קודם במקום מה שחשוב",
      "לא לתקשר עדיפויות עם הצוות",
    ],
    tags: ["עדיפויות", "bugs", "חשיבה", "prioritization"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tt-007",
    category: "Technical Thinking",
    topic: "שיפור",
    difficulty: "intermediate",
    question: "איך היית משפרת פיצ׳ר שכבר עובד?",
    shortAnswer:
      "קודם מבינים איפה הכאב — האם זה ביצועים, קריאות הקוד, UX, או כיסוי edge cases. אחר כך מטפלים בנקודה הכי בעייתית.",
    simpleExplanation:
      "לשפר פיצ'ר שעובד זה כמו לשפץ דירה — לא פורקים הכל, מזהים מה מציק הכי הרבה ומתחילים משם.",
    example:
      "חיפוש שעובד אבל איטי → מוסיפים debounce, מאנדקסים את הDB, ואז בודקים שוב עם נתונים גדולים.",
    whatToMention: [
      "להבין מהו הבעיה לפני שמשנים",
      "לשנות ולמדוד — לא לנחש",
      "לא לשבור מה שעובד",
      "regression testing אחרי שינוי",
    ],
    commonMistakes: [
      "לשפר בלי מדידה — לא יודעים אם עזר",
      "לרפקטור הכל בבת אחת",
    ],
    tags: ["שיפור", "refactor", "ביצועים", "חשיבה"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tt-008",
    category: "Technical Thinking",
    topic: "חקירת נתונים",
    difficulty: "intermediate",
    question: "אם מספר בדשבורד נראה לא הגיוני, איך תבדקי את זה?",
    shortAnswer:
      "קודם מאמתים את המקור — מאיפה המספר מגיע? בודקים את ה-query, את הפילטרים, ואת הנתונים הגולמיים מול הצפוי.",
    simpleExplanation:
      "לא מאמינים לדשבורד עיוור — חוזרים למקור. כמו לבדוק חשבון בנק — לא מסתמכים על הכותרת, בודקים את הפירוט.",
    example:
      "מכירות חודשיות נראות 0 → בודקים: האם הפילטר נכון? האם ה-query נכון? האם יש נתונים ב-DB בכלל?",
    whatToMention: [
      "לאתר את מקור הנתון",
      "לבדוק את ה-query / הלוגיקה",
      "לבדוק פילטרים ופרמטרים",
      "להשוות מול נתון ידוע",
    ],
    commonMistakes: [
      "לדווח על בעיה לפני בדיקה עצמית",
      "להניח שהקוד נכון ולחפש בנתונים בלבד",
    ],
    tags: ["נתונים", "debugging", "חשיבה", "data analysis"],
    source: "demo",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
];
