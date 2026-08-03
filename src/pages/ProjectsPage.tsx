import { useState, useRef } from "react";
import { useProjects } from "../hooks/useProjects";
import { useAISettings } from "../lib/useAISettings";
import { useProfessionalQuestions } from "../hooks/useProfessionalQuestions";
import {
  fetchAISingleProjectAnalysis,
  fetchAIProjectQuestion,
  type AIRawQuestion,
} from "../lib/aiClient";
import type { ProjectEntry, ProjectDeepAnalysis } from "../types/project";

// ─── Types ───────────────────────────────────────────────────────────────────

type QAMessage = { role: "user" | "ai"; text: string };

type CardUIState = {
  analyzeLoading: boolean;
  analyzeError: string;
  sessionQuestions: AIRawQuestion[];
  selectedQs: Set<number>;
  expandedQs: Set<number>;
  editedAnswers: Record<number, string>;
  savedCount: number;
  analysisOpen: boolean;
  qaOpen: boolean;
  qaMessages: QAMessage[];
  qaInput: string;
  qaLoading: boolean;
  qaError: string;
};

const EMPTY_UI: CardUIState = {
  analyzeLoading: false,
  analyzeError: "",
  sessionQuestions: [],
  selectedQs: new Set(),
  expandedQs: new Set(),
  editedAnswers: {},
  savedCount: 0,
  analysisOpen: true,
  qaOpen: false,
  qaMessages: [],
  qaInput: "",
  qaLoading: false,
  qaError: "",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="projects-empty">
      <p className="projects-empty__title">אין פרויקטים עדיין</p>
      <p className="projects-empty__desc">
        כנסי לעמוד <strong>הפרופיל שלי</strong> → <strong>ייבוא מ-GitHub</strong> → בחרי פרויקטים → לחצי <strong>החל</strong>.
      </p>
    </div>
  );
}

type AnalysisSectionProps = {
  da: ProjectDeepAnalysis;
};
function AnalysisSection({ da }: AnalysisSectionProps) {
  return (
    <div className="project-analysis">
      {da.analysis && (
        <div className="project-analysis__section">
          <p className="project-analysis__label">מה הפרויקט עושה</p>
          <p className="project-analysis__text">{da.analysis}</p>
        </div>
      )}
      {da.whatWasBuilt && (
        <div className="project-analysis__section">
          <p className="project-analysis__label">מה נבנה בפרויקט</p>
          <p className="project-analysis__text">{da.whatWasBuilt}</p>
        </div>
      )}
      {da.architecture && (
        <div className="project-analysis__section">
          <p className="project-analysis__label">ארכיטקטורה ובנייה</p>
          <p className="project-analysis__text">{da.architecture}</p>
        </div>
      )}
      {da.technologiesExplained && (
        <div className="project-analysis__section">
          <p className="project-analysis__label">טכנולוגיות</p>
          <p className="project-analysis__text">{da.technologiesExplained}</p>
        </div>
      )}
      <p className="project-analysis__date">
        נותח: {new Date(da.analyzedAt).toLocaleDateString("he-IL")}
      </p>
    </div>
  );
}

