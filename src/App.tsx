import "./App.css";
import { useState } from "react";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import ProjectsPage from "./pages/ProjectsPage";
import PersonalInterviewPage from "./pages/PersonalInterviewPage";
import type { PageName } from "./types/navigation";
import type { JobApplication } from "./types/job";

function App() {
  const [activePage, setActivePage] = useState<PageName>("dashboard");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
        return <DashboardPage onNavigate={handleNavigate} />;
      case "jobs":
        return <JobsPage onSelectJob={handleSelectJob} />;
      case "job-details":
        return selectedJob ? (
          <JobDetailsPage
            job={selectedJob}
            onBack={() => setActivePage("jobs")}
          />
        ) : (
          <JobsPage onSelectJob={handleSelectJob} />
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
