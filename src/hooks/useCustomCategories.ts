import { useState, useCallback } from "react";

const STORAGE_KEY = "jobprep_custom_categories";

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function useCustomCategories() {
  const [customCategories, setCustomCategories] = useState<string[]>(load);

  const addCustomCategory = useCallback((cat: string) => {
    const trimmed = cat.trim();
    if (!trimmed) return;
    setCustomCategories((prev) => {
      if (prev.includes(trimmed)) return prev;
      const next = [...prev, trimmed];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { customCategories, addCustomCategory };
}
