import type { JobApplication } from "../types/job";
import type { ProjectEntry } from "../types/project";
import type { ProfessionalQuestion } from "../types/professionalQuestion";
import type { PersonalQuestion } from "../hooks/usePersonalQuestions";
import * as XLSX from "xlsx-js-style";

export type JobsBackup = {
  version: 1;
  appName: "JobPrep AI";
  exportedAt: string;
  jobs: JobApplication[];
};

export type FullBackup = {
  version: 2;
  appName: "JobPrep AI";
  exportedAt: string;
  jobs: JobApplication[];
  projects: ProjectEntry[];
  professionalQuestions: ProfessionalQuestion[];
  personalQuestions: PersonalQuestion[];
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

export function validateFullBackup(data: unknown): data is FullBackup {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    d.version === 2 &&
    d.appName === "JobPrep AI" &&
    typeof d.exportedAt === "string" &&
    Array.isArray(d.jobs)
  );
}

export function downloadFullBackup(
  jobs: JobApplication[],
  projects: ProjectEntry[],
  professionalQuestions: ProfessionalQuestion[],
  personalQuestions: PersonalQuestion[]
): void {
  const backup: FullBackup = {
    version: 2,
    appName: "JobPrep AI",
    exportedAt: new Date().toISOString(),
    jobs,
    projects,
    professionalQuestions,
    personalQuestions,
  };
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jobprep-ai-fullbackup-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseFullOrJobsBackupFile(file: File): Promise<FullBackup | JobsBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as unknown;
        if (validateFullBackup(data)) { resolve(data); return; }
        if (validateJobsBackup(data)) { resolve(data); return; }
        reject(new Error("invalid"));
      } catch {
        reject(new Error("invalid"));
      }
    };
    reader.onerror = () => reject(new Error("invalid"));
    reader.readAsText(file);
  });
}

const XLS_HEADERS = [
  "תפקיד",
  "מקום עבודה",
  "מספר משרה",
  "מיקום",
  "תחום / סוג תפקיד",
  "סטטוס",
  "תאריך שליחת קורות חיים",
  "תאריך פולואפ",
  "מקור המשרה",
  "קישור למשרה",
  "גרסת קורות חיים",
  "פעולה הבאה",
  "ציון התאמה",
  "הערות",
  "עודכן לאחרונה",
];

const STATUS_LABELS_HE: Record<string, string> = {
  saved: "נשמרה",
  applied: "הוגשה",
  waiting: "ממתינה לתשובה",
  phone_screen: "שיחה טלפונית",
  home_assignment: "משימת בית",
  technical_interview: "ראיון טכני",
  personal_interview: "ראיון אישי",
  offer: "הצעה",
  rejected: "נדחתה",
};

const CATEGORY_LABELS_HE: Record<string, string> = {
  Frontend: "Frontend",
  Backend: "Backend",
  QA: "QA",
  "Data Analyst": "Data Analyst",
  Cyber: "Cyber",
  Product: "Product",
  Other: "אחר",
};

type BorderSide = { style: "thin"; color: { rgb: string } };
type CellBorder = { top: BorderSide; bottom: BorderSide; left: BorderSide; right: BorderSide };
type CellStyle = {
  font?: { bold?: boolean; sz?: number; color?: { rgb: string } };
  fill?: { fgColor: { rgb: string }; patternType: "solid" };
  alignment?: { horizontal?: "right" | "center" | "left"; vertical?: "top" | "center" | "bottom"; wrapText?: boolean };
  border?: CellBorder;
};

