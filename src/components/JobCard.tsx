import type { JobApplication } from "../types/job";

const statusLabels: Record<string, string> = {
  saved: "שמורה",
  applied: "הוגשה",
  waiting: "ממתינה",
  phone_screen: "שיחה טלפונית",
  home_assignment: "מטלת בית",
  technical_interview: "ראיון טכני",
  personal_interview: "ראיון אישי",
  offer: "הצעה",
  rejected: "נדחתה",
};

type Props = {
  job: JobApplication;
  onSelect: (job: JobApplication) => void;
};

function JobCard({ job, onSelect }: Props) {
  return (
    <div className="job-card">
      <div className="job-card__header">
        <div>
          <p className="job-card__company">{job.companyName}</p>
          <p className="job-card__role">{job.roleTitle}</p>
        </div>
        <span className={`status-badge status-badge--${job.status}`}>
          {statusLabels[job.status] ?? job.status}
        </span>
      </div>

      <div className="job-card__meta">
        {job.source && <span className="chip">{job.source}</span>}
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

      <button className="btn btn--primary btn--sm" onClick={() => onSelect(job)}>
        פתחי הכנה למשרה
      </button>
    </div>
  );
}

export default JobCard;
