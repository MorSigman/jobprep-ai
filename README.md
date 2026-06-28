# JobPrep AI

A personal Hebrew RTL web app for managing a first high-tech job search and preparing for interviews.

> **Portfolio demo** — all data shown in this repository is fake. The real user data stays local on the user's machine. See [docs/PRIVACY.md](docs/PRIVACY.md).

---

## The Problem

Searching for your first tech job means juggling dozens of tabs — job listings, company research, recruiter emails, self-study notes, and interview prep. There is no single place that ties all of this together per job, in Hebrew, in RTL.

JobPrep AI is that place.

---

## Key Features

- **Per-job workspace** — every application gets its own page with status, description, match score, and next action
- **Interview prep tabs** — phone screen / technical / personal questions, organized per job
- **Job tracking** — search and filter all open applications by status
- **Projects page** — review GitHub projects with interview talking points
- **Personal interview page** — prepared answers for "tell me about yourself" and similar questions
- **Hebrew RTL throughout** — built from scratch for right-to-left layout

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite |
| Styling | Plain CSS with custom properties (no CSS framework) |
| Data (demo) | Local TypeScript constants |
| Data (future) | IndexedDB — browser-local, no server needed |
| Routing | `useState` state machine (no React Router yet) |

---

## Local-First Privacy Architecture

This app is intentionally **local-first**. Personal job search data — recruiter names, interview notes, salary expectations, personal answers — is sensitive. It should not leave the user's computer.

The architecture reflects this:

```
Browser (your machine only)
  └── React UI
       ├── Demo layer     ← what you see on GitHub (fake data, TypeScript constants)
       └── Future layer   ← IndexedDB (planned, no server required)
                               └── Export / Import JSON (user-controlled backup)
```

There is no backend, no cloud database, no external API for personal data.

---

## Why the GitHub Version Uses Demo Data Only

This repository is a **portfolio artifact**, not a running application with real data. Everything committed here is code and fake examples.

Real job applications, recruiter names, interview notes, and personal answers must never be committed to a public (or even private) repository. They live only on the local machine of whoever runs the app.

See [docs/PRIVACY.md](docs/PRIVACY.md) for the full policy.

---

## Current Demo Features

- [x] Dashboard with stats and navigation
- [x] Job list with search and status filter
- [x] Add job form (UI only — no persistence yet)
- [x] Job details page with three interview prep tabs (phone / technical / personal)
- [x] Projects page with demo project cards and interview tips
- [x] Personal interview page with prepared answer cards
- [x] Sticky RTL sidebar with active-page highlighting
- [x] Responsive layout (collapses below 700px)

---

## Future Local-Only Roadmap

- [ ] IndexedDB persistence — add/edit/delete jobs in the browser
- [ ] Add job form submits to IndexedDB
- [ ] Per-job Q&A editor — write and save custom answers per interview type
- [ ] Per-job personal answers — "why do you want this role" customized per company
- [ ] Export to JSON — full backup the user controls
- [ ] Import from JSON — restore on a new machine
- [ ] Project details page with editable talking points
- [ ] Match score calculator (local, no AI API)

---

## How to Run Locally

```bash
# Clone
git clone <repo-url>
cd jobprep-ai

# Install
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). All data shown is fake demo data defined in `src/data/demoJobs.ts`.

---

## What I Learned / Technical Highlights

**RTL layout without hacks** — Using `dir="rtl"` on the app shell means CSS flexbox naturally flows right-to-left. The sidebar is the first child and appears on the right. No `flex-direction: row-reverse` needed.

**Sticky sidebar pattern** — `position: sticky; top: 0; height: 100vh; overflow-y: auto` keeps the nav fixed while the content scrolls, without the manual offset that `position: fixed` requires.

**Shared type extraction to prevent circular imports** — `App.tsx` imports `AppLayout`, and `AppLayout` needs the `PageName` type. Putting `PageName` in `App.tsx` would create a cycle. Extracted it to `src/types/navigation.ts`.

**State machine navigation without React Router** — `activePage: PageName` in `App.tsx` drives all page rendering via a switch statement. Clean enough at this scale; routing can be layered on later.

**CSS design tokens** — All colors, radii, and shadows live in `:root` custom properties. Changing the primary color is a one-line edit.

---

## Interview Talking Points

> These are notes for the developer when presenting this project in an interview.

- "I built this for my own job search — it solves a real problem I have."
- "I chose local-first because interview notes are sensitive. They should not go to a server I don't control."
- "The RTL layout required thinking about flexbox direction carefully — `dir='rtl'` changes how browsers flow flex children."
- "The state machine navigation is intentionally simple. I could add React Router when the app grows, but right now one `useState` handles everything cleanly."
- "The next step is IndexedDB persistence — all the UI is already built, it just needs a real data layer underneath."

---

## License

Personal project. Not licensed for reuse.
