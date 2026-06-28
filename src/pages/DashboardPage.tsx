import { demoJobs } from "../data/demoJobs";
import type { PageName } from "../types/navigation";

type Props = {
  onNavigate: (page: PageName) => void;
};

function DashboardPage({ onNavigate }: Props) {
  const stats = {
    total: demoJobs.length,
    waiting: demoJobs.filter((j) => j.status === "waiting").length,
    phoneScreens: demoJobs.filter((j) => j.status === "phone_screen").length,
  };

  return (
    <div className="page">
      <div className="hero-card">
        <span className="chip chip--teal">מערכת מבוססת משרה</span>
        <h2 className="hero-card__headline">
          לכל עבודה יהיה עמוד מלא משלה, עם שאלות ותשובות מותאמות.
        </h2>
        <p className="hero-card__body">
          המערכת מסייעת לעקוב אחרי כל משרה, לשמור שאלות ותשובות, ולהתכונן
          לראיונות בצורה ממוקדת. כל משרה מקבלת עמוד ייעודי עם הכנה מלאה.
        </p>
        <div className="btn-row">
          <button
            className="btn btn--primary"
            onClick={() => onNavigate("jobs")}
          >
            להוסיף משרה חדשה
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => onNavigate("job-details")}
          >
            לראות עמוד משרה
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <strong className="stat-card__number">{stats.total}</strong>
          <span className="stat-card__label">משרות במעקב</span>
        </div>
        <div className="stat-card">
          <strong className="stat-card__number">0</strong>
          <span className="stat-card__label">שאלות תשובות שמורות</span>
        </div>
        <div className="stat-card">
          <strong className="stat-card__number">2</strong>
          <span className="stat-card__label">פרויקטים לדוגמה</span>
        </div>
        <div className="stat-card">
          <strong className="stat-card__number">{stats.total}</strong>
          <span className="stat-card__label">עמוד אישי לכל משרה</span>
        </div>
      </div>

      <div className="info-grid">
        <div className="card">
          <h3 className="card__title">איך יתבצע ניהול המעקב</h3>
          <p className="card__text">
            כל משרה שמתווספת מקבלת כרטיס עם סטטוס, תאריכים, ציון התאמה
            ופעולה הבאה. ניתן לסנן ולחפש בין המשרות ולעקוב אחרי התהליך.
          </p>
        </div>
        <div className="card">
          <h3 className="card__title">מאיפה יגיע המידע</h3>
          <p className="card__text">
            בשלב זה המידע מוזן ידנית. בהמשך תהיה אפשרות לנתח תיאור משרה
            אוטומטית ולקבל שאלות מותאמות מהמערכת.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
