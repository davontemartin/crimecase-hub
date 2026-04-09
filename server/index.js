import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(systemPrompt, userPrompt, maxTokens = 4000) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  return res.choices[0].message.content;
}

async function chatWithHistory(systemPrompt, messages, maxTokens = 2000) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });
  return res.choices[0].message.content;
}

// ─── Script Generation ───────────────────────────────────────────────
app.post('/api/generate-script', async (req, res) => {
  try {
    const { caseData, options } = req.body;
    const { style, sections, tone, duration, includeTimestamps, includeSources } = options;

    const system = `You are a professional true crime script writer. You write compelling, production-ready scripts for podcasts, documentaries, and YouTube videos. Treat victims with respect. Present facts accurately.`;

    const prompt = `Generate a complete, production-ready script for the following case.

## Case Information
- **Title:** ${caseData.title}
- **Victim(s):** ${caseData.victim}
- **Crime Type:** ${caseData.type}
- **Status:** ${caseData.status}
- **Date:** ${caseData.date}
- **Location:** ${caseData.location}
- **Summary:** ${caseData.summary}
- **Details:** ${caseData.details}
- **Suspects:** ${(caseData.suspects || []).join(', ')}
- **Key Evidence:** ${(caseData.evidence || []).join(', ')}
- **Timeline:** ${(caseData.timeline || []).map(e => `${e.date}: ${e.event}`).join(' | ')}

## Script Requirements
- **Style:** ${style}
- **Tone:** ${tone}
- **Target Duration:** ${duration} minutes (~${duration * 150} words)
- **Include Timestamps:** ${includeTimestamps ? 'Yes, add [MM:SS] timestamps at each section' : 'No'}
- **Include Source Placeholders:** ${includeSources ? 'Yes' : 'No'}
- **Sections:** ${sections.join(', ')}

## Style Guide
${style === 'podcast-casual' ? 'Warm, conversational tone. Natural language, direct address.' :
  style === 'podcast-deep' ? 'Analytical, investigative. Thorough evidence analysis, multiple theories.' :
  style === 'documentary' ? 'Cinematic narration. Include [AMBIENT SOUND], [VISUAL], [MUSIC CUE] direction cues.' :
  style === 'youtube' ? 'High engagement. Strong hook, chapter markers, calls to action.' :
  style === 'news-report' ? 'Formal journalistic. Inverted pyramid, attribution, [ANCHOR]/[REPORTER] cues.' :
  'Literary narrative. Vivid prose, atmospheric scene-setting, dramatic tension.'}

Write the complete script now.`;

    const content = await chat(system, prompt, 8000);
    const wordCount = content.split(/\s+/).length;

    res.json({
      content,
      metadata: {
        style, tone, wordCount,
        estimatedDuration: Math.ceil(wordCount / 150),
        sectionCount: sections.length,
        generatedAt: new Date().toISOString(),
        aiGenerated: true,
      }
    });
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate script' });
  }
});

// ─── Show Notes Generation ───────────────────────────────────────────
app.post('/api/generate-show-notes', async (req, res) => {
  try {
    const { caseData, template } = req.body;

    const system = `You are a podcast producer creating professional show notes for true crime episodes.`;

    const prompt = `Create show notes for a ${template.name} episode (${template.duration}) about ${caseData.title}.

Case: ${caseData.summary} ${caseData.details}
Victim: ${caseData.victim} | Type: ${caseData.type} | Status: ${caseData.status}
Date: ${caseData.date} | Location: ${caseData.location}
Suspects: ${(caseData.suspects || []).join(', ')}
Evidence: ${(caseData.evidence || []).join(', ')}
Timeline: ${(caseData.timeline || []).map(e => `${e.date}: ${e.event}`).join(' | ')}

Include: Episode Title, Description (2-3 paragraphs), Key Facts, Timeline, Evidence Summary, Suspects, Discussion Points (5-7), Content Warnings, Keywords/Tags, Further Reading suggestions. Format in Markdown.`;

    const content = await chat(system, prompt, 4000);
    res.json({ content });
  } catch (error) {
    console.error('Show notes error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate show notes' });
  }
});

