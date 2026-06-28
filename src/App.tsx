import "./App.css";
import { useState, useEffect } from "react";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import ProjectsPage from "./pages/ProjectsPage";
import PersonalInterviewPage from "./pages/PersonalInterviewPage";
import { demoJobs } from "./data/demoJobs";
import type { PageName } from "./types/navigation";
import type { JobApplication } from "./types/job";

const LOCAL_STORAGE_KEY = "jobprep-ai-jobs";

function loadJobs(): JobApplication[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw) as JobApplication[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // corrupted storage — fall back to demo data
  }
  return demoJobs;
}

function App() {
  const [activePage, setActivePage] = useState<PageName>("dashboard");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [jobs, setJobs] = useState<JobApplication[]>(loadJobs);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  function handleAddJob(job: JobApplication) {
    setJobs((prev) => [job, ...prev]);
  }

  function handleSelectJob(job: JobApplication) {
    setSelectedJob(job);
    setActivePage("job-details");
  }

  function handleNavigate(page: PageName) {
    if (page === "job-details" && !selectedJob) {
      setActivePage("jobs");
    } else {
      setActivePage(page);
    }
  }

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage jobs={jobs} onNavigate={handleNavigate} />;
      case "jobs":
        return (
          <JobsPage
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onAddJob={handleAddJob}
          />
        );
      case "job-details":
        return selectedJob ? (
          <JobDetailsPage
            job={selectedJob}
            onBack={() => setActivePage("jobs")}
          />
        ) : (
          <JobsPage
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onAddJob={handleAddJob}
          />
        );
      case "projects":
        return <ProjectsPage />;
      case "personal-interview":
        return <PersonalInterviewPage />;
    }
  }

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={handleNavigate}
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
