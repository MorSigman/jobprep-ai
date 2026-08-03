import { useState, useMemo } from "react";
import type { UserProfile } from "../types/profile";
import { useAISettings } from "../lib/useAISettings";
import { usePersonalQuestions, type PersonalQuestion } from "../hooks/usePersonalQuestions";
import { COMMON_PERSONAL_QUESTIONS } from "../data/commonPersonalQuestions";
import { REALTIME_ENGINEER_QUESTIONS } from "../data/realtimeEngineerQuestions";
import {
  fetchAIPersonalInterviewPrep,
  fetchAIPersonalAnswer,
  type AIPersonalQuestion,
  type AIPersonalAnswerResult,
} from "../lib/aiClient";

// ─── Types & Constants ────────────────────────────────────────────────────────

type EditableQuestion = AIPersonalQuestion & { _key: number; _saved: boolean };
type ViewMode = "cards" | "compact";
type SortKey = "newest" | "oldest" | "type";
type PersonalType = PersonalQuestion["type"];

const DRAFT_KEY = "jobprep-ai-personal-draft";

function loadDraft(): EditableQuestion[] {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as EditableQuestion[]) : [];
  } catch {
    return [];
  }
}

function saveDraft(qs: EditableQuestion[]) {
  if (qs.length > 0) localStorage.setItem(DRAFT_KEY, JSON.stringify(qs));
  else localStorage.removeItem(DRAFT_KEY);
}

const TYPE_LABELS: Record<string, string> = {
  behavioral: "התנהגותית",
  motivational: "מוטיבציה",
  situational: "סיטואציה",
  personal: "אישית",
};

const TYPE_CHIP: Record<string, string> = {
  behavioral: "chip--teal",
  motivational: "chip--ai",
  situational: "chip--topic",
  personal: "chip--topic",
};

const ALL_TYPES: PersonalType[] = ["behavioral", "motivational", "situational", "personal"];

type Props = { profile?: UserProfile };

// ─── Saved Question Card (full) ───────────────────────────────────────────────

