import { useState, useEffect, useMemo } from "react";
import type { JobApplication } from "../types/job";
import type { UserProfile } from "../types/profile";
import type { ProfessionalQuestion } from "../types/professionalQuestion";
import type { PageName } from "../types/navigation";
import AddJobForm from "../components/AddJobForm";
import {
  generateCvTailoringSuggestions,
  isProfileEmpty,
  type CvTailoringSuggestions,
} from "../lib/cvTailoring";
import { demoProfessionalQuestions } from "../data/professionalQuestions";
import { getRecommendedQuestionsForJob } from "../lib/recommendedQuestions";
import { usePracticeProgress, type ProgressMap } from "../hooks/usePracticeProgress";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "../lib/questionLabels";

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


type RQCardProps = { q: ProfessionalQuestion };
function RecommendedQuestionCard({ q }: RQCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="recommended-question-card">
      <div className="recommended-question-meta">
        <span className="chip chip--category">{CATEGORY_LABELS[q.category]}</span>
        <span className="chip chip--topic chip--sm">{q.topic}</span>
        <span className={`chip chip--difficulty chip--difficulty-${q.difficulty} chip--sm`}>
          {DIFFICULTY_LABELS[q.difficulty]}
        </span>
      </div>
      <p className="pq-card__question">{q.question}</p>
      <div className="recommended-question-answer">
        <p>{q.shortAnswer}</p>
      </div>
      <div className="recommended-question-actions">
        <button
          type="button"
          className="pq-expandable__btn"
          aria-expanded={showExplanation}
          onClick={() => setShowExplanation((v) => !v)}
        >
          {showExplanation ? "- הרחבה" : "+ הרחבה"}
        </button>
        {q.example && (
          <button
            type="button"
            className="pq-expandable__btn"
            aria-expanded={showExample}
            onClick={() => setShowExample((v) => !v)}
          >
            {showExample ? "- דוגמה" : "+ דוגמה"}
          </button>
        )}
      </div>
      {showExplanation && q.simpleExplanation && (
        <div className="recommended-question-expanded">
          <strong>הרחבה:</strong>
          <p className="pq-expandable__text">{q.simpleExplanation}</p>
        </div>
      )}
      {showExample && q.example && (
        <div className="recommended-question-expanded">
          <strong>דוגמה:</strong>
          <p>{q.example}</p>
        </div>
      )}
    </div>
  );
}

type JobPracticePanelProps = {
  questions: ProfessionalQuestion[];
  progress: ProgressMap;
  onRecordResult: (questionId: string, result: "known" | "review") => void;
  onExit: () => void;
};

