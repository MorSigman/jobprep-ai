import { useState, useEffect, useMemo, useRef } from "react";
import type { JobApplication } from "../types/job";
import type { UserProfile } from "../types/profile";
import type { ProfessionalQuestion, QuestionCategory } from "../types/professionalQuestion";
import type { PageName } from "../types/navigation";
import AddJobForm from "../components/AddJobForm";
import {
  generateCvTailoringSuggestions,
  isProfileEmpty,
  type CvTailoringSuggestions,
} from "../lib/cvTailoring";
import { useAISettings } from "../lib/useAISettings";
import { redactPersonalInfo } from "../lib/redactPersonalInfo";
import {
  fetchAICvTailoring,
  fetchAIInterviewPrep,
  fetchAIJobFullAnalysis,
  fetchAIAnswer,
  type AICvTailoringResult,
  type AIInterviewPrepResult,
  type AIRawQuestion,
  type AIPersonalQuestion,
  type AIJobFullAnalysisResult,
  type AICvReview,
  type AIAnswerResult,
} from "../lib/aiClient";
import { AIConsentModal } from "../components/AIConsentModal";
import type { ConsentPayload } from "../components/AIConsentModal";
import { demoProfessionalQuestions } from "../data/professionalQuestions";
import { getRecommendedQuestionsForJob } from "../lib/recommendedQuestions";
import { usePracticeProgress, type ProgressMap } from "../hooks/usePracticeProgress";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "../lib/questionLabels";
import { useProfessionalQuestions } from "../hooks/useProfessionalQuestions";
import { SALARY_DATA, formatK } from "../data/salaryData";

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


// ─── Salary Card ──────────────────────────────────────────────────────────────

const GLOBAL_MAX = 60000;

