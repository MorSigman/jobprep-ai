import { useState } from "react";
import type { ProfessionalQuestion } from "../types/professionalQuestion";
import { demoProfessionalQuestions } from "../data/professionalQuestions";

const LS_KEY = "jobprep-ai-professional-questions";

function loadUserQuestions(): ProfessionalQuestion[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as ProfessionalQuestion[];
  } catch {
    return [];
  }
}

function saveUserQuestions(questions: ProfessionalQuestion[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(questions));
}

type UseProfessionalQuestionsResult = {
  questions: ProfessionalQuestion[];
  addQuestion: (q: Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">) => void;
  addQuestions: (qs: Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">[], source: "user" | "job-description") => void;
  deleteUserQuestion: (id: string) => void;
};

export function useProfessionalQuestions(): UseProfessionalQuestionsResult {
  const [userQuestions, setUserQuestions] = useState<ProfessionalQuestion[]>(
    () => loadUserQuestions()
  );

  const questions = [...demoProfessionalQuestions, ...userQuestions];

  function addQuestion(
    q: Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">
  ): void {
    const today = new Date().toISOString().slice(0, 10);
    const newQ: ProfessionalQuestion = {
      ...q,
      id: `user-${Date.now()}`,
      source: "user",
      createdAt: today,
      updatedAt: today,
    };
    const updated = [...userQuestions, newQ];
    setUserQuestions(updated);
    saveUserQuestions(updated);
  }

  function addQuestions(
    qs: Omit<ProfessionalQuestion, "id" | "source" | "createdAt" | "updatedAt">[],
    source: "user" | "job-description"
  ): void {
    const today = new Date().toISOString().slice(0, 10);
    const newQs: ProfessionalQuestion[] = qs.map((q, i) => ({
      ...q,
      id: `${source}-${Date.now()}-${i}`,
      source,
      createdAt: today,
      updatedAt: today,
    }));
    const updated = [...userQuestions, ...newQs];
    setUserQuestions(updated);
    saveUserQuestions(updated);
  }

  function deleteUserQuestion(id: string): void {
    const updated = userQuestions.filter((q) => q.id !== id);
    setUserQuestions(updated);
    saveUserQuestions(updated);
  }

  return { questions, addQuestion, addQuestions, deleteUserQuestion };
}
