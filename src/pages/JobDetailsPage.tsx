import { useState } from "react";
import type { JobApplication } from "../types/job";

const statusLabels: Record<string, string> = {
  saved: "שמורה",
  applied: "הוגשה",
  waiting: "ממתינה",
  phone_screen: "שיחה טלפונית",
  home_assignment: "מטלת בית",
  technical_interview: "ראיון טכני",
  personal_interview: "ראיון אישי",
  offer: "הצעה",
  rejected: "נדחתה",
};

type Tab = "phone" | "professional" | "personal";

const tabLabels: { id: Tab; label: string }[] = [
  { id: "phone", label: "שיחה טלפונית" },
  { id: "professional", label: "ראיון מקצועי" },
  { id: "personal", label: "ראיון אישי" },
];

const demoQuestions: Record<Tab, { q: string; a: string }[]> = {
  phone: [
    {
      q: "ספרי על עצמך בקצרה.",
      a: "אני מפתחת פרונטאנד עם ניסיון ב-React ו-TypeScript. אני מחפשת תפקיד ראשון בהייטק.",
    },
    {
      q: "למה את מעוניינת בחברה שלנו?",
      a: "נתון דמו — תשובה תותאם למשרה ספציפית.",
    },
  ],
  professional: [
    {
      q: "מה ההבדל בין state ל-props ב-React?",
      a: "State הוא מידע פנימי של קומפוננטה. Props הוא מידע שמועבר מקומפוננטת אב.",
    },
    {
      q: "מה זה TypeScript ולמה משתמשים בו?",
      a: "TypeScript הוא JavaScript עם טיפוסים סטטיים. משתמשים בו למניעת באגים ולשיפור תחזוקה.",
    },
  ],
  personal: [
    {
      q: "ספרי על חולשה שלך.",
      a: "נתון דמו — תשובה תותאם למשרה ספציפית.",
    },
    {
      q: "איפה את רואה את עצמך בעוד שנתיים?",
      a: "נתון דמו — תשובה תותאם למשרה ספציפית.",
    },
  ],
};

type Props = {
  job: JobApplication;
  onBack: () => void;
};

function JobDetailsPage({ job, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("phone");

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>
        חזרה לרשימת המשרות
      </button>

      <div className="card">
        <div className="job-details-header">
          <div>
            <h2 className="job-details-company">{job.companyName}</h2>
            <p className="job-details-role">{job.roleTitle}</p>
          </div>
          <span className={`status-badge status-badge--${job.status}`}>
            {statusLabels[job.status] ?? job.status}
          </span>
        </div>

        <div className="details-grid">
          <div className="details-grid__item">
            <span className="details-grid__label">מקור</span>
            <span className="details-grid__value">{job.source}</span>
          </div>
          {job.resumeVersion && (
            <div className="details-grid__item">
              <span className="details-grid__label">קורות חיים</span>
              <span className="details-grid__value">{job.resumeVersion}</span>
            </div>
          )}
          {job.appliedAt && (
            <div className="details-grid__item">
              <span className="details-grid__label">תאריך הגשה</span>
              <span className="details-grid__value">{job.appliedAt}</span>
            </div>
          )}
          {job.followUpAt && (
            <div className="details-grid__item">
              <span className="details-grid__label">מעקב</span>
              <span className="details-grid__value">{job.followUpAt}</span>
            </div>
          )}
          {job.matchScore !== undefined && (
            <div className="details-grid__item">
              <span className="details-grid__label">ציון התאמה</span>
              <span className="details-grid__value">{job.matchScore}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-row">
        <div className="card card--grow">
          <h3 className="card__title">תיאור המשרה</h3>
          <p className="card__text">{job.jobDescription}</p>
        </div>
        {job.nextAction && (
          <div className="card card--accent">
            <h3 className="card__title">פעולה הבאה</h3>
            <p className="card__text">{job.nextAction}</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="tab-bar">
          {tabLabels.map((t) => (
            <button
              key={t.id}
              className={`tab-btn${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="qa-list">
          {demoQuestions[activeTab].map((item, i) => (
            <div key={i} className="qa-item">
              <p className="qa-item__question">{item.q}</p>
              <p className="qa-item__answer">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;
