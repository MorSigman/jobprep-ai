import type { JobApplication } from "../types/job";

export type JobsBackup = {
  version: 1;
  appName: "JobPrep AI";
  exportedAt: string;
  jobs: JobApplication[];
};

function todayStr(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export function createJobsBackup(jobs: JobApplication[]): JobsBackup {
  return {
    version: 1,
    appName: "JobPrep AI",
    exportedAt: new Date().toISOString(),
    jobs,
  };
}

export function downloadJobsBackup(jobs: JobApplication[]): void {
  const backup = createJobsBackup(jobs);
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jobprep-ai-backup-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateJobsBackup(data: unknown): data is JobsBackup {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    d.version === 1 &&
    d.appName === "JobPrep AI" &&
    typeof d.exportedAt === "string" &&
    Array.isArray(d.jobs)
  );
}

export function parseJobsBackupFile(file: File): Promise<JobsBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as unknown;
        if (!validateJobsBackup(data)) {
          reject(new Error("invalid"));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error("invalid"));
      }
    };
    reader.onerror = () => reject(new Error("invalid"));
    reader.readAsText(file);
  });
}
