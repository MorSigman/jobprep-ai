import type { JobApplication } from "../types/job";

export const demoJobs: JobApplication[] = [
  {
    id: "job-1",
    companyName: "DemoTech",
    roleTitle: "Junior Frontend Developer",
    jobUrl: "https://example.com/demo-job",
    jobDescription:
      "A demo junior frontend role that requires React, TypeScript, CSS, and basic API knowledge.",
    status: "phone_screen",
    source: "LinkedIn",
    resumeVersion: "Demo CV - Frontend",
    appliedAt: "2026-06-20",
    followUpAt: "2026-06-27",
    matchScore: 78,
    nextAction: "להתכונן לשיחה טלפונית",
    notes: "נתון דמו בלבד. לא מידע אישי אמיתי.",
  },
  {
    id: "job-2",
    companyName: "CodeExample",
    roleTitle: "Junior Full Stack Developer",
    jobUrl: "https://example.com/fullstack-demo",
    jobDescription:
      "A demo full stack role involving React, Node.js, REST APIs, and databases.",
    status: "waiting",
    source: "Company Website",
    resumeVersion: "Demo CV - Full Stack",
    appliedAt: "2026-06-21",
    followUpAt: "2026-06-28",
    matchScore: 72,
    nextAction: "לחזור על REST APIs ו־database basics",
    notes: "נתון דמו בלבד.",
  },
];