// ─── Case Research / Deep Search ─────────────────────────────────────
app.post('/api/research-case', async (req, res) => {
  try {
    const { caseData, researchType } = req.body;

    const system = `You are an expert true crime researcher and analyst. Provide thorough, factual, well-sourced analysis. Be objective. Distinguish facts from theories.`;

    const prompts = {
      'deep-dive': `Provide a comprehensive deep-dive analysis of ${caseData.title}.\n\nCase: ${caseData.summary} ${caseData.details}\nSuspects: ${(caseData.suspects || []).join(', ')}\nEvidence: ${(caseData.evidence || []).join(', ')}\n\nCover: Complete Background, Victim Profile, Expanded Timeline, Evidence Analysis, Suspect Analysis (motive/means/opportunity for each), Investigative Failures/Successes, Major Theories, Modern Forensic Potential, Cultural Impact, Current Status.`,

      'suspect-profile': `Create detailed profiles for each suspect in ${caseData.title}.\nCase: ${caseData.summary}\nSuspects: ${(caseData.suspects || []).join(', ')}\n\nFor each: Background, Motive, Means & Opportunity, Evidence for/against, Behavioral analysis, Current status, Expert opinions.`,

      'evidence-analysis': `Analyze all evidence in ${caseData.title}.\nCase: ${caseData.summary}\nEvidence: ${(caseData.evidence || []).join(', ')}\n\nFor each item: What it is, significance, how it was processed, controversies, modern forensic potential. Also discuss overlooked evidence and chain of custody issues.`,

      'theories': `Present and evaluate all major theories about ${caseData.title}.\nCase: ${caseData.summary} ${caseData.details}\nSuspects: ${(caseData.suspects || []).join(', ')}\nEvidence: ${(caseData.evidence || []).join(', ')}\n\nFor each theory: Summary, Supporting Evidence, Contradicting Evidence, Key Proponents, Plausibility Rating, Unanswered Questions. Present at least 3-5 theories.`,
    };

    const content = await chat(system, prompts[researchType] || prompts['deep-dive'], 6000);
    res.json({ content, researchType });
  } catch (error) {
    console.error('Research error:', error);
    res.status(500).json({ error: error.message || 'Failed to research case' });
  }
});

// ─── Case Chat / Ask Questions ───────────────────────────────────────
app.post('/api/case-chat', async (req, res) => {
  try {
    const { caseData, question, history } = req.body;

    const systemPrompt = `You are a knowledgeable true crime research assistant. You specialize in ${caseData.title}.

Case data:
- Title: ${caseData.title} | Victim: ${caseData.victim} | Type: ${caseData.type}
- Status: ${caseData.status} | Date: ${caseData.date} | Location: ${caseData.location}
- Summary: ${caseData.summary}
- Details: ${caseData.details}
- Suspects: ${(caseData.suspects || []).join(', ')}
- Evidence: ${(caseData.evidence || []).join(', ')}
- Timeline: ${(caseData.timeline || []).map(e => `${e.date}: ${e.event}`).join(' | ')}

Answer thoroughly and accurately. Say when something isn't known. Be respectful of victims. Distinguish facts from theories.`;

    const messages = [
      ...(history || []),
      { role: 'user', content: question },
    ];

    const answer = await chatWithHistory(systemPrompt, messages);
    res.json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to get answer' });
  }
});

// ─── Live Case Search ────────────────────────────────────────────────
let searchIdCounter = 1000;

