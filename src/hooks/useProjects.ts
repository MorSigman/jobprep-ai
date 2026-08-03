import { useState } from "react";
import type { ProjectEntry } from "../types/project";

const LS_KEY = "jobprep-ai-projects";

function load(): ProjectEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProjectEntry[];
    // Backfill deepAnalysis field for entries saved before it existed
    return parsed.map((p) => ({ ...p, deepAnalysis: p.deepAnalysis ?? null }));
  } catch {
    return [];
  }
}

function save(entries: ProjectEntry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries));
}

export type UseProjectsResult = {
  projects: ProjectEntry[];
  setProjects: (entries: ProjectEntry[]) => void;
  updateProject: (id: string, patch: Partial<ProjectEntry>) => void;
  deleteProject: (id: string) => void;
};

export function useProjects(): UseProjectsResult {
  const [projects, setProjectsState] = useState<ProjectEntry[]>(() => load());

  function setProjects(entries: ProjectEntry[]) {
    save(entries);
    setProjectsState(entries);
  }

  function updateProject(id: string, patch: Partial<ProjectEntry>) {
    setProjectsState((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      save(updated);
      return updated;
    });
  }

  function deleteProject(id: string) {
    setProjectsState((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      save(updated);
      return updated;
    });
  }

  return { projects, setProjects, updateProject, deleteProject };
}
