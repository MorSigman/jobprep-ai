import { useState, useMemo, useRef, useEffect } from "react";
import type {
  ProfessionalQuestion,
  QuestionCategory,
  QuestionDifficulty,
  QuestionSource,
} from "../types/professionalQuestion";
import type { UserProfile } from "../types/profile";
import { useProfessionalQuestions } from "../hooks/useProfessionalQuestions";
import { usePracticeProgress } from "../hooks/usePracticeProgress";
import type { ProgressMap } from "../hooks/usePracticeProgress";
import { analyzeJobDescription, type AnalysisResult } from "../lib/jobDescriptionAnalyzer";
import { REALTIME_ENGINEER_PROFESSIONAL_QUESTIONS } from "../data/realtimeEngineerProfessionalQuestions";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from "../lib/questionLabels";
import { searchLocalQA } from "../lib/localQA";
import type { QAMatch } from "../lib/localQA";
import { useAISettings } from "../lib/useAISettings";
import { redactPersonalInfo } from "../lib/redactPersonalInfo";
import { fetchAIJobQuestions, fetchAIAnswer } from "../lib/aiClient";
import type { AIRawQuestion, AIAnswerResult } from "../lib/aiClient";
import { AIConsentModal } from "../components/AIConsentModal";
import type { ConsentPayload } from "../components/AIConsentModal";

type ViewMode = "cards" | "compact" | "table";

const ALL_CATEGORIES: QuestionCategory[] = [
  "General",
  "Data Analyst",
  "SQL",
  "QA",
  "Frontend",
  "Backend",
  "JavaScript",
  "Cyber",
  "Git",
  "Projects",
  "Technical Thinking",
  "Protocols",
  "Architecture",
  "Cpp",
  "Embedded",
  "Machine Learning",
  "Deep Learning",
  "AI",
  "Personal",
];

// ─── Full Card ─────────────────────────────────────────────────────────────

type CardProps = {
  q: ProfessionalQuestion;
  onDelete?: (id: string) => void;
};

