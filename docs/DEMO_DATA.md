# Demo Data Policy — JobPrep AI

## What Is Demo Data

Demo data is invented, non-personal, placeholder content used to show how the application looks and works. It exists so that the GitHub repository can be shared publicly without exposing any real personal information.

All demo data in this repository is defined in:

```
src/data/demoJobs.ts
```

---

## What Demo Data Contains

The demo dataset includes:

- **Invented company names** — e.g., "DemoTech", "QA Innovations", "DataVision Analytics". These are not real companies.
- **Invented role titles** — generic placeholder titles like "Junior Frontend Developer" or "Junior QA Engineer".
- **Placeholder job descriptions** — generic text describing a fictional role, containing no real requirements from any real company.
- **Fake dates** — all `appliedAt` and `followUpAt` dates are invented to populate the dashboard analytics.
- **Placeholder notes and next actions** — Hebrew placeholder text that explicitly says "נתון דמו בלבד".
- **No real match scores** — the percentages shown are invented numbers for visual demo purposes only.

---

## What Must Never Be Committed to This Repository

The following categories of real personal data must **never** be added to this repository, to any branch, in any file:

| Category | Examples |
|---|---|
| Real job applications | Actual companies you applied to, actual roles you're pursuing |
| Real recruiter information | Names, email addresses, phone numbers, LinkedIn profiles |
| Real interview notes | What was asked, what you answered, how it went |
| Real CV content | Work history, education, skills, personal projects linked to your identity |
| Real cover letters | Any text written specifically for a real application |
| Real salary expectations | Any numbers discussed in a real interview process |
| Real follow-up notes | Dates, contacts, decisions |
| API keys or tokens | Of any kind, for any service |
| Personal contact information | Email, phone, location |

---

## Why This Policy Exists

This project is shared publicly on GitHub as a portfolio artifact. Public repositories are indexed by search engines, cached by GitHub, and visible to anyone permanently — even if the repository is later made private or deleted.

Personal job search data is sensitive. Exposing it publicly could:

- Reveal your job search to your current employer
- Expose recruiter contacts without their consent
- Leak salary negotiation details
- Create a permanent record of rejections or private interview notes

Keeping real data out of GitHub entirely is the safest approach.

---

## Where Real Data Will Live

The real version of this app stores all personal data **locally on the user's machine**, using the browser's built-in storage.

**Current state:** Demo data only (TypeScript constants).

**Planned:** IndexedDB in the browser — a local structured database that:
- Never transmits data to any server
- Is scoped to the user's local browser
- Survives browser restarts
- Supports the full dataset without size limits

**Backup:** The user will be able to export all data as a JSON file and import it on another machine. This export lives wherever the user saves it — not in this repository, not in any cloud service.

---

## How to Work With Demo Data Safely

If you fork this project for your own use:

1. Keep `src/data/demoJobs.ts` as fake data.
2. Do not replace the demo data with your real applications.
3. Add your real data only through the app's UI (once persistence is added), not through source files.
4. Never commit any file that contains real job search information.
5. If you create new demo data for testing, make it obviously fake (invented company names, placeholder notes).

---

## Identifying Demo Data in the Codebase

All demo items are labeled in their `notes` field:

```typescript
notes: "נתון דמו בלבד. לא מידע אישי אמיתי.",
```

The UI also shows a persistent demo notice at the bottom of the sidebar explaining that all data is fictional.
