import { useState } from "react";
import { demoJobs } from "../data/demoJobs";
import type { JobApplication, JobStatus } from "../types/job";
import JobCard from "../components/JobCard";

const statusOptions: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "כל הסטטוסים" },
  { value: "waiting", label: "ממתינה" },
  { value: "phone_screen", label: "שיחה טלפונית" },
  { value: "technical_interview", label: "ראיון טכני" },
  { value: "rejected", label: "נדחתה" },
];

type Props = {
  onSelectJob: (job: JobApplication) => void;
};

function JobsPage({ onSelectJob }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");

  const filtered = demoJobs.filter((job) => {
    const query = search.toLowerCase();
    const matchesSearch =
      job.companyName.toLowerCase().includes(query) ||
      job.roleTitle.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">משרות</p>
        <h2 className="page__title">מעקב משרות</h2>
        <p className="page__subtitle">רשימת המשרות שלי — נתוני דמו בלבד</p>
      </div>

      <div className="jobs-layout">
        <div className="jobs-form-panel">
          <div className="card">
            <h3 className="card__title">הוספת משרה חדשה</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="field-company">
                שם חברה
              </label>
              <input
                id="field-company"
                className="form-input"
                placeholder="לדוגמה: Google"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="field-role">
                תפקיד
              </label>
              <input
                id="field-role"
                className="form-input"
                placeholder="לדוגמה: Frontend Developer"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="field-url">
                לינק למשרה
              </label>
              <input
                id="field-url"
                className="form-input"
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="field-source">
                מקור
              </label>
              <select id="field-source" className="form-input">
                <option>LinkedIn</option>
                <option>Company Website</option>
                <option>אחר</option>
              </select>
            </div>
            <button type="button" className="btn btn--primary btn--full">
              הוספת משרה
            </button>
          </div>
        </div>

        <div className="jobs-list-panel">
          <div className="jobs-controls">
            <input
              id="search-jobs"
              type="search"
              className="form-input"
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
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="empty-state">לא נמצאו משרות תואמות.</p>
          ) : (
            <div className="jobs-list">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} onSelect={onSelectJob} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsPage;
