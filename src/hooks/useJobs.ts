import { useState, useEffect } from "react";
import type { JobApplication } from "../types/job";
import {
  getAllJobs,
  saveJob,
  saveJobs,
  deleteJob as dbDeleteJob,
} from "../lib/localDb";
import { demoJobs } from "../data/demoJobs";

const LEGACY_LS_KEY = "jobprep-ai-jobs";
const MIGRATION_FLAG = "jobprep-ai-indexeddb-migrated";

export type UseJobsResult = {
  jobs: JobApplication[];
  loading: boolean;
  error: string | null;
  addJob: (job: JobApplication) => void;
  updateJob: (job: JobApplication) => void;
  deleteJob: (id: string) => void;
  replaceJobs: (jobs: JobApplication[]) => void;
};

export function useJobs(): UseJobsResult {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // One-time migration from localStorage to IndexedDB
        if (!localStorage.getItem(MIGRATION_FLAG)) {
          try {
            const raw = localStorage.getItem(LEGACY_LS_KEY);
            if (raw) {
              const parsed = JSON.parse(raw) as unknown;
              if (Array.isArray(parsed) && parsed.length > 0) {
                await saveJobs(parsed as JobApplication[]);
              }
            }
          } catch {
            // corrupted localStorage — ignore and continue
          } finally {
            localStorage.setItem(MIGRATION_FLAG, "1");
          }
        }

        const stored = await getAllJobs();
        if (stored.length === 0) {
          await saveJobs(demoJobs);
          setJobs(demoJobs);
        } else {
          setJobs(stored);
        }
      } catch {
        setError("לא ניתן לטעון את המידע המקומי כרגע.");
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, []);

  function addJob(job: JobApplication): void {
    setJobs((prev) => [job, ...prev]);
    void saveJob(job).catch(() => {
      setError("לא ניתן לשמור את המשרה כרגע.");
    });
  }

  function updateJob(job: JobApplication): void {
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
    void saveJob(job).catch(() => {
      setError("לא ניתן לעדכן את המשרה כרגע.");
    });
  }

  function deleteJob(id: string): void {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    void dbDeleteJob(id).catch(() => {
      setError("לא ניתן למחוק את המשרה כרגע.");
    });
  }

  function replaceJobs(newJobs: JobApplication[]): void {
    setJobs(newJobs);
    void saveJobs(newJobs).catch(() => {
      setError("לא ניתן לייבא את הגיבוי כרגע.");
    });
  }

  return { jobs, loading, error, addJob, updateJob, deleteJob, replaceJobs };
}