function SavedQuestionCard({
  q,
  onUpdate,
  onDelete,
}: {
  q: PersonalQuestion;
  onUpdate: (patch: Partial<PersonalQuestion>) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showFollow, setShowFollow] = useState(false);
  const [draftQ, setDraftQ] = useState(q.question);
  const [draftA, setDraftA] = useState(q.suggestedAnswer);

  function handleSave() {
    onUpdate({ question: draftQ, suggestedAnswer: draftA });
    setEditing(false);
  }
  function handleCancel() {
    setDraftQ(q.question);
    setDraftA(q.suggestedAnswer);
    setEditing(false);
  }

  return (
    <div className="pq-card">
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className={`chip ${TYPE_CHIP[q.type] ?? "chip--topic"} chip--sm`}>
            {TYPE_LABELS[q.type] ?? q.type}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className="btn btn--xs btn--secondary"
            onClick={editing ? handleCancel : () => setEditing(true)}
          >
            {editing ? "ביטול" : "ערוך"}
          </button>
          <button type="button" className="pq-card__delete" onClick={onDelete} title="מחיקה">
            ✕
          </button>
        </div>
      </div>

      {editing ? (
        <div className="personal-q-edit">
          <label className="form-label">שאלה</label>
          <input
            className="form-input"
            value={draftQ}
            onChange={(e) => setDraftQ(e.target.value)}
          />
          <label className="form-label" style={{ marginTop: 8 }}>
            תשובה מוצעת
          </label>
          <textarea
            className="form-input form-textarea"
            rows={5}
            value={draftA}
            onChange={(e) => setDraftA(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--primary btn--sm"
            style={{ marginTop: 8, alignSelf: "flex-start" }}
            onClick={handleSave}
          >
            שמור שינויים
          </button>
        </div>
      ) : (
        <>
          <h3 className="pq-card__question">{q.question}</h3>
          <div className="pq-card__toggles">
            <button
              type="button"
              className="pq-toggle-btn"
              onClick={() => setShowAnswer((v) => !v)}
            >
              {showAnswer ? "− תשובה" : "+ תשובה"}
            </button>
            {q.tips.length > 0 && (
              <button
                type="button"
                className="pq-toggle-btn"
                onClick={() => setShowTips((v) => !v)}
              >
                {showTips ? "− טיפים" : "+ טיפים"}
              </button>
            )}
            {q.followUpQuestions.length > 0 && (
              <button
                type="button"
                className="pq-toggle-btn"
                onClick={() => setShowFollow((v) => !v)}
              >
                {showFollow ? "− שאלות המשך" : "+ שאלות המשך"}
              </button>
            )}
          </div>
          {showAnswer && (
            <div className="pq-expandable">
              <p className="pq-expandable__label">תשובה מוצעת</p>
              <p className="pq-expandable__text">{q.suggestedAnswer}</p>
            </div>
          )}
          {showTips && q.tips.length > 0 && (
            <div className="pq-expandable">
              <p className="pq-expandable__label">טיפים</p>
              <ul className="pq-expandable__list">
                {q.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {showFollow && q.followUpQuestions.length > 0 && (
            <div className="pq-expandable">
              <p className="pq-expandable__label">שאלות המשך אפשריות</p>
              <ul className="pq-expandable__list">
                {q.followUpQuestions.map((fq, i) => (
                  <li key={i}>{fq}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Compact Card ─────────────────────────────────────────────────────────────

function CompactPersonalCard({
  q,
  onUpdate,
  onDelete,
}: {
  q: PersonalQuestion;
  onUpdate: (patch: Partial<PersonalQuestion>) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftQ, setDraftQ] = useState(q.question);
  const [draftA, setDraftA] = useState(q.suggestedAnswer);

  function handleSave() {
    onUpdate({ question: draftQ, suggestedAnswer: draftA });
    setEditing(false);
  }

  return (
    <div className="pq-card pq-card--compact">
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className={`chip ${TYPE_CHIP[q.type] ?? "chip--topic"} chip--sm`}>
            {TYPE_LABELS[q.type] ?? q.type}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className="btn btn--xs btn--secondary"
            onClick={() => {
              setEditing((v) => !v);
              if (!open) setOpen(true);
            }}
          >
            {editing ? "ביטול" : "ערוך"}
          </button>
          <button type="button" className="pq-card__delete" onClick={onDelete}>
            ✕
          </button>
        </div>
      </div>

      <h3 className="pq-card__question">{q.question}</h3>

      {!editing && (
        <div className="pq-card__toggles">
          <button
            type="button"
            className="pq-toggle-btn"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "− הצג פחות" : "+ הצג תשובה"}
          </button>
        </div>
      )}

      {open && !editing && (
        <>
          <div className="pq-expandable">
            <p className="pq-expandable__label">תשובה מוצעת</p>
            <p className="pq-expandable__text">{q.suggestedAnswer}</p>
          </div>
          {q.tips.length > 0 && (
            <div className="pq-expandable">
              <p className="pq-expandable__label">טיפים</p>
              <ul className="pq-expandable__list">
                {q.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {q.followUpQuestions.length > 0 && (
            <div className="pq-expandable">
              <p className="pq-expandable__label">שאלות המשך</p>
              <ul className="pq-expandable__list">
                {q.followUpQuestions.map((fq, i) => (
                  <li key={i}>{fq}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {editing && (
        <div className="personal-q-edit">
          <label className="form-label">שאלה</label>
          <input
            className="form-input"
            value={draftQ}
            onChange={(e) => setDraftQ(e.target.value)}
          />
          <label className="form-label" style={{ marginTop: 8 }}>
            תשובה מוצעת
          </label>
          <textarea
            className="form-input form-textarea"
            rows={4}
            value={draftA}
            onChange={(e) => setDraftA(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--primary btn--sm"
            style={{ marginTop: 8, alignSelf: "flex-start" }}
            onClick={handleSave}
          >
            שמור שינויים
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI Generated Question Card ───────────────────────────────────────────────

function AIQuestionCard({
  q,
  onSave,
}: {
  q: EditableQuestion;
  onSave: (edited: EditableQuestion) => void;
}) {
  const [draftQ, setDraftQ] = useState(q.question);
  const [draftA, setDraftA] = useState(q.suggestedAnswer);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`pq-card${q._saved ? " pq-card--saved" : ""}`}>
      <div className="pq-card__header">
        <div className="pq-card__meta">
          <span className={`chip ${TYPE_CHIP[q.type] ?? "chip--topic"} chip--sm`}>
            {TYPE_LABELS[q.type] ?? q.type}
          </span>
          {q._saved && <span className="chip chip--ai chip--sm">✓ נשמר</span>}
        </div>
      </div>

      <div className="personal-q-edit">
        <label className="form-label">שאלה</label>
        <input
          className="form-input"
          value={draftQ}
          onChange={(e) => setDraftQ(e.target.value)}
          disabled={q._saved}
        />
        <label className="form-label" style={{ marginTop: 8 }}>
          תשובה מוצעת (ערכי לפני שמירה)
        </label>
        <textarea
          className="form-input form-textarea"
          rows={4}
          value={draftA}
          onChange={(e) => setDraftA(e.target.value)}
          disabled={q._saved}
        />
      </div>

      {(q.tips.length > 0 || q.followUpQuestions.length > 0) && (
        <>
          <button
            type="button"
            className="btn btn--xs btn--secondary"
            style={{ marginTop: 8, alignSelf: "flex-start" }}
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? "הסתר פרטים" : "הצג טיפים ושאלות המשך"}
          </button>
          {showDetails && (
            <>
              {q.tips.length > 0 && (
                <div className="pq-expandable">
                  <p className="pq-expandable__label">טיפים</p>
                  <ul className="pq-expandable__list">
                    {q.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              {q.followUpQuestions.length > 0 && (
                <div className="pq-expandable">
                  <p className="pq-expandable__label">שאלות המשך</p>
                  <ul className="pq-expandable__list">
                    {q.followUpQuestions.map((fq, i) => (
                      <li key={i}>{fq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!q._saved && (
        <button
          type="button"
          className="btn btn--primary btn--sm"
          style={{ marginTop: 10, alignSelf: "flex-start" }}
          onClick={() => onSave({ ...q, question: draftQ, suggestedAnswer: draftA })}
        >
          + שמור שאלה זו למאגר
        </button>
      )}
    </div>
  );
}

// ─── Personal Q&A Sidebar Panel ───────────────────────────────────────────────

type PersonalQAPanelProps = {
  aiEnabled: boolean;
  buildSummary: () => string;
  onSave: (q: Omit<PersonalQuestion, "id" | "createdAt">) => void;
};

function PersonalQAPanel({ aiEnabled, buildSummary, onSave }: PersonalQAPanelProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AIPersonalAnswerResult | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleAsk() {
    const q = query.trim();
    if (!q || !aiEnabled) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);
    try {
      const res = await fetchAIPersonalAnswer(q, buildSummary());
      setResult(res);
      setEditQ(q);
      setEditA(res.suggestedAnswer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!editQ.trim()) return;
    onSave({
      question: editQ,
      type: result?.type ?? "personal",
      suggestedAnswer: editA,
      tips: result?.tips ?? [],
      followUpQuestions: result?.followUpQuestions ?? [],
    });
    setSaved(true);
    setQuery("");
  }

  function handleReset() {
    setQuery("");
    setResult(null);
    setEditQ("");
    setEditA("");
    setError("");
    setSaved(false);
  }

  return (
    <div className="local-qa-panel card">
      <div className="local-qa-panel__header">
        <h3 className="local-qa-panel__title">שאל שאלה</h3>
        <p className="local-qa-panel__subtitle">
          {aiEnabled ? "הקלידי שאלה אישית · AI יציע תשובה" : "AI כבוי"}
        </p>
      </div>
      <div className="local-qa-body">
        <div className="local-qa-input-row">
          <input
            type="text"
            className="form-input local-qa-input"
            placeholder="לדוגמה: ספרי על עצמך, מה החולשה הגדולה שלך..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAsk();
            }}
            dir="rtl"
            disabled={loading}
          />
          <button
            type="button"
            className="btn btn--ai"
            onClick={handleAsk}
            disabled={!query.trim() || loading || !aiEnabled}
            title={aiEnabled ? "קבל תשובה מ-AI" : "AI כבוי"}
          >
            {loading ? "⏳" : "✨ AI"}
          </button>
        </div>

        {!aiEnabled && (
          <p className="ai-error-msg" style={{ marginTop: 8 }}>
            הפעל AI בפרופיל כדי להשתמש בתכונה זו
          </p>
        )}

        {loading && (
          <div className="ai-qa-thinking" role="status" aria-live="polite">
            <span className="ai-qa-thinking__dots">
              <span /><span /><span />
            </span>
            <span>AI חושב…</span>
          </div>
        )}

        {error && <p className="ai-error-msg">{error}</p>}

        {result && (
          <div className="ai-qa-result">
            <p className="ai-qa-result__label">
              תשובה מוצעת — ניתנת לעריכה לפני שמירה
            </p>

            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">שאלה</label>
              <input
                className="form-input"
                value={editQ}
                onChange={(e) => setEditQ(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">תשובה</label>
              <textarea
                className="form-input form-textarea"
                rows={5}
                value={editA}
                onChange={(e) => setEditA(e.target.value)}
              />
            </div>

            {result.tips.length > 0 && (
              <div className="ai-qa-result__section">
                <p className="ai-qa-result__section-title">טיפים:</p>
                <ul className="ai-qa-result__list">
                  {result.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.followUpQuestions.length > 0 && (
              <div className="ai-qa-result__section">
                <p className="ai-qa-result__section-title">שאלות המשך:</p>
                <ul className="ai-qa-result__list">
                  {result.followUpQuestions.map((fq, i) => (
                    <li key={i}>{fq}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="ai-qa-result__actions">
              {saved ? (
                <span className="local-qa-saved-badge">✓ נשמר במאגר</span>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={handleSave}
                  disabled={!editQ.trim()}
                >
                  + שמור למאגר
                </button>
              )}
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={handleReset}
              >
                שאלה חדשה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PersonalInterviewPage({ profile }: Props) {
  const { settings: aiSettings } = useAISettings();
  const { questions: savedQs, addQuestions, updateQuestion, deleteQuestion } = usePersonalQuestions();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [generated, setGenerated] = useState<EditableQuestion[]>(() => loadDraft());
  const [activeTab, setActiveTab] = useState<"bank" | "generate">(() =>
    loadDraft().length > 0 ? "generate" : "bank"
  );

  // Bank filter/sort/view state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<PersonalType | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  function buildProfileSummary(): string {
    if (!profile) return "";
    return [
      profile.targetRoles && `תפקידים: ${profile.targetRoles}`,
      profile.skills && `כישורים: ${profile.skills}`,
      profile.technologies && `טכנולוגיות: ${profile.technologies}`,
      profile.experienceSummary && `ניסיון: ${profile.experienceSummary}`,
      profile.educationSummary && `השכלה: ${profile.educationSummary}`,
      profile.strengths && `חוזקות: ${profile.strengths}`,
      profile.skillsToImprove && `תחומים לשיפור: ${profile.skillsToImprove}`,
      profile.projectsSummary && `פרויקטים: ${profile.projectsSummary}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // ── Filtered + sorted bank ────────────────────────────────────────────────

  const filteredQs = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = savedQs.filter((item) => {
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.suggestedAnswer.toLowerCase().includes(q);
      const matchType = !filterType || item.type === filterType;
      return matchSearch && matchType;
    });
    if (sortKey === "newest") list = [...list].reverse();
    else if (sortKey === "oldest") { /* already oldest first */ }
    else if (sortKey === "type") {
      list = [...list].sort((a, b) =>
        (TYPE_LABELS[a.type] ?? a.type).localeCompare(TYPE_LABELS[b.type] ?? b.type, "he")
      );
    }
    return list;
  }, [savedQs, search, filterType, sortKey]);

  const hasActiveFilters = search.trim() !== "" || filterType !== "";

  // ── Generate tab handlers ─────────────────────────────────────────────────

  async function handleGenerate() {
    setAiLoading(true);
    setAiError("");
    setActiveTab("generate");
    try {
      const profileSummary = buildProfileSummary();
      const qs = await fetchAIPersonalInterviewPrep(profileSummary);
      const mapped = qs.map((q, i) => ({ ...q, _key: i, _saved: false }));
      setGenerated(mapped);
      saveDraft(mapped);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setAiLoading(false);
    }
  }

  function handleSaveOne(edited: EditableQuestion) {
    addQuestions([
      {
        question: edited.question,
        type: edited.type,
        suggestedAnswer: edited.suggestedAnswer,
        tips: edited.tips,
        followUpQuestions: edited.followUpQuestions,
      },
    ]);
    setGenerated((prev) => {
      const updated = prev.map((q) =>
        q._key === edited._key ? { ...q, _saved: true } : q
      );
      saveDraft(updated);
      return updated;
    });
  }

  function handleSaveAll() {
    const unsaved = generated.filter((q) => !q._saved);
    if (!unsaved.length) return;
    addQuestions(
      unsaved.map((q) => ({
        question: q.question,
        type: q.type,
        suggestedAnswer: q.suggestedAnswer,
        tips: q.tips,
        followUpQuestions: q.followUpQuestions,
      }))
    );
    setGenerated((prev) => {
      const updated = prev.map((q) => ({ ...q, _saved: true }));
      saveDraft(updated);
      return updated;
    });
  }

  function handleClearDraft() {
    setGenerated([]);
    saveDraft([]);
    setActiveTab("bank");
  }

  function handleLoadCommon() {
    const existingTexts = new Set(savedQs.map((q) => q.question.trim()));
    const toAdd = COMMON_PERSONAL_QUESTIONS.filter(
      (q) => !existingTexts.has(q.question.trim())
    );
    if (toAdd.length === 0) return;
    addQuestions(toAdd);
    setActiveTab("bank");
  }

  const alreadyLoaded = COMMON_PERSONAL_QUESTIONS.every((q) =>
    savedQs.some((sq) => sq.question.trim() === q.question.trim())
  );

  function handleLoadRealtime() {
    const existingTexts = new Set(savedQs.map((q) => q.question.trim()));
    const toAdd = REALTIME_ENGINEER_QUESTIONS.filter(
      (q) => !existingTexts.has(q.question.trim())
    );
    if (toAdd.length === 0) return;
    addQuestions(toAdd);
    setActiveTab("bank");
  }

  const realtimeLoaded = REALTIME_ENGINEER_QUESTIONS.every((q) =>
    savedQs.some((sq) => sq.question.trim() === q.question.trim())
  );

  const profileEmpty = !buildProfileSummary();
  const unsavedCount = generated.filter((q) => !q._saved).length;

  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">ראיון אישי</p>
        <h2 className="page__title">הכנה לראיון אישי</h2>
        <p className="page__subtitle">
          שאלות אישיות/התנהגותיות מותאמות לפרופיל — ניתן לערוך, לסנן ולנהל
        </p>
      </div>

      {/* Generate with AI */}
      <div className="card personal-controls">
        <div className="personal-controls__row">
          <div>
            <p className="personal-controls__label">יצירת שאלות עם AI לפי הפרופיל</p>
            <p className="prep-section__helper" style={{ margin: 0 }}>
              {profileEmpty
                ? "מלאי את הפרופיל שלך כדי לקבל שאלות מותאמות אישית"
                : "AI ינתח את הפרופיל שלך ויצור שאלות מותאמות"}
            </p>
          </div>
          {aiSettings.aiEnabled ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleGenerate}
              disabled={aiLoading}
            >
              {aiLoading ? "⏳ מייצר שאלות..." : "✨ צור שאלות ראיון אישי"}
            </button>
          ) : (
            <p className="ai-error-msg">הפעל AI בפרופיל כדי להשתמש בפיצ'ר זה</p>
          )}
        </div>
        <div className="personal-controls__row" style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
          <div>
            <p className="personal-controls__label">8 שאלות ראיון נפוצות</p>
            <p className="prep-section__helper" style={{ margin: 0 }}>
              טען שאלות קלאסיות הנשאלות בכל ראיון, עם טיפים ושאלות המשך
            </p>
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleLoadCommon}
            disabled={alreadyLoaded}
          >
            {alreadyLoaded ? "✓ נטענו" : "טען שאלות נפוצות"}
          </button>
        </div>
        <div className="personal-controls__row" style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
          <div>
            <p className="personal-controls__label">69 שאלות — Real Time Software Engineer</p>
            <p className="prep-section__helper" style={{ margin: 0 }}>
              C/C++, RTOS, Embedded, TCP/IP, DDS, Git, LeetCode, פרויקטים, אישיות — עם תשובות מוכנות
            </p>
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleLoadRealtime}
            disabled={realtimeLoaded}
          >
            {realtimeLoaded ? "✓ נטענו" : "טען שאלות RT Engineer"}
          </button>
        </div>
        {aiError && <p className="ai-error-msg">{aiError}</p>}
      </div>

      {/* Tabs */}
      {(savedQs.length > 0 || generated.length > 0) && (
        <div className="personal-tabs">
          <button
            type="button"
            className={`personal-tab${activeTab === "bank" ? " personal-tab--active" : ""}`}
            onClick={() => setActiveTab("bank")}
          >
            המאגר שלי ({savedQs.length})
          </button>
          {generated.length > 0 && (
            <button
              type="button"
              className={`personal-tab${activeTab === "generate" ? " personal-tab--active" : ""}`}
              onClick={() => setActiveTab("generate")}
            >
              נוצרו ע"י AI ({generated.length})
              {unsavedCount > 0 && (
                <span className="personal-tab__badge">{unsavedCount} לא נשמרו</span>
              )}
            </button>
          )}
        </div>
      )}

      {/* ── Bank tab ─────────────────────────────────────────────────────── */}
      {activeTab === "bank" && (
        <>
          {/* Filter bar */}
          <div className="pq-filters card">
            {/* View mode */}
            <div className="view-mode-selector" role="group" aria-label="צורת הצגה">
              <span className="view-mode-label">צורת הצגה:</span>
              <button
                type="button"
                className={`view-mode-button${viewMode === "cards" ? " view-mode-button--active" : ""}`}
                onClick={() => setViewMode("cards")}
              >
                כרטיסיות
              </button>
              <button
                type="button"
                className={`view-mode-button${viewMode === "compact" ? " view-mode-button--active" : ""}`}
                onClick={() => setViewMode("compact")}
              >
                קומפקטי
              </button>
            </div>

            {/* Search */}
            <input
              type="search"
              className="form-input pq-search"
              placeholder="חיפוש שאלה או תשובה..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="חיפוש שאלות"
            />

            {/* Filters + sort */}
            <div className="pq-filter-row">
              <select
                className="form-input pq-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as PersonalType | "")}
                aria-label="סינון לפי סוג שאלה"
              >
                <option value="">כל הסוגים</option>
                {ALL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>

              <select
                className="form-input pq-select"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                aria-label="מיון"
              >
                <option value="newest">חדש → ישן</option>
                <option value="oldest">ישן → חדש</option>
                <option value="type">לפי סוג</option>
              </select>

              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => {
                  setSearch("");
                  setFilterType("");
                  setSortKey("newest");
                }}
              >
                איפוס
              </button>
            </div>

            {/* Status */}
            <div className="pq-status-row">
              <p className="pq-count">
                נמצאו <strong>{filteredQs.length}</strong> שאלות מתוך {savedQs.length}
              </p>
              {hasActiveFilters && (
                <p className="pq-filter-summary">סינון פעיל</p>
              )}
            </div>
          </div>

          {/* Main layout: cards + sidebar */}
          <div className="pq-layout">
            <div className="pq-main">
              {savedQs.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state__text">
                    המאגר ריק — לחצי <strong>✨ צור שאלות ראיון אישי</strong> או השתמשי בפאנל "שאל שאלה" בצד.
                  </p>
                </div>
              ) : filteredQs.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state__text">לא נמצאו שאלות התואמות לחיפוש.</p>
                </div>
              ) : viewMode === "cards" ? (
                <div className="pq-list cards-view">
                  {filteredQs.map((q) => (
                    <SavedQuestionCard
                      key={q.id}
                      q={q}
                      onUpdate={(patch) => updateQuestion(q.id, patch)}
                      onDelete={() => deleteQuestion(q.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="pq-list compact-cards-view">
                  {filteredQs.map((q) => (
                    <CompactPersonalCard
                      key={q.id}
                      q={q}
                      onUpdate={(patch) => updateQuestion(q.id, patch)}
                      onDelete={() => deleteQuestion(q.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="pq-sidebar">
              <PersonalQAPanel
                aiEnabled={aiSettings.aiEnabled}
                buildSummary={buildProfileSummary}
                onSave={(q) => addQuestions([q])}
              />

              <div className="card card--accent" style={{ marginTop: 16 }}>
                <h3 className="card__title">טיפים לראיון אישי</h3>
                <p className="card__text">השתמשי בשיטת STAR:</p>
                <ul className="card__list">
                  <li>
                    <strong>S</strong>ituation — הקשר
                  </li>
                  <li>
                    <strong>T</strong>ask — המשימה
                  </li>
                  <li>
                    <strong>A</strong>ction — מה עשית
                  </li>
                  <li>
                    <strong>R</strong>esult — התוצאה
                  </li>
                </ul>
                <p className="card__text" style={{ marginTop: 12 }}>
                  ערכי את התשובות עם פרטים אמיתיים מהניסיון שלך.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Generate tab ──────────────────────────────────────────────────── */}
      {activeTab === "generate" && generated.length > 0 && (
        <div className="pq-layout">
          <div className="pq-main">
            <div className="btn-row" style={{ marginBottom: 8 }}>
              {unsavedCount > 0 && (
                <button type="button" className="btn btn--primary" onClick={handleSaveAll}>
                  שמור את כל {unsavedCount} השאלות שלא נשמרו
                </button>
              )}
              <button
                type="button"
                className="btn btn--xs btn--danger"
                onClick={handleClearDraft}
              >
                נקה טיוטה
              </button>
            </div>
            <div className="pq-list cards-view">
              {generated.map((q) => (
                <AIQuestionCard key={q._key} q={q} onSave={handleSaveOne} />
              ))}
            </div>
          </div>
          <div className="pq-sidebar">
            <div className="card card--accent">
              <h3 className="card__title">איך לעבוד עם השאלות</h3>
              <ol className="card__list">
                <li>קראי את השאלה והתשובה המוצעת</li>
                <li>ערכי את התשובה עם פרטים אמיתיים שלך</li>
                <li>
                  לחצי <strong>+ שמור שאלה זו</strong>
                </li>
                <li>תרגלי את התשובות מהמאגר לפני הראיון</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalInterviewPage;
