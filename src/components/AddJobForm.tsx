import { useState } from "react";
import type { JobApplication, JobCategory, JobStatus } from "../types/job";

const CATEGORY_OPTIONS: JobCategory[] = [
  "Frontend",
  "Backend",
  "QA",
  "Data Analyst",
  "Cyber",
  "Product",
  "Other",
];

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "saved", label: "שמורה" },
  { value: "applied", label: "הוגשה" },
  { value: "waiting", label: "ממתינה לתשובה" },
  { value: "phone_screen", label: "שיחה טלפונית" },
  { value: "home_assignment", label: "מטלת בית" },
  { value: "technical_interview", label: "ראיון טכני" },
  { value: "personal_interview", label: "ראיון אישי" },
  { value: "offer", label: "הצעת עבודה" },
  { value: "rejected", label: "נדחתה" },
];

type FormState = {
  companyName: string;
  roleTitle: string;
  jobUrl: string;
  jobDescription: string;
  category: JobCategory | "";
  status: JobStatus;
  source: string;
  resumeVersion: string;
  appliedAt: string;
  followUpAt: string;
  nextAction: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type Props = {
  onSave: (job: JobApplication) => void;
  onCancel: () => void;
  initialJob?: JobApplication;
};

function todayLocalStr(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function buildForm(initial?: JobApplication): FormState {
  return {
    companyName: initial?.companyName ?? "",
    roleTitle: initial?.roleTitle ?? "",
    jobUrl: initial?.jobUrl ?? "",
    jobDescription: initial?.jobDescription ?? "",
    category: initial?.category ?? "",
    status: initial?.status ?? "applied",
    source: initial?.source ?? "",
    resumeVersion: initial?.resumeVersion ?? "",
    appliedAt: initial?.appliedAt ?? todayLocalStr(),
    followUpAt: initial?.followUpAt ?? "",
    nextAction: initial?.nextAction ?? "",
    notes: initial?.notes ?? "",
  };
}

function AddJobForm({ onSave, onCancel, initialJob }: Props) {
  const [form, setForm] = useState<FormState>(() => buildForm(initialJob));
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditing = initialJob !== undefined;

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.companyName.trim()) errs.companyName = "שם חברה הוא שדה חובה";
    if (!form.roleTitle.trim()) errs.roleTitle = "שם התפקיד הוא שדה חובה";
    if (!form.category) errs.category = "יש לבחור קטגוריה";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const saved: JobApplication = {
      id: initialJob?.id ?? crypto.randomUUID(),
      companyName: form.companyName.trim(),
      roleTitle: form.roleTitle.trim(),
      jobUrl: form.jobUrl.trim() || undefined,
      jobDescription: form.jobDescription.trim(),
      category: form.category as JobCategory,
      status: form.status,
      source: form.source.trim(),
      resumeVersion: form.resumeVersion.trim() || undefined,
      appliedAt: form.appliedAt || undefined,
      followUpAt: form.followUpAt || undefined,
      nextAction: form.nextAction.trim() || undefined,
      notes: form.notes.trim() || undefined,
      matchScore: initialJob?.matchScore,
      updatedAt: isEditing ? todayLocalStr() : undefined,
    };
    onSave(saved);
  }

  return (
    <form className="add-job-form" onSubmit={handleSubmit} noValidate>
      <div className="add-job-form__grid">

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-company">
            שם חברה{" "}
            <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="ajf-company"
            className={`form-input${errors.companyName ? " form-input--error" : ""}`}
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            placeholder="שם החברה"
            autoComplete="off"
          />
          {errors.companyName && (
            <p className="form-error" role="alert">
              {errors.companyName}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-role">
            תפקיד{" "}
            <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="ajf-role"
            className={`form-input${errors.roleTitle ? " form-input--error" : ""}`}
            value={form.roleTitle}
            onChange={(e) => set("roleTitle", e.target.value)}
            placeholder="שם התפקיד"
            autoComplete="off"
          />
          {errors.roleTitle && (
            <p className="form-error" role="alert">
              {errors.roleTitle}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-category">
            קטגוריה{" "}
            <span className="form-required" aria-hidden="true">*</span>
          </label>
          <select
            id="ajf-category"
            className={`form-input${errors.category ? " form-input--error" : ""}`}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">בחר קטגוריה...</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="form-error" role="alert">
              {errors.category}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-status">
            סטטוס{" "}
            <span className="form-required" aria-hidden="true">*</span>
          </label>
          <select
            id="ajf-status"
            className="form-input"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-applied-at">
            תאריך הגשה
          </label>
          <input
            id="ajf-applied-at"
            className="form-input"
            type="date"
            value={form.appliedAt}
            onChange={(e) => set("appliedAt", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-followup-at">
            תאריך מעקב
          </label>
          <input
            id="ajf-followup-at"
            className="form-input"
            type="date"
            value={form.followUpAt}
            onChange={(e) => set("followUpAt", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-source">
            מקור
          </label>
          <input
            id="ajf-source"
            className="form-input"
            value={form.source}
            onChange={(e) => set("source", e.target.value)}
            placeholder="LinkedIn, אתר החברה, המלצה..."
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-resume">
            גרסת קורות חיים
          </label>
          <input
            id="ajf-resume"
            className="form-input"
            value={form.resumeVersion}
            onChange={(e) => set("resumeVersion", e.target.value)}
            placeholder="לדוגמה: v3"
          />
        </div>

        <div className="form-group form-group--full">
          <label className="form-label" htmlFor="ajf-url">
            לינק למשרה
          </label>
          <input
            id="ajf-url"
            className="form-input"
            type="url"
            value={form.jobUrl}
            onChange={(e) => set("jobUrl", e.target.value)}
            placeholder="https://..."
            dir="ltr"
          />
        </div>

        <div className="form-group form-group--full">
          <label className="form-label" htmlFor="ajf-next-action">
            הצעד הבא
          </label>
          <input
            id="ajf-next-action"
            className="form-input"
            value={form.nextAction}
            onChange={(e) => set("nextAction", e.target.value)}
            placeholder="מה צריך לעשות בהמשך?"
          />
        </div>

        <div className="form-group form-group--full">
          <label className="form-label" htmlFor="ajf-description">
            תיאור המשרה
          </label>
          <textarea
            id="ajf-description"
            className="form-input form-textarea"
            value={form.jobDescription}
            onChange={(e) => set("jobDescription", e.target.value)}
            placeholder="הדבק כאן את תיאור המשרה..."
            rows={4}
          />
        </div>

        <div className="form-group form-group--full">
          <label className="form-label" htmlFor="ajf-notes">
            הערות
          </label>
          <textarea
            id="ajf-notes"
            className="form-input form-textarea"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="הערות אישיות על המשרה..."
            rows={3}
          />
        </div>

      </div>

      <div className="add-job-form__actions">
        <button type="submit" className="btn btn--primary">
          {isEditing ? "שמירה" : "הוספת משרה"}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </form>
  );
}

export default AddJobForm;