function QuestionCard({ q, onDelete }: CardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`pq-card${q.source !== "demo" ? " pq-card--user" : ""}`}>
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className="chip chip--category">{CATEGORY_LABELS[q.category]}</span>
          <span className={`chip chip--difficulty chip--difficulty-${q.difficulty}`}>
            {DIFFICULTY_LABELS[q.difficulty]}
          </span>
          {q.source === "user" && <span className="chip chip--user">שאלה שלי</span>}
          {q.source === "job-description" && <span className="chip chip--job-desc">נוצר מתיאור משרה</span>}
          {q.source === "ai" && <span className="chip chip--ai">נוצר בעזרת AI</span>}
        </div>
        {onDelete && q.source !== "demo" && (
          <button
            type="button"
            className="pq-card__delete"
            onClick={() => onDelete(q.id)}
            title="מחיקת שאלה"
          >
            ✕
          </button>
        )}
      </div>

      <p className="pq-card__topic">{q.topic}</p>
      <h3 className="pq-card__question">{q.question}</h3>
      <p className="pq-card__answer">{q.shortAnswer}</p>

      <div className="pq-card__toggles">
        <button
          type="button"
          className="pq-toggle-btn"
          aria-expanded={showExplanation}
          onClick={() => setShowExplanation((v) => !v)}
        >
          {showExplanation ? "− הרחבה" : "+ הרחבה"}
        </button>
        <button
          type="button"
          className="pq-toggle-btn"
          aria-expanded={showExample}
          onClick={() => setShowExample((v) => !v)}
        >
          {showExample ? "− דוגמה" : "+ דוגמה"}
        </button>
        {(q.whatToMention.length > 0 || q.commonMistakes.length > 0 || q.tags.length > 0) && (
          <button
            type="button"
            className="pq-toggle-btn"
            aria-expanded={showDetails}
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? "− פרטים נוספים" : "+ פרטים נוספים"}
          </button>
        )}
      </div>

      {showExplanation && q.simpleExplanation && (
        <div className="pq-expandable">
          <p className="pq-expandable__label">הרחבה</p>
          <p className="pq-expandable__text">{q.simpleExplanation}</p>
        </div>
      )}

      {showExample && q.example && (
        <div className="pq-expandable">
          <p className="pq-expandable__label">דוגמה</p>
          <p className="pq-expandable__text">{q.example}</p>
        </div>
      )}

      {showDetails && (
        <div className="pq-expandable">
          {q.whatToMention.length > 0 && (
            <>
              <p className="pq-expandable__label">מה כדאי להזכיר</p>
              <ul className="pq-expandable__list">
                {q.whatToMention.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </>
          )}
          {q.commonMistakes.length > 0 && (
            <>
              <p className="pq-expandable__label">טעויות נפוצות</p>
              <ul className="pq-expandable__list pq-expandable__list--warn">
                {q.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </>
          )}
          {q.tags.length > 0 && (
            <div className="chip-row" style={{ marginTop: "8px" }}>
              {q.tags.map((tag) => (
                <span key={tag} className="chip chip--tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Compact Card ───────────────────────────────────────────────────────────

function CompactCard({ q, onDelete }: CardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExample, setShowExample] = useState(false);

  return (
    <div className={`pq-card pq-card--compact${q.source !== "demo" ? " pq-card--user" : ""}`}>
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className="chip chip--category">{CATEGORY_LABELS[q.category]}</span>
          <span className="chip chip--topic">{q.topic}</span>
          <span className={`chip chip--difficulty chip--difficulty-${q.difficulty}`}>
            {DIFFICULTY_LABELS[q.difficulty]}
          </span>
          {q.source === "user" && <span className="chip chip--user">שאלה שלי</span>}
          {q.source === "job-description" && <span className="chip chip--job-desc">נוצר מתיאור משרה</span>}
          {q.source === "ai" && <span className="chip chip--ai">נוצר בעזרת AI</span>}
        </div>
        {onDelete && q.source !== "demo" && (
          <button
            type="button"
            className="pq-card__delete"
            onClick={() => onDelete(q.id)}
            title="מחיקת שאלה"
          >
            ✕
          </button>
        )}
      </div>

      <h3 className="pq-card__question">{q.question}</h3>
      <p className="pq-card__answer">{q.shortAnswer}</p>

      <div className="pq-card__toggles">
        <button
          type="button"
          className="pq-toggle-btn"
          aria-expanded={showExplanation}
          onClick={() => setShowExplanation((v) => !v)}
        >
          {showExplanation ? "− הרחבה" : "+ הרחבה"}
        </button>
        <button
          type="button"
          className="pq-toggle-btn"
          aria-expanded={showExample}
          onClick={() => setShowExample((v) => !v)}
        >
          {showExample ? "− דוגמה" : "+ דוגמה"}
        </button>
      </div>

      {showExplanation && q.simpleExplanation && (
        <div className="pq-expandable">
          <p className="pq-expandable__label">הרחבה</p>
          <p className="pq-expandable__text">{q.simpleExplanation}</p>
        </div>
      )}

      {showExample && q.example && (
        <div className="pq-expandable">
          <p className="pq-expandable__label">דוגמה</p>
          <p className="pq-expandable__text">{q.example}</p>
        </div>
      )}
    </div>
  );
}

// ─── Table View ─────────────────────────────────────────────────────────────

type TableExpanded = Record<string, { explanation: boolean; example: boolean }>;

function QuestionsTable({
  questions,
  onDelete,
}: {
  questions: ProfessionalQuestion[];
  onDelete?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<TableExpanded>({});

  function toggle(id: string, field: "explanation" | "example") {
    setExpanded((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: !prev[id]?.[field] },
    }));
  }

  return (
    <div className="table-view-wrapper">
      <table className="questions-table" dir="rtl">
        <thead>
          <tr>
            <th>תחום</th>
            <th>נושא</th>
            <th>רמה</th>
            <th>שאלה</th>
            <th>תשובה קצרה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => {
            const expRow = expanded[q.id];
            const showExp = expRow?.explanation ?? false;
            const showEx = expRow?.example ?? false;

            return (
              <>
                <tr
                  key={q.id}
                  className={q.source !== "demo" ? "table-row--user" : ""}
                >
                  <td>
                    <span className="chip chip--category chip--sm">
                      {CATEGORY_LABELS[q.category]}
                    </span>
                  </td>
                  <td className="table-cell--topic">{q.topic}</td>
                  <td>
                    <span className={`chip chip--difficulty chip--difficulty-${q.difficulty} chip--sm`}>
                      {DIFFICULTY_LABELS[q.difficulty]}
                    </span>
                  </td>
                  <td className="table-cell--question">{q.question}</td>
                  <td className="table-cell--answer">{q.shortAnswer}</td>
                  <td className="table-cell--actions">
                    <button
                      type="button"
                      className="table-action-button"
                      aria-expanded={showExp}
                      onClick={() => toggle(q.id, "explanation")}
                    >
                      {showExp ? "− הרחבה" : "+ הרחבה"}
                    </button>
                    <button
                      type="button"
                      className="table-action-button"
                      aria-expanded={showEx}
                      onClick={() => toggle(q.id, "example")}
                    >
                      {showEx ? "− דוגמה" : "+ דוגמה"}
                    </button>
                    {onDelete && q.source !== "demo" && (
                      <button
                        type="button"
                        className="table-action-button table-action-button--delete"
                        onClick={() => onDelete(q.id)}
                      >
                        מחק
                      </button>
                    )}
                  </td>
                </tr>
                {(showExp || showEx) && (
                  <tr key={`${q.id}-expanded`} className="questions-table-expanded-row">
                    <td colSpan={6}>
                      {showExp && (
                        <div className="table-expanded-section">
                          <span className="pq-expandable__label">הרחבה: </span>
                          {q.simpleExplanation}
                        </div>
                      )}
                      {showEx && (
                        <div className="table-expanded-section">
                          <span className="pq-expandable__label">דוגמה: </span>
                          {q.example}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Practice Mode ──────────────────────────────────────────────────────────

type PracticeModeProps = {
  questions: ProfessionalQuestion[];
  progress: ProgressMap;
  onRecordResult: (id: string, result: "known" | "review") => void;
  onResetProgress: () => void;
  onExit: () => void;
};

function PracticeMode({
  questions,
  progress,
  onRecordResult,
  onResetProgress,
  onExit,
}: PracticeModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewOnly, setReviewOnly] = useState(false);

  const questionsRef = useRef(questions);
  useEffect(() => {
    if (questions !== questionsRef.current) {
      questionsRef.current = questions;
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  }, [questions]);

  const practiceList = useMemo(
    () =>
      reviewOnly
        ? questions.filter((q) => {
            const p = progress[q.id];
            return p && (p.lastResult === "review" || p.timesNeedsReview > 0);
          })
        : questions,
    [questions, progress, reviewOnly]
  );

  const safeIndex = Math.min(currentIndex, Math.max(0, practiceList.length - 1));
  const current = practiceList[safeIndex];

  const stats = useMemo(
    () =>
      questions.reduce(
        (acc, q) => {
          const p = progress[q.id];
          if (p) {
            acc.practiced += 1;
            acc.known += p.timesKnown;
            acc.review += p.timesNeedsReview;
          }
          return acc;
        },
        { practiced: 0, known: 0, review: 0 }
      ),
    [questions, progress]
  );

  function goNext() {
    if (safeIndex < practiceList.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
    setShowAnswer(false);
  }

  function goPrev() {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setShowAnswer(false);
    }
  }

  function handleResult(result: "known" | "review") {
    if (!current) return;
    onRecordResult(current.id, result);
    setShowAnswer(false);
    if (safeIndex < practiceList.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  }

  function handleReset() {
    if (window.confirm("האם לאפס את התקדמות התרגול? השאלות עצמן לא יימחקו.")) {
      onResetProgress();
    }
  }

  function handleToggleReview() {
    setReviewOnly((v) => !v);
    setCurrentIndex(0);
    setShowAnswer(false);
  }

  return (
    <div className="practice-mode-panel">
      <div className="practice-mode-header">
        <div className="practice-mode-header__top">
          <h3 className="practice-mode-title">מצב תרגול</h3>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={onExit}
          >
            יציאה מתרגול
          </button>
        </div>

        <div className="practice-stats">
          <span>תורגלו: <strong>{stats.practiced}</strong></span>
          <span>ידעתי: <strong>{stats.known}</strong></span>
          <span>צריך חזרה: <strong>{stats.review}</strong></span>
        </div>

        <div className="practice-mode-controls">
          <button
            type="button"
            className={`btn btn--sm ${reviewOnly ? "btn--primary" : "btn--secondary"}`}
            aria-pressed={reviewOnly}
            onClick={handleToggleReview}
          >
            {reviewOnly ? "✓ שאלות לחזרה בלבד" : "תרגול שאלות שצריך לחזור עליהן"}
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={handleReset}
          >
            איפוס התקדמות תרגול
          </button>
        </div>
      </div>

      {practiceList.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__text">
            {reviewOnly
              ? "אין כרגע שאלות שסומנו לחזרה."
              : "אין שאלות לתרגול לפי הסינון הנוכחי."}
          </p>
        </div>
      ) : (
        <>
          <p className="practice-progress">
            שאלה <strong>{safeIndex + 1}</strong> מתוך {practiceList.length}
          </p>

          <div className="practice-card">
            <div className="pq-card__meta">
              <span className="chip chip--category">
                {CATEGORY_LABELS[current.category]}
              </span>
              <span className="chip chip--topic chip--sm">{current.topic}</span>
              <span
                className={`chip chip--difficulty chip--difficulty-${current.difficulty} chip--sm`}
              >
                {DIFFICULTY_LABELS[current.difficulty]}
              </span>
            </div>

            {progress[current.id] && (
              <p className="practice-past-hint">
                תורגל {progress[current.id].timesPracticed} פעמים ·{" "}
                פעם אחרונה: {progress[current.id].lastPracticedAt}
              </p>
            )}

            <h3 className="practice-card-question">{current.question}</h3>

            <button
              type="button"
              className="btn btn--primary"
              aria-expanded={showAnswer}
              onClick={() => setShowAnswer((v) => !v)}
            >
              {showAnswer ? "הסתר תשובה" : "הצג תשובה"}
            </button>

            {showAnswer && (
              <div className="practice-card-answer" aria-live="polite">
                <div className="practice-answer-section">
                  <p className="pq-expandable__label">תשובה קצרה</p>
                  <p>{current.shortAnswer}</p>
                </div>

                {current.simpleExplanation && (
                  <div className="practice-answer-section">
                    <p className="pq-expandable__label">הרחבה</p>
                    <p className="pq-expandable__text">{current.simpleExplanation}</p>
                  </div>
                )}

                {current.example && (
                  <div className="practice-answer-section">
                    <p className="pq-expandable__label">דוגמה</p>
                    <p>{current.example}</p>
                  </div>
                )}

                {current.whatToMention.length > 0 && (
                  <div className="practice-answer-section">
                    <p className="pq-expandable__label">מה כדאי להזכיר</p>
                    <ul className="pq-expandable__list">
                      {current.whatToMention.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {current.commonMistakes.length > 0 && (
                  <div className="practice-answer-section">
                    <p className="pq-expandable__label">טעויות נפוצות</p>
                    <ul className="pq-expandable__list pq-expandable__list--warn">
                      {current.commonMistakes.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="practice-actions">
                  <button
                    type="button"
                    className="practice-result-button practice-result-button--known"
                    onClick={() => handleResult("known")}
                  >
                    ידעתי ✓
                  </button>
                  <button
                    type="button"
                    className="practice-result-button practice-result-button--review"
                    onClick={() => handleResult("review")}
                  >
                    צריך חזרה ↺
                  </button>
                </div>
              </div>
            )}

            <div className="practice-nav">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                disabled={safeIndex === 0}
                onClick={goPrev}
              >
                שאלה קודמת
              </button>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                disabled={safeIndex >= practiceList.length - 1}
                onClick={goNext}
              >
                שאלה הבאה
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── AI Result Card ─────────────────────────────────────────────────────────

type AIResultCardProps = {
  q: AIRawQuestion;
  selected: boolean;
  onToggle: () => void;
};

function AIResultCard({ q, selected, onToggle }: AIResultCardProps) {
  const [showExpand, setShowExpand] = useState(false);
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="ai-result-card">
      <input
        type="checkbox"
        className="ai-result-card__checkbox"
        checked={selected}
        onChange={onToggle}
        aria-label={`בחר שאלה: ${q.question}`}
      />
      <div className="ai-result-card__body">
        <div className="ai-result-card__meta">
          <span className="chip chip--category chip--sm">
            {(CATEGORY_LABELS as Record<string, string>)[q.category] ?? q.category}
          </span>
          <span className="chip chip--topic chip--sm">{q.topic}</span>
          <span className={`chip chip--difficulty chip--difficulty-${q.difficulty} chip--sm`}>
            {DIFFICULTY_LABELS[q.difficulty]}
          </span>
        </div>
        <p className="ai-result-card__question">{q.question}</p>
        <p className="ai-result-card__answer">{q.shortAnswer}</p>
        <div className="ai-result-card__toggles">
          {q.simpleExplanation && (
            <button
              type="button"
              className="pq-toggle-btn"
              onClick={() => setShowExpand((v) => !v)}
            >
              {showExpand ? "− הרחבה" : "+ הרחבה"}
            </button>
          )}
          {q.example && (
            <button
              type="button"
              className="pq-toggle-btn"
              onClick={() => setShowExample((v) => !v)}
            >
              {showExample ? "− דוגמה" : "+ דוגמה"}
            </button>
          )}
        </div>
        {showExpand && q.simpleExplanation && (
          <div className="ai-result-expanded">
            <p className="ai-result-expanded__label">הרחבה</p>
            <p>{q.simpleExplanation}</p>
          </div>
        )}
        {showExample && q.example && (
          <div className="ai-result-expanded">
            <p className="ai-result-expanded__label">דוגמה</p>
            <p>{q.example}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Job Description Analyzer ──────────────────────────────────────────────

const JD_TITLE_KEY = "jobprep-ai-jd-title";
const JD_DESC_KEY = "jobprep-ai-jd-desc";
const JD_AI_KEY = "jobprep-ai-jd-ai-results";

function loadJdStr(key: string): string {
  try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
}
function loadJdAiResults(): AIRawQuestion[] {
  try {
    const raw = localStorage.getItem(JD_AI_KEY);
    return raw ? (JSON.parse(raw) as AIRawQuestion[]) : [];
  } catch { return []; }
}

type AnalyzerProps = {
  allQuestions: ProfessionalQuestion[];
  onAddQuestions: (
    qs: Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">[]
  ) => void;
  onAddAIQuestions: (
    qs: Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">[]
  ) => void;
  categoryLabels: Record<QuestionCategory, string>;
  aiEnabled: boolean;
  redactBeforeSend: boolean;
  profileSummary?: string;
};

function JobDescriptionAnalyzer({
  allQuestions,
  onAddQuestions,
  onAddAIQuestions,
  categoryLabels,
  aiEnabled,
  redactBeforeSend,
  profileSummary,
}: AnalyzerProps) {
  const _savedAiResults = loadJdAiResults();
  const _savedTitle = loadJdStr(JD_TITLE_KEY);
  const _savedDesc = loadJdStr(JD_DESC_KEY);

  const [open, setOpen] = useState(() => !!_savedDesc.trim() || !!_savedAiResults.length);
  const [jobTitle, setJobTitle] = useState(() => _savedTitle);
  const [jobDesc, setJobDesc] = useState(() => _savedDesc);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [addedMsg, setAddedMsg] = useState(false);

  // AI state
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState("");
  const [aiResults, setAIResults] = useState<AIRawQuestion[]>(() => _savedAiResults);
  const [aiSelected, setAISelected] = useState<Set<number>>(
    () => new Set(_savedAiResults.map((_, i) => i))
  );
  const [aiAddedMsg, setAIAddedMsg] = useState(false);
  const [aiDisabledMsg, setAIDisabledMsg] = useState(false);
  const [consentPayload, setConsentPayload] = useState<ConsentPayload | null>(null);

  function handleAnalyze() {
    if (!jobDesc.trim()) return;
    const r = analyzeJobDescription(jobTitle, jobDesc, allQuestions);
    setResult(r);
    const allIndexes = new Set(r.suggestedNewQuestions.map((_, i) => i));
    setSelected(allIndexes);
    setAddedMsg(false);
  }

  function handleClear() {
    setJobTitle("");
    setJobDesc("");
    setResult(null);
    setSelected(new Set());
    setAddedMsg(false);
    setAIResults([]);
    setAISelected(new Set());
    setAIError("");
    setAIDisabledMsg(false);
    localStorage.removeItem(JD_TITLE_KEY);
    localStorage.removeItem(JD_DESC_KEY);
    localStorage.removeItem(JD_AI_KEY);
  }

  function toggleSelected(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleAddSelected() {
    if (!result) return;
    const toAdd = result.suggestedNewQuestions.filter((_, i) => selected.has(i));
    if (toAdd.length === 0) return;
    onAddQuestions(toAdd);
    setAddedMsg(true);
    setResult(null);
    setSelected(new Set());
  }

  // ─── AI handlers ──────────────────────────────────────────────────────────

  function handleAIClick() {
    if (!aiEnabled) {
      setAIDisabledMsg(true);
      return;
    }
    if (!jobDesc.trim()) return;
    setAIDisabledMsg(false);

    const descToSend = redactBeforeSend ? redactPersonalInfo(jobDesc) : jobDesc;
    const titleToSend = redactBeforeSend ? redactPersonalInfo(jobTitle) : jobTitle;

    setConsentPayload({
      taskLabel: "יצירת שאלות ראיון מתיאור משרה",
      fields: [
        { label: "כותרת משרה", value: titleToSend || "לא צוין" },
        {
          label: "תיאור משרה",
          value: descToSend.length > 80 ? descToSend.slice(0, 80) + "…" : descToSend,
        },
      ],
      textToSend: descToSend,
      isRedacted: redactBeforeSend,
    });
  }

  async function handleConfirmAI() {
    if (!consentPayload) return;
    const payload = consentPayload;
    setConsentPayload(null);
    setAILoading(true);
    setAIError("");
    setAIResults([]);

    try {
      const qs = await fetchAIJobQuestions({
        jobTitle: redactBeforeSend ? redactPersonalInfo(jobTitle) : jobTitle,
        jobCategory: "",
        jobDescription: payload.textToSend,
        optionalProfileSummary: profileSummary,
        taskType: "job-questions",
      });
      setAIResults(qs);
      setAISelected(new Set(qs.map((_, i) => i)));
      localStorage.setItem(JD_AI_KEY, JSON.stringify(qs));
    } catch (err) {
      setAIError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setAILoading(false);
    }
  }

  function toggleAISelected(i: number) {
    setAISelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleAddAISelected() {
    const toAdd = aiResults
      .filter((_, i) => aiSelected.has(i))
      .map((q) => ({
        category: (q.category as QuestionCategory) || "General",
        topic: q.topic || "כללי",
        difficulty: q.difficulty,
        question: q.question,
        shortAnswer: q.shortAnswer,
        simpleExplanation: q.simpleExplanation || "",
        example: q.example || "",
        whatToMention: Array.isArray(q.whatToMention) ? q.whatToMention : [],
        commonMistakes: Array.isArray(q.commonMistakes) ? q.commonMistakes : [],
        tags: Array.isArray(q.tags) ? q.tags : [],
      }));
    if (!toAdd.length) return;
    onAddAIQuestions(toAdd);
    setAIResults([]);
    setAISelected(new Set());
    setAIAddedMsg(true);
    localStorage.removeItem(JD_AI_KEY);
    setTimeout(() => setAIAddedMsg(false), 4000);
  }

  return (
    <>
      {consentPayload && (
        <AIConsentModal
          payload={consentPayload}
          onConfirm={handleConfirmAI}
          onCancel={() => setConsentPayload(null)}
        />
      )}

      <div className="job-description-analyzer card">
        <button
          type="button"
          className="analyzer-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "▲" : "▼"}</span>
          <span>יצירת שאלות מתיאור משרה</span>
        </button>

        {open && (
          <div className="job-description-analyzer-panel">
            <p className="analyzer-subtitle">
              המערכת מנתחת מקומית מילות מפתח ומציעה שאלות מתבניות קיימות.
              ניתן גם לשלוח ל-AI לקבלת שאלות מותאמות אישית.
            </p>

            <div className="pq-form-row">
              <div className="form-group">
                <label className="form-label">כותרת משרה</label>
                <input
                  type="text"
                  className="form-input"
                  value={jobTitle}
                  onChange={(e) => { setJobTitle(e.target.value); localStorage.setItem(JD_TITLE_KEY, e.target.value); }}
                  placeholder="Data Analyst, QA Engineer, Frontend Developer..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">תיאור משרה</label>
              <textarea
                className="form-input form-textarea"
                rows={5}
                value={jobDesc}
                onChange={(e) => { setJobDesc(e.target.value); localStorage.setItem(JD_DESC_KEY, e.target.value); }}
                placeholder="הדביקי את תיאור המשרה כאן..."
              />
            </div>

            <div className="btn-row">
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleAnalyze}
                disabled={!jobDesc.trim()}
              >
                ניתוח תיאור משרה
              </button>
              <button
                type="button"
                className="btn btn--ai"
                onClick={handleAIClick}
                disabled={!jobDesc.trim() || aiLoading}
                title={
                  aiEnabled
                    ? "יצירת שאלות בעזרת AI"
                    : "AI כבוי — הפעלי ב\"הפרופיל שלי\""
                }
              >
                {aiLoading ? "⏳ יוצר שאלות…" : "✨ יצירת שאלות בעזרת AI"}
              </button>
              {(result || jobDesc || aiResults.length > 0) && (
                <button type="button" className="btn btn--secondary" onClick={handleClear}>
                  ניקוי
                </button>
              )}
            </div>

            {aiDisabledMsg && (
              <div className="ai-disabled-msg" role="status">
                AI כבוי. אפשר להפעיל AI בהגדרות בעמוד{" "}
                <strong>הפרופיל שלי</strong> או להשתמש בניתוח המקומי.
              </div>
            )}

            {aiError && (
              <div className="ai-error-msg" role="alert">
                {aiError}
              </div>
            )}

            {aiLoading && (
              <div className="ai-loading" role="status">
                ⏳ שולח לשרת AI ומחכה לתשובה…
              </div>
            )}

            {addedMsg && (
              <p className="pq-added-msg" role="status">
                השאלות נוספו למאגר ונשמרו מקומית.
              </p>
            )}

            {aiAddedMsg && (
              <p className="pq-added-msg" role="status">
                שאלות ה-AI נוספו למאגר ונשמרו מקומית.
              </p>
            )}

            {/* Local analysis results */}
            {result && (
              <div className="analyzer-results">
                <div className="analyzer-category-chips">
                  <span className="analyzer-label">קטגוריות שזוהו:</span>
                  {result.detectedCategories.map((cat) => (
                    <span key={cat} className="chip chip--category">
                      {categoryLabels[cat]}
                    </span>
                  ))}
                </div>

                {result.matchingExistingQuestions.length > 0 && (
                  <div className="analyzer-section">
                    <h4 className="analyzer-section-title">
                      שאלות קיימות במאגר שרלוונטיות למשרה ({result.matchingExistingQuestions.length})
                    </h4>
                    <ul className="analyzer-existing-list">
                      {result.matchingExistingQuestions.map((q) => (
                        <li key={q.id} className="analyzer-existing-item">
                          <span className="chip chip--category chip--sm">{categoryLabels[q.category]}</span>
                          <span>{q.question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.suggestedNewQuestions.length > 0 && (
                  <div className="analyzer-section">
                    <h4 className="analyzer-section-title">
                      שאלות חדשות מוצעות ({result.suggestedNewQuestions.length})
                    </h4>
                    <p className="analyzer-note">
                      סמני שאלות שתרצי להוסיף למאגר. הן ייוצגו עם תווית "נוצר מתיאור משרה".
                    </p>
                    <div className="analyzer-suggestion-list">
                      {result.suggestedNewQuestions.map((q, i) => (
                        <label key={i} className="analyzer-suggestion-card">
                          <input
                            type="checkbox"
                            checked={selected.has(i)}
                            onChange={() => toggleSelected(i)}
                          />
                          <div className="analyzer-suggestion-body">
                            <div className="analyzer-suggestion-meta">
                              <span className="chip chip--category chip--sm">{categoryLabels[q.category]}</span>
                              <span className="chip chip--topic chip--sm">{q.topic}</span>
                            </div>
                            <p className="analyzer-suggestion-q">{q.question}</p>
                            <p className="analyzer-suggestion-a">{q.shortAnswer}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="analyzer-actions btn-row">
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={handleAddSelected}
                        disabled={selected.size === 0}
                      >
                        הוספת שאלות נבחרות ({selected.size})
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() =>
                          setSelected(new Set(result.suggestedNewQuestions.map((_, i) => i)))
                        }
                      >
                        בחירת הכל
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => setSelected(new Set())}
                      >
                        ביטול בחירה
                      </button>
                    </div>
                  </div>
                )}

                {result.suggestedNewQuestions.length === 0 && (
                  <p className="analyzer-note">כל השאלות המוצעות כבר קיימות במאגר שלך.</p>
                )}
              </div>
            )}

            {/* AI results */}
            {aiResults.length > 0 && (
              <div className="ai-results">
                <p className="ai-results__title">שאלות שנוצרו בעזרת AI ({aiResults.length})</p>
                <p className="ai-results__subtitle">
                  סמני שאלות שתרצי להוסיף למאגר. הן ייוצגו עם תווית "נוצר בעזרת AI".
                </p>

                <div className="analyzer-suggestion-list">
                  {aiResults.map((q, i) => (
                    <AIResultCard
                      key={i}
                      q={q}
                      selected={aiSelected.has(i)}
                      onToggle={() => toggleAISelected(i)}
                    />
                  ))}
                </div>

                <div className="analyzer-actions btn-row" style={{ marginTop: "12px" }}>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleAddAISelected}
                    disabled={aiSelected.size === 0}
                  >
                    הוספת שאלות AI נבחרות ({aiSelected.size})
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setAISelected(new Set(aiResults.map((_, i) => i)))}
                  >
                    בחירת הכל
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setAISelected(new Set())}
                  >
                    ביטול בחירה
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      setAIResults([]);
                      setAISelected(new Set());
                    }}
                  >
                    ביטול תוצאות AI
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Local Q&A Panel ────────────────────────────────────────────────────────

type QAHistoryItem = {
  userQuery: string;
  match: ProfessionalQuestion;
  savedKey: string;
};

type LocalQAPanelProps = {
  allQuestions: ProfessionalQuestion[];
  onSave: (q: Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">) => void;
};

function LocalQAPanel({ allQuestions, onSave }: LocalQAPanelProps) {
  const [query, setQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [results, setResults] = useState<QAMatch[]>([]);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState<QAHistoryItem[]>([]);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const { settings: aiSettings } = useAISettings();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState<AIAnswerResult | null>(null);
  const [aiConsent, setAiConsent] = useState<ConsentPayload | null>(null);

  type AIEditDraft = {
    question: string;
    shortAnswer: string;
    simpleExplanation: string;
    example: string;
    category: QuestionCategory;
    difficulty: QuestionDifficulty;
    topic: string;
    whatToMentionRaw: string;
    commonMistakesRaw: string;
    tagsRaw: string;
  };
  const [editDraft, setEditDraft] = useState<AIEditDraft | null>(null);
  const [editSaved, setEditSaved] = useState(false);

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    const matches = searchLocalQA(q, allQuestions);
    setCurrentQuery(q);
    setResults(matches);
    setSearched(true);
    setAiResult(null);
    setAiError("");
    if (matches.length > 0) {
      setHistory((prev) =>
        [
          {
            userQuery: q,
            match: matches[0].question,
            savedKey: `${q}__${matches[0].question.id}`,
          },
          ...prev,
        ].slice(0, 5)
      );
    }
    setQuery("");
  }

  function handleAiAsk() {
    const q = query.trim();
    if (!q) return;
    const questionText = aiSettings.redactBeforeSend ? redactPersonalInfo(q) : q;
    setAiConsent({
      taskLabel: "תשובה לשאלת ראיון בעזרת AI",
      fields: [{ label: "שאלה", value: questionText }],
      textToSend: questionText,
      isRedacted: aiSettings.redactBeforeSend,
    });
  }

  async function handleConfirmAi() {
    if (!aiConsent) return;
    const questionText = aiConsent.textToSend;
    setAiConsent(null);
    setCurrentQuery(questionText);
    setResults([]);
    setSearched(false);
    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    setQuery("");
    try {
      const result = await fetchAIAnswer({ question: questionText });
      setAiResult(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setAiLoading(false);
    }
  }

  function handleOpenEdit() {
    if (!aiResult) return;
    setEditDraft({
      question: currentQuery,
      shortAnswer: aiResult.answer,
      simpleExplanation: aiResult.answer,
      example: aiResult.example,
      category: (aiResult.suggestedCategory as QuestionCategory) ?? "General",
      difficulty: aiResult.suggestedDifficulty ?? "intermediate",
      topic: aiResult.suggestedTopic ?? "",
      whatToMentionRaw: aiResult.keyPoints.join("\n"),
      commonMistakesRaw: aiResult.commonMistakes.join("\n"),
      tagsRaw: aiResult.relatedTopics.join(", "),
    });
    setEditSaved(false);
  }

  function handleSaveEdit() {
    if (!editDraft) return;
    onSave({
      category: editDraft.category,
      topic: editDraft.topic,
      difficulty: editDraft.difficulty,
      question: editDraft.question,
      shortAnswer: editDraft.shortAnswer,
      simpleExplanation: editDraft.simpleExplanation,
      example: editDraft.example,
      whatToMention: editDraft.whatToMentionRaw.split("\n").map((s) => s.trim()).filter(Boolean),
      commonMistakes: editDraft.commonMistakesRaw.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: editDraft.tagsRaw.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setEditSaved(true);
    setEditDraft(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  function handleSave(userQuery: string, match: ProfessionalQuestion) {
    const key = `${userQuery}__${match.id}`;
    onSave({
      category: match.category,
      topic: match.topic,
      difficulty: match.difficulty,
      question: userQuery,
      shortAnswer: match.shortAnswer,
      simpleExplanation: match.simpleExplanation,
      example: match.example,
      whatToMention: match.whatToMention,
      commonMistakes: match.commonMistakes,
      tags: match.tags,
    });
    setSavedKeys((prev) => new Set([...prev, key]));
  }

  return (
    <div className="local-qa-panel card">
      <div className="local-qa-panel__header">
        <h3 className="local-qa-panel__title">שאל שאלה</h3>
        <p className="local-qa-panel__subtitle">
          {aiSettings.aiEnabled
            ? "חיפוש מקומי במאגר · AI חיצוני זמין"
            : "חיפוש מקומי במאגר · אין AI חיצוני"}
        </p>
      </div>
      <div className="local-qa-body">

          <div className="local-qa-input-row">
            <input
              type="text"
              className="form-input local-qa-input"
              placeholder="לדוגמה: מה זה gradient descent? מה ההבדל בין SQL joins?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              dir="rtl"
            />
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSearch}
              disabled={!query.trim()}
            >
              שאל
            </button>
            {aiSettings.aiEnabled && (
              <button
                type="button"
                className="btn btn--ai"
                onClick={handleAiAsk}
                disabled={!query.trim() || aiLoading}
                title="קבל תשובה מ-AI"
              >
                ✨ AI
              </button>
            )}
          </div>

          {aiLoading && (
            <div className="ai-qa-thinking" role="status" aria-live="polite">
              <span className="ai-qa-thinking__dots">
                <span /><span /><span />
              </span>
              <span>AI חושב…</span>
            </div>
          )}

          {!aiLoading && aiError && (
            <p className="ai-error-msg">{aiError}</p>
          )}

          {aiResult && (
            <div className="ai-qa-result">
              <p className="ai-qa-result__label">תשובת AI לשאלה: <strong>{currentQuery}</strong></p>
              <p className="ai-qa-result__answer">{aiResult.answer}</p>
              {aiResult.keyPoints.length > 0 && (
                <div className="ai-qa-result__section">
                  <p className="ai-qa-result__section-title">נקודות מפתח:</p>
                  <ul className="ai-qa-result__list">
                    {aiResult.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}
                  </ul>
                </div>
              )}
              {aiResult.example && (
                <div className="ai-qa-result__section">
                  <p className="ai-qa-result__section-title">דוגמה:</p>
                  <p className="ai-qa-result__example">{aiResult.example}</p>
                </div>
              )}
              {aiResult.relatedTopics.length > 0 && (
                <div className="ai-qa-result__chips">
                  <span className="ai-qa-result__section-title">נושאים קשורים: </span>
                  {aiResult.relatedTopics.map((t, i) => (
                    <span key={i} className="chip chip--category chip--sm">{t}</span>
                  ))}
                </div>
              )}
              <div className="ai-qa-result__actions">
                {editSaved ? (
                  <span className="local-qa-saved-badge">✓ נשמר במאגר</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={handleOpenEdit}
                  >
                    ✏️ ערוך ושמור למאגר
                  </button>
                )}
              </div>
            </div>
          )}

          {editDraft && (
            <div className="ai-qa-edit-form">
              <p className="ai-qa-edit-form__title">ערוך לפני שמירה</p>

              <div className="form-group">
                <label className="form-label">שאלה</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  value={editDraft.question}
                  onChange={(e) => setEditDraft({ ...editDraft, question: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="form-group">
                <label className="form-label">תשובה קצרה</label>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  value={editDraft.shortAnswer}
                  onChange={(e) => setEditDraft({ ...editDraft, shortAnswer: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="form-group">
                <label className="form-label">דוגמה</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  value={editDraft.example}
                  onChange={(e) => setEditDraft({ ...editDraft, example: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="ai-qa-edit-form__row">
                <div className="form-group">
                  <label className="form-label">קטגוריה</label>
                  <select
                    className="form-input"
                    value={editDraft.category}
                    onChange={(e) => setEditDraft({ ...editDraft, category: e.target.value as QuestionCategory })}
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">רמה</label>
                  <select
                    className="form-input"
                    value={editDraft.difficulty}
                    onChange={(e) => setEditDraft({ ...editDraft, difficulty: e.target.value as QuestionDifficulty })}
                  >
                    {(["basic", "intermediate", "advanced"] as QuestionDifficulty[]).map((d) => (
                      <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">נושא</label>
                <input
                  type="text"
                  className="form-input"
                  value={editDraft.topic}
                  onChange={(e) => setEditDraft({ ...editDraft, topic: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="form-group">
                <label className="form-label">נקודות לציין (שורה לכל נקודה)</label>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  value={editDraft.whatToMentionRaw}
                  onChange={(e) => setEditDraft({ ...editDraft, whatToMentionRaw: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="form-group">
                <label className="form-label">טעויות נפוצות (שורה לכל טעות)</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  value={editDraft.commonMistakesRaw}
                  onChange={(e) => setEditDraft({ ...editDraft, commonMistakesRaw: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="form-group">
                <label className="form-label">תגיות (מופרדות בפסיק)</label>
                <input
                  type="text"
                  className="form-input"
                  value={editDraft.tagsRaw}
                  onChange={(e) => setEditDraft({ ...editDraft, tagsRaw: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={handleSaveEdit}
                  disabled={!editDraft.question.trim() || !editDraft.shortAnswer.trim()}
                >
                  שמור למאגר שאלות
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setEditDraft(null)}
                >
                  ביטול
                </button>
              </div>
            </div>
          )}

          {searched && results.length === 0 && !aiResult && (
            <p className="local-qa-no-result">
              לא נמצאה שאלה מתאימה — נסה מילות מפתח אחרות
              {aiSettings.aiEnabled ? " או לחץ ✨ AI לתשובה חכמה." : "."}
            </p>
          )}

          {results.length > 0 && (
            <div className="local-qa-results">
              <div className="local-qa-result local-qa-result--top">
                <div className="local-qa-result-meta">
                  <span className="chip chip--category chip--sm">
                    {CATEGORY_LABELS[results[0].question.category]}
                  </span>
                  <span className="chip chip--topic chip--sm">
                    {results[0].question.topic}
                  </span>
                  <span
                    className={`chip chip--difficulty chip--difficulty-${results[0].question.difficulty} chip--sm`}
                  >
                    {DIFFICULTY_LABELS[results[0].question.difficulty]}
                  </span>
                </div>
                <p className="local-qa-matched-q">{results[0].question.question}</p>
                <p className="local-qa-answer">{results[0].question.shortAnswer}</p>
                {savedKeys.has(`${currentQuery}__${results[0].question.id}`) ? (
                  <span className="local-qa-saved-badge">✓ נשמר במאגר</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm local-qa-save-btn"
                    onClick={() => handleSave(currentQuery, results[0].question)}
                  >
                    שמור כשאלה
                  </button>
                )}
              </div>

              {results.length > 1 && (
                <details className="local-qa-more">
                  <summary className="local-qa-more-toggle">
                    {results.length - 1} תוצאות נוספות
                  </summary>
                  <div className="local-qa-more-list">
                    {results.slice(1).map((m) => {
                      const key = `${currentQuery}__${m.question.id}`;
                      return (
                        <div key={m.question.id} className="local-qa-result">
                          <div className="local-qa-result-meta">
                            <span className="chip chip--category chip--sm">
                              {CATEGORY_LABELS[m.question.category]}
                            </span>
                            <span className="chip chip--topic chip--sm">
                              {m.question.topic}
                            </span>
                          </div>
                          <p className="local-qa-matched-q">{m.question.question}</p>
                          <p className="local-qa-answer">{m.question.shortAnswer}</p>
                          {savedKeys.has(key) ? (
                            <span className="local-qa-saved-badge">✓ נשמר</span>
                          ) : (
                            <button
                              type="button"
                              className="btn btn--secondary btn--sm local-qa-save-btn"
                              onClick={() => handleSave(currentQuery, m.question)}
                            >
                              שמור כשאלה
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </details>
              )}
            </div>
          )}

          {history.length > 0 && (
            <div className="local-qa-history">
              <p className="local-qa-history-title">היסטוריית שאלות — הסשן הנוכחי</p>
              {history.map((item, i) => (
                <div key={i} className="local-qa-history-item">
                  <div className="local-qa-history-text">
                    <span className="local-qa-history-q">ש: {item.userQuery}</span>
                    <span className="local-qa-history-a">ת: {item.match.shortAnswer}</span>
                  </div>
                  {savedKeys.has(item.savedKey) ? (
                    <span className="local-qa-saved-badge">✓ נשמר</span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => handleSave(item.userQuery, item.match)}
                    >
                      שמור
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      {aiConsent && (
        <AIConsentModal
          payload={aiConsent}
          onConfirm={handleConfirmAi}
          onCancel={() => setAiConsent(null)}
        />
      )}
    </div>
  );
}

// ─── Add form ───────────────────────────────────────────────────────────────

const BLANK_FORM = {
  category: "General" as QuestionCategory,
  topic: "",
  difficulty: "basic" as QuestionDifficulty,
  question: "",
  shortAnswer: "",
  simpleExplanation: "",
  example: "",
  whatToMentionRaw: "",
  commonMistakesRaw: "",
  tagsRaw: "",
};

// ─── Main Page ──────────────────────────────────────────────────────────────

type Props = { profile?: UserProfile };

function ProfessionalInterviewPage({ profile }: Props) {
  const { questions, addQuestion, addQuestions, deleteUserQuestion } = useProfessionalQuestions();
  const { progress, recordResult, resetProgress } = usePracticeProgress();
  const { settings: aiSettings } = useAISettings();

  const profileSummary = profile
    ? [
        profile.targetRoles && `תפקידים: ${profile.targetRoles}`,
        profile.skills && `כישורים: ${profile.skills}`,
        profile.technologies && `טכנולוגיות: ${profile.technologies}`,
        profile.tools && `כלים: ${profile.tools}`,
        profile.projectsSummary && `פרויקטים: ${profile.projectsSummary}`,
        profile.experienceSummary && `ניסיון: ${profile.experienceSummary}`,
        profile.strengths && `חוזקות: ${profile.strengths}`,
      ]
        .filter(Boolean)
        .join("\n") || undefined
    : undefined;

  const [practiceMode, setPracticeMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<QuestionCategory | "">("");
  const [filterDifficulty, setFilterDifficulty] = useState<QuestionDifficulty | "">("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [formError, setFormError] = useState("");
  const [addedMsg, setAddedMsg] = useState(false);
  const [filterTopic, setFilterTopic] = useState("");
  const [tableCategoryFilter, setTableCategoryFilter] = useState<QuestionCategory | "">("");
  const [tableTopicFilter, setTableTopicFilter] = useState("");
  const [tableDifficultyFilter, setTableDifficultyFilter] = useState<QuestionDifficulty | "">("");
  const [tableSourceFilter, setTableSourceFilter] = useState<"" | QuestionSource>("");
  const [tableSearchQuery, setTableSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return questions.filter((item) => {
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.shortAnswer.toLowerCase().includes(q) ||
        item.simpleExplanation.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      const matchCategory = !filterCategory || item.category === filterCategory;
      const matchDifficulty = !filterDifficulty || item.difficulty === filterDifficulty;
      const matchTopic = !filterTopic || item.topic === filterTopic;
      return matchSearch && matchCategory && matchDifficulty && matchTopic;
    });
  }, [questions, search, filterCategory, filterDifficulty, filterTopic]);

  const topicOptions = useMemo(() => {
    const pool = filterCategory
      ? questions.filter((q) => q.category === filterCategory)
      : questions;
    return [...new Set(pool.map((q) => q.topic))].sort();
  }, [questions, filterCategory]);

  const tableTopics = useMemo(
    () => [...new Set(filtered.map((q) => q.topic))].sort(),
    [filtered]
  );

  const tableFiltered = useMemo(() => {
    const q = tableSearchQuery.trim().toLowerCase();
    return filtered.filter((item) => {
      const matchCat = !tableCategoryFilter || item.category === tableCategoryFilter;
      const matchTopic = !tableTopicFilter || item.topic === tableTopicFilter;
      const matchDiff = !tableDifficultyFilter || item.difficulty === tableDifficultyFilter;
      const matchSource = !tableSourceFilter || item.source === tableSourceFilter;
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.shortAnswer.toLowerCase().includes(q);
      return matchCat && matchTopic && matchDiff && matchSource && matchSearch;
    });
  }, [filtered, tableCategoryFilter, tableTopicFilter, tableDifficultyFilter, tableSourceFilter, tableSearchQuery]);

  const hasActiveTableFilters =
    tableCategoryFilter !== "" ||
    tableTopicFilter !== "" ||
    tableDifficultyFilter !== "" ||
    tableSourceFilter !== "" ||
    tableSearchQuery.trim() !== "";

  const hasActiveFilters = search.trim() !== "" || filterCategory !== "" || filterDifficulty !== "" || filterTopic !== "";

  function buildFilterSummary() {
    const parts: string[] = [];
    if (search.trim()) parts.push(`חיפוש: "${search.trim()}"`);
    if (filterCategory) parts.push(`קטגוריה: ${CATEGORY_LABELS[filterCategory]}`);
    if (filterDifficulty) parts.push(`רמה: ${DIFFICULTY_LABELS[filterDifficulty]}`);
    if (filterTopic) parts.push(`נושא: ${filterTopic}`);
    return parts.join(" · ");
  }

  function handleSubmitQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || !form.shortAnswer.trim()) {
      setFormError("יש למלא לפחות שאלה ותשובה קצרה.");
      return;
    }
    addQuestion({
      category: form.category,
      topic: form.topic.trim() || form.category,
      difficulty: form.difficulty,
      question: form.question.trim(),
      shortAnswer: form.shortAnswer.trim(),
      simpleExplanation: form.simpleExplanation.trim(),
      example: form.example.trim(),
      whatToMention: form.whatToMentionRaw.split("\n").map((s) => s.trim()).filter(Boolean),
      commonMistakes: form.commonMistakesRaw.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: form.tagsRaw.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setForm(BLANK_FORM);
    setFormError("");
    setShowAddForm(false);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 4000);
  }

  function updateForm(field: keyof typeof BLANK_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const categoryOptions = ALL_CATEGORIES.filter((cat) =>
    questions.some((q) => q.category === cat)
  );

  function handleLoadRealtimePreset() {
    const existingTexts = new Set(questions.map((q) => q.question.trim()));
    const toAdd = REALTIME_ENGINEER_PROFESSIONAL_QUESTIONS.filter(
      (q) => !existingTexts.has(q.question.trim())
    );
    if (toAdd.length === 0) return;
    addQuestions(toAdd, "user");
  }

  const realtimePresetLoaded = REALTIME_ENGINEER_PROFESSIONAL_QUESTIONS.every((q) =>
    questions.some((sq) => sq.question.trim() === q.question.trim())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-header__title">ראיון מקצועי</h2>
        <p className="page-header__subtitle">
          שאלות מקצועיות לפי קטגוריה עם הסברים ודוגמאות. כל השאלות שתוסיפי
          נשמרות מקומית בלבד.
        </p>
      </div>

      <div className="pq-layout">
      <div className="pq-main">
      <div className="pq-filters card">
        {/* View mode selector */}
        <div className="view-mode-selector" role="group" aria-label="צורת הצגה">
          <span className="view-mode-label">צורת הצגה:</span>
          <button
            type="button"
            className={`view-mode-button${viewMode === "cards" ? " view-mode-button--active" : ""}`}
            aria-pressed={viewMode === "cards"}
            onClick={() => setViewMode("cards")}
          >
            כרטיסיות
          </button>
          <button
            type="button"
            className={`view-mode-button${viewMode === "compact" ? " view-mode-button--active" : ""}`}
            aria-pressed={viewMode === "compact"}
            onClick={() => setViewMode("compact")}
          >
            כרטיסיות קצרות
          </button>
          <button
            type="button"
            className={`view-mode-button${viewMode === "table" ? " view-mode-button--active" : ""}`}
            aria-pressed={viewMode === "table"}
            onClick={() => setViewMode("table")}
          >
            טבלה
          </button>
        </div>

        {/* Search */}
        <input
          type="search"
          className="form-input pq-search"
          placeholder="חיפוש שאלה, נושא, הסבר או תגית..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="חיפוש שאלות"
        />

        {/* Filters */}
        <div className="pq-filter-row">
          <select
            className="form-input pq-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as QuestionCategory | "")}
            aria-label="סינון לפי קטגוריה"
          >
            <option value="">כל הקטגוריות</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          <select
            className="form-input pq-select"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value as QuestionDifficulty | "")}
            aria-label="סינון לפי רמת קושי"
          >
            <option value="">כל הרמות</option>
            <option value="basic">בסיסי</option>
            <option value="intermediate">בינוני</option>
            <option value="advanced">מתקדם</option>
          </select>

          <select
            className="form-input pq-select"
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            aria-label="סינון לפי נושא"
          >
            <option value="">כל הנושאים</option>
            {topicOptions.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => {
              setSearch("");
              setFilterCategory("");
              setFilterDifficulty("");
              setFilterTopic("");
            }}
          >
            איפוס
          </button>
        </div>

        {/* Result count + active filter summary */}
        <div className="pq-status-row">
          <p className="pq-count">
            נמצאו <strong>{filtered.length}</strong> שאלות מתוך {questions.length}
          </p>
          <p className="pq-filter-summary">
            {hasActiveFilters ? `סינון פעיל: ${buildFilterSummary()}` : "מציג את כל השאלות"}
          </p>
        </div>
      </div>

      {/* Add question row */}
      <div className="pq-add-row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? "ביטול" : "+ הוספת שאלה"}
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleLoadRealtimePreset}
          disabled={realtimePresetLoaded}
          title="טעינת שאלות C/C++, RTOS, Embedded, Protocols, Git, אלגוריתמים ופרויקטים"
        >
          {realtimePresetLoaded ? "✓ RT Engineer נטענו" : "טען שאלות RT Engineer"}
        </button>
        <button
          type="button"
          className={`btn ${practiceMode ? "btn--primary" : "btn--secondary"} pq-practice-btn`}
          onClick={() => {
            setPracticeMode((v) => !v);
            if (!practiceMode) setShowAddForm(false);
          }}
        >
          {practiceMode ? "יציאה מתרגול" : "מצב תרגול"}
        </button>
        {addedMsg && (
          <span className="pq-added-msg" role="status">
            השאלה נוספה ונשמרה מקומית.
          </span>
        )}
      </div>

      {showAddForm && (
        <div className="card pq-add-form">
          <h3 className="card__title">הוספת שאלה מקצועית</h3>
          <form onSubmit={handleSubmitQuestion} noValidate>
            <div className="pq-form-row">
              <div className="form-group">
                <label className="form-label">קטגוריה</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">רמת קושי</label>
                <select
                  className="form-input"
                  value={form.difficulty}
                  onChange={(e) => updateForm("difficulty", e.target.value)}
                >
                  <option value="basic">בסיסי</option>
                  <option value="intermediate">בינוני</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">נושא</label>
              <input
                type="text"
                className="form-input"
                value={form.topic}
                onChange={(e) => updateForm("topic", e.target.value)}
                placeholder="לדוגמה: React hooks"
              />
            </div>

            <div className="form-group">
              <label className="form-label">שאלה *</label>
              <input
                type="text"
                className="form-input"
                value={form.question}
                onChange={(e) => updateForm("question", e.target.value)}
                placeholder="מה השאלה?"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">תשובה קצרה *</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={form.shortAnswer}
                onChange={(e) => updateForm("shortAnswer", e.target.value)}
                placeholder="1–3 משפטים"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">הסבר פשוט (אופציונלי)</label>
              <textarea
                className="form-input form-textarea"
                rows={2}
                value={form.simpleExplanation}
                onChange={(e) => updateForm("simpleExplanation", e.target.value)}
                placeholder="אנלוגיה או הסבר בשפה פשוטה"
              />
            </div>

            <div className="form-group">
              <label className="form-label">דוגמה (אופציונלי)</label>
              <textarea
                className="form-input form-textarea"
                rows={2}
                value={form.example}
                onChange={(e) => updateForm("example", e.target.value)}
                placeholder="דוגמת קוד או מקרה ספציפי"
              />
            </div>

            <div className="form-group">
              <label className="form-label">מה כדאי להזכיר (שורה לכל נקודה)</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={form.whatToMentionRaw}
                onChange={(e) => updateForm("whatToMentionRaw", e.target.value)}
                placeholder={"נקודה ראשונה\nנקודה שנייה\nנקודה שלישית"}
              />
            </div>

            <div className="form-group">
              <label className="form-label">טעויות נפוצות (שורה לכל טעות)</label>
              <textarea
                className="form-input form-textarea"
                rows={2}
                value={form.commonMistakesRaw}
                onChange={(e) => updateForm("commonMistakesRaw", e.target.value)}
                placeholder={"טעות ראשונה\nטעות שנייה"}
              />
            </div>

            <div className="form-group">
              <label className="form-label">תגיות (מופרדות בפסיק)</label>
              <input
                type="text"
                className="form-input"
                value={form.tagsRaw}
                onChange={(e) => updateForm("tagsRaw", e.target.value)}
                placeholder="sql, joins, בסיסי"
              />
            </div>

            {formError && (
              <p className="pq-form-error" role="alert">
                {formError}
              </p>
            )}

            <div className="btn-row" style={{ marginTop: "16px" }}>
              <button type="submit" className="btn btn--primary">
                הוספת שאלה
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setForm(BLANK_FORM);
                  setFormError("");
                  setShowAddForm(false);
                }}
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Description Analyzer */}
      {!practiceMode && (
        <JobDescriptionAnalyzer
          allQuestions={questions}
          onAddQuestions={(qs) => addQuestions(qs, "job-description")}
          onAddAIQuestions={(qs) => addQuestions(qs, "ai")}
          categoryLabels={CATEGORY_LABELS}
          aiEnabled={aiSettings.aiEnabled}
          redactBeforeSend={aiSettings.redactBeforeSend}
          profileSummary={profileSummary}
        />
      )}

      {/* Results or Practice Mode */}
      {practiceMode ? (
        <PracticeMode
          questions={filtered}
          progress={progress}
          onRecordResult={recordResult}
          onResetProgress={resetProgress}
          onExit={() => setPracticeMode(false)}
        />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__text">לא נמצאו שאלות התואמות לחיפוש.</p>
        </div>
      ) : viewMode === "table" ? (
        <>
          <div className="table-filter-bar card">
            <div className="table-filter-title">
              <span>סינון בתוך הטבלה</span>
              {hasActiveTableFilters && (
                <button
                  type="button"
                  className="table-filter-clear-button"
                  onClick={() => {
                    setTableCategoryFilter("");
                    setTableTopicFilter("");
                    setTableDifficultyFilter("");
                    setTableSourceFilter("");
                    setTableSearchQuery("");
                  }}
                >
                  ניקוי סינון טבלה
                </button>
              )}
            </div>
            <div className="table-filter-controls">
              <select
                className="form-input pq-select"
                value={tableCategoryFilter}
                onChange={(e) => setTableCategoryFilter(e.target.value as QuestionCategory | "")}
                aria-label="סינון טבלה לפי תחום"
              >
                <option value="">תחום</option>
                {ALL_CATEGORIES.filter((cat) => filtered.some((q) => q.category === cat)).map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
              <select
                className="form-input pq-select"
                value={tableTopicFilter}
                onChange={(e) => setTableTopicFilter(e.target.value)}
                aria-label="סינון טבלה לפי נושא"
              >
                <option value="">נושא</option>
                {tableTopics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              <select
                className="form-input pq-select"
                value={tableDifficultyFilter}
                onChange={(e) => setTableDifficultyFilter(e.target.value as QuestionDifficulty | "")}
                aria-label="סינון טבלה לפי רמה"
              >
                <option value="">רמה</option>
                <option value="basic">בסיסי</option>
                <option value="intermediate">בינוני</option>
                <option value="advanced">מתקדם</option>
              </select>
              <select
                className="form-input pq-select"
                value={tableSourceFilter}
                onChange={(e) => setTableSourceFilter(e.target.value as "" | QuestionSource)}
                aria-label="סינון טבלה לפי מקור"
              >
                <option value="">מקור</option>
                <option value="user">נוסף ידנית</option>
                <option value="job-description">נוצר מתיאור משרה</option>
                <option value="ai">נוצר בעזרת AI</option>
              </select>
              <input
                type="search"
                className="form-input"
                placeholder="חיפוש בשאלה או בתשובה..."
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                aria-label="חיפוש בתוך הטבלה"
              />
            </div>
            <p className="table-filter-summary">
              {hasActiveTableFilters
                ? `סינון טבלה פעיל: מציג ${tableFiltered.length} מתוך ${filtered.length} שאלות`
                : "לא הופעל סינון פנימי בטבלה"}
            </p>
          </div>
          <QuestionsTable
            questions={tableFiltered}
            onDelete={deleteUserQuestion}
          />
        </>
      ) : viewMode === "compact" ? (
        <div className="pq-list compact-cards-view">
          {filtered.map((q) => (
            <CompactCard
              key={q.id}
              q={q}
              onDelete={q.source !== "demo" ? deleteUserQuestion : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="pq-list cards-view">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              onDelete={q.source !== "demo" ? deleteUserQuestion : undefined}
            />
          ))}
        </div>
      )}
      </div>{/* /pq-main */}

      <div className="pq-sidebar">
        <LocalQAPanel allQuestions={questions} onSave={addQuestion} />
      </div>
      </div>{/* /pq-layout */}
    </div>
  );
}

export default ProfessionalInterviewPage;
