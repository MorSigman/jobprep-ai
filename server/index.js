'use strict';

// Load .env from server/ directory — keeps API key isolated from the frontend
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const PORT = Number(process.env.AI_SERVER_PORT ?? process.env.PORT ?? 8787);
const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:5174'];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json({ limit: '50kb' }));

// ─── OpenAI setup ─────────────────────────────────────────────────────────────

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not set — AI endpoint will return 503.');
}

let openai = null;
if (API_KEY) {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error('Failed to init OpenAI client:', e.message);
    console.error('Run: cd server && npm install');
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'General', 'Data Analyst', 'SQL', 'QA', 'Frontend', 'JavaScript',
  'Backend', 'Cyber', 'Git', 'Projects', 'Technical Thinking',
  'Protocols', 'Architecture', 'Machine Learning', 'Deep Learning', 'AI',
  'Personal',
];
const VALID_DIFFICULTIES = ['basic', 'intermediate', 'advanced'];
const MAX_DESC = 8000;
const MAX_PROFILE = 500;
const MAX_TITLE = 200;

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', aiReady: !!openai });
});

app.post('/api/ai/job-questions', async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: 'OPENAI_API_KEY לא הוגדר. צרי קובץ .env מתוך .env.example ואתחלי את השרת.',
    });
  }

  const {
    jobTitle = '',
    jobCategory = '',
    jobDescription = '',
    optionalProfileSummary = '',
  } = req.body ?? {};

  if (typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    return res.status(400).json({ error: 'תיאור המשרה חסר או קצר מדי (מינימום 20 תווים).' });
  }

  const desc = String(jobDescription).slice(0, MAX_DESC);
  const profile = String(optionalProfileSummary || '').slice(0, MAX_PROFILE);
  const title = String(jobTitle || '').slice(0, MAX_TITLE);
  const category = String(jobCategory || '').slice(0, 100);

  const systemPrompt = `אתה מומחה הכנה לראיונות עבודה בישראל.
קבל תיאור משרה ויצור שאלות ראיון מקצועיות.
החזר אובייקט JSON עם מפתח "questions" שמכיל מערך שאלות.

כל שאלה חייבת לכלול:
- question: string — שאלת הראיון
- shortAnswer: string — תשובה קצרה (1-2 משפטים טבעיים בלבד)
- simpleExplanation: string — הסבר פשוט וברור
- example: string — דוגמה מעשית
- whatToMention: string[] — נקודות שכדאי להזכיר
- commonMistakes: string[] — טעויות נפוצות
- tags: string[] — תגיות רלוונטיות
- category: string — אחת מ: ${VALID_CATEGORIES.join(', ')}
- topic: string — נושא ספציפי בעברית
- difficulty: "basic" | "intermediate" | "advanced"

חוקים:
- כל השדות חייבים להיות בעברית
- אין שמות חברות אמיתיים
- אין פרטים אישיים
- shortAnswer: 1-2 משפטים קצרים וטבעיים בלבד
- החזר JSON בלבד`;

  const userLines = [
    `כותרת משרה: ${title || 'לא צוין'}`,
    `קטגוריה: ${category || 'לא צוין'}`,
    profile ? `רקע מועמד: ${profile}` : null,
    '',
    'תיאור משרה:',
    desc,
    '',
    'יצר 8-12 שאלות ראיון רלוונטיות.',
  ].filter((l) => l !== null).join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userLines },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.questions)
      ? parsed.questions
      : [];

    const questions = arr.map((q) => ({
      question: String(q.question ?? ''),
      shortAnswer: String(q.shortAnswer ?? ''),
      simpleExplanation: String(q.simpleExplanation ?? ''),
      example: String(q.example ?? ''),
      whatToMention: Array.isArray(q.whatToMention) ? q.whatToMention.map(String) : [],
      commonMistakes: Array.isArray(q.commonMistakes) ? q.commonMistakes.map(String) : [],
      tags: Array.isArray(q.tags) ? q.tags.map(String) : [],
      category: VALID_CATEGORIES.includes(q.category) ? q.category : 'General',
      topic: String(q.topic ?? 'כללי'),
      difficulty: VALID_DIFFICULTIES.includes(q.difficulty) ? q.difficulty : 'intermediate',
    }));

    res.json({ questions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

app.post('/api/ai/cv-tailoring', async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: 'OPENAI_API_KEY לא הוגדר. צרי קובץ .env מתוך .env.example ואתחלי את השרת.',
    });
  }

  const { jobTitle = '', jobDescription = '', profileSummary = '' } = req.body ?? {};

  if (typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    return res.status(400).json({ error: 'תיאור המשרה חסר או קצר מדי (מינימום 20 תווים).' });
  }

  const desc = String(jobDescription).slice(0, MAX_DESC);
  const profile = String(profileSummary || '').slice(0, 2000);
  const title = String(jobTitle || '').slice(0, MAX_TITLE);

  const systemPrompt = `אתה מומחה כתיבת קורות חיים ותעסוקה בישראל.
קבל תיאור משרה ופרופיל מועמד ויצור המלצות ספציפיות להתאמת קורות החיים.
החזר אובייקט JSON בלבד עם המבנה הבא:
{
  "matchingStrengths": string[],
  "missingKeywords": string[],
  "recommendedHighlights": string[],
  "suggestedPhrases": string[],
  "projectsToMention": string[],
  "warnings": string[]
}

חוקים:
- כל השדות בעברית
- אין להמציא ניסיון שלא מוזכר בפרופיל
- הניסוחים המוצעים חייבים להתבסס רק על מה שכתוב בפרופיל
- הוסיפי תמיד אזהרה: "יש להשתמש רק במידע אמיתי. לא לכלול ניסיון שלא קיים."
- החזר JSON בלבד`;

  const userContent = [
    `כותרת משרה: ${title || 'לא צוין'}`,
    '',
    'תיאור משרה:',
    desc,
    '',
    profile ? `פרופיל מועמד:\n${profile}` : 'פרופיל מועמד: לא סופק',
    '',
    'יצר המלצות התאמת קורות חיים.',
  ].join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);
    const toStrArr = (v) => (Array.isArray(v) ? v.map(String) : []);

    res.json({
      matchingStrengths: toStrArr(parsed.matchingStrengths),
      missingKeywords: toStrArr(parsed.missingKeywords),
      recommendedHighlights: toStrArr(parsed.recommendedHighlights),
      suggestedPhrases: toStrArr(parsed.suggestedPhrases),
      projectsToMention: toStrArr(parsed.projectsToMention),
      warnings: toStrArr(parsed.warnings).length > 0
        ? toStrArr(parsed.warnings)
        : ['יש להשתמש רק במידע אמיתי. לא לכלול ניסיון שלא קיים.'],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI cv-tailoring] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

app.post('/api/ai/interview-prep', async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: 'OPENAI_API_KEY לא הוגדר. צרי קובץ .env מתוך .env.example ואתחלי את השרת.',
    });
  }

  const { jobTitle = '', jobDescription = '', profileSummary = '' } = req.body ?? {};

  if (typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    return res.status(400).json({ error: 'תיאור המשרה חסר או קצר מדי (מינימום 20 תווים).' });
  }

  const desc = String(jobDescription).slice(0, MAX_DESC);
  const profile = String(profileSummary || '').slice(0, 2000);
  const title = String(jobTitle || '').slice(0, MAX_TITLE);

  const systemPrompt = `אתה מאמן ראיונות עבודה מנוסה בישראל.
קבל תיאור משרה ופרופיל מועמד ויצור תוכנית הכנה לראיון עבודה.
החזר אובייקט JSON בלבד עם המבנה הבא:
{
  "likelyQuestions": string[],
  "topicsToReview": string[],
  "personalPitch": string,
  "projectsToPrepare": string[],
  "questionsToAskInterviewer": string[],
  "weakSpotsToPrepare": string[]
}

חוקים:
- כל השדות בעברית
- likelyQuestions: 6-8 שאלות ראיון צפויות
- personalPitch: 3-4 משפטים מותאמים לתפקיד ומבוססים על הפרופיל בלבד
- אין להמציא ניסיון שלא קיים
- questionsToAskInterviewer: 4-5 שאלות חכמות לשאול
- החזר JSON בלבד`;

  const userContent = [
    `כותרת משרה: ${title || 'לא צוין'}`,
    '',
    'תיאור משרה:',
    desc,
    '',
    profile ? `פרופיל מועמד:\n${profile}` : 'פרופיל מועמד: לא סופק',
    '',
    'יצר תוכנית הכנה מפורטת לראיון.',
  ].join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);
    const toStrArr = (v) => (Array.isArray(v) ? v.map(String) : []);

    res.json({
      likelyQuestions: toStrArr(parsed.likelyQuestions),
      topicsToReview: toStrArr(parsed.topicsToReview),
      personalPitch: String(parsed.personalPitch ?? ''),
      projectsToPrepare: toStrArr(parsed.projectsToPrepare),
      questionsToAskInterviewer: toStrArr(parsed.questionsToAskInterviewer),
      weakSpotsToPrepare: toStrArr(parsed.weakSpotsToPrepare),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI interview-prep] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

app.post('/api/ai/answer-question', async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: 'OPENAI_API_KEY לא הוגדר. צרי קובץ server/.env מתוך server/.env.example ואתחלי את השרת.',
    });
  }

  const { question = '' } = req.body ?? {};

  if (typeof question !== 'string' || question.trim().length < 3) {
    return res.status(400).json({ error: 'השאלה קצרה מדי (מינימום 3 תווים).' });
  }

  const q = String(question).slice(0, 500);

  const systemPrompt = `אתה מדריך הכנה לראיונות עבודה בתחום ה-IT בישראל.
ענה על שאלת ראיון בצורה ברורה, מעשית ומדויקת.
החזר אובייקט JSON בלבד עם המבנה הבא:
{
  "answer": string,
  "keyPoints": string[],
  "example": string,
  "relatedTopics": string[],
  "commonMistakes": string[],
  "suggestedCategory": string,
  "suggestedDifficulty": "basic" | "intermediate" | "advanced",
  "suggestedTopic": string
}

חוקים:
- answer: תשובה ישירה וברורה (2-4 משפטים)
- keyPoints: 3-5 נקודות מפתח לזכור
- example: דוגמה מעשית קצרה (קוד, ערך, או תרחיש)
- relatedTopics: 2-3 נושאים קשורים לחזרה
- commonMistakes: 2-3 טעויות נפוצות
- suggestedCategory: אחת בדיוק מהרשימה: ${VALID_CATEGORIES.join(', ')}
- suggestedDifficulty: basic / intermediate / advanced
- suggestedTopic: נושא ספציפי בעברית (2-4 מילים)
- הכל בעברית (מלבד שמות טכנולוגיות)
- אין להמציא ניסיון אישי של המועמד
- החזר JSON בלבד`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `שאלת ראיון: ${q}` },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);
    const toStrArr = (v) => (Array.isArray(v) ? v.map(String) : []);

    res.json({
      answer: String(parsed.answer ?? ''),
      keyPoints: toStrArr(parsed.keyPoints),
      example: String(parsed.example ?? ''),
      relatedTopics: toStrArr(parsed.relatedTopics),
      commonMistakes: toStrArr(parsed.commonMistakes),
      suggestedCategory: VALID_CATEGORIES.includes(parsed.suggestedCategory)
        ? parsed.suggestedCategory
        : 'General',
      suggestedDifficulty: VALID_DIFFICULTIES.includes(parsed.suggestedDifficulty)
        ? parsed.suggestedDifficulty
        : 'intermediate',
      suggestedTopic: String(parsed.suggestedTopic ?? 'כללי'),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI answer-question] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

app.post('/api/ai/job-full-analysis', async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: 'OPENAI_API_KEY לא הוגדר. צרי קובץ server/.env מתוך server/.env.example ואתחלי את השרת.',
    });
  }

  const {
    jobTitle = '',
    jobDescription = '',
    companyInfo = '',
    profileSummary = '',
  } = req.body ?? {};

  if (typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    return res.status(400).json({ error: 'תיאור המשרה חסר או קצר מדי (מינימום 20 תווים).' });
  }

  const desc = String(jobDescription).slice(0, MAX_DESC);
  const company = String(companyInfo || '').slice(0, 2000);
  const profile = String(profileSummary || '').slice(0, 2000);
  const title = String(jobTitle || '').slice(0, MAX_TITLE);

  const systemPrompt = `אתה מומחה הכנה לראיונות עבודה בישראל.
קבל תיאור משרה, מידע על חברה, ופרופיל מועמד — וצור ניתוח מקיף.
החזר אובייקט JSON בלבד עם המבנה הבא:
{
  "professionalQuestions": [...],
  "personalQuestions": [...],
  "prepSuggestions": {
    "keyRequirements": string,
    "skillsToLearn": string,
    "phoneScreenNotes": string,
    "companyResearch": string
  }
}

professionalQuestions — 5 שאלות מקצועיות רלוונטיות למשרה:
כל שאלה: { question, shortAnswer, simpleExplanation, example, whatToMention: string[], commonMistakes: string[], tags: string[], category, topic, difficulty }
- shortAnswer: 1-2 משפטים טבעיים
- category: אחת מ: ${VALID_CATEGORIES.filter(c => c !== 'Personal').join(', ')}
- difficulty: "basic"|"intermediate"|"advanced"

personalQuestions — 4 שאלות אישיות/התנהגותיות:
כל שאלה: { question, type, suggestedAnswer, tips: string[], followUpQuestions: string[] }
- type: "behavioral"|"motivational"|"situational"|"personal"
- suggestedAnswer: טיוטת תשובה מותאמת לפרופיל שסופק (3-4 משפטים, בגוף ראשון נקבה)
- tips: 2-3 טיפים מה להדגיש
- followUpQuestions: 1-2 שאלות המשך אפשריות

prepSuggestions:
- keyRequirements: רשימת דרישות עיקריות מהמשרה (כל פריט בשורה חדשה עם •)
- skillsToLearn: פערים לסגירה בהתאם לפרופיל (כל פריט בשורה חדשה עם •)
- phoneScreenNotes: נקודות עיקריות להגיד בשיחה ראשונה (כל פריט בשורה חדשה עם •)
- companyResearch: מה שידוע על החברה מהמידע שסופק, או "לא סופק מידע על החברה" אם אין

חוקים:
- הכל בעברית (מלבד שמות טכנולוגיות)
- אין שמות חברות אמיתיים בשאלות המקצועיות
- השאלות האישיות מבוססות על הפרופיל שסופק
- suggestedAnswer: אם אין פרופיל — כתוב "ספרי על ניסיונך הרלוונטי לתפקיד זה..."
- החזר JSON בלבד`;

  const userContent = [
    `כותרת משרה: ${title || 'לא צוין'}`,
    '',
    'תיאור משרה:',
    desc,
    '',
    company ? `מידע על החברה:\n${company}` : 'מידע על החברה: לא סופק',
    '',
    profile ? `פרופיל מועמד:\n${profile}` : 'פרופיל מועמד: לא סופק',
    '',
    'צור ניתוח מקיף לפי הפורמט שהוגדר.',
  ].join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 8000,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);
    const toStrArr = (v) => (Array.isArray(v) ? v.map(String) : []);

    const professionalQuestions = Array.isArray(parsed.professionalQuestions)
      ? parsed.professionalQuestions.map((q) => ({
          question: String(q.question ?? ''),
          shortAnswer: String(q.shortAnswer ?? ''),
          simpleExplanation: String(q.simpleExplanation ?? ''),
          example: String(q.example ?? ''),
          whatToMention: toStrArr(q.whatToMention),
          commonMistakes: toStrArr(q.commonMistakes),
          tags: toStrArr(q.tags),
          category: VALID_CATEGORIES.includes(q.category) ? q.category : 'General',
          topic: String(q.topic ?? 'כללי'),
          difficulty: VALID_DIFFICULTIES.includes(q.difficulty) ? q.difficulty : 'intermediate',
        }))
      : [];

    const personalQuestions = Array.isArray(parsed.personalQuestions)
      ? parsed.personalQuestions.map((q) => ({
          question: String(q.question ?? ''),
          type: ['behavioral', 'motivational', 'situational', 'personal'].includes(q.type)
            ? q.type
            : 'personal',
          suggestedAnswer: String(q.suggestedAnswer ?? ''),
          tips: toStrArr(q.tips),
          followUpQuestions: toStrArr(q.followUpQuestions),
        }))
      : [];

    const prepSuggestionsRaw = parsed.prepSuggestions ?? {};
    const prepSuggestions = {
      keyRequirements: String(prepSuggestionsRaw.keyRequirements ?? ''),
      skillsToLearn: String(prepSuggestionsRaw.skillsToLearn ?? ''),
      phoneScreenNotes: String(prepSuggestionsRaw.phoneScreenNotes ?? ''),
      companyResearch: String(prepSuggestionsRaw.companyResearch ?? ''),
    };

    res.json({ professionalQuestions, personalQuestions, prepSuggestions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI job-full-analysis] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

app.listen(PORT, () => {
  console.log(`\nJobPrep AI server → http://localhost:${PORT}`);
  if (openai) {
    console.log(`AI ready  (model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'})`);
  } else {
    console.log('AI offline — set OPENAI_API_KEY in .env to enable');
  }
});
