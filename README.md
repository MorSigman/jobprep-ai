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

## Why This Is More Than a Simple CRUD App

Most "job tracker" portfolio projects are a list with an add/edit/delete form. This project makes different choices — here is why each one matters.

**Local-first privacy architecture** — Personal job search data (recruiter names, salary expectations, interview notes) is sensitive. Instead of the common pattern of "build a backend and store everything in a cloud database," this app is designed so that real user data never leaves the device. The GitHub version uses fake demo data; the real version will use IndexedDB in the browser.

**Hebrew RTL product design** — RTL layout is not just `text-align: right`. It changes how CSS flexbox flows children, how borders and padding are oriented, and how the sidebar sits relative to the content. Building a full RTL product in Hebrew from scratch requires careful consideration of layout at every level.

**Dashboard analytics with real data derivation** — The dashboard stats (total jobs, sent this week, in interview, waiting) are computed from the demo dataset, not hard-coded numbers. The bar chart and donut chart are built with pure CSS and conic-gradient — no chart library added.

**Visual-only AI demo without any external API** — The AI assistant panel shows what the feature will look like without calling OpenAI, Anthropic, or any other service. This demonstrates that a feature can be designed and prototyped before the implementation is wired up, and that the privacy constraint (no personal data to external APIs) is a first-class design decision.

**Planned IndexedDB persistence** — The UI is fully built. The data layer is the next step. This separation of concerns (UI complete before persistence is decided) is an intentional architectural choice.

**Planned Export / Import JSON backup** — Instead of sync, the user owns their backup file. This works offline, requires no account, and keeps the data in a format the user can open, read, and understand.

**Portfolio-safe demo data** — The repository is safe to share publicly. All company names, roles, and interview notes are invented. The demo notice in the sidebar makes this explicit to anyone who opens the app.

**Accessibility and readable UI** — Focus-visible keyboard navigation, `aria-current` on the active nav item, `aria-label` on controls, `htmlFor`/`id` connections on form labels, readable contrast ratios, and semantic HTML throughout.

**Clear separation between GitHub code and local personal data** — A policy enforced by documentation ([docs/PRIVACY.md](docs/PRIVACY.md), [docs/DEMO_DATA.md](docs/DEMO_DATA.md)) and by architecture. Real data lives in the browser; the repository contains only code.

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

- [x] Dashboard with 5 live stat cards (total / today / week / in interview / waiting)
- [x] Bar chart — applications by day of the week (pure CSS)
- [x] Donut chart — applications by job category (CSS conic-gradient)
- [x] Visual-only AI assistant demo panel
- [x] Job list with search and status filter
- [x] Add job form (UI only — no persistence yet)
- [x] Job details page with three interview prep tabs (phone / technical / personal)
- [x] Projects page with demo project cards and interview tips
- [x] Personal interview page with prepared answer cards
- [x] Sticky RTL sidebar with active-page highlighting and `aria-current`
- [x] Light / dark mode toggle (CSS variables, warm neutral palette)
- [x] Responsive layout — stacks cleanly at 900px and 700px
- [x] Keyboard-accessible focus states throughout

---

## Future Local-Only Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full 8-phase plan with reasoning.

- [ ] localStorage prototype — jobs survive page refresh
- [ ] IndexedDB persistence — full CRUD, typed records, no size limit
- [ ] Per-job Q&A editor — custom answers per interview type
- [ ] Per-job personal answers — "why do you want this role" per company
- [ ] Export to JSON — user-controlled backup
- [ ] Import from JSON — restore on a new machine
- [ ] Job pipeline view — Kanban by status
- [ ] Local AI or desktop version (no external API)

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
