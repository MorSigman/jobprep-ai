import { useState } from "react";

export type AISettings = {
  aiEnabled: boolean;
  redactBeforeSend: boolean;
};

const LS_KEY = "jobprep-ai-settings";
const DEFAULTS: AISettings = { aiEnabled: false, redactBeforeSend: true };

function loadSettings(): AISettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AISettings>) };
  } catch {
    return DEFAULTS;
  }
}

export function useAISettings() {
  const [settings, setSettings] = useState<AISettings>(loadSettings);

  function updateSettings(patch: Partial<AISettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  return { settings, updateSettings };
}