function buildJobsSheet(jobs: JobApplication[], today: string): XLSX.WorkSheet {
  const numCols = XLS_HEADERS.length;

  const wsData: (string | number | undefined)[][] = [
    ["מעקב משרות - JobPrep AI"],
    [`תאריך ייצוא: ${today}`],
    [],
    XLS_HEADERS,
    ...jobs.map((job) => [
      job.roleTitle,
      job.companyName,
      job.jobNumber ?? "",
      job.location ?? "",
      CATEGORY_LABELS_HE[job.category ?? ""] ?? (job.category ?? ""),
      STATUS_LABELS_HE[job.status] ?? job.status,
      job.appliedAt ?? "",
      job.followUpAt ?? "",
      job.source ?? "",
      job.jobUrl ?? "",
      job.resumeVersion ?? "",
      job.nextAction ?? "",
      job.matchScore !== undefined ? job.matchScore : "",
      job.notes ?? "",
      job.updatedAt ?? "",
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws["!cols"] = [
    { wch: 28 }, // תפקיד
    { wch: 22 }, // מקום עבודה
    { wch: 14 }, // מספר משרה
    { wch: 18 }, // מיקום
    { wch: 18 }, // תחום / סוג תפקיד
    { wch: 18 }, // סטטוס
    { wch: 18 }, // תאריך שליחת קורות חיים
    { wch: 18 }, // תאריך פולואפ
    { wch: 18 }, // מקור המשרה
    { wch: 35 }, // קישור למשרה
    { wch: 18 }, // גרסת קורות חיים
    { wch: 32 }, // פעולה הבאה
    { wch: 14 }, // ציון התאמה
    { wch: 45 }, // הערות
    { wch: 18 }, // עודכן לאחרונה
  ];

  (ws as Record<string, unknown>)["!views"] = [{ rightToLeft: true }];

  const lastCol = XLSX.utils.encode_col(numCols - 1);
  const lastDataRow = 4 + jobs.length;
  ws["!autofilter"] = { ref: `A4:${lastCol}${lastDataRow}` };

  const border: CellBorder = {
    top:    { style: "thin", color: { rgb: "D6C3B4" } },
    bottom: { style: "thin", color: { rgb: "D6C3B4" } },
    left:   { style: "thin", color: { rgb: "D6C3B4" } },
    right:  { style: "thin", color: { rgb: "D6C3B4" } },
  };

  const titleStyle: CellStyle = {
    font: { bold: true, sz: 14, color: { rgb: "4B3A32" } },
    alignment: { horizontal: "right" },
  };
  const headerStyle: CellStyle = {
    font: { bold: true, color: { rgb: "4B3A32" } },
    fill: { fgColor: { rgb: "E8D8C8" }, patternType: "solid" },
    alignment: { horizontal: "right", vertical: "center", wrapText: true },
    border,
  };
  const dataStyle: CellStyle = {
    alignment: { horizontal: "right", vertical: "top", wrapText: true },
    border,
  };
  const dataStyleAlt: CellStyle = {
    ...dataStyle,
    fill: { fgColor: { rgb: "FAF6F1" }, patternType: "solid" },
  };

  function styleCell(addr: string, style: CellStyle) {
    const cell = ws[addr] as (XLSX.CellObject & { s?: unknown }) | undefined;
    if (cell) cell.s = style;
  }

  styleCell("A1", titleStyle);
  for (let c = 0; c < numCols; c++) {
    styleCell(XLSX.utils.encode_cell({ r: 3, c }), headerStyle);
  }
  for (let row = 0; row < jobs.length; row++) {
    const style = row % 2 === 1 ? dataStyleAlt : dataStyle;
    for (let c = 0; c < numCols; c++) {
      styleCell(XLSX.utils.encode_cell({ r: 4 + row, c }), style);
    }
  }

  return ws;
}

function downloadWorkbook(wb: XLSX.WorkBook, filename: string): void {
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportJobsToExcel(jobs: JobApplication[]): void {
  const today = todayStr();
  const ws = buildJobsSheet(jobs, today);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "מעקב משרות");
  if (!wb.Workbook) wb.Workbook = {};
  (wb.Workbook as Record<string, unknown>)["Views"] = [{ RTL: true }];

  downloadWorkbook(wb, `jobprep-ai-jobs-${today}.xlsx`);
}

// ─── Projects sheet ────────────────────────────────────────────────────────

function buildProjectsSheet(projects: ProjectEntry[]): XLSX.WorkSheet {
  const headers = [
    "שם פרויקט", "שפה", "תיאור", "מה הפרויקט עושה",
    "מה נבנה", "ארכיטקטורה", "טכנולוגיות", "קישור GitHub", "נוצר",
  ];

  const rows: (string | undefined)[][] = projects.map((p) => [
    p.name,
    p.language,
    p.description,
    p.deepAnalysis?.analysis ?? "",
    p.deepAnalysis?.whatWasBuilt ?? "",
    p.deepAnalysis?.architecture ?? "",
    p.deepAnalysis?.technologiesExplained ?? "",
    p.githubUrl,
    p.createdAt ? new Date(p.createdAt).toLocaleDateString("he-IL") : "",
  ]);

  const ws = XLSX.utils.aoa_to_sheet([
    ["פרויקטים - JobPrep AI"],
    [],
    headers,
    ...rows,
  ]);

  const border: CellBorder = {
    top: { style: "thin", color: { rgb: "D6C3B4" } },
    bottom: { style: "thin", color: { rgb: "D6C3B4" } },
    left: { style: "thin", color: { rgb: "D6C3B4" } },
    right: { style: "thin", color: { rgb: "D6C3B4" } },
  };

  ws["!cols"] = [
    { wch: 24 }, { wch: 12 }, { wch: 30 }, { wch: 45 },
    { wch: 45 }, { wch: 45 }, { wch: 45 }, { wch: 35 }, { wch: 14 },
  ];
  (ws as Record<string, unknown>)["!views"] = [{ rightToLeft: true }];

  const titleStyle: CellStyle = { font: { bold: true, sz: 14, color: { rgb: "4B3A32" } }, alignment: { horizontal: "right" } };
  const headerStyle: CellStyle = {
    font: { bold: true, color: { rgb: "4B3A32" } },
    fill: { fgColor: { rgb: "E8D8C8" }, patternType: "solid" },
    alignment: { horizontal: "right", vertical: "center", wrapText: true },
    border,
  };
  const dataStyle: CellStyle = { alignment: { horizontal: "right", vertical: "top", wrapText: true }, border };
  const dataAlt: CellStyle = { ...dataStyle, fill: { fgColor: { rgb: "FAF6F1" }, patternType: "solid" } };

  function styleCell(addr: string, style: CellStyle) {
    const cell = ws[addr] as (XLSX.CellObject & { s?: unknown }) | undefined;
    if (cell) cell.s = style;
  }

  styleCell("A1", titleStyle);
  for (let c = 0; c < headers.length; c++) styleCell(XLSX.utils.encode_cell({ r: 2, c }), headerStyle);
  for (let row = 0; row < rows.length; row++) {
    const style = row % 2 === 1 ? dataAlt : dataStyle;
    for (let c = 0; c < headers.length; c++) styleCell(XLSX.utils.encode_cell({ r: 3 + row, c }), style);
  }

  return ws;
}

export function exportFullToExcel(jobs: JobApplication[], projects: ProjectEntry[]): void {
  const today = todayStr();

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, buildJobsSheet(jobs, today), "מעקב משרות");

  if (projects.length > 0) {
    XLSX.utils.book_append_sheet(wb, buildProjectsSheet(projects), "פרויקטים");
  }

  if (!wb.Workbook) wb.Workbook = {};
  (wb.Workbook as Record<string, unknown>)["Views"] = [{ RTL: true }];

  downloadWorkbook(wb, `jobprep-ai-${today}.xlsx`);
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
