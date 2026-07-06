import type { ProfessionalQuestion } from "../types/professionalQuestion";
import { CATEGORY_LABELS } from "./questionLabels";

export interface QAMatch {
  question: ProfessionalQuestion;
  score: number;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[.,?!:;()"'«»\-_/\\]/g, " ");
}

function tokens(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

export function searchLocalQA(
  query: string,
  bank: ProfessionalQuestion[]
): QAMatch[] {
  const qt = tokens(query);
  if (!qt.length) return [];

  const results = bank.map((q) => {
    const topicT = tokens(q.topic);
    const questionT = tokens(q.question);
    const answerT = tokens(q.shortAnswer);
    const catT = tokens((CATEGORY_LABELS[q.category] ?? q.category) + " " + q.category);

    let score = 0;
    for (const t of qt) {
      if (t.length < 2) continue;

      if (topicT.some((tt) => tt.includes(t) || t.includes(tt))) score += 5;
      if (questionT.some((tt) => tt.includes(t) || t.includes(tt))) score += 3;
      if (answerT.some((tt) => tt.includes(t) || t.includes(tt))) score += 1;
      if (catT.some((tt) => tt.includes(t) || t.includes(tt))) score += 2;
    }

    return { question: q, score };
  });

  return results
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
