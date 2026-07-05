import { useState, useMemo, useRef, useEffect } from "react";
import type {
  ProfessionalQuestion,
  QuestionCategory,
  QuestionDifficulty,
  QuestionSource,
} from "../types/professionalQuestion";
import { useProfessionalQuestions } from "../hooks/useProfessionalQuestions";
import { usePracticeProgress } from "../hooks/usePracticeProgress";
import type { ProgressMap } from "../hooks/usePracticeProgress";
import { analyzeJobDescription, type AnalysisResult } from "../lib/jobDescriptionAnalyzer";

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
  "Machine Learning",
  "Deep Learning",
  "AI",
];

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  General: "כללי טכני",
  "Data Analyst": "Data Analyst",
  SQL: "SQL",
  QA: "QA",
  Frontend: "Frontend",
  Backend: "Backend",
  JavaScript: "JavaScript",
  Cyber: "סייבר",
  Git: "Git",
  Projects: "פרויקטים",
  "Technical Thinking": "חשיבה טכנית",
  Protocols: "פרוטוקולים ותקשורת",
  Architecture: "ארכיטקטורה",
  "Machine Learning": "למידת מכונה",
  "Deep Learning": "למידה עמוקה",
  AI: "בינה מלאכותית",
};

const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  basic: "בסיסי",
  intermediate: "בינוני",
  advanced: "מתקדם",
};

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
    <div className={`pq-card${q.source === "user" || q.source === "job-description" ? " pq-card--user" : ""}`}>
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className="chip chip--category">{CATEGORY_LABELS[q.category]}</span>
          <span className={`chip chip--difficulty chip--difficulty-${q.difficulty}`}>
            {DIFFICULTY_LABELS[q.difficulty]}
          </span>
          {q.source === "user" && <span className="chip chip--user">שאלה שלי</span>}
          {q.source === "job-description" && <span className="chip chip--job-desc">נוצר מתיאור משרה</span>}
        </div>
        {onDelete && (q.source === "user" || q.source === "job-description") && (
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
    <div className={`pq-card pq-card--compact${q.source === "user" || q.source === "job-description" ? " pq-card--user" : ""}`}>
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className="chip chip--category">{CATEGORY_LABELS[q.category]}</span>
          <span className="chip chip--topic">{q.topic}</span>
          <span className={`chip chip--difficulty chip--difficulty-${q.difficulty}`}>
            {DIFFICULTY_LABELS[q.difficulty]}
          </span>
          {q.source === "user" && <span className="chip chip--user">שאלה שלי</span>}
          {q.source === "job-description" && <span className="chip chip--job-desc">נוצר מתיאור משרה</span>}
        </div>
        {onDelete && (q.source === "user" || q.source === "job-description") && (
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
                  className={q.source === "user" || q.source === "job-description" ? "table-row--user" : ""}
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
                    {onDelete && (q.source === "user" || q.source === "job-description") && (
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

// ─── Job Description Analyzer ──────────────────────────────────────────────

type AnalyzerProps = {
  allQuestions: ProfessionalQuestion[];
  onAddQuestions: (
    qs: Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">[]
  ) => void;
  categoryLabels: Record<QuestionCategory, string>;
};

function JobDescriptionAnalyzer({ allQuestions, onAddQuestions, categoryLabels }: AnalyzerProps) {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [addedMsg, setAddedMsg] = useState(false);

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

  return (
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
            המערכת מנתחת מקומית מילות מפתח מתוך תיאור המשרה ומציעה שאלות מתוך תבניות קיימות.
            אין שימוש ב-AI ואין שליחה לשרת.
          </p>

          <div className="pq-form-row">
            <div className="form-group">
              <label className="form-label">כותרת משרה</label>
              <input
                type="text"
                className="form-input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
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
              onChange={(e) => setJobDesc(e.target.value)}
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
            {(result || jobDesc) && (
              <button type="button" className="btn btn--secondary" onClick={handleClear}>
                ניקוי ניתוח
              </button>
            )}
          </div>

          {addedMsg && (
            <p className="pq-added-msg" role="status">
              השאלות נוספו למאגר ונשמרו מקומית.
            </p>
          )}

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
        </div>
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

function ProfessionalInterviewPage() {
  const { questions, addQuestion, addQuestions, deleteUserQuestion } = useProfessionalQuestions();
  const { progress, recordResult, resetProgress } = usePracticeProgress();

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

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-header__title">ראיון מקצועי</h2>
        <p className="page-header__subtitle">
          שאלות מקצועיות לפי קטגוריה עם הסברים ודוגמאות. כל השאלות שתוסיפי
          נשמרות מקומית בלבד.
        </p>
      </div>

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
          categoryLabels={CATEGORY_LABELS}
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
                <option value="demo">דמו</option>
                <option value="user">נוסף ידנית</option>
                <option value="job-description">נוצר מתיאור משרה</option>
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
              onDelete={q.source === "user" || q.source === "job-description" ? deleteUserQuestion : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="pq-list cards-view">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              onDelete={q.source === "user" || q.source === "job-description" ? deleteUserQuestion : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfessionalInterviewPage;
