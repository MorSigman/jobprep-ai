import { useState, useCallback } from "react";

const LS_KEY = "jobprep-ai-practice-progress";

export type QuestionProgress = {
  questionId: string;
  timesPracticed: number;
  timesKnown: number;
  timesNeedsReview: number;
  lastResult: "known" | "review";
  lastPracticedAt: string;
};

export type ProgressMap = Record<string, QuestionProgress>;

function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as ProgressMap;
  } catch {
    return {};
  }
}

function save(map: ProgressMap): void {
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

export function usePracticeProgress() {
  const [progress, setProgress] = useState<ProgressMap>(load);

  const recordResult = useCallback(
    (questionId: string, result: "known" | "review") => {
      setProgress((prev) => {
        const existing = prev[questionId];
        const today = new Date().toISOString().slice(0, 10);
        const updated: ProgressMap = {
          ...prev,
          [questionId]: {
            questionId,
            timesPracticed: (existing?.timesPracticed ?? 0) + 1,
            timesKnown: (existing?.timesKnown ?? 0) + (result === "known" ? 1 : 0),
            timesNeedsReview:
              (existing?.timesNeedsReview ?? 0) + (result === "review" ? 1 : 0),
            lastResult: result,
            lastPracticedAt: today,
          },
        };
        save(updated);
        return updated;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    setProgress({});
    localStorage.removeItem(LS_KEY);
  }, []);

  return { progress, recordResult, resetProgress };
}