app.post('/api/search-case', async (req, res) => {
  try {
    const { query } = req.body;

    const system = `You are a true crime database API. You return ONLY valid JSON arrays. No markdown, no code fences, no extra text — just the JSON array.`;

    const prompt = `Search for real criminal cases matching: "${query}"

Return a JSON array of up to 8 real, documented criminal cases.

RULES:
- Mix of well-known AND lesser-known/local cases
- Every case must be REAL with verifiable facts
- Include real media: actual documentary names, real podcast episodes, real YouTube channels, real news outlets, real books
- Cases must have actual coverage available online

JSON structure:
[
  {
    "id": ${searchIdCounter},
    "title": "official case name",
    "victim": "victim name(s)",
    "type": "one of: Murder|Serial Killer|Kidnapping|Missing Person|Cold Case|Robbery|Fraud|Cybercrime|Organized Crime|Wrongful Conviction|Domestic Violence|Arson|Sexual Assault|White Collar Crime|Drug Trafficking|Mass Shooting|Terrorism|Cult Crime|Historical Crime|Heist",
    "status": "one of: Solved|Unsolved|Cold Case|Active|Reopened",
    "date": "YYYY-MM-DD",
    "location": "City, State/Country",
    "summary": "3-4 sentence factual summary",
    "details": "detailed 2-3 paragraph account",
    "suspects": ["name (status)"],
    "evidence": ["item1", "item2", "item3", "item4"],
    "timeline": [
      {"date": "YYYY-MM-DD", "event": "what happened"},
      {"date": "YYYY-MM-DD", "event": "what happened"},
      {"date": "YYYY-MM-DD", "event": "what happened"},
      {"date": "YYYY-MM-DD", "event": "what happened"},
      {"date": "YYYY-MM-DD", "event": "what happened"}
    ],
    "tags": ["tag1", "tag2", "tag3", "tag4"],
    "notoriety": 1-5,
    "mediaCount": {"articles": 0, "videos": 0, "images": 0},
    "media": {
      "documentaries": ["real doc (year, platform)"],
      "podcasts": ["real podcast — episode"],
      "youtubeChannels": ["real channel"],
      "newsOutlets": ["real outlet"],
      "books": ["real book by author"]
    }
  }
]

Increment id starting from ${searchIdCounter}. Include 2-3 lesser-known cases (notoriety 1-3). At least 5 timeline events and 4 evidence items per case.`;

    searchIdCounter += 10;

    const content = await chat(system, prompt, 8000);

    let text = content.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const cases = JSON.parse(text);
    res.json({ cases, source: 'ai' });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message || 'Failed to search cases' });
  }
});

// ─── Fetch Case Media (YouTube videos, articles, etc.) ──────────────
app.post('/api/case-media', async (req, res) => {
  try {
    const { caseData } = req.body;

    const system = `You are a media research assistant. Return ONLY valid JSON, no markdown fences, no extra text.`;

    const prompt = `Find real, currently available media about the true crime case: "${caseData.title}"

Case context: ${caseData.summary}

Return JSON with REAL, EXISTING media that can actually be found online right now:
{
  "youtubeVideos": [
    {
      "title": "exact real video title",
      "channel": "real channel name",
      "description": "1 sentence about the video",
      "searchQuery": "exact YouTube search query to find this video"
    }
  ],
  "documentaries": [
    {
      "title": "exact documentary title",
      "year": 2020,
      "platform": "Netflix/HBO/Hulu/Amazon/YouTube/etc",
      "description": "1 sentence description"
    }
  ],
  "podcasts": [
    {
      "show": "exact podcast name",
      "episode": "exact episode title or number",
      "description": "1 sentence about the episode"
    }
  ],
  "articles": [
    {
      "title": "real article headline",
      "source": "real publication name",
      "year": 2023,
      "description": "1 sentence summary"
    }
  ],
  "books": [
    {
      "title": "exact book title",
      "author": "real author name",
      "year": 2020,
      "description": "1 sentence about the book"
    }
  ],
  "images": [
    {
      "title": "descriptive title of what the image shows",
      "type": "one of: Crime Scene|Evidence|Mugshot|Victim Photo|Location|Court|Document|Composite Sketch|Map|Memorial",
      "description": "what this image shows and its significance to the case",
      "searchQuery": "exact Google Images search query to find this specific image",
      "source": "where this image originates from (e.g. FBI, police department, news outlet)",
      "sensitive": false
    }
  ]
}

RULES:
- Only include media that ACTUALLY EXISTS and can be found with a web search
- Include 3-5 YouTube videos, 2-4 documentaries, 3-5 podcasts, 3-5 articles, 1-3 books
- Include 5-8 images that are REAL and PUBLICLY AVAILABLE (not behind paywalls)
- For images, include a mix of types: crime scene photos, evidence photos, mugshots, location photos, court sketches, maps, composite sketches, documents, etc.
- Mark sensitive images (graphic crime scene photos) with "sensitive": true
- For YouTube videos, the searchQuery must find the actual video when searched on YouTube
- For images, the searchQuery must find the actual image when searched on Google Images
- Include a mix of major outlets and smaller true crime creators`;

    const content = await chat(system, prompt, 4000);

    let text = content.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const media = JSON.parse(text);
    res.json(media);
  } catch (error) {
    console.error('Media fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch media' });
  }
});

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ai: 'OpenAI', model: 'gpt-4o' });
});

// SPA fallback (Express 5 wildcard syntax)
app.get('/{*splat}', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🔴 CrimeCase Hub running at http://localhost:${PORT}`);
  console.log(`  ✓ OpenAI (GPT-4o) integration active\n`);
});
