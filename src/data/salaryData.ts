import type { JobCategory } from "../types/job";

export type SalaryLevel = {
  label: string;
  min: number;
  max: number;
};

export type CategorySalary = {
  levels: [SalaryLevel, SalaryLevel, SalaryLevel]; // junior, mid, senior
  note?: string;
};

// Monthly gross NIS — Israeli tech market, 2025 estimates
export const SALARY_DATA: Record<JobCategory, CategorySalary> = {
  Frontend: {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 10000, max: 16000 },
      { label: "מיד (2–4 שנים)",     min: 16000, max: 28000 },
      { label: "סניור (4+ שנים)",    min: 28000, max: 50000 },
    ],
  },
  Backend: {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 12000, max: 18000 },
      { label: "מיד (2–4 שנים)",     min: 18000, max: 32000 },
      { label: "סניור (4+ שנים)",    min: 32000, max: 55000 },
    ],
  },
  "Full Stack": {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 12000, max: 18000 },
      { label: "מיד (2–4 שנים)",     min: 18000, max: 30000 },
      { label: "סניור (4+ שנים)",    min: 30000, max: 52000 },
    ],
  },
  QA: {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 9000,  max: 14000 },
      { label: "מיד (2–4 שנים)",     min: 14000, max: 22000 },
      { label: "סניור (4+ שנים)",    min: 22000, max: 35000 },
    ],
  },
  "Data Analyst": {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 12000, max: 18000 },
      { label: "מיד (2–4 שנים)",     min: 18000, max: 28000 },
      { label: "סניור (4+ שנים)",    min: 28000, max: 42000 },
    ],
  },
  Cyber: {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 14000, max: 22000 },
      { label: "מיד (2–4 שנים)",     min: 22000, max: 35000 },
      { label: "סניור (4+ שנים)",    min: 35000, max: 60000 },
    ],
    note: "שכר גבוה יותר בחברות ביטחוניות ובסטארטאפים",
  },
  Product: {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 13000, max: 20000 },
      { label: "מיד (2–4 שנים)",     min: 20000, max: 32000 },
      { label: "סניור (4+ שנים)",    min: 32000, max: 55000 },
    ],
  },
  "UX/UI": {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 9000,  max: 15000 },
      { label: "מיד (2–4 שנים)",     min: 15000, max: 25000 },
      { label: "סניור (4+ שנים)",    min: 25000, max: 42000 },
    ],
  },
  Other: {
    levels: [
      { label: "ג׳וניור (0–2 שנים)", min: 10000, max: 15000 },
      { label: "מיד (2–4 שנים)",     min: 15000, max: 25000 },
      { label: "סניור (4+ שנים)",    min: 25000, max: 40000 },
    ],
  },
};

export function formatK(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
}
