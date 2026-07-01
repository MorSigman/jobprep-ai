import { useState } from "react";
import type { UserProfile } from "../types/profile";

const LS_KEY = "jobprep-ai-profile";

const EMPTY_PROFILE: UserProfile = {
  targetRoles: "",
  targetCategories: "",
  skills: "",
  technologies: "",
  tools: "",
  projectsSummary: "",
  experienceSummary: "",
  educationSummary: "",
  strengths: "",
  skillsToImprove: "",
  notes: "",
  updatedAt: "",
};

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...EMPTY_PROFILE };
    return { ...EMPTY_PROFILE, ...(JSON.parse(raw) as Partial<UserProfile>) };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

function todayStr(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export type UseProfileResult = {
  profile: UserProfile;
  updateProfile: (updated: UserProfile) => void;
};

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());

  function updateProfile(updated: UserProfile): void {
    const saved = { ...updated, updatedAt: todayStr() };
    localStorage.setItem(LS_KEY, JSON.stringify(saved));
    setProfile(saved);
  }

  return { profile, updateProfile };
}