function SalaryCard({ category, salaryRange }: { category?: string; salaryRange?: string }) {
  const data = category ? SALARY_DATA[category as keyof typeof SALARY_DATA] : undefined;

  if (!data) return null;

  return (
    <div className="card salary-card">
      <h3 className="card__title">שכר ממוצע בשוק — {category}</h3>
      <p className="salary-card__note">שכר ברוטו חודשי, ₪ — שוק ההייטק הישראלי 2025 (הערכות)</p>

      <div className="salary-levels">
        {data.levels.map((level) => {
          const barMin = (level.min / GLOBAL_MAX) * 100;
          const barWidth = ((level.max - level.min) / GLOBAL_MAX) * 100;
          return (
            <div key={level.label} className="salary-level">
              <span className="salary-level__label">{level.label}</span>
              <div className="salary-level__bar-track">
                <div
                  className="salary-level__bar-fill"
                  style={{ marginRight: `${barMin}%`, width: `${barWidth}%` }}
                />
              </div>
              <span className="salary-level__range">
                {formatK(level.min)}–{formatK(level.max)} ₪
              </span>
            </div>
          );
        })}
      </div>

      {data.note && <p className="salary-card__extra-note">{data.note}</p>}

      {salaryRange && (
        <div className="salary-card__user-range">
          <span className="salary-card__user-label">טווח שכר שצוין למשרה זו:</span>
          <strong className="salary-card__user-value">{salaryRange}</strong>
        </div>
      )}

      <p className="salary-card__disclaimer">
        * הנתונים הם הערכה כללית בלבד ומשתנים לפי חברה, ניסיון וכישורים ספציפיים.
      </p>
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
          className="btn btn--sm btn--secondary"
          aria-expanded={showExplanation}
          onClick={() => setShowExplanation((v) => !v)}
        >
          {showExplanation ? "− הרחבה" : "+ הרחבה"}
        </button>
        {q.example && (
          <button
            type="button"
            className="btn btn--sm btn--secondary"
            aria-expanded={showExample}
            onClick={() => setShowExample((v) => !v)}
          >
            {showExample ? "− דוגמה" : "+ דוגמה"}
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
              <span key={kw} className="chip chip--topic chip--sm">
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

function buildProfileSummaryForAI(profile: UserProfile): string {
  return [
    profile.targetRoles && `תפקידים: ${profile.targetRoles}`,
    profile.skills && `כישורים: ${profile.skills}`,
    profile.technologies && `טכנולוגיות: ${profile.technologies}`,
    profile.tools && `כלים: ${profile.tools}`,
    profile.projectsSummary && `פרויקטים: ${profile.projectsSummary}`,
    profile.experienceSummary && `ניסיון: ${profile.experienceSummary}`,
    profile.educationSummary && `השכלה: ${profile.educationSummary}`,
    profile.strengths && `חוזקות: ${profile.strengths}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function AICvTailoringAIResults({ result }: { result: AICvTailoringResult }) {
  return (
    <div className="cv-tailoring-results" style={{ marginTop: "12px" }}>
      {result.matchingStrengths.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">מה כבר מתאים</p>
          <ul className="cv-tailoring-list">
            {result.matchingStrengths.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}
      {result.missingKeywords.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">מה חסר</p>
          <div className="chip-row">
            {result.missingKeywords.map((kw, i) => (
              <span key={i} className="chip chip--topic chip--sm">{kw}</span>
            ))}
          </div>
        </div>
      )}
      {result.recommendedHighlights.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">מה כדאי להבליט</p>
          <ul className="cv-tailoring-list">
            {result.recommendedHighlights.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}
      {result.suggestedPhrases.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">ניסוחים מוצעים</p>
          <ul className="cv-tailoring-phrases">
            {result.suggestedPhrases.map((phrase, i) => <li key={i}>{phrase}</li>)}
          </ul>
        </div>
      )}
      {result.projectsToMention.length > 0 && (
        <div>
          <p className="cv-tailoring-section__title">פרויקטים שכדאי להזכיר</p>
          <ul className="cv-tailoring-list">
            {result.projectsToMention.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}
      <div>
        <p className="cv-tailoring-section__title">אזהרות — לא להמציא</p>
        <ul className="cv-tailoring-warnings">
          {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </div>
    </div>
  );
}

function AIInterviewPrepResults({ result }: { result: AIInterviewPrepResult }) {
  return (
    <div className="ai-prep-results">
      {result.personalPitch && (
        <div className="ai-prep-section">
          <p className="ai-prep-section__label">פיץ׳ אישי מוצע</p>
          <p className="ai-prep-pitch-box">{result.personalPitch}</p>
        </div>
      )}
      {result.likelyQuestions.length > 0 && (
        <div className="ai-prep-section">
          <p className="ai-prep-section__label">שאלות צפויות בראיון</p>
          <ol className="ai-prep-list ai-prep-list--questions">
            {result.likelyQuestions.map((q, i) => <li key={i}>{q}</li>)}
          </ol>
        </div>
      )}
      {result.topicsToReview.length > 0 && (
        <div className="ai-prep-section">
          <p className="ai-prep-section__label">נושאים לחזור עליהם</p>
          <div className="chip-row">
            {result.topicsToReview.map((t, i) => (
              <span key={i} className="chip chip--category">{t}</span>
            ))}
          </div>
        </div>
      )}
      {result.projectsToPrepare.length > 0 && (
        <div className="ai-prep-section">
          <p className="ai-prep-section__label">פרויקטים להכין כדוגמאות</p>
          <ul className="ai-prep-list">
            {result.projectsToPrepare.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}
      {result.questionsToAskInterviewer.length > 0 && (
        <div className="ai-prep-section">
          <p className="ai-prep-section__label">שאלות לשאול את המראיינים</p>
          <ul className="ai-prep-list ai-prep-list--accent">
            {result.questionsToAskInterviewer.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>
      )}
      {result.weakSpotsToPrepare.length > 0 && (
        <div className="ai-prep-section">
          <p className="ai-prep-section__label">נקודות לחזרה מוכנה</p>
          <ul className="ai-prep-list ai-prep-list--warning">
            {result.weakSpotsToPrepare.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function AICvReviewCard({ cvReview }: { cvReview: AICvReview }) {
  const fitLabel: Record<string, string> = {
    strong: "התאמה גבוהה",
    moderate: "התאמה בינונית",
    weak: "התאמה חלשה",
  };
  return (
    <div className="cv-review-card">
      <div className="cv-review-card__header">
        <h4 className="cv-review-card__title">ניתוח קורות חיים למשרה זו</h4>
        <span className={`chip cv-review-fit cv-review-fit--${cvReview.overallFit}`}>
          {fitLabel[cvReview.overallFit] ?? cvReview.overallFit}
        </span>
      </div>
      {cvReview.strengthsToHighlight.length > 0 && (
        <div className="cv-review-section">
          <p className="cv-review-section__label">מה להדגיש בקורות חיים</p>
          <ul className="ai-prep-list">
            {cvReview.strengthsToHighlight.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
      {cvReview.suggestedChanges.length > 0 && (
        <div className="cv-review-section">
          <p className="cv-review-section__label">שינויים מומלצים</p>
          <ul className="ai-prep-list ai-prep-list--warning">
            {cvReview.suggestedChanges.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
      {cvReview.keywordsToAdd.length > 0 && (
        <div className="cv-review-section">
          <p className="cv-review-section__label">מילות מפתח להוסיף</p>
          <div className="chip-row">
            {cvReview.keywordsToAdd.map((k, i) => <span key={i} className="chip chip--category">{k}</span>)}
          </div>
        </div>
      )}
      {cvReview.projectsToFeature.length > 0 && (
        <div className="cv-review-section">
          <p className="cv-review-section__label">פרויקטים להציג לתפקיד זה</p>
          <ul className="ai-prep-list ai-prep-list--accent">
            {cvReview.projectsToFeature.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

type AIProQCardProps = {
  q: AIRawQuestion;
  added: boolean;
  isDuplicate: boolean;
  onAdd: () => void;
};

function AIProQCard({ q, added, isDuplicate, onAdd }: AIProQCardProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="job-ai-q-card">
      <div className="job-ai-q-card__meta">
        <span className="chip chip--category">{CATEGORY_LABELS[q.category as keyof typeof CATEGORY_LABELS] ?? q.category}</span>
        <span className={`chip chip--difficulty chip--difficulty-${q.difficulty} chip--sm`}>{DIFFICULTY_LABELS[q.difficulty]}</span>
        <span className="chip chip--topic chip--sm">{q.topic}</span>
      </div>
      <p className="job-ai-q-card__question">{q.question}</p>
      {expanded && (
        <div className="job-ai-q-card__details">
          <p className="job-ai-q-card__answer">{q.shortAnswer}</p>
          {q.whatToMention.length > 0 && (
            <div>
              <strong className="job-ai-q-card__sub">מה כדאי להזכיר:</strong>
              <ul className="job-ai-q-card__list">
                {q.whatToMention.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="job-ai-q-card__actions">
        <button type="button" className="btn btn--sm btn--secondary" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "− פחות" : "+ תשובה"}
        </button>
        <button
          type="button"
          className={`btn btn--sm ${added || isDuplicate ? "btn--secondary" : "btn--primary"}`}
          onClick={onAdd}
          disabled={added || isDuplicate}
        >
          {isDuplicate ? "כבר במאגר" : added ? "✓ נוסף למאגר" : "+ הוסף למאגר"}
        </button>
      </div>
    </div>
  );
}

type AIPerQCardProps = {
  q: AIPersonalQuestion;
  added: boolean;
  isDuplicate: boolean;
  onAdd: () => void;
};

function AIPerQCard({ q, added, isDuplicate, onAdd }: AIPerQCardProps) {
  const [expanded, setExpanded] = useState(false);
  const typeLabel: Record<string, string> = {
    behavioral: "התנהגותית",
    motivational: "מוטיבציה",
    situational: "מצבית",
    personal: "אישית",
  };
  return (
    <div className="job-ai-q-card job-ai-q-card--personal">
      <div className="job-ai-q-card__meta">
        <span className="chip chip--category">שאלה אישית</span>
        <span className="chip chip--topic chip--sm">{typeLabel[q.type] ?? q.type}</span>
      </div>
      <p className="job-ai-q-card__question">{q.question}</p>
      {expanded && (
        <div className="job-ai-q-card__details">
          <strong className="job-ai-q-card__sub">הצעת תשובה:</strong>
          <p className="job-ai-q-card__answer">{q.suggestedAnswer}</p>
          {q.tips.length > 0 && (
            <div>
              <strong className="job-ai-q-card__sub">מה להדגיש:</strong>
              <ul className="job-ai-q-card__list">
                {q.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
          {q.followUpQuestions.length > 0 && (
            <div>
              <strong className="job-ai-q-card__sub">שאלות המשך אפשריות:</strong>
              <ul className="job-ai-q-card__list">
                {q.followUpQuestions.map((fq, i) => <li key={i}>{fq}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="job-ai-q-card__actions">
        <button type="button" className="btn btn--sm btn--secondary" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "− פחות" : "+ תשובה מוצעת"}
        </button>
        <button
          type="button"
          className={`btn btn--sm ${added || isDuplicate ? "btn--secondary" : "btn--primary"}`}
          onClick={onAdd}
          disabled={added || isDuplicate}
        >
          {isDuplicate ? "כבר במאגר" : added ? "✓ נוסף למאגר" : "+ הוסף למאגר"}
        </button>
      </div>
    </div>
  );
}

type PrepSuggestionCardProps = {
  title: string;
  value: string;
  saved: boolean;
  onSave: () => void;
};

function PrepSuggestionCard({ title, value, saved, onSave }: PrepSuggestionCardProps) {
  if (!value.trim()) return null;
  return (
    <div className="job-ai-prep-suggestion">
      <div className="job-ai-prep-suggestion__header">
        <strong className="job-ai-prep-suggestion__title">{title}</strong>
        <button
          type="button"
          className={`btn btn--sm ${saved ? "btn--secondary" : "btn--primary"}`}
          onClick={onSave}
          disabled={saved}
        >
          {saved ? "✓ נשמר" : "שמור לסעיף"}
        </button>
      </div>
      <p className="job-ai-prep-suggestion__text">{value}</p>
    </div>
  );
}

function loadInterviewPrepCache(jobId: string): AIInterviewPrepResult | null {
  try {
    const raw = localStorage.getItem(`jobprep-ai-interview-prep-${jobId}`);
    if (!raw) return null;
    return JSON.parse(raw) as AIInterviewPrepResult;
  } catch {
    return null;
  }
}

function saveInterviewPrepCache(jobId: string, result: AIInterviewPrepResult): void {
  try {
    localStorage.setItem(`jobprep-ai-interview-prep-${jobId}`, JSON.stringify(result));
  } catch {
    /* ignore */
  }
}

type FullAnalysisCache = {
  result: AIJobFullAnalysisResult;
  addedProQs: number[];
  addedPerQs: number[];
  savedPrepFields: string[];
};

function loadFullAnalysisCache(jobId: string): FullAnalysisCache | null {
  try {
    const raw = localStorage.getItem(`jobprep-ai-full-result-${jobId}`);
    if (!raw) return null;
    return JSON.parse(raw) as FullAnalysisCache;
  } catch {
    return null;
  }
}

type ChatMsg = {
  id: string;
  role: "user" | "ai";
  text: string;
  question?: string;
  result?: AIAnswerResult;
  addedToBank?: boolean;
};

function saveFullAnalysisCacheData(jobId: string, data: FullAnalysisCache): void {
  try {
    localStorage.setItem(`jobprep-ai-full-result-${jobId}`, JSON.stringify(data));
  } catch {
    /* ignore storage errors */
  }
}

function JobDetailsPage({ job, onBack, onUpdate, onDelete, onNavigate, profile }: Props) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [suggestions, setSuggestions] = useState<CvTailoringSuggestions | null>(null);
  const [jobPracticeMode, setJobPracticeMode] = useState(false);
  const { progress, recordResult } = usePracticeProgress();
  const { settings: aiSettings } = useAISettings();
  const { questions: allQuestions, addQuestions } = useProfessionalQuestions();

  const [aiCvLoading, setAiCvLoading] = useState(false);
  const [aiCvError, setAiCvError] = useState("");
  const [aiCvResult, setAiCvResult] = useState<AICvTailoringResult | null>(null);
  const [aiCvConsent, setAiCvConsent] = useState<ConsentPayload | null>(null);

  const [aiPrepLoading, setAiPrepLoading] = useState(false);
  const [aiPrepError, setAiPrepError] = useState("");
  const [aiPrepResult, setAiPrepResult] = useState<AIInterviewPrepResult | null>(
    () => loadInterviewPrepCache(job.id)
  );
  const [aiPrepConsent, setAiPrepConsent] = useState<ConsentPayload | null>(null);

  const [companyInfo, setCompanyInfo] = useState("");
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [aiFullLoading, setAiFullLoading] = useState(false);
  const [aiFullError, setAiFullError] = useState("");
  const [aiFullResult, setAiFullResult] = useState<AIJobFullAnalysisResult | null>(() => {
    const c = loadFullAnalysisCache(job.id);
    return c ? c.result : null;
  });
  const [aiFullConsent, setAiFullConsent] = useState<ConsentPayload | null>(null);
  const [addedProQs, setAddedProQs] = useState<Set<number>>(() => {
    const c = loadFullAnalysisCache(job.id);
    return c ? new Set(c.addedProQs) : new Set();
  });
  const [addedPerQs, setAddedPerQs] = useState<Set<number>>(() => {
    const c = loadFullAnalysisCache(job.id);
    return c ? new Set(c.addedPerQs) : new Set();
  });
  const [savedPrepFields, setSavedPrepFields] = useState<Set<string>>(() => {
    const c = loadFullAnalysisCache(job.id);
    return c ? new Set(c.savedPrepFields) : new Set();
  });
  const [duplicateProQs, setDuplicateProQs] = useState<Set<number>>(new Set());
  const [duplicatePerQs, setDuplicatePerQs] = useState<Set<number>>(new Set());
  const [showFullResults, setShowFullResults] = useState(true);
  const [showPrepResults, setShowPrepResults] = useState(true);

  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const recommendedQuestions = useMemo(
    () => getRecommendedQuestionsForJob(job, demoProfessionalQuestions),
    [job]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setSuggestions(null);
    setAiCvResult(null);
    setAiCvError("");
    setAiPrepError("");
    setAiFullError("");
    setShowFullResults(true);
    setShowPrepResults(true);
    setDuplicateProQs(new Set());
    setDuplicatePerQs(new Set());

    const prepCache = loadInterviewPrepCache(job.id);
    setAiPrepResult(prepCache ?? null);

    const fullCache = loadFullAnalysisCache(job.id);
    if (fullCache) {
      setAiFullResult(fullCache.result);
      setAddedProQs(new Set(fullCache.addedProQs));
      setAddedPerQs(new Set(fullCache.addedPerQs));
      setSavedPrepFields(new Set(fullCache.savedPrepFields));
    } else {
      setAiFullResult(null);
      setAddedProQs(new Set());
      setAddedPerQs(new Set());
      setSavedPrepFields(new Set());
    }
  }, [job.id]);

  useEffect(() => {
    if (chatMessages.length === 0) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [chatMessages]);

  async function handleChatSend() {
    const q = chatInput.trim();
    if (!q || chatLoading) return;
    setChatInput("");
    setChatMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: q }]);
    setChatLoading(true);
    try {
      const result = await fetchAIAnswer({ question: q });
      setChatMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", text: result.answer, question: q, result },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", text: "שגיאה — ודאי שהשרת פעיל ונסי שוב." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleChatAddToBank(msg: ChatMsg) {
    if (!msg.result || !msg.question) return;
    addQuestions(
      [
        {
          question: msg.question,
          shortAnswer: msg.text,
          simpleExplanation: msg.result.example || msg.text,
          example: msg.result.example,
          whatToMention: msg.result.keyPoints,
          commonMistakes: msg.result.commonMistakes,
          tags: [...msg.result.relatedTopics, job.roleTitle].filter(Boolean),
          category: (msg.result.suggestedCategory in CATEGORY_LABELS
            ? msg.result.suggestedCategory
            : "General") as QuestionCategory,
          topic: msg.result.suggestedTopic,
          difficulty: msg.result.suggestedDifficulty,
        },
      ],
      "user"
    );
    setChatMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, addedToBank: true } : m))
    );
  }

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

  function buildAIContext() {
    const desc = aiSettings.redactBeforeSend
      ? redactPersonalInfo(job.jobDescription)
      : job.jobDescription;
    const title = aiSettings.redactBeforeSend
      ? redactPersonalInfo(job.roleTitle)
      : job.roleTitle;
    const profileText = profile ? buildProfileSummaryForAI(profile) : "";
    const profileToSend = aiSettings.redactBeforeSend
      ? redactPersonalInfo(profileText)
      : profileText;
    return { desc, title, profileToSend };
  }

  function handleAiCvClick() {
    if (!aiSettings.aiEnabled) return;
    const { desc, title, profileToSend } = buildAIContext();
    setAiCvConsent({
      taskLabel: "התאמת קורות חיים בעזרת AI",
      fields: [
        { label: "כותרת משרה", value: title || "לא צוין" },
        { label: "תיאור משרה", value: desc.length > 80 ? desc.slice(0, 80) + "…" : desc },
        { label: "פרופיל", value: profileToSend.length > 80 ? profileToSend.slice(0, 80) + "…" : profileToSend },
      ],
      textToSend: `${desc}\n\nפרופיל:\n${profileToSend}`,
      isRedacted: aiSettings.redactBeforeSend,
    });
  }

  async function handleConfirmAiCv() {
    if (!aiCvConsent) return;
    const { desc, title, profileToSend } = buildAIContext();
    setAiCvConsent(null);
    setAiCvLoading(true);
    setAiCvError("");
    setAiCvResult(null);
    try {
      const result = await fetchAICvTailoring({
        jobTitle: title,
        jobDescription: desc,
        profileSummary: profileToSend,
      });
      setAiCvResult(result);
    } catch (err) {
      setAiCvError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setAiCvLoading(false);
    }
  }

  function handleAiPrepClick() {
    if (!aiSettings.aiEnabled) return;
    const { desc, title, profileToSend } = buildAIContext();
    setAiPrepConsent({
      taskLabel: "הכנה לראיון בעזרת AI",
      fields: [
        { label: "כותרת משרה", value: title || "לא צוין" },
        { label: "תיאור משרה", value: desc.length > 80 ? desc.slice(0, 80) + "…" : desc },
        { label: "פרופיל", value: profileToSend.length > 80 ? profileToSend.slice(0, 80) + "…" : profileToSend },
      ],
      textToSend: `${desc}\n\nפרופיל:\n${profileToSend}`,
      isRedacted: aiSettings.redactBeforeSend,
    });
  }

  async function handleConfirmAiPrep() {
    if (!aiPrepConsent) return;
    const { desc, title, profileToSend } = buildAIContext();
    setAiPrepConsent(null);
    setAiPrepLoading(true);
    setAiPrepError("");
    setAiPrepResult(null);
    try {
      const result = await fetchAIInterviewPrep({
        jobTitle: title,
        jobDescription: desc,
        profileSummary: profileToSend,
      });
      setAiPrepResult(result);
      setShowPrepResults(true);
      saveInterviewPrepCache(job.id, result);
    } catch (err) {
      setAiPrepError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setAiPrepLoading(false);
    }
  }

  function handleAiFullAnalysisClick() {
    if (!aiSettings.aiEnabled) return;
    const desc = aiSettings.redactBeforeSend
      ? redactPersonalInfo(job.jobDescription)
      : job.jobDescription;
    const title = aiSettings.redactBeforeSend
      ? redactPersonalInfo(job.roleTitle)
      : job.roleTitle;
    const profileText = profile ? buildProfileSummaryForAI(profile) : "";
    const profileToSend = aiSettings.redactBeforeSend
      ? redactPersonalInfo(profileText)
      : profileText;
    const companyToSend = aiSettings.redactBeforeSend
      ? redactPersonalInfo(companyInfo)
      : companyInfo;

    const fields: ConsentPayload["fields"] = [
      { label: "כותרת משרה", value: title || "לא צוין" },
      { label: "תיאור משרה", value: desc.length > 80 ? desc.slice(0, 80) + "…" : desc },
    ];
    if (companyToSend.trim()) {
      fields.push({ label: "מידע על חברה", value: companyToSend.length > 80 ? companyToSend.slice(0, 80) + "…" : companyToSend });
    }
    if (profileToSend.trim()) {
      fields.push({ label: "פרופיל", value: profileToSend.length > 80 ? profileToSend.slice(0, 80) + "…" : profileToSend });
    }

    setAiFullConsent({
      taskLabel: "ניתוח AI מקיף — שאלות ראיון מותאמות",
      fields,
      textToSend: [desc, companyToSend && `\nחברה:\n${companyToSend}`, profileToSend && `\nפרופיל:\n${profileToSend}`].filter(Boolean).join(""),
      isRedacted: aiSettings.redactBeforeSend,
    });
  }

  async function handleConfirmAiFullAnalysis() {
    if (!aiFullConsent) return;
    const desc = aiSettings.redactBeforeSend
      ? redactPersonalInfo(job.jobDescription)
      : job.jobDescription;
    const title = aiSettings.redactBeforeSend
      ? redactPersonalInfo(job.roleTitle)
      : job.roleTitle;
    const profileText = profile ? buildProfileSummaryForAI(profile) : "";
    const profileToSend = aiSettings.redactBeforeSend
      ? redactPersonalInfo(profileText)
      : profileText;
    const companyToSend = aiSettings.redactBeforeSend
      ? redactPersonalInfo(companyInfo)
      : companyInfo;

    setAiFullConsent(null);
    setAiFullLoading(true);
    setAiFullError("");
    setAiFullResult(null);
    setAddedProQs(new Set());
    setAddedPerQs(new Set());
    setSavedPrepFields(new Set());

    try {
      const result = await fetchAIJobFullAnalysis({
        jobTitle: title,
        jobDescription: desc,
        companyInfo: companyToSend,
        profileSummary: profileToSend,
      });
      setAiFullResult(result);
      setShowFullResults(true);
      saveFullAnalysisCacheData(job.id, {
        result,
        addedProQs: [],
        addedPerQs: [],
        savedPrepFields: [],
      });
    } catch (err) {
      setAiFullError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setAiFullLoading(false);
    }
  }

  function handleAddProfessionalQ(q: AIRawQuestion, index: number) {
    const alreadyExists = allQuestions.some(
      (existing) => existing.question.trim() === q.question.trim()
    );
    if (alreadyExists) {
      setDuplicateProQs((prev) => new Set(prev).add(index));
      return;
    }
    addQuestions([{
      question: q.question,
      shortAnswer: q.shortAnswer,
      simpleExplanation: q.simpleExplanation,
      example: q.example,
      whatToMention: q.whatToMention,
      commonMistakes: q.commonMistakes,
      tags: q.tags,
      category: q.category as ProfessionalQuestion["category"],
      topic: q.topic,
      difficulty: q.difficulty,
    }], "ai");
    const newProQs = new Set(addedProQs).add(index);
    setAddedProQs(newProQs);
    if (aiFullResult) {
      saveFullAnalysisCacheData(job.id, {
        result: aiFullResult,
        addedProQs: Array.from(newProQs),
        addedPerQs: Array.from(addedPerQs),
        savedPrepFields: Array.from(savedPrepFields),
      });
    }
  }

  function handleAddPersonalQ(q: AIPersonalQuestion, index: number) {
    const alreadyExists = allQuestions.some(
      (existing) => existing.question.trim() === q.question.trim()
    );
    if (alreadyExists) {
      setDuplicatePerQs((prev) => new Set(prev).add(index));
      return;
    }
    const topicMap: Record<string, string> = {
      behavioral: "שאלה התנהגותית",
      motivational: "מוטיבציה",
      situational: "שאלה מצבית",
      personal: "שאלה אישית",
    };
    addQuestions([{
      question: q.question,
      shortAnswer: q.suggestedAnswer.slice(0, 300),
      simpleExplanation: q.suggestedAnswer,
      example: q.followUpQuestions.join("\n"),
      whatToMention: q.tips,
      commonMistakes: [],
      tags: ["אישי", "ראיון"],
      category: "Personal",
      topic: topicMap[q.type] ?? "שאלה אישית",
      difficulty: "basic",
    }], "ai");
    const newPerQs = new Set(addedPerQs).add(index);
    setAddedPerQs(newPerQs);
    if (aiFullResult) {
      saveFullAnalysisCacheData(job.id, {
        result: aiFullResult,
        addedProQs: Array.from(addedProQs),
        addedPerQs: Array.from(newPerQs),
        savedPrepFields: Array.from(savedPrepFields),
      });
    }
  }

  function handleSavePrepSuggestion(field: PrepField, value: string) {
    savePrep(field, value);
    const newSavedFields = new Set(savedPrepFields).add(field);
    setSavedPrepFields(newSavedFields);
    if (aiFullResult) {
      saveFullAnalysisCacheData(job.id, {
        result: aiFullResult,
        addedProQs: Array.from(addedProQs),
        addedPerQs: Array.from(addedPerQs),
        savedPrepFields: Array.from(newSavedFields),
      });
    }
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
            <h2 className="job-details-role">{job.roleTitle}</h2>
            <p className="job-details-company">{job.companyName}</p>
          </div>
          <span className={`status-badge status-badge--${job.status}`}>
            {STATUS_LABELS[job.status] ?? job.status}
          </span>
        </div>

        <div className="details-grid">
          {job.jobNumber && (
            <div className="details-grid__item">
              <span className="details-grid__label">מספר משרה</span>
              <span className="details-grid__value">{job.jobNumber}</span>
            </div>
          )}
          {job.location && (
            <div className="details-grid__item">
              <span className="details-grid__label">מיקום</span>
              <span className="details-grid__value">📍 {job.location}</span>
            </div>
          )}
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
          {job.salaryRange && (
            <div className="details-grid__item">
              <span className="details-grid__label">טווח שכר</span>
              <span className="details-grid__value">{job.salaryRange}</span>
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

      <SalaryCard category={job.category} salaryRange={job.salaryRange} />

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

        {aiSettings.aiEnabled && profile && !isProfileEmpty(profile) && job.jobDescription.trim() && (
          <div style={{ marginTop: "14px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
            <p className="cv-tailoring-section__title" style={{ marginBottom: "8px" }}>
              התאמת קורות חיים בעזרת AI
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--ai btn--sm"
                onClick={handleAiCvClick}
                disabled={aiCvLoading}
              >
                {aiCvLoading ? "⏳ מנתח…" : "✨ התאמה בעזרת AI"}
              </button>
              {aiCvResult && (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setAiCvResult(null)}
                >
                  סגירה
                </button>
              )}
            </div>
            {aiCvError && <p className="ai-error-msg">{aiCvError}</p>}
            {aiCvResult && <AICvTailoringAIResults result={aiCvResult} />}
          </div>
        )}

        {!aiSettings.aiEnabled && (
          <p className="prep-section__helper" style={{ marginTop: "14px" }}>
            הבדיקה מתבצעת מקומית בלבד לפי הפרופיל ותיאור המשרה השמורים בדפדפן.
            המידע אינו נשלח לשרת חיצוני. להפעיל AI בהגדרות כדי לקבל ניתוח מעמיק יותר.
          </p>
        )}
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

      <div className="card">
        <h3 className="card__title">✨ שאלות ראיון מותאמות למשרה הזו</h3>
        {!aiSettings.aiEnabled ? (
          <p className="prep-section__helper">
            AI כבוי. ניתן להפעיל ב"הפרופיל שלי" כדי לקבל שאלות ראיון מותאמות.
          </p>
        ) : !job.jobDescription.trim() ? (
          <p className="prep-section__helper">
            כדי לנתח, יש להוסיף תיאור משרה לכרטיס המשרה.
          </p>
        ) : (
          <>
            <p className="prep-section__helper">
              AI יצור שאלות מקצועיות ואישיות מותאמות לתיאור המשרה ולפרופיל שלך —
              ותוכלי להוסיף כל שאלה ישירות למאגר השאלות שלך.
            </p>

            <div className="job-ai-company-row">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => setShowCompanyInput((v) => !v)}
              >
                {showCompanyInput ? "− הסתר מידע על החברה" : "+ הוסף מידע על החברה (אופציונלי)"}
              </button>
            </div>

            {showCompanyInput && (
              <div className="form-group" style={{ marginTop: "10px" }}>
                <label className="form-label" htmlFor="job-company-info">
                  מידע על החברה
                </label>
                <textarea
                  id="job-company-info"
                  className="form-input form-textarea"
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  placeholder="הדבק כאן מידע על החברה — מוצרים, שוק, תרבות, גודל צוות..."
                  rows={3}
                />
              </div>
            )}

            <div className="btn-row" style={{ marginTop: "12px" }}>
              <button
                type="button"
                className="btn btn--ai btn--sm"
                onClick={handleAiFullAnalysisClick}
                disabled={aiFullLoading}
              >
                {aiFullLoading ? "⏳ מנתח…" : aiFullResult ? "✨ נתח שוב" : "✨ נתח ויצור שאלות ראיון"}
              </button>
              {aiFullResult && (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setShowFullResults((v) => !v)}
                >
                  {showFullResults ? "הסתר תוצאות" : "הצג תוצאות"}
                </button>
              )}
            </div>

            {aiFullLoading && (
              <div className="ai-qa-thinking" role="status" aria-live="polite">
                <span className="ai-qa-thinking__dots">
                  <span /><span /><span />
                </span>
                <span>AI מנתח את המשרה…</span>
              </div>
            )}

            {!aiFullLoading && aiFullError && (
              <p className="ai-error-msg">{aiFullError}</p>
            )}

            {aiFullResult && showFullResults && (
              <div className="job-ai-results">

                {aiFullResult.cvReview && (
                  <div className="job-ai-results__section">
                    <AICvReviewCard cvReview={aiFullResult.cvReview} />
                  </div>
                )}

                <div className="job-ai-results__section">
                  <h4 className="job-ai-results__section-title">
                    שאלות מקצועיות ({aiFullResult.professionalQuestions.length})
                  </h4>
                  <p className="prep-section__helper">
                    לחצי "+ הוסף למאגר" כדי לשמור שאלה במאגר השאלות המקצועיות שלך.
                  </p>
                  <div className="job-ai-results__q-list">
                    {aiFullResult.professionalQuestions.map((q, i) => (
                      <AIProQCard
                        key={i}
                        q={q}
                        added={addedProQs.has(i)}
                        isDuplicate={duplicateProQs.has(i)}
                        onAdd={() => handleAddProfessionalQ(q, i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="job-ai-results__section">
                  <h4 className="job-ai-results__section-title">
                    שאלות אישיות / התנהגותיות ({aiFullResult.personalQuestions.length})
                  </h4>
                  <p className="prep-section__helper">
                    שאלות מותאמות לפרופיל שלך עם טיוטת תשובה.
                  </p>
                  <div className="job-ai-results__q-list">
                    {aiFullResult.personalQuestions.map((q, i) => (
                      <AIPerQCard
                        key={i}
                        q={q}
                        added={addedPerQs.has(i)}
                        isDuplicate={duplicatePerQs.has(i)}
                        onAdd={() => handleAddPersonalQ(q, i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="job-ai-results__section">
                  <h4 className="job-ai-results__section-title">הצעות לחומר הכנה</h4>
                  <p className="prep-section__helper">
                    לחצי "שמור" כדי להעתיק את ההצעה לסעיף ההכנה המתאים.
                  </p>
                  <PrepSuggestionCard
                    title="דרישות מרכזיות מהמשרה"
                    value={aiFullResult.prepSuggestions.keyRequirements}
                    saved={savedPrepFields.has("keyRequirements")}
                    onSave={() => handleSavePrepSuggestion("keyRequirements", aiFullResult!.prepSuggestions.keyRequirements)}
                  />
                  <PrepSuggestionCard
                    title="מה אני צריכה ללמוד"
                    value={aiFullResult.prepSuggestions.skillsToLearn}
                    saved={savedPrepFields.has("skillsToLearn")}
                    onSave={() => handleSavePrepSuggestion("skillsToLearn", aiFullResult!.prepSuggestions.skillsToLearn)}
                  />
                  <PrepSuggestionCard
                    title="הכנה לשיחה טלפונית"
                    value={aiFullResult.prepSuggestions.phoneScreenNotes}
                    saved={savedPrepFields.has("phoneScreenNotes")}
                    onSave={() => handleSavePrepSuggestion("phoneScreenNotes", aiFullResult!.prepSuggestions.phoneScreenNotes)}
                  />
                  {aiFullResult.prepSuggestions.companyResearch && aiFullResult.prepSuggestions.companyResearch !== "לא סופק מידע על החברה" && (
                    <PrepSuggestionCard
                      title="מחקר על החברה"
                      value={aiFullResult.prepSuggestions.companyResearch}
                      saved={savedPrepFields.has("companyResearch")}
                      onSave={() => handleSavePrepSuggestion("companyResearch", aiFullResult!.prepSuggestions.companyResearch)}
                    />
                  )}
                  {aiFullResult.prepSuggestions.suggestedSalary && (
                    <div className="job-ai-salary-card">
                      <p className="job-ai-salary-card__label">💰 טווח שכר מוצע לדרוש</p>
                      <p className="job-ai-salary-card__value">{aiFullResult.prepSuggestions.suggestedSalary}</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}
      </div>

      <div className="card">
        <h3 className="card__title">הכנה לראיון בעזרת AI</h3>
        {!aiSettings.aiEnabled ? (
          <p className="prep-section__helper">
            AI כבוי. ניתן להפעיל ב"הפרופיל שלי" כדי לקבל תוכנית הכנה מותאמת לראיון.
          </p>
        ) : !job.jobDescription.trim() ? (
          <p className="prep-section__helper">
            כדי לקבל הכנה בעזרת AI, יש להוסיף תיאור משרה לכרטיס המשרה.
          </p>
        ) : (
          <>
            <p className="prep-section__helper">
              בניית תוכנית הכנה מותאמת — שאלות צפויות, נושאים לחזור עליהם, פיץ׳ אישי ושאלות לשאול.
            </p>
            <div className="btn-row" style={{ marginTop: "12px" }}>
              <button
                type="button"
                className="btn btn--ai btn--sm"
                onClick={handleAiPrepClick}
                disabled={aiPrepLoading}
              >
                {aiPrepLoading ? "⏳ מכין תוכנית…" : aiPrepResult ? "✨ נתח שוב" : "✨ בניית תוכנית הכנה בעזרת AI"}
              </button>
              {aiPrepResult && (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setShowPrepResults((v) => !v)}
                >
                  {showPrepResults ? "הסתר" : "הצג"}
                </button>
              )}
            </div>
            {aiPrepError && <p className="ai-error-msg">{aiPrepError}</p>}
            {aiPrepResult && showPrepResults && <AIInterviewPrepResults result={aiPrepResult} />}
          </>
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

      <div className="card chat-card">
        <h3 className="card__title">שיח חופשי עם AI</h3>
        {!aiSettings.aiEnabled ? (
          <p className="prep-section__helper">AI כבוי. ניתן להפעיל ב"הפרופיל שלי".</p>
        ) : (
          <>
            <p className="prep-section__helper">
              שאלי כל שאלה — תקבלי תשובה קצרה וממוקדת מוכנה לראיון. כל תשובה ניתן להוסיף ישירות למאגר השאלות.
            </p>
            <div className="chat-messages">
              {chatMessages.length === 0 && (
                <p className="chat-empty">התחילי לשאול שאלה...</p>
              )}
              {chatMessages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="chat-msg chat-msg--user">
                    <p className="chat-msg__text">{msg.text}</p>
                  </div>
                ) : (
                  <div key={msg.id} className="chat-msg chat-msg--ai">
                    <p className="chat-msg__text">{msg.text}</p>
                    {msg.result && msg.result.keyPoints.length > 0 && (
                      <ul className="chat-msg__points">
                        {msg.result.keyPoints.map((kp, i) => (
                          <li key={i}>{kp}</li>
                        ))}
                      </ul>
                    )}
                    {msg.result && (
                      <div className="chat-msg__footer">
                        <div className="chat-msg__meta">
                          <span className="chip chip--category chip--sm">
                            {CATEGORY_LABELS[msg.result.suggestedCategory as keyof typeof CATEGORY_LABELS] ?? msg.result.suggestedCategory}
                          </span>
                          <span className="chip chip--topic chip--sm">{msg.result.suggestedTopic}</span>
                          <span className={`chip chip--difficulty chip--difficulty-${msg.result.suggestedDifficulty} chip--sm`}>
                            {DIFFICULTY_LABELS[msg.result.suggestedDifficulty]}
                          </span>
                        </div>
                        <button
                          type="button"
                          className={`btn btn--sm ${msg.addedToBank ? "btn--secondary" : "btn--primary"}`}
                          onClick={() => handleChatAddToBank(msg)}
                          disabled={msg.addedToBank}
                        >
                          {msg.addedToBank ? "✓ נוסף למאגר" : "+ הוסף למאגר"}
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
              {chatLoading && (
                <div className="chat-msg chat-msg--ai chat-msg--loading">
                  <span className="chat-loading-dots">
                    <span /><span /><span />
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                className="form-input chat-input"
                placeholder="שאלי שאלה — לדוגמה: מה זה mutex?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleChatSend();
                  }
                }}
                disabled={chatLoading}
                dir="rtl"
              />
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => void handleChatSend()}
                disabled={chatLoading || !chatInput.trim()}
              >
                שלח
              </button>
            </div>
          </>
        )}
      </div>

      {aiCvConsent && (
        <AIConsentModal
          payload={aiCvConsent}
          onConfirm={handleConfirmAiCv}
          onCancel={() => setAiCvConsent(null)}
        />
      )}
      {aiPrepConsent && (
        <AIConsentModal
          payload={aiPrepConsent}
          onConfirm={handleConfirmAiPrep}
          onCancel={() => setAiPrepConsent(null)}
        />
      )}
      {aiFullConsent && (
        <AIConsentModal
          payload={aiFullConsent}
          onConfirm={handleConfirmAiFullAnalysis}
          onCancel={() => setAiFullConsent(null)}
        />
      )}
    </div>
  );
}

export default JobDetailsPage;
