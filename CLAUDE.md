# JobPrep AI

JobPrep AI is a personal Hebrew RTL web app for managing a first high-tech job search and preparing for interviews.

## Main Goal

Build a personal job search assistant that helps me:
- Track job applications
- Analyze job descriptions
- Prepare for phone interviews
- Prepare for technical interviews
- Prepare for personal/behavioral interviews
- Analyze my GitHub projects
- Generate possible interview questions about my projects
- Match projects to job requirements

## Tech Stack

- React
- TypeScript
- Vite
- CSS Modules or plain CSS for now
- Supabase later
- AI API later
- GitHub API later

## UX Rules

- The UI language is Hebrew.
- The layout must be RTL.
- The design should be clean, practical, and easy to use.
- This is a personal app, not a SaaS product.
- Prioritize clarity over complexity.

## Privacy Rules

- Do not put personal data in the code.
- Do not add real job applications.
- Do not add real CV content.
- Do not add real recruiter names or emails.
- Do not add API keys.
- Do not expose secrets in frontend code.
- Use only fake demo data.

## Development Rules

- Use TypeScript.
- Keep components small and readable.
- Do not add unnecessary libraries.
- Build step by step.
- Explain important changes.
- Do not connect Supabase yet.
- Do not add AI yet.
- Do not add GitHub API yet.
- Start with local mock data only.

## Local-First Privacy Rule

This app is personal and privacy-first. Personal job search data must never leave the user's machine.

- Do NOT suggest cloud storage (Supabase, Firebase, PlanetScale, etc.) for personal data.
- Do NOT suggest external AI APIs (OpenAI, Claude API) for processing personal data.
- Do NOT suggest any architecture that transmits job applications, interview notes, recruiter names, or personal answers to an external server.
- The next persistence step is **IndexedDB** (browser-local, no server required).
- Backup will be user-controlled Export / Import JSON — no automatic cloud sync.
- GitHub contains only source code, documentation, and fake demo data.
- Real user data lives only on the local machine of whoever runs the app.

## First Version Features

1. Dashboard
2. Jobs list
3. Add job page
4. Job details page
5. Interview preparation sections
6. GitHub projects page with demo projects
7. Project details page with demo interview questions
