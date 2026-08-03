import type { JobApplication, JobStatus } from "../types/job";

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

type Props = {
  job: JobApplication;
  compact?: boolean;
  onSelect: (job: JobApplication) => void;
  onStatusChange: (id: string, newStatus: JobStatus) => void;
};

function JobCard({ job, compact = false, onSelect, onStatusChange }: Props) {
  if (compact) {
    return (
      <div className="job-tile">
        <div className="job-tile__top">
          <span className="job-tile__company">{job.companyName}</span>
          {job.location && <span className="job-tile__location">📍 {job.location}</span>}
        </div>
        <p className="job-tile__role">{job.roleTitle}</p>
        <div className="job-tile__meta">
          <select
            className={`status-select status-select--${job.status}`}
            value={job.status}
            onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
            aria-label="שינוי סטטוס"
            onClick={(e) => e.stopPropagation()}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {job.appliedAt && <span className="job-tile__date">{job.appliedAt}</span>}
        </div>
        <div className="job-tile__chips">
          {job.category && <span className="chip">{job.category}</span>}
          {job.matchScore !== undefined && (
            <span className="chip chip--teal">התאמה {job.matchScore}%</span>
          )}
        </div>
        <button
          className="btn btn--primary btn--sm job-tile__open"
          onClick={() => onSelect(job)}
        >
          ניהול מלא ‹
        </button>
      </div>
    );
  }

  return (
    <div className="job-card">
      <div className="job-card__header">
        <div>
          <p className="job-card__role">{job.roleTitle}</p>
          <p className="job-card__company">{job.companyName}</p>
        </div>
        <div className="job-card__side">
          <select
            className={`status-select status-select--${job.status}`}
            value={job.status}
            onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
            aria-label="שינוי סטטוס"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => onSelect(job)}
          >
            פתח הכנה למשרה
          </button>
        </div>
      </div>

      <div className="job-card__meta">
        {job.source && <span className="chip">{job.source}</span>}
        {job.category && <span className="chip">{job.category}</span>}
        {job.location && <span className="chip">📍 {job.location}</span>}
        {job.jobNumber && <span className="chip">מס׳ {job.jobNumber}</span>}
        {job.matchScore !== undefined && (
          <span className="chip chip--teal">התאמה {job.matchScore}%</span>
        )}
        {job.appliedAt && (
          <span className="chip">הגשה: {job.appliedAt}</span>
        )}
      </div>

      {job.nextAction && (
        <p className="job-card__action">{job.nextAction}</p>
      )}
    </div>
  );
}

export default JobCard;
