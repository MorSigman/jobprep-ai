import { useState } from "react";
import type { UserProfile } from "../types/profile";

type Props = {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
};

type Section = {
  title: string;
  fields: {
    key: keyof Omit<UserProfile, "updatedAt">;
    label: string;
    helper: string;
    rows: number;
  }[];
};

const SECTIONS: Section[] = [
  {
    title: "מה אני מחפשת",
    fields: [
      {
        key: "targetRoles",
        label: "תפקידים שאני מחפשת",
        helper: "רשמי את התפקידים שמעניינים אותך — לדוגמה: QA Automation, Data Analyst.",
        rows: 2,
      },
      {
        key: "targetCategories",
        label: "תחומים רלוונטיים",
        helper: "תחומים שמתאימים לך — לדוגמה: פינטק, בריאות דיגיטלית, סייבר.",
        rows: 2,
      },
    ],
  },
  {
    title: "ידע מקצועי",
    fields: [
      {
        key: "skills",
        label: "כישורים מקצועיים",
        helper: "רשמי כישורים שיש לך — בדיקות תוכנה, SQL, ניתוח נתונים, ניהול פרויקטים...",
        rows: 3,
      },
      {
        key: "technologies",
        label: "טכנולוגיות",
        helper: "שפות תכנות, כלי בדיקה, frameworks — Python, Selenium, Postman...",
        rows: 3,
      },
      {
        key: "tools",
        label: "כלים",
        helper: "כלים יומיומיים — Jira, Confluence, Git, Excel, Tableau...",
        rows: 2,
      },
    ],
  },
  {
    title: "ניסיון ורקע",
    fields: [
      {
        key: "projectsSummary",
        label: "פרויקטים שלי",
        helper: "תארי את הפרויקטים הרלוונטיים שלך — מה עשית, באיזה טכנולוגיה, מה למדת.",
        rows: 4,
      },
      {
        key: "experienceSummary",
        label: "תקציר ניסיון",
        helper: "תארי את הרקע התעסוקתי שלך — תפקידים קודמים, אחריות, הישגים.",
        rows: 4,
      },
      {
        key: "educationSummary",
        label: "השכלה / לימודים",
        helper: "תואר, מסלולים, קורסים, בוטקמפ — כל מה שרלוונטי.",
        rows: 3,
      },
    ],
  },
  {
    title: "חוזקות ופיתוח",
    fields: [
      {
        key: "strengths",
        label: "חוזקות",
        helper: "מה את טובה בו? מה קולגות מעריכים בך? מה מייחד אותך?",
        rows: 3,
      },
      {
        key: "skillsToImprove",
        label: "דברים שאני רוצה לשפר",
        helper: "תחומים שאת עובדת עליהם — כישורים טכניים, ניהול זמן, תקשורת...",
        rows: 3,
      },
    ],
  },
  {
    title: "הערות נוספות",
    fields: [
      {
        key: "notes",
        label: "הערות",
        helper: "כל מידע נוסף שתרצי לשמור לצרכי הכנה — אילוצים, העדפות, מחשבות.",
        rows: 4,
      },
    ],
  },
];

function ProfilePage({ profile, onSave }: Props) {
  const [draft, setDraft] = useState<UserProfile>(() => ({ ...profile }));
  const [isDirty, setIsDirty] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  function handleChange(key: keyof Omit<UserProfile, "updatedAt">, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSavedMessage(false);
  }

  function handleSave() {
    onSave(draft);
    setIsDirty(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 4000);
  }

  function handleCancel() {
    setDraft({ ...profile });
    setIsDirty(false);
    setSavedMessage(false);
  }

  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">פרופיל אישי</p>
        <h2 className="page__title">הפרופיל שלי</h2>
        <p className="page__subtitle">
          המידע בעמוד זה נשמר מקומית במחשב שלך וישמש בהמשך לחישוב התאמה למשרות.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="card">
          <h3 className="card__title">{section.title}</h3>
          {section.fields.map((field) => (
            <div key={field.key} className="form-group">
              <label className="form-label" htmlFor={`pf-${field.key}`}>
                {field.label}
              </label>
              <p className="prep-section__helper">{field.helper}</p>
              <textarea
                id={`pf-${field.key}`}
                className="form-input form-textarea prep-section__textarea"
                value={draft[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={field.rows}
                aria-label={field.label}
              />
            </div>
          ))}
        </div>
      ))}

      <div className="card">
        <div className="btn-row">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSave}
            disabled={!isDirty}
          >
            שמירת פרופיל
          </button>
          {isDirty && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleCancel}
            >
              ביטול שינויים
            </button>
          )}
        </div>
        {savedMessage && (
          <p className="prep-section__saved" role="status">
            הפרופיל נשמר מקומית.
          </p>
        )}
        {profile.updatedAt && !isDirty && (
          <p className="prep-section__helper" style={{ marginTop: "10px" }}>
            עודכן לאחרונה: {profile.updatedAt}
          </p>
        )}
        <p className="prep-section__helper" style={{ marginTop: "12px" }}>
          המידע בפרופיל נשמר מקומית בלבד ואינו נשלח לשרת חיצוני.
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
