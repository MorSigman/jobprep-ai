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

function JobDetailsPage({ job }: Props) {
  return (
    <div className="jobDetails">
      <header className="jobDetailsHeader">
        <div>
          <h1 className="pageTitle">{job.companyName}</h1>
          <p className="jobDetailsRole">{job.roleTitle}</p>
        </div>
        <span className={`jobCard__status jobCard__status--${job.status}`}>
          {statusLabels[job.status] ?? job.status}
        </span>
      </header>

      <section className="prepSection">
        <h2>תיאור המשרה</h2>
        <p>{job.jobDescription}</p>
      </section>

      <div className="detailsGrid">
        <div>
          <strong>מקור</strong>
          <p>{job.source}</p>
        </div>
        {job.resumeVersion && (
          <div>
            <strong>קורות חיים</strong>
            <p>{job.resumeVersion}</p>
          </div>
        )}
        {job.appliedAt && (
          <div>
            <strong>תאריך הגשה</strong>
            <p>{job.appliedAt}</p>
          </div>
        )}
        {job.followUpAt && (
          <div>
            <strong>מעקב</strong>
            <p>{job.followUpAt}</p>
          </div>
        )}
        {job.matchScore !== undefined && (
          <div>
            <strong>ציון התאמה</strong>
            <p>{job.matchScore}%</p>
          </div>
        )}
      </div>

      {job.nextAction && (
        <p className="jobCard__action">פעולה הבאה: {job.nextAction}</p>
      )}

      <section className="prepSection">
        <h2>הכנה לשיחה טלפונית</h2>
        <p>פה יופיעו נקודות מפתח להכנה לשיחת הסינון.</p>
      </section>

      <section className="prepSection">
        <h2>שאלות מקצועיות לדוגמה</h2>
        <p>פה יופיעו שאלות טכניות לדוגמה שקשורות לתפקיד.</p>
      </section>

      <section className="prepSection">
        <h2>שאלות אישיות לדוגמה</h2>
        <p>פה יופיעו שאלות אישיות ושאלות התנהגותיות לדוגמה.</p>
      </section>

      <section className="prepSection">
        <h2>מה ללמוד לפני הראיון</h2>
        <p>פה תופיע רשימת נושאים ללמוד לפני הראיון.</p>
      </section>
    </div>
  );
}

export default JobDetailsPage;
