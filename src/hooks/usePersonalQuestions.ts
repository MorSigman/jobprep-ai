import { useState } from "react";

const LS_KEY = "jobprep-ai-personal-questions";

export type PersonalQuestion = {
  id: string;
  question: string;
  type: "behavioral" | "motivational" | "situational" | "personal";
  suggestedAnswer: string;
  tips: string[];
  followUpQuestions: string[];
  createdAt: string;
};

function load(): PersonalQuestion[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as PersonalQuestion[]) : [];
  } catch {
    return [];
  }
}

function save(qs: PersonalQuestion[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(qs));
}

export type UsePersonalQuestionsResult = {
  questions: PersonalQuestion[];
  addQuestions: (qs: Omit<PersonalQuestion, "id" | "createdAt">[]) => void;
  updateQuestion: (id: string, patch: Partial<PersonalQuestion>) => void;
  deleteQuestion: (id: string) => void;
  replaceAll: (qs: PersonalQuestion[]) => void;
};

export function usePersonalQuestions(): UsePersonalQuestionsResult {
  const [questions, setQs] = useState<PersonalQuestion[]>(() => load());

  function addQuestions(incoming: Omit<PersonalQuestion, "id" | "createdAt">[]) {
    setQs((prev) => {
      const now = new Date().toISOString();
      const newQs: PersonalQuestion[] = incoming.map((q, i) => ({
        ...q,
        id: `pq-${Date.now()}-${i}`,
        createdAt: now,
      }));
      const updated = [...prev, ...newQs];
      save(updated);
      return updated;
    });
  }

  function updateQuestion(id: string, patch: Partial<PersonalQuestion>) {
    setQs((prev) => {
      const updated = prev.map((q) => (q.id === id ? { ...q, ...patch } : q));
      save(updated);
      return updated;
    });
  }

  function deleteQuestion(id: string) {
    setQs((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      save(updated);
      return updated;
    });
  }

  function replaceAll(qs: PersonalQuestion[]) {
    save(qs);
    setQs(qs);
  }

  return { questions, addQuestions, updateQuestion, deleteQuestion, replaceAll };
}
