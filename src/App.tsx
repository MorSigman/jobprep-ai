import "./App.css";
import { useState } from "react";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import ProjectsPage from "./pages/ProjectsPage";
import PersonalInterviewPage from "./pages/PersonalInterviewPage";
import ProfessionalInterviewPage from "./pages/ProfessionalInterviewPage";
import ProfilePage from "./pages/ProfilePage";
import { downloadJobsBackup } from "./lib/backup";
import { useJobs } from "./hooks/useJobs";
import { useProfile } from "./hooks/useProfile";
import type { PageName } from "./types/navigation";
import type { JobApplication } from "./types/job";

function App() {
  const [activePage, setActivePage] = useState<PageName>("dashboard");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const { jobs, loading, error, addJob, updateJob, deleteJob, replaceJobs } =
    useJobs();
  const { profile, updateProfile } = useProfile();

  function handleAddJob(job: JobApplication) {
    addJob(job);
  }

  function handleUpdateJob(updatedJob: JobApplication) {
    updateJob(updatedJob);
  }

  function handleDeleteJob(id: string) {
    deleteJob(id);
    setSelectedJob(null);
    setActivePage("jobs");
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

  function handleExport() {
    downloadJobsBackup(jobs);
  }

  function handleImport(importedJobs: JobApplication[]) {
    replaceJobs(importedJobs);
  }

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return (
          <DashboardPage
            jobs={jobs}
            onNavigate={handleNavigate}
            onExport={handleExport}
            onImport={handleImport}
          />
        );
      case "jobs":
        return (
          <JobsPage
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
          />
        );
      case "job-details": {
        const liveJob = selectedJob
          ? (jobs.find((j) => j.id === selectedJob.id) ?? selectedJob)
          : null;
        return liveJob ? (
          <JobDetailsPage
            job={liveJob}
            onBack={() => setActivePage("jobs")}
            onUpdate={handleUpdateJob}
            onDelete={handleDeleteJob}
            profile={profile}
          />
        ) : (
          <JobsPage
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
          />
        );
      }
      case "projects":
        return <ProjectsPage />;
      case "personal-interview":
        return <PersonalInterviewPage />;
      case "professional-interview":
        return <ProfessionalInterviewPage />;
      case "profile":
        return <ProfilePage profile={profile} onSave={updateProfile} />;
    }
  }

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={handleNavigate}
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
    >
      {error && (
        <div className="db-error-banner" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <p className="loading-state">טוען נתונים...</p>
      ) : (
        renderPage()
      )}
    </AppLayout>
  );
}

export default App;
