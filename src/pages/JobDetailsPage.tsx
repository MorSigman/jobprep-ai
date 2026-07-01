import { useState, useEffect } from "react";
import type { JobApplication } from "../types/job";
import type { UserProfile } from "../types/profile";
import AddJobForm from "../components/AddJobForm";
import {
  generateCvTailoringSuggestions,
  isProfileEmpty,
  type CvTailoringSuggestions,
} from "../lib/cvTailoring";

const STATUS_LABELS: Record<string, string> = {
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

type PrepField =
  | "companyResearch"
  | "keyRequirements"
  | "skillsToLearn"
  | "phoneScreenNotes"
  | "technicalQuestions"
  | "personalQuestions"
  | "relevantProjects"
  | "interviewNotes"
  | "followUpMessageDraft";

const PREP_SECTIONS: { field: PrepField; title: string; helper: string }[] = [
  {
    field: "companyResearch",
    title: "מחקר על החברה",
    helper: "כתבי מה שמצאת על החברה — מוצרים, תרבות, לקוחות, גיוסים אחרונים.",
  },
  {
    field: "keyRequirements",
    title: "דרישות מרכזיות מהמשרה",
    helper: "העתיקי את הדרישות החשובות ביותר מתיאור המשרה.",
  },
  {
    field: "skillsToLearn",
    title: "מה אני צריכה ללמוד",
    helper: "ציינו טכנולוגיות, כישורים או נושאים שכדאי לחזק לפני הראיון.",
  },
  {
    field: "phoneScreenNotes",
    title: "הכנה לשיחה טלפונית",
    helper: "רשמי נקודות עיקריות שתרצי להגיד בשיחה הראשונה עם המגייסת.",
  },
  {
    field: "technicalQuestions",
    title: "שאלות מקצועיות אפשריות",
    helper: "כתבי שאלות טכניות שעלולות לעלות בראיון ותשובות מוצעות.",
  },
  {
    field: "personalQuestions",
    title: "שאלות אישיות אפשריות",
    helper: "כתבי שאלות אישיות / התנהגותיות צפויות ותשובות מוצעות.",
  },
  {
    field: "relevantProjects",
    title: "פרויקטים רלוונטיים שלי",
    helper: "ציינו אילו פרויקטים מ-GitHub שלך רלוונטיים לתפקיד זה ולמה.",
  },
  {
    field: "interviewNotes",
    title: "הערות אחרי שיחה / ראיון",
    helper: "לאחר כל שיחה — כתבי מה עלה, מה הרגשת, ומה לשפר.",
  },
  {
    field: "followUpMessageDraft",
    title: "טיוטת הודעת המשך",
    helper: "כתבי טיוטה להודעת Follow-Up לאחר הראיון.",
  },
];

function toLocalDateStr(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

type PrepSectionProps = {
  id: string;
  title: string;
  helper: string;
  value: string;
  onSave: (value: string) => void;
};

function PrepSection({ id, title, helper, value, onSave }: PrepSectionProps) {
  const [draft, setDraft] = useState(value);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const isDirty = draft !== value;

  function handleSave() {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleCancel() {
    setDraft(value);
  }

  return (
    <div className="card">
      <h3 className="card__title">{title}</h3>
      <p className="prep-section__helper">{helper}</p>
      <textarea
        id={id}
        className="form-input form-textarea prep-section__textarea"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        aria-label={title}
        rows={4}
      />
      {isDirty && (
        <div className="btn-row prep-section__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleSave}
          >
            שמירה
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={handleCancel}
          >
            ביטול
          </button>
        </div>
      )}
      {saved && !isDirty && (
        <p className="prep-section__saved" role="status">
          השינויים נשמרו מקומית.
        </p>
      )}
    </div>
  );
}

type Props = {
  job: JobApplication;
  onBack: () => void;
  onUpdate: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  profile?: UserProfile;
};

function CvTailoringResults({ suggestions }: { suggestions: CvTailoringSuggestions }) {
  const {
    matchingKeywords,
    missingKeywords,
    recommendedToHighlight,
    addOnlyIfTrue,
    suggestedSimplePhrases,
    recommendedToReduceOrRemove,
    warnings,
  } = suggestions;

  return (
    <div className="cv-tailoring-results">
      {matchingKeywords.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">מה כבר מתאים</p>
          <div className="chip-row">
            {matchingKeywords.map((kw) => (
              <span key={kw} className="chip chip--teal">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {recommendedToHighlight.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">מה כדאי להבליט</p>
          <ul className="cv-tailoring-list">
            {recommendedToHighlight.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {missingKeywords.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">מה חסר או דורש בדיקה</p>
          <div className="chip-row">
            {missingKeywords.map((kw) => (
              <span key={kw} className="chip chip--demo">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {addOnlyIfTrue.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">מה להוסיף רק אם זה נכון</p>
          <ul className="cv-tailoring-list">
            {addOnlyIfTrue.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendedToReduceOrRemove.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">מה כדאי לקצר או להוריד</p>
          <ul className="cv-tailoring-list">
            {recommendedToReduceOrRemove.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestedSimplePhrases.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">ניסוחים פשוטים שאפשר לשקול</p>
          <ul className="cv-tailoring-phrases">
            {suggestedSimplePhrases.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="cv-tailoring-section__title">אזהרות — לא להמציא</p>
        <ul className="cv-tailoring-warnings">
          {warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function JobDetailsPage({ job, onBack, onUpdate, onDelete, profile }: Props) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [suggestions, setSuggestions] = useState<CvTailoringSuggestions | null>(null);

  useEffect(() => {
    setSuggestions(null);
  }, [job.id]);

  function handleSave(updatedJob: JobApplication) {
    onUpdate(updatedJob);
    setMode("view");
  }

  function handleDeleteConfirmed() {
    onDelete(job.id);
  }

  function savePrep(field: PrepField, value: string) {
    onUpdate({ ...job, [field]: value, updatedAt: toLocalDateStr() } as JobApplication);
  }

  if (mode === "edit") {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => setMode("view")}>
          חזרה לפרטי המשרה
        </button>
        <div className="card">
          <h3 className="card__title">עריכת משרה</h3>
          <AddJobForm
            initialJob={job}
            onSave={handleSave}
            onCancel={() => setMode("view")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="job-details-topbar">
        <button className="back-btn" onClick={onBack}>
          חזרה לרשימת המשרות
        </button>
        <div className="btn-row">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => {
              setDeleteConfirm(false);
              setMode("edit");
            }}
          >
            עריכה
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => setDeleteConfirm(true)}
            aria-expanded={deleteConfirm}
          >
            מחיקה
          </button>
        </div>
      </div>

      {deleteConfirm && (
        <div className="delete-confirm" role="alert">
          <span className="delete-confirm__text">האם למחוק את המשרה הזו?</span>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={handleDeleteConfirmed}
            >
              כן, מחק
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => setDeleteConfirm(false)}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="job-details-header">
          <div>
            <h2 className="job-details-company">{job.companyName}</h2>
            <p className="job-details-role">{job.roleTitle}</p>
          </div>
          <span className={`status-badge status-badge--${job.status}`}>
            {STATUS_LABELS[job.status] ?? job.status}
          </span>
        </div>

        <div className="details-grid">
          {job.category && (
            <div className="details-grid__item">
              <span className="details-grid__label">קטגוריה</span>
              <span className="details-grid__value">{job.category}</span>
            </div>
          )}
          {job.source && (
            <div className="details-grid__item">
              <span className="details-grid__label">מקור</span>
              <span className="details-grid__value">{job.source}</span>
            </div>
          )}
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
          {job.updatedAt && (
            <div className="details-grid__item">
              <span className="details-grid__label">עודכן</span>
              <span className="details-grid__value">{job.updatedAt}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-row">
        <div className="card card--grow">
          <h3 className="card__title">תיאור המשרה</h3>
          <p className="card__text">{job.jobDescription || "לא הוזן תיאור."}</p>
        </div>
        {job.nextAction && (
          <div className="card card--accent">
            <h3 className="card__title">פעולה הבאה</h3>
            <p className="card__text">{job.nextAction}</p>
          </div>
        )}
      </div>

      {job.notes && (
        <div className="card">
          <h3 className="card__title">הערות</h3>
          <p className="card__text">{job.notes}</p>
        </div>
      )}

      <div className="card">
        <h3 className="card__title">התאמת קורות חיים למשרה</h3>

        {!job.jobDescription.trim() ? (
          <p className="prep-section__helper">
            כדי לבצע התאמה, יש להוסיף תיאור משרה לכרטיס המשרה.
          </p>
        ) : !profile || isProfileEmpty(profile) ? (
          <p className="prep-section__helper">
            כדי לקבל התאמות לקורות החיים, יש למלא קודם את עמוד הפרופיל שלי.
          </p>
        ) : (
          <>
            <p className="prep-section__helper">
              בדיקה מקומית של מידת ההתאמה בין הפרופיל שלך לדרישות המשרה.
            </p>
            <div className="btn-row" style={{ marginTop: "12px" }}>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() =>
                  setSuggestions(generateCvTailoringSuggestions(job, profile))
                }
              >
                בדיקת התאמת קורות חיים
              </button>
              {suggestions && (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setSuggestions(null)}
                >
                  סגירה
                </button>
              )}
            </div>
            {suggestions && <CvTailoringResults suggestions={suggestions} />}
          </>
        )}

        <p className="prep-section__helper" style={{ marginTop: "14px" }}>
          הבדיקה מתבצעת מקומית בלבד לפי הפרופיל ותיאור המשרה השמורים בדפדפן.
          המידע אינו נשלח לשרת חיצוני.
        </p>
      </div>

      <div className="prep-workspace">
        <div className="prep-workspace__header">
          <h3 className="prep-workspace__title">הכנה לראיון</h3>
          <p className="prep-workspace__privacy">
            המידע בעמוד זה נשמר מקומית במחשב שלך ואינו נשלח לשרת חיצוני.
          </p>
        </div>
        {PREP_SECTIONS.map((s) => (
          <PrepSection
            key={s.field}
            id={`prep-${s.field}`}
            title={s.title}
            helper={s.helper}
            value={job[s.field] ?? ""}
            onSave={(v) => savePrep(s.field, v)}
          />
        ))}
      </div>
    </div>
  );
}

export default JobDetailsPage;
