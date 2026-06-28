import type { JobApplication } from "../types/job";
import type { PageName } from "../types/navigation";

type Props = {
  jobs: JobApplication[];
  onNavigate: (page: PageName) => void;
};

const INTERVIEW_STATUSES = new Set([
  "phone_screen",
  "home_assignment",
  "technical_interview",
  "personal_interview",
]);

const HEBREW_DAY_NAMES = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת",
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#c4a882",
  Backend: "#9e8c82",
  QA: "#b89080",
  "Data Analyst": "#8db4a8",
  Cyber: "#a0a8b0",
  Product: "#c8b89a",
  Other: "#c0b8b0",
};

function toLocalDateStr(d = new Date()): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: HEBREW_DAY_NAMES[d.getDay()], date: toLocalDateStr(d) };
  });
}

function DashboardPage({ jobs, onNavigate }: Props) {
  const todayStr = toLocalDateStr();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const weekStartStr = toLocalDateStr(weekStart);
  const weekDays = getLast7Days();

  const stats = {
    total: jobs.length,
    today: jobs.filter((j) => j.appliedAt === todayStr).length,
    thisWeek: jobs.filter(
      (j) =>
        j.appliedAt &&
        j.appliedAt >= weekStartStr &&
        j.appliedAt <= todayStr
    ).length,
    inInterview: jobs.filter((j) => INTERVIEW_STATUSES.has(j.status)).length,
    waiting: jobs.filter((j) => j.status === "waiting").length,
  };

  const dailyCounts = weekDays.map((day) => ({
    label: day.label,
    count: jobs.filter((j) => j.appliedAt === day.date).length,
  }));
  const maxBarCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  const categoryCounts = jobs.reduce(
    (acc, job) => {
      const cat = job.category ?? "Other";
      acc[cat] = (acc[cat] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const total = jobs.length;
  const categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      pct: total > 0 ? count / total : 0,
      color: CATEGORY_COLORS[name] ?? "#c0b8b0",
    }));

  let gradientOffset = 0;
  const gradientParts = categories.map(({ color, pct }) => {
    const start = (gradientOffset * 100).toFixed(1);
    gradientOffset += pct;
    const end = (gradientOffset * 100).toFixed(1);
    return `${color} ${start}% ${end}%`;
  });
  const donutGradient =
    gradientParts.length > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : `conic-gradient(var(--border) 0% 100%)`;

  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">דשבורד</p>
        <h2 className="page__title">סיכום חיפוש העבודה</h2>
        <p className="page__subtitle">פעילות שבעת הימים האחרונים</p>
      </div>

      <div className="stats-grid stats-grid--5">
        <div className="stat-card">
          <strong className="stat-card__number">{stats.total}</strong>
          <span className="stat-card__label">סך הכול משרות</span>
        </div>
        <div className="stat-card">
          <strong className="stat-card__number">{stats.today}</strong>
          <span className="stat-card__label">נשלחו היום</span>
        </div>
        <div className="stat-card">
          <strong className="stat-card__number">{stats.thisWeek}</strong>
          <span className="stat-card__label">נשלחו השבוע</span>
        </div>
        <div className="stat-card stat-card--highlight">
          <strong className="stat-card__number">{stats.inInterview}</strong>
          <span className="stat-card__label">בשלב ראיון</span>
        </div>
        <div className="stat-card">
          <strong className="stat-card__number">{stats.waiting}</strong>
          <span className="stat-card__label">ממתינות לתשובה</span>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <h3 className="card__title">משרות לפי יום</h3>
          <p className="chart-subtitle">שבעת הימים האחרונים</p>
          <div
            className="bar-chart"
            role="img"
            aria-label="תרשים עמודות: משרות לפי יום בשבוע"
          >
            {dailyCounts.map((day) => (
              <div key={day.label + day.count} className="bar-chart__col">
                <span className="bar-chart__count">{day.count}</span>
                <div className="bar-chart__bar-wrapper">
                  <div
                    className="bar-chart__bar"
                    style={{
                      height: `${Math.round((day.count / maxBarCount) * 80)}px`,
                    }}
                  />
                </div>
                <span className="bar-chart__label">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card chart-card">
          <h3 className="card__title">משרות לפי תחום</h3>
          <p className="chart-subtitle">התפלגות לפי קטגוריה</p>
          {total === 0 ? (
            <p className="chart-empty">אין עדיין נתונים להצגה</p>
          ) : (
            <div className="donut-section">
              <div
                className="donut-chart"
                style={{ background: donutGradient }}
                role="img"
                aria-label="תרשים עוגה: התפלגות משרות לפי תחום"
              >
                <div className="donut-chart__hole">
                  <span className="donut-chart__total">{total}</span>
                  <span className="donut-chart__total-label">משרות</span>
                </div>
              </div>
              <ul className="donut-legend">
                {categories.map((cat) => (
                  <li key={cat.name} className="donut-legend__item">
                    <span
                      className="donut-legend__dot"
                      style={{ background: cat.color }}
                      aria-hidden="true"
                    />
                    <span className="donut-legend__name">{cat.name}</span>
                    <span className="donut-legend__count">{cat.count}</span>
                    <span className="donut-legend__pct">
                      {Math.round(cat.pct * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="info-grid">
        <div className="card">
          <h3 className="card__title">פעולות מהירות</h3>
          <p className="card__text">
            עברי לרשימת המשרות להוספת משרה חדשה, או צפי בעמוד משרה קיים.
          </p>
          <div className="btn-row" style={{ marginTop: "16px" }}>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => onNavigate("jobs")}
            >
              + הוספת משרה
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => onNavigate("jobs")}
            >
              רשימת משרות
            </button>
          </div>
        </div>
        <div className="card">
          <h3 className="card__title">מאיפה יגיע המידע</h3>
          <p className="card__text">
            המידע מוזן ידנית דרך טופס הוספת משרה. הנתונים נשמרים מקומית
            בדפדפן במחשב שלך בלבד — ללא שליחה לשרת חיצוני. בהמשך תתוסף
            אפשרות לייצוא וייבוא גיבוי.
          </p>
        </div>
      </div>

      <div className="ai-demo-panel">
        <div className="ai-demo-panel__header">
          <span className="chip chip--demo">דמו בלבד</span>
          <h3 className="ai-demo-panel__title">
            עוזרת AI להכנה לראיון — דמו בלבד
          </h3>
          <p className="ai-demo-panel__subtitle">
            בגרסה המקומית העתידית — ניתוח משרה מקומי, בלי לשלוח מידע לשרת
            חיצוני
          </p>
        </div>
        <div className="ai-demo-panel__form">
          <label className="form-label" htmlFor="ai-demo-input">
            שאלי שאלה על ההכנה לראיון
          </label>
          <div className="ai-demo-panel__input-row">
            <input
              id="ai-demo-input"
              className="form-input"
              placeholder="לדוגמה: אילו שאלות יכולות להיות בראיון לתפקיד Data Analyst?"
              disabled
              aria-disabled="true"
            />
            <button type="button" className="btn btn--primary" disabled>
              שאלי את העוזרת
            </button>
          </div>
        </div>
        <div className="ai-demo-panel__response">
          <p className="ai-demo-panel__response-label">תשובה לדוגמה</p>
          <p className="ai-demo-panel__response-text">
            בגרסה המקומית העתידית, העוזרת תנתח את תיאור המשרה, תשווה אותו
            לפרופיל שלך, ותציע שאלות ותשובות מותאמות — הכל מקומית, בלי לשלוח
            מידע אישי לשרת חיצוני.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
