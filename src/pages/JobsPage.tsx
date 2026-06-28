import { useState } from "react";
import type { JobApplication, JobCategory, JobStatus } from "../types/job";
import JobCard from "../components/JobCard";
import AddJobForm from "../components/AddJobForm";

const STATUS_FILTER_OPTIONS: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "כל הסטטוסים" },
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

const CATEGORY_FILTER_OPTIONS: { value: JobCategory | "all"; label: string }[] = [
  { value: "all", label: "כל הקטגוריות" },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "QA", label: "QA" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Cyber", label: "Cyber" },
  { value: "Product", label: "Product" },
  { value: "Other", label: "אחר" },
];

type Props = {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
  onAddJob: (job: JobApplication) => void;
};

function JobsPage({ jobs, onSelectJob, onAddJob }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<JobCategory | "all">(
    "all"
  );
  const [showForm, setShowForm] = useState(false);

  const filtered = jobs.filter((job) => {
    const query = search.toLowerCase();
    const matchesSearch =
      job.companyName.toLowerCase().includes(query) ||
      job.roleTitle.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || job.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  function handleAdd(job: JobApplication) {
    onAddJob(job);
    setShowForm(false);
  }

  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">משרות</p>
        <h2 className="page__title">מעקב משרות</h2>
        <p className="page__subtitle">
          {jobs.length === 0
            ? "הוסף את המשרה הראשונה שלך"
            : `${jobs.length} משרות`}
        </p>
      </div>

      <div className="add-job-row">
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => setShowForm((s) => !s)}
          aria-expanded={showForm}
        >
          {showForm ? "סגור טופס" : "+ הוספת משרה"}
        </button>
        <p className="local-data-notice">
          המידע נשמר מקומית בדפדפן במחשב שלך. אין שליחה לשרת חיצוני.
        </p>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="card__title">הוספת משרה חדשה</h3>
          <AddJobForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="jobs-controls">
        <input
          type="search"
          className="form-input jobs-search"
          placeholder="חיפוש לפי חברה או תפקיד..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="חיפוש משרות"
        />
        <select
          className="form-input"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as JobStatus | "all")
          }
          aria-label="סינון לפי סטטוס"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          className="form-input"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as JobCategory | "all")
          }
          aria-label="סינון לפי קטגוריה"
        >
          {CATEGORY_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">
          {jobs.length === 0
            ? 'לא נוספו משרות עדיין. לחץ על "+ הוספת משרה" כדי להתחיל.'
            : "לא נמצאו משרות תואמות לחיפוש."}
        </p>
      ) : (
        <div className="jobs-list">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onSelect={onSelectJob} />
          ))}
        </div>
      )}
    </div>
  );
}

export default JobsPage;
