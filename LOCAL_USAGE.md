# Local Usage Guide — JobPrep AI

## What this app is

JobPrep AI is a personal, local-only job search assistant. It runs entirely in your browser, on your machine. There is no server, no cloud database, no account required.

---

## What is in this repository

| Included | Not included |
|---|---|
| Source code | Real job applications |
| Documentation | Real recruiter names or emails |
| Fake demo data | Real interview notes |
| Build configuration | Real CV content |
| | Backup JSON files |
| | Database files |
| | API keys |

If it contains real personal information, it does not belong here.

---

## Where your real data belongs

Your real job search data — companies you applied to, recruiter contacts, interview notes, salary expectations, personal answers — belongs on your local machine only.

**Current version:** Demo data only. No persistence yet.

**Planned:** IndexedDB storage in the browser. Your data will stay in the browser on your computer, never transmitted anywhere.

**Backup:** When the export feature is ready, save your backup JSON files somewhere outside this repository — your desktop, an external drive, or a personal encrypted folder. Do not commit backup files to Git.

---

## Folders that are ignored by Git

The following folders are safe to create locally — Git will not track them:

| Folder | Intended use |
|---|---|
| `private-data/` | Any local private files |
| `backups/` | Exported backup JSON files |
| `exports/` | Data export files |

You can create these folders locally and place personal files in them. They will not appear in `git status` and will never be committed.

---

## File types that are ignored by Git

The following file patterns are always ignored:

- `*.backup.json` — backup files from the Export feature
- `*.db`, `*.sqlite`, `*.sqlite3` — local database files
- `*.pdf`, `*.docx`, `*.xlsx` — document files
- `.env`, `*.local` — environment and local config files

---

## Before running git commit

Check that you are not about to commit:

- [ ] A real company name you actually applied to
- [ ] A real recruiter's name, email, or phone number
- [ ] Real interview notes or feedback
- [ ] Real CV content or cover letter text
- [ ] A backup JSON file containing real job data
- [ ] Any API key or token

If any of the above is present in a file, do not commit it. Move it outside the repository or add it to `.gitignore`.

---

## How to run the app

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app loads fake demo data. Nothing is saved between sessions yet.
