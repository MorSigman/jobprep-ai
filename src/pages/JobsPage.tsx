import { useState } from "react";
import type { JobApplication, JobStatus } from "../types/job";
import JobCard from "../components/JobCard";
import AddJobForm from "../components/AddJobForm";
import { useCustomCategories } from "../hooks/useCustomCategories";

const STATUS_FILTER_OPTIONS: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "כל הסטטוסים" },
  { value: "saved", label: "שמורה" },
  { value: "applied", label: "הוגשה" },
  { value: "waiting", label: "ממתינה לתשובה" },
  { value: "phone_screen", label: "שיחה טלפונית" },
  { value: "home_assignment", label: "מטלת בית" },
  { value: "technical_interview", label: "ראיון טכני" },
  { value: "digital_interview", label: "ראיון דיגיטלי" },
  { value: "personal_interview", label: "ראיון אישי" },
  { value: "offer", label: "הצעת עבודה" },
  { value: "rejected", label: "נדחתה" },
];

const BASE_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "כל הקטגוריות" },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Full Stack", label: "Full Stack" },
  { value: "QA", label: "QA" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Cyber", label: "Cyber" },
  { value: "Product", label: "Product" },
  { value: "UX/UI", label: "UX/UI" },
  { value: "Other", label: "אחר" },
];

type SortOption = "applied-desc" | "applied-asc" | "company-asc" | "status";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "applied-desc", label: "תאריך הגשה — חדש ראשון" },
  { value: "applied-asc",  label: "תאריך הגשה — ישן ראשון" },
  { value: "company-asc",  label: "שם חברה — א׳ עד ת׳" },
  { value: "status",       label: "לפי סטטוס" },
];

function sortJobs(jobs: JobApplication[], sort: SortOption): JobApplication[] {
  const copy = [...jobs];
  if (sort === "applied-desc") {
    return copy.sort((a, b) => (b.appliedAt ?? "").localeCompare(a.appliedAt ?? ""));
  }
  if (sort === "applied-asc") {
    return copy.sort((a, b) => (a.appliedAt ?? "").localeCompare(b.appliedAt ?? ""));
  }
  if (sort === "company-asc") {
    return copy.sort((a, b) => a.companyName.localeCompare(b.companyName, "he"));
  }
  if (sort === "status") {
    const ORDER = ["offer","personal_interview","digital_interview","technical_interview","phone_screen","home_assignment","waiting","applied","saved","rejected"];
    return copy.sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status));
  }
  return copy;
}

type ViewMode = "list" | "grid";

type Props = {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
  onAddJob: (job: JobApplication) => void;
  onUpdateJob: (job: JobApplication) => void;
};

function toLocalDateStr(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function JobsPage({ jobs, onSelectJob, onAddJob, onUpdateJob }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("applied-desc");
  const [showForm, setShowForm] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem("jobprep_jobs_view") as ViewMode) || "list"
  );

  function changeView(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem("jobprep_jobs_view", mode);
  }
  const { customCategories } = useCustomCategories();
  const categoryFilterOptions = [
    ...BASE_CATEGORY_OPTIONS,
    ...customCategories.map((cat) => ({ value: cat, label: cat })),
  ];

  const filtered = sortJobs(
    jobs.filter((job) => {
      const query = search.toLowerCase();
      const matchesSearch =
        job.companyName.toLowerCase().includes(query) ||
        job.roleTitle.toLowerCase().includes(query) ||
        (job.jobNumber ?? "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || job.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    }),
    sort
  );

  function handleAdd(job: JobApplication) {
    onAddJob(job);
    setShowForm(false);
  }

  function handleStatusChange(id: string, newStatus: JobStatus) {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    onUpdateJob({ ...job, status: newStatus, updatedAt: toLocalDateStr() });
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
          המידע נשמר מקומית בדפדפן באמצעות IndexedDB. אין שליחה לשרת חיצוני.
        </p>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="card__title">הוספת משרה חדשה</h3>
          <AddJobForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
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
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="סינון לפי קטגוריה"
        >
          {categoryFilterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          className="form-input"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="מיון"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="view-toggle" role="group" aria-label="תצוגה">
          <button
            type="button"
            className={`view-toggle__btn ${viewMode === "list" ? "view-toggle__btn--active" : ""}`}
            onClick={() => changeView("list")}
            title="תצוגת רשימה"
          >
            ☰ רשימה
          </button>
          <button
            type="button"
            className={`view-toggle__btn ${viewMode === "grid" ? "view-toggle__btn--active" : ""}`}
            onClick={() => changeView("grid")}
            title="תצוגת כרטיסיות"
          >
            ▦ כרטיסיות
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">
          {jobs.length === 0
            ? 'לא נוספו משרות עדיין. לחץ על "+ הוספת משרה" כדי להתחיל.'
            : "לא נמצאו משרות תואמות לחיפוש."}
        </p>
      ) : (() => {
        const activeJobs = filtered.filter((j) => j.status !== "rejected");
        const rejectedJobs = filtered.filter((j) => j.status === "rejected");
        return (
          <>
            {activeJobs.length > 0 && (
              <div className={viewMode === "grid" ? "jobs-grid" : "jobs-list"}>
                {activeJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    compact={viewMode === "grid"}
                    onSelect={onSelectJob}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
            {rejectedJobs.length > 0 && (
              <div className="rejected-section">
                <button
                  type="button"
                  className="rejected-section__toggle"
                  onClick={() => setShowRejected((v) => !v)}
                >
                  <span>{showRejected ? "▲" : "▼"}</span>
                  <span>נדחו ({rejectedJobs.length})</span>
                </button>
                {showRejected && (
                  <div className={`${viewMode === "grid" ? "jobs-grid" : "jobs-list"} jobs-list--rejected`}>
                    {rejectedJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        compact={viewMode === "grid"}
                        onSelect={onSelectJob}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

export default JobsPage;
