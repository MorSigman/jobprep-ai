import { useState } from "react";
import type { UserProfile } from "../types/profile";
import type { ProjectEntry } from "../types/project";
import { useAISettings } from "../lib/useAISettings";
import {
  fetchAICvParse,
  fetchAIProjectAnalysis,
  fetchAICvFullAnalysis,
  type AICvFullAnalysisResult,
  type AIRawQuestion,
} from "../lib/aiClient";
import { useProfessionalQuestions } from "../hooks/useProfessionalQuestions";
import { useProjects } from "../hooks/useProjects";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "../lib/questionLabels";

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

type GithubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
};

function ProfilePage({ profile, onSave }: Props) {
  const [draft, setDraft] = useState<UserProfile>(() => ({ ...profile }));
  const [isDirty, setIsDirty] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const { settings: aiSettings, updateSettings: updateAISettings } = useAISettings();
  const { addQuestions } = useProfessionalQuestions();
  const { setProjects } = useProjects();

  // CV import state
  const [showCvImport, setShowCvImport] = useState(false);
  const [cvText, setCvText] = useState("");
  const [cvParsing, setCvParsing] = useState(false);
  const [cvError, setCvError] = useState("");
  const [cvApplied, setCvApplied] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<AICvFullAnalysisResult | null>(null);
  const [cvAnalysisLoading, setCvAnalysisLoading] = useState(false);
  const [addedCvQs, setAddedCvQs] = useState<Set<number>>(new Set());

  // GitHub import state
  const [showGithub, setShowGithub] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [githubApplied, setGithubApplied] = useState(false);
  const [githubAILoading, setGithubAILoading] = useState(false);
  const [githubQsAdded, setGithubQsAdded] = useState(0);
  const [githubSelected, setGithubSelected] = useState<Set<string>>(new Set());
  const [githubTotalFound, setGithubTotalFound] = useState(0);

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

  async function handleParseCv() {
    if (!cvText.trim()) return;
    setCvParsing(true);
    setCvError("");
    setCvApplied(false);
    setCvAnalysis(null);
    setAddedCvQs(new Set());
    try {
      const parsed = await fetchAICvParse(cvText);
      const merged: UserProfile = {
        ...draft,
        targetRoles: parsed.targetRoles || draft.targetRoles,
        targetCategories: parsed.targetCategories || draft.targetCategories,
        skills: parsed.skills || draft.skills,
        technologies: parsed.technologies || draft.technologies,
        tools: parsed.tools || draft.tools,
        projectsSummary: parsed.projectsSummary || draft.projectsSummary,
        experienceSummary: parsed.experienceSummary || draft.experienceSummary,
        educationSummary: parsed.educationSummary || draft.educationSummary,
        strengths: parsed.strengths || draft.strengths,
      };
      setDraft(merged);
      onSave(merged);
      setIsDirty(false);
      setCvApplied(true);
      setCvText("");

      // Auto-run deeper analysis after parse
      const profileSummary = [
        merged.targetRoles && `תפקידים: ${merged.targetRoles}`,
        merged.skills && `כישורים: ${merged.skills}`,
        merged.technologies && `טכנולוגיות: ${merged.technologies}`,
        merged.experienceSummary && `ניסיון: ${merged.experienceSummary}`,
        merged.educationSummary && `השכלה: ${merged.educationSummary}`,
        merged.strengths && `חוזקות: ${merged.strengths}`,
      ].filter(Boolean).join("\n");

      if (profileSummary.length > 30) {
        setCvAnalysisLoading(true);
        try {
          const analysis = await fetchAICvFullAnalysis(profileSummary);
          setCvAnalysis(analysis);
        } catch {
          // analysis is bonus — don't block the main flow
        } finally {
          setCvAnalysisLoading(false);
        }
      }
    } catch (err) {
      setCvError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setCvParsing(false);
    }
  }

  function handleAddCvQuestion(q: AIRawQuestion, index: number) {
    addQuestions([{
      question: q.question,
      shortAnswer: q.shortAnswer,
      simpleExplanation: q.simpleExplanation,
      example: q.example,
      whatToMention: q.whatToMention,
      commonMistakes: q.commonMistakes,
      tags: q.tags,
      category: q.category as "General",
      topic: q.topic,
      difficulty: q.difficulty,
    }], "ai");
    setAddedCvQs((prev) => new Set(prev).add(index));
  }

  async function handleGithubFetch() {
    const username = githubUsername.trim();
    if (!username) return;
    setGithubLoading(true);
    setGithubError("");
    setGithubRepos([]);
    setGithubApplied(false);
    setGithubSelected(new Set());
    setGithubTotalFound(0);
    setGithubQsAdded(0);
    try {
      // GitHub API max per_page is 100; fetch page 1 and page 2 to cover up to 200 repos
      const [res1, res2] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&page=1`),
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&page=2`),
      ]);
      if (!res1.ok) {
        throw new Error(res1.status === 404 ? "משתמש GitHub לא נמצא" : "שגיאה בגישה ל-GitHub");
      }
      const page1 = (await res1.json()) as GithubRepo[];
      const page2 = res2.ok ? ((await res2.json()) as GithubRepo[]) : [];
      const all = [...page1, ...page2];
      setGithubTotalFound(all.length);
      setGithubRepos(all);
      // pre-select all repos
      setGithubSelected(new Set(all.map((r) => r.name)));
    } catch (err) {
      setGithubError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setGithubLoading(false);
    }
  }

  async function handleApplyGithub() {
    const selected = githubRepos.filter((r) => githubSelected.has(r.name));
    if (!selected.length) return;
    const summary = selected
      .map((r) => {
        const lang = r.language ? ` (${r.language})` : "";
        const desc = r.description ? `: ${r.description}` : "";
        return `${r.name}${lang}${desc}`;
      })
      .join("\n");
    const merged: UserProfile = { ...draft, projectsSummary: summary };
    setDraft(merged);
    onSave(merged);
    setIsDirty(false);
    setGithubApplied(true);

    // Save bare project entries immediately (no AI yet)
    const bareEntries: ProjectEntry[] = selected.map((r) => ({
      id: `gh-${r.name}`,
      name: r.name,
      description: r.description ?? "",
      language: r.language ?? "",
      githubUrl: r.html_url,
      simpleExplanation: "",
      interviewTip: "",
      deepAnalysis: null,
      createdAt: new Date().toISOString(),
    }));
    setProjects(bareEntries);

    if (aiSettings.aiEnabled) {
      setGithubAILoading(true);
      try {
        const result = await fetchAIProjectAnalysis(
          selected.map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
          }))
        );

        // Merge AI analysis into project entries
        const enriched: ProjectEntry[] = bareEntries.map((entry) => {
          const analysis = result.projects.find((p) => p.name === entry.name);
          return analysis
            ? { ...entry, simpleExplanation: analysis.simpleExplanation, interviewTip: analysis.interviewTip }
            : entry;
        });
        setProjects(enriched);

        if (result.questions.length > 0) {
          addQuestions(
            result.questions.map((q) => ({
              category: "Projects" as const,
              topic: q.topic,
              difficulty: q.difficulty,
              question: q.question,
              shortAnswer: q.shortAnswer,
              simpleExplanation: q.simpleExplanation,
              example: q.example,
              whatToMention: q.whatToMention,
              commonMistakes: q.commonMistakes,
              tags: q.tags,
            })),
            "ai"
          );
          setGithubQsAdded(result.questions.length);
        }
      } catch {
        // שגיאת AI לא תמנע שמירת הפרויקטים
      } finally {
        setGithubAILoading(false);
        setTimeout(() => setShowGithub(false), 2000);
      }
    } else {
      setTimeout(() => setShowGithub(false), 1500);
    }
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

      {/* Quick Import */}
      <div className="card profile-import-card">
        <div className="profile-import-header">
          <div>
            <h3 className="card__title" style={{ marginBottom: 4 }}>ייבוא מהיר</h3>
            <p className="prep-section__helper" style={{ margin: 0 }}>
              במקום למלא כל שדה ידנית — ייבא קורות חיים או פרויקטים מ-GitHub בלחיצה אחת.
            </p>
          </div>
          <div className="profile-import-btns">
            <button
              type="button"
              className={`btn btn--sm ${showCvImport ? "btn--primary" : "btn--secondary"}`}
              onClick={() => { setShowCvImport((v) => !v); setShowGithub(false); }}
            >
              📄 ייבוא קורות חיים
            </button>
            <button
              type="button"
              className={`btn btn--sm ${showGithub ? "btn--primary" : "btn--secondary"}`}
              onClick={() => { setShowGithub((v) => !v); setShowCvImport(false); }}
            >
              🐙 ייבוא מ-GitHub
            </button>
          </div>
        </div>

        {showCvImport && (
          <div className="profile-import-panel">
            <p className="prep-section__helper">
              הדבק את קורות החיים שלך (עברית או אנגלית) — ה-AI ינתח ויחלץ את כל הפרטים לשדות הפרופיל.
            </p>
            {!aiSettings.aiEnabled && (
              <p className="ai-error-msg">⚠️ יש להפעיל AI בהגדרות למטה לפני שימוש בפיצ׳ר זה.</p>
            )}
            <textarea
              className="form-input form-textarea"
              rows={10}
              placeholder="הדבק כאן את הטקסט של קורות החיים שלך..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              disabled={cvParsing}
            />
            {cvError && <p className="ai-error-msg">{cvError}</p>}
            {cvApplied && (
              <p className="prep-section__saved" role="status">
                ✓ הפרופיל עודכן ונשמר אוטומטית
                {cvAnalysisLoading && " — מנתח חוזקות ושאלות ראיון..."}
              </p>
            )}
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleParseCv}
                disabled={cvParsing || !cvText.trim() || !aiSettings.aiEnabled}
              >
                {cvParsing ? "⏳ מנתח..." : "✨ נתח וייבא"}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => { setShowCvImport(false); setCvText(""); setCvError(""); }}
              >
                ביטול
              </button>
            </div>
          </div>
        )}

        {showGithub && (
          <div className="profile-import-panel">
            <p className="prep-section__helper">
              הזן שם משתמש GitHub — המערכת תייבא את הפרויקטים הציבוריים ותמלא את שדה "פרויקטים שלי".
            </p>
            <div className="profile-github-row">
              <input
                type="text"
                className="form-input"
                placeholder="שם משתמש GitHub (לדוגמה: MorSigman)"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGithubFetch()}
                disabled={githubLoading}
              />
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={handleGithubFetch}
                disabled={githubLoading || !githubUsername.trim()}
              >
                {githubLoading ? "⏳ טוען..." : "טען פרויקטים"}
              </button>
            </div>
            {githubError && <p className="ai-error-msg">{githubError}</p>}
            {githubRepos.length > 0 && (
              <>
                <div className="profile-github-summary">
                  <span>נמצאו <strong>{githubTotalFound}</strong> פרויקטים</span>
                  <span className="profile-github-summary__sep">·</span>
                  <span>נבחרו <strong>{githubSelected.size}</strong></span>
                  <button
                    type="button"
                    className="btn btn--xs btn--secondary"
                    onClick={() => setGithubSelected(new Set(githubRepos.map((r) => r.name)))}
                  >
                    בחר הכל
                  </button>
                  <button
                    type="button"
                    className="btn btn--xs btn--secondary"
                    onClick={() => setGithubSelected(new Set())}
                  >
                    בטל הכל
                  </button>
                </div>
                <div className="profile-github-repos">
                  {githubRepos.map((r) => (
                    <label key={r.name} className={`profile-github-repo${githubSelected.has(r.name) ? " profile-github-repo--selected" : ""}`}>
                      <input
                        type="checkbox"
                        className="profile-github-repo__check"
                        checked={githubSelected.has(r.name)}
                        onChange={() => {
                          setGithubSelected((prev) => {
                            const next = new Set(prev);
                            if (next.has(r.name)) next.delete(r.name);
                            else next.add(r.name);
                            return next;
                          });
                        }}
                      />
                      <span className="profile-github-repo__name">{r.name}</span>
                      {r.language && <span className="chip chip--topic chip--sm">{r.language}</span>}
                      {r.description
                        ? <span className="profile-github-repo__desc">{r.description}</span>
                        : <span className="profile-github-repo__no-desc">ללא תיאור</span>}
                    </label>
                  ))}
                </div>
                <div className="btn-row">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleApplyGithub}
                    disabled={githubApplied || githubAILoading || githubSelected.size === 0}
                  >
                    {githubAILoading
                      ? "⏳ מנתח פרויקטים..."
                      : githubApplied
                      ? "✓ הוחל"
                      : `החל ${githubSelected.size} פרויקטים נבחרים`}
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => { setShowGithub(false); setGithubRepos([]); setGithubUsername(""); setGithubSelected(new Set()); }}
                    disabled={githubAILoading}
                  >
                    ביטול
                  </button>
                </div>
                {githubAILoading && (
                  <p className="prep-section__helper">
                    ✨ AI מנתח את הפרויקטים ויוצר שאלות ראיון למאגר...
                  </p>
                )}
                {githubQsAdded > 0 && !githubAILoading && (
                  <p className="prep-section__saved" role="status">
                    ✓ {githubQsAdded} שאלות ראיון על הפרויקטים נוספו למאגר "שאלות מקצועיות"
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* CV Analysis Results */}
      {cvAnalysis && (
        <div className="card cv-analysis-card">
          <h3 className="card__title">✨ ניתוח קורות חיים — תוצאות</h3>

          {cvAnalysis.strengths.length > 0 && (
            <div className="cv-analysis-section">
              <p className="cv-analysis-section__label">חוזקות בולטות</p>
              <ul className="cv-analysis-list cv-analysis-list--strength">
                {cvAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {cvAnalysis.areasToImprove.length > 0 && (
            <div className="cv-analysis-section">
              <p className="cv-analysis-section__label">תחומים לחיזוק לפני ראיון</p>
              <ul className="cv-analysis-list cv-analysis-list--improve">
                {cvAnalysis.areasToImprove.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}

          {cvAnalysis.focusPerJobType.length > 0 && (
            <div className="cv-analysis-section">
              <p className="cv-analysis-section__label">מה להדגיש לפי סוג תפקיד</p>
              <div className="cv-analysis-focus-grid">
                {cvAnalysis.focusPerJobType.map((f, i) => (
                  <div key={i} className="cv-analysis-focus-item">
                    <p className="cv-analysis-focus-item__type">{f.jobType}</p>
                    <p className="cv-analysis-focus-item__focus">{f.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cvAnalysis.questions.length > 0 && (
            <div className="cv-analysis-section">
              <p className="cv-analysis-section__label">
                שאלות ראיון צפויות ({cvAnalysis.questions.length}) — ניתן להוסיף למאגר
              </p>
              <div className="cv-analysis-questions">
                {cvAnalysis.questions.map((q, i) => (
                  <div key={i} className="cv-analysis-q-card">
                    <div className="cv-analysis-q-card__meta">
                      <span className="chip chip--category chip--sm">
                        {CATEGORY_LABELS[q.category as keyof typeof CATEGORY_LABELS] ?? q.category}
                      </span>
                      <span className={`chip chip--difficulty chip--difficulty-${q.difficulty} chip--sm`}>
                        {DIFFICULTY_LABELS[q.difficulty]}
                      </span>
                      <span className="chip chip--topic chip--sm">{q.topic}</span>
                    </div>
                    <p className="cv-analysis-q-card__question">{q.question}</p>
                    <p className="cv-analysis-q-card__answer">{q.shortAnswer}</p>
                    <button
                      type="button"
                      className={`btn btn--sm ${addedCvQs.has(i) ? "btn--secondary" : "btn--primary"}`}
                      onClick={() => handleAddCvQuestion(q, i)}
                      disabled={addedCvQs.has(i)}
                    >
                      {addedCvQs.has(i) ? "✓ נוסף למאגר" : "+ הוסף למאגר שאלות"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Settings */}
      <div className="card">
        <div className="ai-settings-card">
          <div>
            <h3 className="ai-settings-card__title">הגדרות AI</h3>
            <p className="ai-settings-card__desc">
              הגדרות אלה שולטות בשימוש ב-AI. AI כבוי כברירת מחדל.
              כדי להשתמש ב-AI, יש להגדיר מפתח API ב-<code>.env</code> ולהפעיל את שרת ה-AI.
            </p>
          </div>

          <div className="ai-settings-row">
            <div className="ai-settings-row__info">
              <span className="ai-settings-row__label">הפעלת AI</span>
              <span className="ai-settings-row__helper">
                מאפשר יצירת שאלות ראיון בעזרת AI מתיאורי משרה.
                דורש שרת AI מקומי רץ (ראי docs/AI_SETUP.md).
              </span>
            </div>
            <label className="ai-settings-toggle" aria-label="הפעלת AI">
              <input
                type="checkbox"
                checked={aiSettings.aiEnabled}
                onChange={(e) => updateAISettings({ aiEnabled: e.target.checked })}
              />
              <span className="ai-settings-toggle__track" />
            </label>
          </div>

          {aiSettings.aiEnabled && (
            <p className="ai-settings-warning">
              AI מופעל. לפני כל שליחה, יוצג אישור עם הטקסט המדויק שישלח לשרת.
              אף נתון לא ישלח ללא אישורך.
            </p>
          )}

          <div className="ai-settings-row">
            <div className="ai-settings-row__info">
              <span className="ai-settings-row__label">ניקוי אוטומטי לפני שליחה</span>
              <span className="ai-settings-row__helper">
                לפני שליחה ל-AI, כתובות מייל, מספרי טלפון, קישורים ות.ז. יוחלפו
                בתגיות כמו [EMAIL], [PHONE], [URL], [ID].
              </span>
            </div>
            <label className="ai-settings-toggle" aria-label="ניקוי לפני שליחה">
              <input
                type="checkbox"
                checked={aiSettings.redactBeforeSend}
                onChange={(e) => updateAISettings({ redactBeforeSend: e.target.checked })}
              />
              <span className="ai-settings-toggle__track" />
            </label>
          </div>
        </div>
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
