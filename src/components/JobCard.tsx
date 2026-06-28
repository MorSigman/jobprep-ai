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
};

function JobCard({ job }: Props) {
  return (
    <article className="jobCard">
      <div className="jobCard__header">
        <h2 className="jobCard__company">{job.companyName}</h2>
        <span className={`jobCard__status jobCard__status--${job.status}`}>
          {statusLabels[job.status] ?? job.status}
        </span>
      </div>

      <p className="jobCard__role">{job.roleTitle}</p>

      <div className="jobCard__meta">
        <span>מקור: {job.source}</span>
        {job.resumeVersion && <span>קו"ח: {job.resumeVersion}</span>}
        {job.matchScore !== undefined && <span>התאמה: {job.matchScore}%</span>}
        {job.appliedAt && <span>הגשה: {job.appliedAt}</span>}
        {job.followUpAt && <span>מעקב: {job.followUpAt}</span>}
      </div>

      {job.nextAction && (
        <p className="jobCard__action">פעולה הבאה: {job.nextAction}</p>
      )}
    </article>
  );
}

export default JobCard;
