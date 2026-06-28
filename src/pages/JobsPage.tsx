import { useState } from "react";
import { demoJobs } from "../data/demoJobs";
import type { JobApplication, JobStatus } from "../types/job";
import JobCard from "../components/JobCard";
import JobDetailsPage from "./JobDetailsPage";

const statusOptions: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "כל הסטטוסים" },
  { value: "waiting", label: "ממתינה" },
  { value: "phone_screen", label: "שיחה טלפונית" },
  { value: "technical_interview", label: "ראיון טכני" },
  { value: "rejected", label: "נדחתה" },
];

function JobsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);

  if (selectedJob) {
    return (
      <div>
        <button className="backButton" onClick={() => setSelectedJob(null)}>
          חזרה לרשימת המשרות
        </button>
        <JobDetailsPage job={selectedJob} />
      </div>
    );
  }

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
    <section>
      <p className="eyebrow">משרות</p>
      <h1 className="pageTitle">המשרות שלי</h1>

      <div className="jobsControls">
        <input
          type="search"
          className="jobsSearch"
          placeholder="חיפוש לפי חברה או תפקיד..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="jobsFilter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as JobStatus | "all")
          }
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="jobsEmpty">לא נמצאו משרות תואמות.</p>
      ) : (
        <div className="jobsList">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
          ))}
        </div>
      )}
    </section>
  );
}

export default JobsPage;
