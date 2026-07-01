import type { ReactNode } from "react";
import type { PageName } from "../types/navigation";

type Props = {
  children: ReactNode;
  activePage: PageName;
  onNavigate: (page: PageName) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

const navItems: { label: string; page: PageName }[] = [
  { label: "דשבורד", page: "dashboard" },
  { label: "מעקב משרות", page: "jobs" },
  { label: "עמוד משרה", page: "job-details" },
  { label: "פרויקטים", page: "projects" },
  { label: "ראיון אישי", page: "personal-interview" },
  { label: "ראיון מקצועי", page: "professional-interview" },
  { label: "הפרופיל שלי", page: "profile" },
];

function AppLayout({
  children,
  activePage,
  onNavigate,
  theme,
  onToggleTheme,
}: Props) {
  return (
    <div className={`app-shell theme-${theme}`} dir="rtl">
      <aside className="sidebar">
        <div className="sidebar__logo">
          <p className="sidebar__app-name">JobPrep AI</p>
          <p className="sidebar__subtitle">מערכת לניהול חיפוש עבודה</p>
        </div>

        <nav className="sidebar__nav" aria-label="ניווט ראשי">
          {navItems.map((item) => (
            <button
              key={item.page}
              className={`nav-item${activePage === item.page ? " active" : ""}`}
              onClick={() => onNavigate(item.page)}
              aria-current={activePage === item.page ? "page" : undefined}
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

        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === "light" ? "עבור למצב לילה" : "עבור למצב יום"}
        >
          {theme === "light" ? "🌙 מצב לילה" : "☀️ מצב יום"}
        </button>

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