type QuestionsPanelProps = {
  questions: AIRawQuestion[];
  selected: Set<number>;
  expanded: Set<number>;
  editedAnswers: Record<number, string>;
  savedCount: number;
  onToggle: (i: number) => void;
  onToggleExpand: (i: number) => void;
  onEditAnswer: (i: number, val: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSave: () => void;
};
function QuestionsPanel({
  questions, selected, expanded, editedAnswers, savedCount,
  onToggle, onToggleExpand, onEditAnswer,
  onSelectAll, onDeselectAll, onSave,
}: QuestionsPanelProps) {
  if (!questions.length) return null;
  return (
    <div className="project-analysis__questions">
      <div className="project-analysis__questions-header">
        <p className="project-analysis__label">שאלות ראיון ({questions.length})</p>
        <div className="project-analysis__questions-actions">
          <button type="button" className="btn btn--xs btn--secondary" onClick={onSelectAll}>בחר הכל</button>
          <button type="button" className="btn btn--xs btn--secondary" onClick={onDeselectAll}>בטל הכל</button>
        </div>
      </div>
      <div className="project-analysis__q-list">
        {questions.map((q, i) => {
          const isExpanded = expanded.has(i);
          const answer = editedAnswers[i] ?? q.shortAnswer;
          return (
            <div
              key={i}
              className={`project-analysis__q-item${selected.has(i) ? " project-analysis__q-item--selected" : ""}`}
            >
              {/* Row: checkbox + question + expand toggle */}
              <div className="project-analysis__q-row">
                <input
                  type="checkbox"
                  className="project-github-repo__check"
                  checked={selected.has(i)}
                  onChange={() => onToggle(i)}
                  aria-label="בחר שאלה"
                />
                <p className="project-analysis__q-text">{q.question}</p>
                <button
                  type="button"
                  className="btn btn--xs btn--secondary project-analysis__q-expand"
                  onClick={() => onToggleExpand(i)}
                  aria-label={isExpanded ? "סגור תשובה" : "הצג תשובה"}
                >
                  {isExpanded ? "−" : "+"}
                </button>
              </div>

              {/* Chips always visible */}
              <div className="chip-row" style={{ marginTop: 4, paddingRight: 24 }}>
                <span className={`chip chip--difficulty chip--${q.difficulty}`}>
                  {q.difficulty === "basic" ? "בסיסי" : q.difficulty === "intermediate" ? "בינוני" : "מתקדם"}
                </span>
                {q.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="chip chip--topic chip--sm">{tag}</span>
                ))}
              </div>

              {/* Expanded: editable answer */}
              {isExpanded && (
                <div className="project-analysis__q-answer-block">
                  <p className="project-analysis__q-answer-label">תשובה מוצעת (ניתנת לעריכה)</p>
                  <textarea
                    className="form-textarea project-analysis__q-answer-edit"
                    value={answer}
                    rows={4}
                    onChange={(e) => onEditAnswer(i, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="btn-row" style={{ marginTop: 10 }}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onSave}
          disabled={selected.size === 0 || savedCount > 0}
        >
          {savedCount > 0
            ? `✓ ${savedCount} שאלות נשמרו למאגר`
            : `שמור ${selected.size} שאלות נבחרות למאגר`}
        </button>
      </div>
    </div>
  );
}

type QAPanelProps = {
  project: ProjectEntry;
  ui: CardUIState;
  onSendQuestion: () => void;
  onInputChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};
function QAPanel({ project, ui, onSendQuestion, onInputChange, onKeyDown, messagesEndRef }: QAPanelProps) {
  const hasAnalysis = !!project.deepAnalysis;
  return (
    <div className="project-qa">
      <div className="project-qa__header">
        <p className="project-analysis__label">שאלות חופשיות על "{project.name}"</p>
        {!hasAnalysis && (
          <p className="project-qa__hint">טיפ: נתח קודם את הפרויקט עם AI לקבל תשובות מדויקות יותר</p>
        )}
      </div>

      {ui.qaMessages.length > 0 && (
        <div className="project-qa__messages">
          {ui.qaMessages.map((msg, i) => (
            <div key={i} className={`project-qa__msg project-qa__msg--${msg.role}`}>
              <span className="project-qa__msg-role">{msg.role === "user" ? "את" : "AI"}</span>
              <p className="project-qa__msg-text">{msg.text}</p>
            </div>
          ))}
          {ui.qaLoading && (
            <div className="project-qa__msg project-qa__msg--ai">
              <span className="project-qa__msg-role">AI</span>
              <p className="project-qa__msg-text project-qa__typing">⏳ חושב...</p>
            </div>
          )}
          {ui.qaError && (
            <p className="ai-error-msg">{ui.qaError}</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="project-qa__input-row">
        <input
          type="text"
          className="form-input"
          placeholder={`שאלי שאלה על ${project.name}... (Enter לשליחה)`}
          value={ui.qaInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={ui.qaLoading}
        />
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={onSendQuestion}
          disabled={ui.qaLoading || !ui.qaInput.trim()}
        >
          שלח
        </button>
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

type ProjectCardProps = {
  project: ProjectEntry;
  aiEnabled: boolean;
  ui: CardUIState;
  onAnalyze: () => void;
  onDelete: () => void;
  onToggleAnalysis: () => void;
  onToggleQ: (i: number) => void;
  onToggleExpand: (i: number) => void;
  onEditAnswer: (i: number, val: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSaveQuestions: () => void;
  onToggleQA: () => void;
  onSendQuestion: () => void;
  onQAInputChange: (v: string) => void;
  onQAKeyDown: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

function ProjectCard({
  project, aiEnabled, ui,
  onAnalyze, onDelete, onToggleAnalysis,
  onToggleQ, onToggleExpand, onEditAnswer,
  onSelectAll, onDeselectAll, onSaveQuestions,
  onToggleQA, onSendQuestion, onQAInputChange, onQAKeyDown,
  messagesEndRef,
}: ProjectCardProps) {
  const da = project.deepAnalysis;
  const hasSessionQs = ui.sessionQuestions.length > 0;

  return (
    <div className="card project-card">
      {/* Header */}
      <div className="project-card__header">
        <div>
          <h3 className="card__title">{project.name}</h3>
          {project.language && (
            <span className="chip chip--teal chip--sm" style={{ marginTop: 4, display: "inline-block" }}>
              {project.language}
            </span>
          )}
        </div>
        <div className="project-card__actions">
          {aiEnabled && (
            <button
              type="button"
              className="btn btn--sm btn--primary"
              onClick={onAnalyze}
              disabled={ui.analyzeLoading}
            >
              {ui.analyzeLoading ? "⏳ מנתח..." : da ? "↻ נתח שוב" : "✨ נתח עם AI"}
            </button>
          )}
          {da && (
            <button
              type="button"
              className="btn btn--xs btn--secondary"
              onClick={onToggleAnalysis}
            >
              {ui.analysisOpen ? "הסתר ניתוח ▲" : "הצג ניתוח ▼"}
            </button>
          )}
          {aiEnabled && da && (
            <button
              type="button"
              className={`btn btn--sm ${ui.qaOpen ? "btn--primary" : "btn--secondary"}`}
              onClick={onToggleQA}
            >
              💬 שאל שאלה
            </button>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--xs btn--secondary"
            >
              GitHub ↗
            </a>
          )}
          <button
            type="button"
            className="btn btn--xs btn--danger"
            onClick={onDelete}
          >
            מחק
          </button>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="project-card__desc">{project.description}</p>
      )}

      {/* No AI state */}
      {!aiEnabled && !da && (
        <div className="project-card__section project-card__section--empty">
          <p className="project-card__section-text project-card__section-text--hint">
            הפעל AI בפרופיל כדי לנתח את הפרויקט
          </p>
        </div>
      )}

      {/* Analyze error */}
      {ui.analyzeError && (
        <p className="ai-error-msg" style={{ marginTop: 8 }}>{ui.analyzeError}</p>
      )}

      {/* Persisted deep analysis */}
      {da && ui.analysisOpen && <AnalysisSection da={da} />}

      {/* Session questions (shown after fresh analysis) */}
      {hasSessionQs && (
        <QuestionsPanel
          questions={ui.sessionQuestions}
          selected={ui.selectedQs}
          expanded={ui.expandedQs}
          editedAnswers={ui.editedAnswers}
          savedCount={ui.savedCount}
          onToggle={onToggleQ}
          onToggleExpand={onToggleExpand}
          onEditAnswer={onEditAnswer}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          onSave={onSaveQuestions}
        />
      )}

      {/* Q&A chat */}
      {ui.qaOpen && da && (
        <QAPanel
          project={project}
          ui={ui}
          onSendQuestion={onSendQuestion}
          onInputChange={onQAInputChange}
          onKeyDown={onQAKeyDown}
          messagesEndRef={messagesEndRef}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ProjectsPage() {
  const { projects, updateProject, deleteProject } = useProjects();
  const { settings: aiSettings } = useAISettings();
  const { addQuestions } = useProfessionalQuestions();

  const [uiState, setUiState] = useState<Record<string, CardUIState>>({});
  const messagesEndRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  function getUI(id: string): CardUIState {
    return uiState[id] ?? EMPTY_UI;
  }

  function patchUI(id: string, patch: Partial<CardUIState>) {
    setUiState((prev) => ({ ...prev, [id]: { ...(prev[id] ?? EMPTY_UI), ...patch } }));
  }

  function getMessagesRef(id: string): React.RefObject<HTMLDivElement | null> {
    if (!messagesEndRefs.current[id]) {
      messagesEndRefs.current[id] = { current: null };
    }
    return messagesEndRefs.current[id];
  }

  // ── Analyze ──────────────────────────────────────────────────────────────

  async function handleAnalyze(project: ProjectEntry) {
    patchUI(project.id, {
      analyzeLoading: true,
      analyzeError: "",
      sessionQuestions: [],
      selectedQs: new Set(),
      savedCount: 0,
    });
    try {
      const result = await fetchAISingleProjectAnalysis({
        name: project.name,
        description: project.description,
        language: project.language,
      });

      const da: ProjectDeepAnalysis = {
        analysis: result.analysis,
        architecture: result.architecture,
        whatWasBuilt: result.whatWasBuilt,
        technologiesExplained: result.technologiesExplained,
        analyzedAt: new Date().toISOString(),
      };

      // Save analysis permanently
      updateProject(project.id, { deepAnalysis: da });

      patchUI(project.id, {
        analyzeLoading: false,
        sessionQuestions: result.questions,
        selectedQs: new Set(result.questions.map((_, i) => i)),
      });
    } catch (err) {
      patchUI(project.id, {
        analyzeLoading: false,
        analyzeError: err instanceof Error ? err.message : "שגיאה לא ידועה",
      });
    }
  }

  // ── Questions ────────────────────────────────────────────────────────────

  function handleToggleQ(id: string, i: number) {
    const prev = getUI(id).selectedQs;
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    patchUI(id, { selectedQs: next });
  }

  function handleToggleExpand(id: string, i: number) {
    const prev = getUI(id).expandedQs;
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    patchUI(id, { expandedQs: next });
  }

  function handleEditAnswer(id: string, i: number, val: string) {
    const prev = getUI(id).editedAnswers;
    patchUI(id, { editedAnswers: { ...prev, [i]: val } });
  }

  function handleSaveQuestions(project: ProjectEntry) {
    const ui = getUI(project.id);
    const toSave = ui.sessionQuestions.filter((_, i) => ui.selectedQs.has(i));
    if (!toSave.length) return;
    addQuestions(
      toSave.map((q: AIRawQuestion) => {
        const idx = ui.sessionQuestions.indexOf(q);
        const editedAnswer = ui.editedAnswers[idx];
        return {
          category: "Projects" as const,
          topic: project.name,
          difficulty: q.difficulty,
          question: q.question,
          shortAnswer: editedAnswer ?? q.shortAnswer,
          simpleExplanation: q.simpleExplanation,
          example: q.example,
          whatToMention: q.whatToMention,
          commonMistakes: q.commonMistakes,
          tags: q.tags,
        };
      }),
      "ai"
    );
    patchUI(project.id, { savedCount: toSave.length });
  }

  // ── Q&A ──────────────────────────────────────────────────────────────────

  function handleToggleQA(id: string) {
    patchUI(id, { qaOpen: !getUI(id).qaOpen });
  }

  async function handleSendQuestion(project: ProjectEntry) {
    const ui = getUI(project.id);
    const question = ui.qaInput.trim();
    if (!question || ui.qaLoading) return;

    const da = project.deepAnalysis;
    const newMessages: QAMessage[] = [...ui.qaMessages, { role: "user", text: question }];
    patchUI(project.id, { qaMessages: newMessages, qaInput: "", qaLoading: true, qaError: "" });

    // Scroll to bottom
    setTimeout(() => {
      const ref = getMessagesRef(project.id);
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      const answer = await fetchAIProjectQuestion({
        projectName: project.name,
        description: project.description,
        language: project.language,
        analysis: da?.analysis ?? "",
        architecture: da?.architecture ?? "",
        whatWasBuilt: da?.whatWasBuilt ?? "",
        technologiesExplained: da?.technologiesExplained ?? "",
        question,
      });

      patchUI(project.id, {
        qaLoading: false,
        qaMessages: [...newMessages, { role: "ai", text: answer }],
      });

      setTimeout(() => {
        const ref = getMessagesRef(project.id);
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (err) {
      patchUI(project.id, {
        qaLoading: false,
        qaError: err instanceof Error ? err.message : "שגיאה לא ידועה",
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">פרויקטים</p>
        <h2 className="page__title">הפרויקטים שלי</h2>
        {projects.length > 0 && (
          <p className="page__subtitle">
            {projects.length} פרויקטים · לחצי <strong>✨ נתח עם AI</strong> לניתוח ושאלות ראיון, ואז <strong>💬 שאל שאלה</strong> לשיחה חופשית
          </p>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="projects-layout">
          <div className="projects-list">
            {projects.map((project) => {
              const ui = getUI(project.id);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  aiEnabled={aiSettings.aiEnabled}
                  ui={ui}
                  onAnalyze={() => handleAnalyze(project)}
                  onDelete={() => deleteProject(project.id)}
                  onToggleAnalysis={() => patchUI(project.id, { analysisOpen: !getUI(project.id).analysisOpen })}
                  onToggleQ={(i) => handleToggleQ(project.id, i)}
                  onToggleExpand={(i) => handleToggleExpand(project.id, i)}
                  onEditAnswer={(i, val) => handleEditAnswer(project.id, i, val)}
                  onSelectAll={() => patchUI(project.id, { selectedQs: new Set(ui.sessionQuestions.map((_, i) => i)) })}
                  onDeselectAll={() => patchUI(project.id, { selectedQs: new Set() })}
                  onSaveQuestions={() => handleSaveQuestions(project)}
                  onToggleQA={() => handleToggleQA(project.id)}
                  onSendQuestion={() => handleSendQuestion(project)}
                  onQAInputChange={(v) => patchUI(project.id, { qaInput: v })}
                  onQAKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendQuestion(project); } }}
                  messagesEndRef={getMessagesRef(project.id)}
                />
              );
            })}
          </div>

          <div className="card card--sidebar card--accent">
            <h3 className="card__title">איך להשתמש בזה בראיון</h3>
            <p className="card__text">מבנה מנצח להצגת פרויקט:</p>
            <ul className="card__list">
              <li><strong>בעיה</strong> — מה ניסיתי לפתור?</li>
              <li><strong>פתרון</strong> — מה בניתי ואיך?</li>
              <li><strong>טכנולוגיות</strong> — למה בחרתי דווקא אלה?</li>
              <li><strong>תוצאה</strong> — מה למדתי? מה הייתי משנה?</li>
            </ul>
            <p className="card__text" style={{ marginTop: 12 }}>
              לאחר ניתוח עם AI תוכלי לשאול שאלות חופשיות על כל פרויקט — הAI למד את המבנה שלו.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