function JobPracticePanel({ questions, progress, onRecordResult, onExit }: JobPracticePanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const safeIndex = Math.min(currentIndex, Math.max(0, questions.length - 1));
  const current = questions[safeIndex];

  const stats = useMemo(() => {
    const practiced = questions.filter((q) => (progress[q.id]?.timesPracticed ?? 0) > 0).length;
    const known = questions.reduce((sum, q) => sum + (progress[q.id]?.timesKnown ?? 0), 0);
    const review = questions.reduce((sum, q) => sum + (progress[q.id]?.timesNeedsReview ?? 0), 0);
    return { practiced, known, review };
  }, [questions, progress]);

  function handleResult(result: "known" | "review") {
    if (!current) return;
    onRecordResult(current.id, result);
    setShowAnswer(false);
    if (safeIndex < questions.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  }

  function goTo(index: number) {
    setCurrentIndex(index);
    setShowAnswer(false);
  }

  if (questions.length === 0) {
    return (
      <div className="job-practice-panel">
        <div className="job-practice-header">
          <div className="job-practice-header__top">
            <h4 className="job-practice-title">תרגול ראיון למשרה הזו</h4>
            <button type="button" className="btn btn--secondary btn--sm" onClick={onExit}>
              סיום תרגול
            </button>
          </div>
        </div>
        <p className="job-practice-empty">לא נמצאו שאלות מתאימות לתרגול עבור המשרה הזו.</p>
      </div>
    );
  }

  const qProgress = current ? progress[current.id] : undefined;

  return (
    <div className="job-practice-panel">
      <div className="job-practice-header">
        <div className="job-practice-header__top">
          <h4 className="job-practice-title">תרגול ראיון למשרה הזו</h4>
          <button type="button" className="btn btn--secondary btn--sm" onClick={onExit}>
            סיום תרגול
          </button>
        </div>
        <p className="prep-section__helper" style={{ margin: "4px 0 8px" }}>
          השאלות נבחרו מתוך המאגר המקומי לפי תחום המשרה ותיאור המשרה.
        </p>
        <div className="job-practice-stats">
          <span>תורגלו: {stats.practiced}</span>
          <span>ידעתי: {stats.known}</span>
          <span>צריך חזרה: {stats.review}</span>
        </div>
      </div>

      <div className="job-practice-card">
        <p className="job-practice-progress">שאלה {safeIndex + 1} מתוך {questions.length}</p>
        <div className="recommended-question-meta">
          <span className="chip chip--category">{CATEGORY_LABELS[current.category]}</span>
          <span className="chip chip--topic chip--sm">{current.topic}</span>
          <span className={`chip chip--difficulty chip--difficulty-${current.difficulty} chip--sm`}>
            {DIFFICULTY_LABELS[current.difficulty]}
          </span>
        </div>
        {qProgress && qProgress.timesPracticed > 0 && (
          <p className="job-practice-past-hint">
            תורגל {qProgress.timesPracticed} פעמים · פעם אחרונה: {qProgress.lastPracticedAt}
          </p>
        )}
        <p className="job-practice-question">{current.question}</p>
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          aria-expanded={showAnswer}
          onClick={() => setShowAnswer((v) => !v)}
        >
          {showAnswer ? "הסתר תשובה" : "הצג תשובה"}
        </button>
        {showAnswer && (
          <div className="job-practice-answer">
            {current.shortAnswer && (
              <div className="job-practice-answer-section">
                <strong>תשובה קצרה:</strong>
                <p>{current.shortAnswer}</p>
              </div>
            )}
            {current.simpleExplanation && (
              <div className="job-practice-answer-section">
                <strong>הרחבה:</strong>
                <p className="pq-expandable__text">{current.simpleExplanation}</p>
              </div>
            )}
            {current.example && (
              <div className="job-practice-answer-section">
                <strong>דוגמה:</strong>
                <p>{current.example}</p>
              </div>
            )}
            {current.whatToMention.length > 0 && (
              <div className="job-practice-answer-section">
                <strong>מה כדאי להזכיר:</strong>
                <ul className="job-practice-list">
                  {current.whatToMention.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {current.commonMistakes.length > 0 && (
              <div className="job-practice-answer-section">
                <strong>טעויות נפוצות:</strong>
                <ul className="job-practice-list">
                  {current.commonMistakes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="job-practice-actions">
              <button
                type="button"
                className="job-practice-result-button job-practice-result-button--known"
                onClick={() => handleResult("known")}
              >
                ידעתי ✓
              </button>
              <button
                type="button"
                className="job-practice-result-button job-practice-result-button--review"
                onClick={() => handleResult("review")}
              >
                צריך חזרה ↺
              </button>
            </div>
          </div>
        )}
        <div className="job-practice-nav">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            disabled={safeIndex === 0}
            onClick={() => goTo(safeIndex - 1)}
          >
            שאלה קודמת
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            disabled={safeIndex === questions.length - 1}
            onClick={() => goTo(safeIndex + 1)}
          >
            שאלה הבאה
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = {
  job: JobApplication;
  onBack: () => void;
  onUpdate: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onNavigate?: (page: PageName) => void;
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

function JobDetailsPage({ job, onBack, onUpdate, onDelete, onNavigate, profile }: Props) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [suggestions, setSuggestions] = useState<CvTailoringSuggestions | null>(null);
  const [jobPracticeMode, setJobPracticeMode] = useState(false);
  const { progress, recordResult } = usePracticeProgress();

  const recommendedQuestions = useMemo(
    () => getRecommendedQuestionsForJob(job, demoProfessionalQuestions),
    [job]
  );

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

      <div className="recommended-questions-section">
        {!jobPracticeMode && (
          <div className="recommended-questions-header">
            <h3 className="prep-workspace__title">שאלות מקצועיות מומלצות למשרה הזו</h3>
            <p className="prep-section__helper">
              נבחרו מתוך מאגר השאלות המקומי לפי תחום המשרה, תיאור המשרה ומילות מפתח.
            </p>
            <div className="recommended-questions-topbar">
              <span className="pq-count-text">נמצאו {recommendedQuestions.length} שאלות</span>
              <div className="btn-row">
                {recommendedQuestions.length > 0 && (
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => setJobPracticeMode(true)}
                  >
                    תרגול ראיון למשרה הזו
                  </button>
                )}
                {onNavigate && (
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => onNavigate("professional-interview")}
                  >
                    לכל מאגר השאלות המקצועיות
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {jobPracticeMode ? (
          <JobPracticePanel
            questions={recommendedQuestions}
            progress={progress}
            onRecordResult={recordResult}
            onExit={() => setJobPracticeMode(false)}
          />
        ) : recommendedQuestions.length === 0 ? (
          <p className="recommended-question-empty">
            לא נמצאו שאלות מתאימות למשרה הזו. אפשר להיכנס למאגר השאלות המקצועיות ולחפש ידנית.
          </p>
        ) : (
          <div className="recommended-questions-grid">
            {recommendedQuestions.map((q) => (
              <RecommendedQuestionCard key={q.id} q={q} />
            ))}
          </div>
        )}
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
