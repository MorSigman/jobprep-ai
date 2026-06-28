# Roadmap — JobPrep AI

This document describes the planned development phases for JobPrep AI. The project follows a local-first, privacy-first approach: personal job search data never leaves the user's machine.

---

## Phase 1 — Portfolio Demo Version ✅ (current)

**What:** A fully functional Hebrew RTL UI with fake demo data, deployed to GitHub as a portfolio artifact. Includes dashboard analytics, job tracking, interview preparation tabs, projects page, personal interview page, light/dark mode, and a visual-only AI assistant demo.

**Why it matters:** Demonstrates product thinking, Hebrew RTL layout engineering, accessible design, and local-first architecture — without exposing any personal data.

**Privacy:** No real data anywhere. All companies, roles, and notes are invented. The repository is safe to share publicly.

---

## Phase 2 — Local MVP for Personal Job Tracking

**What:** Replace demo data with a working add-job form. Jobs added in the browser survive a page refresh using `localStorage` as a temporary proof of concept. The UI is already fully built — this phase wires up the data layer.

**Why it matters:** Transforms the portfolio demo into a tool that actually works for tracking a real job search.

**Privacy:** Data stays in the browser's localStorage on the user's machine. Nothing is sent to any server. GitHub still contains only demo data.

---

## Phase 3 — localStorage Prototype

**What:** Full CRUD for job applications using `localStorage`: add, edit, delete, reorder. Status updates persist between sessions. Basic data validation on the add-job form.

**Why it matters:** localStorage is simple, requires zero setup, and proves the data layer works before moving to IndexedDB. Good enough for light use.

**Privacy:** Still fully local. `localStorage` is scoped to the origin and never leaves the device.

---

## Phase 4 — IndexedDB Local Persistence

**What:** Migrate from localStorage to IndexedDB using the browser's native structured storage. IndexedDB supports larger datasets, typed records, and efficient queries. Stores: jobs, answers (per job, per interview type), project talking points.

**Why it matters:** localStorage serializes everything to strings and has a 5–10 MB limit. IndexedDB is the right tool for a personal application that may grow to hundreds of job records and thousands of Q&A pairs.

**Privacy:** IndexedDB is strictly local. Data is never transmitted. No account required. No server.

---

## Phase 5 — Export / Import JSON Backup

**What:** A one-click "Export all data" button that downloads a JSON file to the user's computer. A matching "Import" flow that reads a JSON file and restores all records. The JSON format is documented so the data remains portable.

**Why it matters:** Local-only data has one risk: if the browser storage is cleared, data is lost. Export / Import gives the user full control of their backup without depending on any cloud service.

**Privacy:** The backup file lives wherever the user saves it — their local drive, an encrypted USB, or a personal cloud folder of their choice. The app never uploads anything.

---

## Phase 6 — Job Pipeline by Status

**What:** A visual pipeline view (Kanban-style columns) showing jobs organized by status: Saved → Applied → Waiting → Phone Screen → Interview → Offer / Rejected. Drag or click to move jobs between stages.

**Why it matters:** As the job count grows, a pipeline view is more useful than a flat list. Seeing "3 jobs in phone screen, 1 in final interview" at a glance improves decision-making.

**Privacy:** All pipeline state is stored in IndexedDB. No external service.

---

## Phase 7 — Interview Preparation Workspace

**What:** Each job gets a dedicated workspace with:
- Editable Q&A for phone screen, technical, and personal rounds
- A customized "tell me about yourself" draft per company
- A "why do you want this role" draft per company
- Checklist of preparation steps
- Notes field

**Why it matters:** Generic interview prep is not useful. The value comes from preparing answers that are specific to each job and company. This workspace makes that possible.

**Privacy:** All custom answers and notes are stored in IndexedDB. They are not visible in the GitHub repository. The user owns and controls this data entirely.

---

## Phase 8 — Future: Local AI or Desktop Version

**What (option A — local AI):** Integrate a locally-run language model (e.g., WebLLM running in-browser, or Ollama via a local server) to analyze job descriptions, suggest questions, and help draft answers — all without sending data to any external API.

**What (option B — desktop app):** Package the app as an Electron or Tauri desktop application with SQLite persistence. This removes the browser storage limitations and makes the app feel like a real native tool.

**Why it matters:** AI assistance for interview prep is genuinely valuable. But submitting personal interview notes and job descriptions to OpenAI, Anthropic, or any cloud AI service is a significant privacy trade-off. Local AI removes that trade-off entirely.

**Privacy:** Option A uses a model that runs in the browser — data never leaves the device. Option B uses SQLite on the local filesystem, which is even more private than IndexedDB. In both cases: no external API, no account, no subscription, no data transmission.

---

## Principles That Guide Every Phase

- Personal job search data is sensitive. It must not leave the user's device without explicit consent.
- The GitHub repository contains only source code, documentation, and fake demo data.
- Real user data is stored locally (localStorage → IndexedDB → SQLite).
- Backup is always user-controlled (Export / Import JSON or desktop file system).
- No cloud database, no external auth, no subscription required to use the core product.
