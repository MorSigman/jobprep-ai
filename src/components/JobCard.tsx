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
  onSelect: (job: JobApplication) => void;
  onStatusChange: (id: string, newStatus: JobStatus) => void;
};

function JobCard({ job, onSelect, onStatusChange }: Props) {
  return (
    <div className="job-card">
      <div className="job-card__header">
        <div>
          <p className="job-card__company">{job.companyName}</p>
          <p className="job-card__role">{job.roleTitle}</p>
        </div>
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
      </div>

      <div className="job-card__meta">
        {job.source && <span className="chip">{job.source}</span>}
        {job.category && <span className="chip">{job.category}</span>}
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

      <button
        className="btn btn--primary btn--sm"
        onClick={() => onSelect(job)}
      >
        פתחי הכנה למשרה
      </button>
    </div>
  );
}

export default JobCard;
