# Privacy Policy — JobPrep AI

## What This App Is

JobPrep AI is a **personal, local-first** job search assistant. It runs entirely in the browser. There is no server, no cloud database, no account system, and no external API that receives personal data.

---

## What Data Is Sensitive in a Job Search

The following categories of data are personal and should never leave the user's machine:

- Job application details (company names, recruiter names, contacts)
- Interview notes and outcomes
- Personal answers to interview questions
- CV versions and cover letters
- Salary expectations
- Rejection reasons and follow-up notes
- Personal reflection on strengths and weaknesses

---

## What Is in This Repository

This repository contains **only**:

- Source code (React, TypeScript, CSS)
- Fake demo data (`src/data/demoJobs.ts`) with imaginary companies and placeholder text
- Documentation
- Configuration files (Vite, TypeScript, ESLint)

**Nothing in this repository is real personal data.**

---

## What Should Not Be Committed to GitHub

The following must never be committed, to any branch, public or private:

- Real job applications
- Real company names from an active job search
- Real recruiter names or contact details
- Real interview notes
- Real CV content
- Real personal answers to interview questions
- API keys of any kind
- Local database files (`.db`, `.sqlite`, IndexedDB exports)
- Any file containing information about a specific employer conversation

---

## Where Real Data Will Live (Future)

The planned persistence layer is **IndexedDB** — the browser's built-in local database. Data written to IndexedDB:

- Lives only on the local machine
- Is not sent anywhere
- Survives browser refreshes and restarts
- Is not accessible to other websites or servers

### Backup Strategy

The user will be able to export their data as a JSON file and import it on another machine. This export is:

- Triggered manually by the user
- Stored wherever the user saves it on their machine
- Never uploaded automatically

---

## Why No Cloud Database

Cloud databases (Supabase, Firebase, PlanetScale, etc.) require personal data to leave the device and be stored on external servers. For a personal job search assistant, this trade-off is not worth it:

- The data is sensitive
- The app is single-user
- There is no collaboration requirement
- IndexedDB handles the persistence need without any server

---

## Summary

| Question | Answer |
|---|---|
| Is personal data stored on a server? | No |
| Is personal data committed to GitHub? | No |
| Where does real data live? | Local machine (IndexedDB, planned) |
| Can the user back up their data? | Yes, via JSON export (planned) |
| Does the GitHub version have real data? | No — only fake demo data |
