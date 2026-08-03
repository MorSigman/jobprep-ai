import { useState, useEffect } from "react";
import type { JobApplication, JobCategory, JobStatus } from "../types/job";
import { useCustomCategories } from "../hooks/useCustomCategories";
import { fetchAICompanyInfo, fetchAISalaryEstimate } from "../lib/aiClient";

const CATEGORY_OPTIONS: JobCategory[] = [
  "Frontend",
  "Backend",
  "Full Stack",
  "QA",
  "Data Analyst",
  "Cyber",
  "Product",
  "UX/UI",
  "Other",
];

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "saved", label: "שמורה" },
  { value: "applied", label: "הוגשה" },
  { value: "waiting", label: "ממתינה לתשובה" },
  { value: "phone_screen", label: "שיחה טלפונית" },
  { value: "home_assignment", label: "מטלת בית" },
  { value: "technical_interview", label: "ראיון טכני" },
  { value: "digital_interview",  label: "ראיון דיגיטלי" },
  { value: "personal_interview", label: "ראיון אישי" },
  { value: "offer", label: "הצעת עבודה" },
  { value: "rejected", label: "נדחתה" },
];

type FormState = {
  companyName: string;
  roleTitle: string;
  jobNumber: string;
  location: string;
  jobUrl: string;
  jobDescription: string;
  category: string;
  status: JobStatus;
  source: string;
  resumeVersion: string;
  salaryRange: string;
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
    jobNumber: initial?.jobNumber ?? "",
    location: initial?.location ?? "",
    jobUrl: initial?.jobUrl ?? "",
    jobDescription: initial?.jobDescription ?? "",
    category: initial?.category ?? "",
    status: initial?.status ?? "applied",
    source: initial?.source ?? "",
    resumeVersion: initial?.resumeVersion ?? "",
    salaryRange: initial?.salaryRange ?? "",
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
  const { customCategories, addCustomCategory } = useCustomCategories();
  const [companySummary, setCompanySummary] = useState("");
  const [companyLoading, setCompanyLoading] = useState(false);
  const [salaryEstimate, setSalaryEstimate] = useState("");
  const [salaryLoading, setSalaryLoading] = useState(false);

  useEffect(() => {
    const name = form.companyName.trim();
    if (name.length < 2) {
      setCompanySummary("");
      return;
    }
    setCompanyLoading(true);
    const timer = setTimeout(async () => {
      const summary = await fetchAICompanyInfo(name);
      setCompanySummary(summary);
      setCompanyLoading(false);
    }, 900);
    return () => {
      clearTimeout(timer);
      setCompanyLoading(false);
    };
  }, [form.companyName]);

  useEffect(() => {
    const title = form.roleTitle.trim();
    if (title.length < 3) {
      setSalaryEstimate("");
      return;
    }
    setSalaryLoading(true);
    const timer = setTimeout(async () => {
      const estimate = await fetchAISalaryEstimate(title, form.category, form.location);
      setSalaryEstimate(estimate);
      setSalaryLoading(false);
    }, 1200);
    return () => {
      clearTimeout(timer);
      setSalaryLoading(false);
    };
  }, [form.roleTitle, form.category, form.location]);

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
    const categoryValue = form.category.trim();
    if (categoryValue && !CATEGORY_OPTIONS.includes(categoryValue as JobCategory)) {
      addCustomCategory(categoryValue);
    }
    const saved: JobApplication = {
      id: initialJob?.id ?? crypto.randomUUID(),
      companyName: form.companyName.trim(),
      roleTitle: form.roleTitle.trim(),
      jobNumber: form.jobNumber.trim() || undefined,
      location: form.location.trim() || undefined,
      jobUrl: form.jobUrl.trim() || undefined,
      jobDescription: form.jobDescription.trim(),
      category: categoryValue || undefined,
      status: form.status,
      source: form.source.trim(),
      resumeVersion: form.resumeVersion.trim() || undefined,
      salaryRange: form.salaryRange.trim() || undefined,
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
          {companyLoading && (
            <p className="company-info-loading">מחפש מידע על החברה...</p>
          )}
          {!companyLoading && companySummary && (
            <p className="company-info-summary">{companySummary}</p>
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
          <label className="form-label" htmlFor="ajf-job-number">
            מספר משרה
          </label>
          <input
            id="ajf-job-number"
            className="form-input"
            value={form.jobNumber}
            onChange={(e) => set("jobNumber", e.target.value)}
            placeholder="לדוגמה: 12345"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-location">
            מיקום
          </label>
          <input
            id="ajf-location"
            className="form-input"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="תל אביב, רחובות, מרחוק..."
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-category">
            קטגוריה{" "}
            <span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="ajf-category"
            list="ajf-category-list"
            className={`form-input${errors.category ? " form-input--error" : ""}`}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="בחר מהרשימה או הקלד קטגוריה חדשה..."
            autoComplete="off"
          />
          <datalist id="ajf-category-list">
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat} />
            ))}
            {customCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
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

        <div className="form-group">
          <label className="form-label" htmlFor="ajf-salary">
            טווח שכר (הוצע / מצופה)
          </label>
          <input
            id="ajf-salary"
            className="form-input"
            value={form.salaryRange}
            onChange={(e) => set("salaryRange", e.target.value)}
            placeholder="לדוגמה: 14,000 – 18,000 ₪"
          />
          {salaryLoading && (
            <p className="company-info-loading">מחשב שכר שוק...</p>
          )}
          {!salaryLoading && salaryEstimate && (
            <p className="salary-estimate-summary">
              <span className="salary-estimate-summary__label">שכר שוק (ג׳וניור): </span>
              {salaryEstimate}
            </p>
          )}
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
