# AI Setup Guide

JobPrep AI supports optional local AI integration using OpenAI.

## Important

- AI is **off by default**.
- No data is sent to AI without your explicit approval before each request.
- The API key is stored only in the local `.env` file — never in source code.
- **Never commit `.env` to git.**

---

## Setup

### 1. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and set your OpenAI API key:

```
OPENAI_API_KEY=sk-...your-key-here...
OPENAI_MODEL=gpt-4o-mini
```

### 2. Install server dependencies

```bash
cd server
npm install
cd ..
```

### 3. Run the backend server

In one terminal:

```bash
npm run dev:server
```

The server starts on `http://localhost:3001`.

### 4. Run the frontend

In another terminal:

```bash
npm run dev
```

### 5. Enable AI in the app

1. Go to **הפרופיל שלי**
2. Find the **הגדרות AI** section
3. Check **הפעלת AI**

---

## What data may be sent to AI

When you click the AI button and approve the consent modal, the following may be sent:

- Job title (if entered)
- Job description text (from the analyzer input)

**Redaction is enabled by default.** Before sending, the system automatically replaces:

| Pattern | Replaced with |
|---|---|
| Email addresses | `[EMAIL]` |
| Phone numbers | `[PHONE]` |
| URLs, LinkedIn, GitHub | `[URL]` |
| 9-digit ID-like numbers | `[ID]` |

You can disable redaction in AI settings, but be aware that unredacted text may contain personal details.

---

## If the backend is not running

The app works fully without the backend. All local features continue to work:

- Local question bank
- Local smart search (sidebar)
- Job tracking and details
- Practice mode
- Job description analyzer (rule-based)
- Backup / export

If you click the AI button and the server is not running, you will see a friendly error message.

---

## Security notes

- `OPENAI_API_KEY` is only read in the server process (`server/index.js`).
- The key never appears in React code or browser requests.
- All AI calls go through `POST /api/ai/job-questions` on the local server.
- The local server only accepts requests from `localhost:5173` and `localhost:5174`.
- AI questions saved to the bank are stored in localStorage only — same as all other questions.
