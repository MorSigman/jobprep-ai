'use strict';

// Load .env from server/ directory — keeps API key isolated from the frontend
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const PORT = Number(process.env.AI_SERVER_PORT ?? process.env.PORT ?? 8787);
const app = express();
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
}));
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
    "companyResearch": string,
    "suggestedSalary": string
  },
  "cvReview": {
    "overallFit": "strong"|"moderate"|"weak",
    "strengthsToHighlight": string[],
    "suggestedChanges": string[],
    "keywordsToAdd": string[],
    "projectsToFeature": string[]
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
- suggestedAnswer: טיוטת תשובה מותאמת לפרופיל שסופק (3-4 משפטים, בגוף ראשון זכר)
- tips: 2-3 טיפים מה להדגיש
- followUpQuestions: 1-2 שאלות המשך אפשריות

prepSuggestions:
- keyRequirements: רשימת דרישות עיקריות מהמשרה (כל פריט בשורה חדשה עם •)
- skillsToLearn: פערים לסגירה בהתאם לפרופיל (כל פריט בשורה חדשה עם •)
- phoneScreenNotes: נקודות עיקריות להגיד בשיחה ראשונה (כל פריט בשורה חדשה עם •)
- companyResearch: מה שידוע על החברה מהמידע שסופק, או "לא סופק מידע על החברה" אם אין
- suggestedSalary: טווח שכר מוצע לדרוש בשקלים לפי תפקיד, מיקום, וניסיון המועמד — למשל "18,000–24,000 ₪ לחודש ברוטו". אם אין מידע מספיק, ציין "לא ניתן להעריך — חסר מידע על ניסיון/מיקום"

cvReview — ניתוח קורות חיים ביחס למשרה:
- overallFit: "strong" אם הפרופיל מתאים מאוד, "moderate" אם צריך שיפורים, "weak" אם יש פערים משמעותיים
- strengthsToHighlight: 2-3 נקודות חוזק מהפרופיל שיש להדגיש לתפקיד הזה
- suggestedChanges: 2-4 שינויים ספציפיים שכדאי לעשות בקורות חיים לתפקיד זה
- keywordsToAdd: 3-5 מילות מפתח שחסרות בפרופיל (חשוב ל-ATS)
- projectsToFeature: 1-3 פרויקטים מהרשימה שסופקה שכדאי להבליט לתפקיד זה
- אם אין פרופיל — overallFit: "moderate", כל שאר השדות: []

חוקים:
- הכל בעברית (מלבד שמות טכנולוגיות)
- אין שמות חברות אמיתיים בשאלות המקצועיות
- השאלות האישיות מבוססות על הפרופיל שסופק
- suggestedAnswer: אם אין פרופיל — כתוב "ספר על ניסיונך הרלוונטי לתפקיד זה..."
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
      suggestedSalary: String(prepSuggestionsRaw.suggestedSalary ?? ''),
    };

    const VALID_FIT = ['strong', 'moderate', 'weak'];
    const cvReviewRaw = parsed.cvReview ?? {};
    const cvReview = {
      overallFit: VALID_FIT.includes(cvReviewRaw.overallFit) ? cvReviewRaw.overallFit : 'moderate',
      strengthsToHighlight: toStrArr(cvReviewRaw.strengthsToHighlight),
      suggestedChanges: toStrArr(cvReviewRaw.suggestedChanges),
      keywordsToAdd: toStrArr(cvReviewRaw.keywordsToAdd),
      projectsToFeature: toStrArr(cvReviewRaw.projectsToFeature),
    };

    res.json({ professionalQuestions, personalQuestions, prepSuggestions, cvReview });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI job-full-analysis] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── Parse CV ─────────────────────────────────────────────────────────────────

