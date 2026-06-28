import { demoJobs } from "../data/demoJobs";
import type { PageName } from "../types/navigation";

type Props = {
  onNavigate: (page: PageName) => void;
};

const INTERVIEW_STATUSES = new Set([
  "phone_screen",
  "home_assignment",
  "technical_interview",
  "personal_interview",
]);

const DEMO_TODAY = "2026-06-28";
const DEMO_WEEK_START = "2026-06-22";

const WEEK_DAYS = [
  { label: "ראשון", date: "2026-06-22" },
  { label: "שני", date: "2026-06-23" },
  { label: "שלישי", date: "2026-06-24" },
  { label: "רביעי", date: "2026-06-25" },
  { label: "חמישי", date: "2026-06-26" },
  { label: "שישי", date: "2026-06-27" },
  { label: "שבת", date: "2026-06-28" },
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

function DashboardPage({ onNavigate }: Props) {
  const stats = {
    total: demoJobs.length,
    today: demoJobs.filter((j) => j.appliedAt === DEMO_TODAY).length,
    thisWeek: demoJobs.filter(
      (j) =>
        j.appliedAt &&
        j.appliedAt >= DEMO_WEEK_START &&
        j.appliedAt <= DEMO_TODAY
    ).length,
    inInterview: demoJobs.filter((j) => INTERVIEW_STATUSES.has(j.status))
      .length,
    waiting: demoJobs.filter((j) => j.status === "waiting").length,
  };

  const dailyCounts = WEEK_DAYS.map((day) => ({
    label: day.label,
    count: demoJobs.filter((j) => j.appliedAt === day.date).length,
  }));
  const maxBarCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  const categoryCounts = demoJobs.reduce(
    (acc, job) => {
      const cat = job.category ?? "Other";
      acc[cat] = (acc[cat] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const total = demoJobs.length;
  const categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      pct: count / total,
      color: CATEGORY_COLORS[name] ?? "#c0b8b0",
    }));

  let gradientOffset = 0;
  const gradientParts = categories.map(({ color, pct }) => {
    const start = (gradientOffset * 100).toFixed(1);
    gradientOffset += pct;
    const end = (gradientOffset * 100).toFixed(1);
    return `${color} ${start}% ${end}%`;
  });
  const donutGradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">דשבורד</p>
        <h2 className="page__title">סיכום חיפוש העבודה</h2>
        <p className="page__subtitle">פעילות השבוע — נתוני דמו בלבד</p>
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
          <p className="chart-subtitle">השבוע הנוכחי — נתוני דמו</p>
          <div
            className="bar-chart"
            role="img"
            aria-label="תרשים עמודות: משרות לפי יום בשבוע"
          >
            {dailyCounts.map((day) => (
              <div key={day.label} className="bar-chart__col">
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
          <p className="chart-subtitle">התפלגות לפי קטגוריה — נתוני דמו</p>
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
              מעקב משרות
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => onNavigate("job-details")}
            >
              עמוד משרה
            </button>
          </div>
        </div>
        <div className="card">
          <h3 className="card__title">מאיפה יגיע המידע</h3>
          <p className="card__text">
            בשלב זה המידע מוזן ידנית. בהמשך תהיה אפשרות לנתח תיאור משרה
            אוטומטית ולקבל שאלות מותאמות מהמערכת — הכל מקומית, ללא שליחת
            מידע לשרת.
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
