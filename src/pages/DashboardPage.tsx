import { useState, useRef } from "react";
import type { JobApplication } from "../types/job";
import type { PageName } from "../types/navigation";
import { parseJobsBackupFile } from "../lib/backup";

type Props = {
  jobs: JobApplication[];
  onNavigate: (page: PageName) => void;
  onExport: () => void;
  onImport: (jobs: JobApplication[]) => void;
};

type BackupMessage = { type: "success" | "error"; text: string };

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

function DashboardPage({ jobs, onNavigate, onExport, onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupMessage, setBackupMessage] = useState<BackupMessage | null>(null);
  const [pendingJobs, setPendingJobs] = useState<JobApplication[] | null>(null);

  function showMessage(msg: BackupMessage) {
    setBackupMessage(msg);
    setTimeout(() => setBackupMessage(null), 4000);
  }

  function handleExportClick() {
    onExport();
    showMessage({ type: "success", text: "קובץ הגיבוי נוצר בהצלחה." });
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    parseJobsBackupFile(file)
      .then((backup) => {
        setPendingJobs(backup.jobs);
        setBackupMessage(null);
      })
      .catch(() => {
        showMessage({ type: "error", text: "קובץ הגיבוי אינו תקין." });
      });
  }

  function confirmImport() {
    if (!pendingJobs) return;
    onImport(pendingJobs);
    setPendingJobs(null);
    showMessage({ type: "success", text: "הגיבוי יובא בהצלחה." });
  }

  function cancelImport() {
    setPendingJobs(null);
  }

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
            בדפדפן באמצעות IndexedDB — ללא שליחה לשרת חיצוני.
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">גיבוי מקומי</h3>
        <p className="card__text">
          הגיבוי נשמר כקובץ מקומי במחשב שלך. אין העלאה לשרת חיצוני.
        </p>
        <div className="btn-row" style={{ marginTop: "16px" }}>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleExportClick}
          >
            ייצוא גיבוי
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={handleImportClick}
          >
            ייבוא גיבוי
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleFileChange}
            aria-label="בחירת קובץ גיבוי לייבוא"
          />
        </div>
        {pendingJobs !== null && (
          <div className="import-confirm" role="alert">
            <span className="import-confirm__text">
              ייבוא גיבוי יחליף את רשימת המשרות הנוכחית. להמשיך?
            </span>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={confirmImport}
              >
                כן, ייבא
              </button>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={cancelImport}
              >
                ביטול
              </button>
            </div>
          </div>
        )}
        {backupMessage && (
          <p
            className={`backup-message backup-message--${backupMessage.type}`}
            role="status"
          >
            {backupMessage.text}
          </p>
        )}
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
