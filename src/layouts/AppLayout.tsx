import type { ReactNode } from "react";
import type { PageName } from "../types/navigation";

type Props = {
  children: ReactNode;
  activePage: PageName;
  onNavigate: (page: PageName) => void;
};

const navItems: { label: string; page: PageName }[] = [
  { label: "דשבורד", page: "dashboard" },
  { label: "מעקב משרות", page: "jobs" },
  { label: "עמוד משרה", page: "job-details" },
  { label: "פרויקטים", page: "projects" },
  { label: "ראיון אישי", page: "personal-interview" },
];

function AppLayout({ children, activePage, onNavigate }: Props) {
  return (
    <div className="app-shell" dir="rtl">
      <aside className="sidebar">
        <div className="sidebar__logo">
          <p className="sidebar__app-name">Job Search Hub</p>
          <p className="sidebar__subtitle">מערכת לניהול חיפוש עבודה</p>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.page}
              className={`nav-item${activePage === item.page ? " active" : ""}`}
              onClick={() => onNavigate(item.page)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar__logic-card">
          <p className="sidebar__logic-title">הלוגיקה של המערכת</p>
          <p className="sidebar__logic-text">
            את מעלה פרטים + לינק משרה.{"\n"}
            לכל משרה נשמר כרטיס מלא משלה.{"\n"}
            בלחיצה על משרה נפתח עמוד ייעודי.{"\n"}
            באותו עמוד רואים שאלות, תשובות, ידע מקצועי והכנה אישית.
          </p>
        </div>

        <div className="demo-notice">
          <span className="demo-notice__label">מצב דמו</span>
          הנתונים המוצגים כאן פיקטיביים בלבד. בגרסה המקומית האמיתית, המידע
          האישי נשמר רק על המחשב של המשתמשת.
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default AppLayout;