app.post('/api/ai/parse-cv', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OPENAI_API_KEY לא הוגדר. צור קובץ server/.env ואתחל את השרת.' });
  }

  const { cvText = '' } = req.body ?? {};

  if (typeof cvText !== 'string' || cvText.trim().length < 30) {
    return res.status(400).json({ error: 'טקסט קורות חיים חסר או קצר מדי.' });
  }

  const cv = String(cvText).slice(0, 10000);

  const systemPrompt = `אתה מנתח קורות חיים. קבל קורות חיים בעברית או אנגלית וחלץ את המידע לשדות מובנים.
החזר JSON בלבד עם המבנה הבא:
{
  "targetRoles": string,
  "targetCategories": string,
  "skills": string,
  "technologies": string,
  "tools": string,
  "projectsSummary": string,
  "experienceSummary": string,
  "educationSummary": string,
  "strengths": string
}

הנחיות:
- targetRoles: תפקידים מתאימים (מופרדים בפסיקים)
- targetCategories: תחומי עניין מהניסיון (מופרדים בפסיקים)
- skills: כישורים מקצועיים (מופרדים בפסיקים)
- technologies: frameworks וספריות (מופרדים בפסיקים)
- tools: כלי פיתוח (מופרדים בפסיקים)
- projectsSummary: פרויקטים — שם + תיאור קצר + טכנולוגיות, שורה לכל פרויקט
- experienceSummary: ניסיון — תפקיד, מקום, תקופה, תיאור קצר. שורה לכל תפקיד
- educationSummary: השכלה ולימודים (תמציתי)
- strengths: חוזקות עיקריות (2-4 משפטים)
- כל שדה: עברית, טכנולוגיות בלועזית. אם לא קיים — string ריק
- החזר JSON בלבד`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `קורות חיים לניתוח:\n\n${cv}` },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 4000,
    });

    const finishReason = completion.choices[0]?.finish_reason;
    if (finishReason === 'length') {
      console.warn('[AI parse-cv] response truncated (finish_reason=length)');
    }

    const raw = completion.choices[0]?.message?.content ?? '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error('[AI parse-cv] JSON parse failed, raw:', raw.slice(0, 200));
      return res.status(500).json({ error: 'תשובת ה-AI נחתכה — נסי שוב עם קורות חיים קצרים יותר.' });
    }
    const toStr = (v) => (typeof v === 'string' ? v : '');

    res.json({
      targetRoles: toStr(parsed.targetRoles),
      targetCategories: toStr(parsed.targetCategories),
      skills: toStr(parsed.skills),
      technologies: toStr(parsed.technologies),
      tools: toStr(parsed.tools),
      projectsSummary: toStr(parsed.projectsSummary),
      experienceSummary: toStr(parsed.experienceSummary),
      educationSummary: toStr(parsed.educationSummary),
      strengths: toStr(parsed.strengths),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI parse-cv] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── Analyze GitHub Projects ──────────────────────────────────────────────────

app.post('/api/ai/analyze-projects', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OPENAI_API_KEY לא הוגדר.' });
  }

  const { repos = [] } = req.body ?? {};

  if (!Array.isArray(repos) || repos.length === 0) {
    return res.status(400).json({ error: 'נדרש מערך repos.' });
  }

  const limited = repos.slice(0, 20);

  const repoList = limited
    .map((r) => {
      const lang = r.language ? ` [${r.language}]` : '';
      const desc = r.description ? `: ${r.description}` : ': (ללא תיאור)';
      return `- ${r.name}${lang}${desc}`;
    })
    .join('\n');

  const systemPrompt = `אתה מומחה הכנה לראיונות עבודה בהייטק בישראל.
קבל רשימת פרויקטים מ-GitHub וצור לכל פרויקט ניתוח ושאלות ראיון.
החזר JSON בלבד עם המבנה:
{
  "projects": [
    {
      "name": string,
      "simpleExplanation": string,
      "interviewTip": string,
      "questions": [...]
    }
  ]
}

לכל פרויקט:
- name: שם הפרויקט בדיוק כפי שהופיע
- simpleExplanation: הסבר בשפה פשוטה ובעברית מה הפרויקט עושה, מה הבעיה שהוא פותר, ואיזה טכנולוגיות נראות מהשם/תיאור (3-5 משפטים, ברמת הסבר לאדם שאינו מתכנת)
- interviewTip: איך להציג את הפרויקט בראיון — מה להדגיש, אילו שאלות עשויות לעלות עליו, ואיך לענות על "ספר לי על הפרויקט הזה" (2-3 משפטים)
- questions: 2-3 שאלות ראיון ספציפיות לפרויקט הזה

כל שאלה ב-questions:
{
  "question": string,
  "shortAnswer": string,
  "simpleExplanation": string,
  "example": string,
  "whatToMention": string[],
  "commonMistakes": string[],
  "tags": string[],
  "category": "Projects",
  "topic": string,
  "difficulty": "basic"|"intermediate"|"advanced"
}

חוקים לשאלות:
- question: שאלות כמו "ספר על פרויקט X", "מה בעיה פתר פרויקט X?", "מה למדת מ-X?", "למה בחרת ב-[טכנולוגיה] ב-X?"
- shortAnswer: תשובה לדוגמה שאפשר להתאים (1-2 משפטים)
- topic: שם הפרויקט
- tags: [שם הפרויקט, שפה, נושאים רלוונטיים]
- הכל בעברית, שמות טכנולוגיות ופרויקטים — בלועזית
- החזר JSON בלבד`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `פרויקטים מ-GitHub לניתוח:\n${repoList}` },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 6000,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: 'תשובת ה-AI נחתכה — נסה שוב עם פחות פרויקטים.' });
    }

    const projectsRaw = Array.isArray(parsed.projects) ? parsed.projects : [];

    const projects = projectsRaw.map((p) => ({
      name: String(p.name ?? ''),
      simpleExplanation: String(p.simpleExplanation ?? ''),
      interviewTip: String(p.interviewTip ?? ''),
    }));

    const questions = projectsRaw.flatMap((p) =>
      Array.isArray(p.questions)
        ? p.questions.map((q) => ({
            question: String(q.question ?? ''),
            shortAnswer: String(q.shortAnswer ?? ''),
            simpleExplanation: String(q.simpleExplanation ?? ''),
            example: String(q.example ?? ''),
            whatToMention: Array.isArray(q.whatToMention) ? q.whatToMention.map(String) : [],
            commonMistakes: Array.isArray(q.commonMistakes) ? q.commonMistakes.map(String) : [],
            tags: Array.isArray(q.tags) ? q.tags.map(String) : [],
            category: 'Projects',
            topic: String(p.name ?? q.topic ?? 'פרויקט'),
            difficulty: VALID_DIFFICULTIES.includes(q.difficulty) ? q.difficulty : 'intermediate',
          }))
        : []
    );

    res.json({ projects, questions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI analyze-projects] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── Personal Interview Prep ──────────────────────────────────────────────────

app.post('/api/ai/personal-interview-prep', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OPENAI_API_KEY לא הוגדר.' });
  }

  const { profileSummary = '' } = req.body ?? {};

  const profile = String(profileSummary || '').slice(0, 3000);

  const systemPrompt = `אתה מאמן ראיונות עבודה מנוסה בישראל.
קבל פרופיל מועמד וצור שאלות ראיון אישי/התנהגותי מותאמות אישית.
החזר JSON בלבד עם מפתח "questions" שמכיל מערך שאלות.

כל שאלה:
{
  "question": string,
  "type": "behavioral"|"motivational"|"situational"|"personal",
  "suggestedAnswer": string,
  "tips": string[],
  "followUpQuestions": string[]
}

חוקים:
- צור 10-14 שאלות מגוונות
- שאלות חובה: "ספרי על עצמך", "למה אתה עוזב/ת את מקום העבודה הנוכחי/ת", "חוזקה בולטת", "חולשה שאתה עובד עליה", "למה את/ה רוצה את התפקיד הזה"
- suggestedAnswer: תשובה לדוגמה מפורטת ומבוססת על הפרופיל שסופק (4-6 משפטים, גוף ראשון)
- tips: 2-4 טיפים ספציפיים מה להדגיש בתשובה
- followUpQuestions: 2-3 שאלות המשך אפשריות מהמראיין
- אם סופק פרופיל — התאם את suggestedAnswer לניסיון האמיתי
- אם לא סופק פרופיל — כתב תשובה כללית שהמועמד יוכל להתאים
- הכל בעברית
- החזר JSON בלבד`;

  const userContent = profile
    ? `פרופיל מועמד:\n${profile}\n\nצור שאלות ראיון אישי מותאמות לפרופיל זה.`
    : 'צור שאלות ראיון אישי כלליות (לא סופק פרופיל).';

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 5000,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: 'תשובת ה-AI נחתכה — נסה שוב.' });
    }

    const VALID_TYPES = ['behavioral', 'motivational', 'situational', 'personal'];
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions.map((q) => ({
          question: String(q.question ?? ''),
          type: VALID_TYPES.includes(q.type) ? q.type : 'personal',
          suggestedAnswer: String(q.suggestedAnswer ?? ''),
          tips: Array.isArray(q.tips) ? q.tips.map(String) : [],
          followUpQuestions: Array.isArray(q.followUpQuestions) ? q.followUpQuestions.map(String) : [],
        }))
      : [];

    res.json({ questions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI personal-interview-prep] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── Analyze Single Project ───────────────────────────────────────────────────

app.post('/api/ai/analyze-single-project', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OPENAI_API_KEY לא הוגדר.' });
  }

  const { name = '', description = '', language = '' } = req.body ?? {};

  if (!name.trim()) {
    return res.status(400).json({ error: 'שם הפרויקט חסר.' });
  }

  const systemPrompt = `אתה מומחה הכנה לראיונות עבודה בהייטק בישראל.
קבל פרטי פרויקט GitHub ויצור ניתוח מפורט ושאלות ראיון.
החזר JSON בלבד עם המבנה:
{
  "analysis": string,
  "architecture": string,
  "whatWasBuilt": string,
  "technologiesExplained": string,
  "questions": [...]
}

- analysis: הסבר בעברית פשוטה ובגובה העיניים (לאדם שאינו מתכנת) מה הפרויקט עושה, מה הבעיה שהוא פותר, ולמה הוא שימושי. 4-5 משפטים.
- architecture: הסבר קצר על הארכיטקטורה — איך הפרויקט בנוי, מה הרכיבים העיקריים, איך הם מתקשרים. אם השפה היא React/TypeScript — הסבר על קומפוננטים, state, props. אם Python — הסבר על מודולים, פונקציות, ספריות. 3-4 משפטים.
- whatWasBuilt: מה נבנה בפועל — פיצ'רים, עמודים, API, מסד נתונים, לוגיקה. 3-4 משפטים.
- technologiesExplained: הסבר בעברית על כל טכנולוגיה ששימשה — מה היא, למה משתמשים בה, מה תפקידה בפרויקט. רשימה.

questions: 5-7 שאלות ראיון ספציפיות לפרויקט הזה:
{
  "question": string,
  "shortAnswer": string,
  "simpleExplanation": string,
  "example": string,
  "whatToMention": string[],
  "commonMistakes": string[],
  "tags": string[],
  "category": "Projects",
  "topic": string,
  "difficulty": "basic"|"intermediate"|"advanced"
}

- question: שאלות כמו "ספר על הפרויקט X", "למה בחרת ב-[טכנולוגיה]?", "איך בנית את [רכיב]?", "מה הייית משנה?", "מה הקושי הגדול ביותר?"
- shortAnswer: תשובה לדוגמה (2-3 משפטים) שאפשר להתאים לניסיון האישי
- topic: שם הפרויקט בדיוק
- tags: [שם הפרויקט, שפה, נושאים רלוונטיים]
- הכל בעברית, שמות פרויקטים וטכנולוגיות — בלועזית
- החזר JSON בלבד`;

  const userContent = [
    `שם פרויקט: ${name}`,
    language ? `שפה עיקרית: ${language}` : '',
    description ? `תיאור: ${description}` : '(ללא תיאור)',
  ].filter(Boolean).join('\n');

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
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: 'תשובת ה-AI נחתכה — נסה שוב.' });
    }

    const questions = Array.isArray(parsed.questions)
      ? parsed.questions.map((q) => ({
          question: String(q.question ?? ''),
          shortAnswer: String(q.shortAnswer ?? ''),
          simpleExplanation: String(q.simpleExplanation ?? ''),
          example: String(q.example ?? ''),
          whatToMention: Array.isArray(q.whatToMention) ? q.whatToMention.map(String) : [],
          commonMistakes: Array.isArray(q.commonMistakes) ? q.commonMistakes.map(String) : [],
          tags: Array.isArray(q.tags) ? q.tags.map(String) : [],
          category: 'Projects',
          topic: String(q.topic ?? name),
          difficulty: VALID_DIFFICULTIES.includes(q.difficulty) ? q.difficulty : 'intermediate',
        }))
      : [];

    res.json({
      analysis: String(parsed.analysis ?? ''),
      architecture: String(parsed.architecture ?? ''),
      whatWasBuilt: String(parsed.whatWasBuilt ?? ''),
      technologiesExplained: String(parsed.technologiesExplained ?? ''),
      questions,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI analyze-single-project] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── Project Free Q&A ────────────────────────────────────────────────────────

app.post('/api/ai/project-question', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OPENAI_API_KEY לא הוגדר.' });
  }

  const {
    projectName = '',
    description = '',
    language = '',
    analysis = '',
    architecture = '',
    whatWasBuilt = '',
    technologiesExplained = '',
    question = '',
  } = req.body ?? {};

  if (!question.trim()) {
    return res.status(400).json({ error: 'שאלה חסרה.' });
  }

  const context = [
    `שם פרויקט: ${projectName}`,
    language ? `שפה: ${language}` : '',
    description ? `תיאור: ${description}` : '',
    analysis ? `\nמה הפרויקט עושה:\n${analysis}` : '',
    whatWasBuilt ? `\nמה נבנה:\n${whatWasBuilt}` : '',
    architecture ? `\nארכיטקטורה:\n${architecture}` : '',
    technologiesExplained ? `\nטכנולוגיות:\n${technologiesExplained}` : '',
  ].filter(Boolean).join('\n').slice(0, 6000);

  const systemPrompt = `אתה מומחה הכנה לראיונות עבודה בהייטק.
אתה יודע הכל על הפרויקט "${projectName}" לפי המידע שסופק.
ענה בעברית, בצורה ברורה ומפורטת, ספציפית לפרויקט הזה.
אם מדובר בשאלת ראיון — הדגם גם איך לנסח תשובה טובה בראיון.
אם חסר מידע — אמור זאת ונסה לתת תשובה כללית מועילה.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `מידע על הפרויקט:\n${context}\n\nשאלה: ${question.slice(0, 500)}` },
      ],
      max_completion_tokens: 1500,
    });

    const answer = completion.choices[0]?.message?.content ?? '';
    res.json({ answer });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI project-question] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── CV Full Analysis ─────────────────────────────────────────────────────────

app.post('/api/ai/cv-full-analysis', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OPENAI_API_KEY לא הוגדר.' });
  }

  const { profileSummary = '' } = req.body ?? {};
  if (typeof profileSummary !== 'string' || profileSummary.trim().length < 20) {
    return res.status(400).json({ error: 'פרופיל חסר או קצר מדי.' });
  }

  const profile = String(profileSummary).slice(0, 3000);

  const systemPrompt = `אתה מומחה קריירה ישראלי. קבל פרופיל מועמד וצור ניתוח מקיף.
החזר JSON בלבד עם המבנה:
{
  "strengths": string[],
  "areasToImprove": string[],
  "focusPerJobType": [{ "jobType": string, "focus": string }],
  "questions": [...]
}

strengths — 3-5 חוזקות בולטות מהפרופיל
areasToImprove — 3-5 תחומים לחיזוק לפני הראיון
focusPerJobType — למקסימום 4 תחומים רלוונטיים לפרופיל: מה להדגיש בראיון לכל תחום
questions — 8-10 שאלות ראיון שסביר לצפות להן בהתבסס על הפרופיל:
כל שאלה: { question, shortAnswer, simpleExplanation, example, whatToMention: string[], commonMistakes: string[], tags: string[], category, topic, difficulty }
- category: אחת מ: ${VALID_CATEGORIES.join(', ')}
- difficulty: "basic"|"intermediate"|"advanced"
- הכל בעברית`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `פרופיל מועמד:\n${profile}\n\nצור ניתוח מקיף.` },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 6000,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: 'תגובת AI לא תקינה — נסי שוב.' });
    }

    const toStrArr = (v) => (Array.isArray(v) ? v.map(String) : []);
    const strengths = toStrArr(parsed.strengths);
    const areasToImprove = toStrArr(parsed.areasToImprove);
    const focusPerJobType = Array.isArray(parsed.focusPerJobType)
      ? parsed.focusPerJobType.map((f) => ({ jobType: String(f.jobType ?? ''), focus: String(f.focus ?? '') }))
      : [];
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions.map((q) => ({
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

    res.json({ strengths, areasToImprove, focusPerJobType, questions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI cv-full-analysis] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── Personal Answer ──────────────────────────────────────────────────────────

app.post('/api/ai/personal-answer', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OPENAI_API_KEY לא הוגדר.' });
  }

  const { question = '', profileSummary = '' } = req.body ?? {};

  if (typeof question !== 'string' || question.trim().length < 3) {
    return res.status(400).json({ error: 'שאלה קצרה מדי.' });
  }

  const q = String(question).slice(0, 300);
  const profile = String(profileSummary || '').slice(0, 2000);

  const systemPrompt = `אתה מאמן ראיונות עבודה מנוסה בישראל.
קבל שאלת ראיון אישית/התנהגותית ופרופיל מועמד — וצור תשובה מפורטת ומותאמת אישית.
החזר JSON בלבד עם המבנה:
{
  "type": "behavioral"|"motivational"|"situational"|"personal",
  "suggestedAnswer": string,
  "tips": string[],
  "followUpQuestions": string[]
}
- type: סוג השאלה
- suggestedAnswer: תשובה לדוגמה מפורטת ומבוססת על הפרופיל (4-6 משפטים, גוף ראשון)
- tips: 2-4 טיפים ספציפיים מה להדגיש בתשובה
- followUpQuestions: 2 שאלות המשך אפשריות מהמראיין
- אם לא סופק פרופיל — כתב תשובה כללית שהמועמד יוכל להתאים
- הכל בעברית
- החזר JSON בלבד`;

  const userContent = profile
    ? `פרופיל מועמד:\n${profile}\n\nשאלת ראיון: ${q}`
    : `שאלת ראיון: ${q}`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 1500,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: 'תגובת AI לא תקינה.' });
    }

    const VALID_TYPES = ['behavioral', 'motivational', 'situational', 'personal'];
    res.json({
      type: VALID_TYPES.includes(parsed.type) ? parsed.type : 'personal',
      suggestedAnswer: String(parsed.suggestedAnswer ?? ''),
      tips: Array.isArray(parsed.tips) ? parsed.tips.map(String) : [],
      followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions.map(String) : [],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    console.error('[AI personal-answer] error:', msg);
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── Salary Estimate ──────────────────────────────────────────────────────────

app.post('/api/ai/salary-estimate', async (req, res) => {
  if (!openai) return res.status(503).json({ error: 'AI לא זמין' });

  const { roleTitle = '', category = '', location = '' } = req.body ?? {};
  const title = String(roleTitle).trim().slice(0, 200);
  if (title.length < 2) return res.status(400).json({ error: 'שם תפקיד חסר' });

  const systemPrompt = `אתה מומחה שכר ותעסוקה בהייטק הישראלי.
קבל תפקיד ופרטים ותחשב טווח שכר ריאלי לפי שוק ישראל.
החזר JSON בלבד: { "estimate": string }
- estimate: טווח שכר חודשי ברוטו לג'וניור עם עד שנה ניסיון
- פורמט לדוגמה: "12,000–16,000 ₪ ברוטו לחודש — טווח שוק לג'וניור Frontend בתל אביב"
- הבסס על נתוני שוק הייטק ישראלי עדכניים
- אם המיקום לא ידוע — השתמש בממוצע ארצי
- הכל בעברית`;

  const userContent = [
    `תפקיד: ${title}`,
    category ? `קטגוריה: ${category}` : '',
    location ? `מיקום: ${location}` : 'מיקום: לא צוין',
    'רמה: ג\'וניור, עד שנה ניסיון',
  ].filter(Boolean).join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 150,
    });
    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);
    res.json({ estimate: String(parsed.estimate ?? '') });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה';
    res.status(500).json({ error: `שגיאת AI: ${msg}` });
  }
});

// ─── Company Info ─────────────────────────────────────────────────────────────

app.post('/api/ai/company-info', async (req, res) => {
  if (!openai) return res.status(503).json({ error: 'AI לא זמין' });

  const { companyName = '' } = req.body ?? {};
  const name = String(companyName).trim().slice(0, 100);
  if (name.length < 2) return res.status(400).json({ error: 'שם חברה קצר מדי' });

  const systemPrompt = `אתה עוזר לחיפוש עבודה בישראל. קבל שם חברה וכתוב תיאור קצר בעברית.
החזר JSON בלבד: { "summary": string }
- summary: 2-3 משפטים קצרים — מה החברה עושה, תחום, גודל אם ידוע
- אם החברה לא מוכרת — כתב "לא נמצא מידע על חברה זו"
- אין פרטים אישיים. הכל בעברית.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `שם חברה: ${name}` },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 250,
    });
    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);
    res.json({ summary: String(parsed.summary ?? '') });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'שגיאה';
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
