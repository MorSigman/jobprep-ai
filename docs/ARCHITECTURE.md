# Architecture — JobPrep AI

## Overview

JobPrep AI is a single-page React application with no backend. All state is managed in-memory (and in the future, in IndexedDB). The architecture has two layers: the current demo layer and the planned local persistence layer.

---

## Current Architecture (Demo Layer)

```
src/
  App.tsx                  ← page state machine (activePage, selectedJob)
  App.css                  ← full design system (CSS custom properties)
  index.css                ← 3-line reset only

  layouts/
    AppLayout.tsx          ← RTL shell, sticky sidebar, nav items

  pages/
    DashboardPage.tsx      ← hero card, stats grid, navigation shortcuts
    JobsPage.tsx           ← split layout: add-job form + filtered job list
    JobDetailsPage.tsx     ← per-job header, Q&A tabs (phone/technical/personal)
    ProjectsPage.tsx       ← demo projects with tech stack and interview tips
    PersonalInterviewPage.tsx ← prepared personal answers

  components/
    JobCard.tsx            ← job list item with status badge and select button

  data/
    demoJobs.ts            ← fake demo jobs (TypeScript constants, not real data)

  types/
    job.ts                 ← JobApplication and JobStatus types
    navigation.ts          ← PageName union type (extracted to avoid circular import)

  docs/
    PRIVACY.md             ← privacy policy
    ARCHITECTURE.md        ← this file
```

### Navigation Model

There is no React Router. Page switching is handled by `activePage: PageName` state in `App.tsx`. A `renderPage()` switch statement renders the correct component. This is sufficient for the current number of pages and keeps the dependency tree lean.

### RTL Layout

`dir="rtl"` is set on the `.app-shell` wrapper. CSS flexbox in RTL context flows right-to-left naturally, so the sidebar (first child) renders on the right and the main content (second child) renders on the left. No `flex-direction: row-reverse` is used.

### Sticky Sidebar

```css
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
```

This keeps the nav visible while content scrolls, without the manual offset that `position: fixed` requires.

---

## Planned: Local Persistence Layer (IndexedDB)

When the add-job form becomes functional, data will be persisted using IndexedDB — the browser's native key-value store. No server is required.

```
Browser
  └── React UI (current)
       └── IndexedDB (planned)
            ├── jobs store      ← JobApplication records
            ├── answers store   ← per-job Q&A per interview type
            └── projects store  ← project talking points
```

IndexedDB is accessed via the standard `window.indexedDB` API or a thin wrapper like `idb`. No external storage service is used.

### Why IndexedDB, Not a Cloud DB

| Criterion | IndexedDB | Supabase / Firebase |
|---|---|---|
| Data stays local | Yes | No — data goes to external server |
| Works offline | Yes | No |
| Single-user app | Fits perfectly | Overkill |
| Sensitive data risk | Low — no transmission | High — data leaves device |
| Setup complexity | Low | Medium (account, schema, API keys) |

---

## Planned: Export / Import Layer

Users will be able to back up and restore their data as JSON.

```
Export: IndexedDB → JSON file → user's Downloads folder
Import: JSON file → IndexedDB → UI refreshes
```

This is the only "sync" mechanism. There is no automatic cloud backup. The user controls where the backup file goes.

---

## What Is Intentionally Excluded

| Feature | Status | Reason |
|---|---|---|
| React Router | Not added | One `useState` is sufficient at this scale |
| Supabase | Not planned | Personal data should not go to external servers |
| Firebase | Not planned | Same reason |
| OpenAI / Claude API | Not planned for personal data | API calls transmit data to external servers |
| CSS framework (Tailwind, etc.) | Not added | Plain CSS with custom properties covers all needs |
| State management library | Not added | React `useState` is sufficient |

---

## Design Tokens

All visual constants live in `:root` in `App.css`:

```css
:root {
  --bg: #f5f0eb;           /* warm beige background */
  --primary: #0d9488;      /* teal */
  --primary-light: #ccfbf1;
  --surface: #ffffff;
  --border: #e2ddd8;
  --text-1: #1c1917;       /* headings */
  --text-2: #44403c;       /* body */
  --text-3: #78716c;       /* labels, secondary */
  --radius: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
}
```

Changing the visual theme is a single `:root` edit.
