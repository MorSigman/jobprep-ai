import { useState, useMemo } from "react";
import type {
  ProfessionalQuestion,
  QuestionCategory,
  QuestionDifficulty,
} from "../types/professionalQuestion";
import { useProfessionalQuestions } from "../hooks/useProfessionalQuestions";

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
];

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  General: "כללי",
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
};

const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  basic: "בסיסי",
  intermediate: "בינוני",
};

// ─── Full Card ─────────────────────────────────────────────────────────────

type CardProps = {
  q: ProfessionalQuestion;
  onDelete?: (id: string) => void;
};

function QuestionCard({ q, onDelete }: CardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showFull, setShowFull] = useState(false);

  return (
    <div className={`pq-card${q.source === "user" ? " pq-card--user" : ""}`}>
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className="chip chip--category">{CATEGORY_LABELS[q.category]}</span>
          <span className={`chip chip--difficulty chip--difficulty-${q.difficulty}`}>
            {DIFFICULTY_LABELS[q.difficulty]}
          </span>
          {q.source === "user" && <span className="chip chip--user">שאלה שלי</span>}
        </div>
        {onDelete && q.source === "user" && (
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

      {q.whatToMention.length > 0 && (
        <div className="pq-section">
          <p className="pq-expandable__label">מה כדאי להזכיר</p>
          <ul className="pq-expandable__list">
            {q.whatToMention.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {q.commonMistakes.length > 0 && (
        <div className="pq-section">
          <p className="pq-expandable__label">טעויות נפוצות</p>
          <ul className="pq-expandable__list pq-expandable__list--warn">
            {q.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {q.tags.length > 0 && (
        <div className="chip-row" style={{ marginTop: "8px" }}>
          {q.tags.map((tag) => (
            <span key={tag} className="chip chip--tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="pq-card__toggles">
        <button
          type="button"
          className="pq-toggle-btn"
          aria-expanded={showExplanation}
          onClick={() => setShowExplanation((v) => !v)}
        >
          {showExplanation ? "− הסבר פשוט" : "+ הסבר פשוט"}
        </button>
        <button
          type="button"
          className="pq-toggle-btn"
          aria-expanded={showExample}
          onClick={() => setShowExample((v) => !v)}
        >
          {showExample ? "− דוגמה" : "+ דוגמה"}
        </button>
        <button
          type="button"
          className="pq-toggle-btn"
          aria-expanded={showFull}
          onClick={() => setShowFull((v) => !v)}
        >
          {showFull ? "− פרטים מלאים" : "+ פרטים מלאים"}
        </button>
      </div>

      {showExplanation && (
        <div className="pq-expandable">
          <p className="pq-expandable__label">הסבר פשוט</p>
          <p className="pq-expandable__text">{q.simpleExplanation}</p>
        </div>
      )}

      {showExample && (
        <div className="pq-expandable">
          <p className="pq-expandable__label">דוגמה</p>
          <p className="pq-expandable__text">{q.example}</p>
        </div>
      )}

      {showFull && (
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
    <div className={`pq-card pq-card--compact${q.source === "user" ? " pq-card--user" : ""}`}>
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className="chip chip--category">{CATEGORY_LABELS[q.category]}</span>
          <span className="chip chip--topic">{q.topic}</span>
          <span className={`chip chip--difficulty chip--difficulty-${q.difficulty}`}>
            {DIFFICULTY_LABELS[q.difficulty]}
          </span>
          {q.source === "user" && <span className="chip chip--user">שאלה שלי</span>}
        </div>
        {onDelete && q.source === "user" && (
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
          {showExplanation ? "− הסבר פשוט" : "+ הסבר פשוט"}
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

      {showExplanation && (
        <div className="pq-expandable">
          <p className="pq-expandable__text">{q.simpleExplanation}</p>
        </div>
      )}

      {showExample && (
        <div className="pq-expandable">
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
                  className={q.source === "user" ? "table-row--user" : ""}
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
                      {showExp ? "− הסבר" : "+ הסבר"}
                    </button>
                    <button
                      type="button"
                      className="table-action-button"
                      aria-expanded={showEx}
                      onClick={() => toggle(q.id, "example")}
                    >
                      {showEx ? "− דוגמה" : "+ דוגמה"}
                    </button>
                    {onDelete && q.source === "user" && (
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
                          <span className="pq-expandable__label">הסבר פשוט: </span>
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
  const { questions, addQuestion, deleteUserQuestion } = useProfessionalQuestions();

  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<QuestionCategory | "">("");
  const [filterDifficulty, setFilterDifficulty] = useState<QuestionDifficulty | "">("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [formError, setFormError] = useState("");
  const [addedMsg, setAddedMsg] = useState(false);

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
      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [questions, search, filterCategory, filterDifficulty]);

  const hasActiveFilters = search.trim() !== "" || filterCategory !== "" || filterDifficulty !== "";

  function buildFilterSummary() {
    const parts: string[] = [];
    if (search.trim()) parts.push(`חיפוש: "${search.trim()}"`);
    if (filterCategory) parts.push(`קטגוריה: ${CATEGORY_LABELS[filterCategory]}`);
    if (filterDifficulty) parts.push(`רמה: ${DIFFICULTY_LABELS[filterDifficulty]}`);
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
          </select>

          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => {
              setSearch("");
              setFilterCategory("");
              setFilterDifficulty("");
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

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__text">לא נמצאו שאלות התואמות לחיפוש.</p>
        </div>
      ) : viewMode === "table" ? (
        <QuestionsTable
          questions={filtered}
          onDelete={deleteUserQuestion}
        />
      ) : viewMode === "compact" ? (
        <div className="pq-list compact-cards-view">
          {filtered.map((q) => (
            <CompactCard
              key={q.id}
              q={q}
              onDelete={q.source === "user" ? deleteUserQuestion : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="pq-list cards-view">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              onDelete={q.source === "user" ? deleteUserQuestion : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfessionalInterviewPage;
