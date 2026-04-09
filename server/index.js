import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve built frontend in production
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Script Generation ───────────────────────────────────────────────
app.post('/api/generate-script', async (req, res) => {
  try {
    const { caseData, options } = req.body;
    const { style, sections, tone, duration, includeTimestamps, includeSources } = options;

    const prompt = `You are a professional true crime script writer. Generate a complete, production-ready script for the following case.

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
- **Tags:** ${(caseData.tags || []).join(', ')}

## Script Requirements
- **Style:** ${style}
- **Tone:** ${tone}
- **Target Duration:** ${duration} minutes (~${duration * 150} words)
- **Include Timestamps:** ${includeTimestamps ? 'Yes, add [MM:SS] timestamps at each section' : 'No'}
- **Include Source Placeholders:** ${includeSources ? 'Yes, add [SOURCE: ...] notes where citations should go' : 'No'}

## Sections to Include (in this order):
${sections.join(', ')}

## Style Guide
${style === 'podcast-casual' ? 'Write in a warm, conversational tone as if talking to a friend. Use natural language, occasional humor (where appropriate), and direct address ("you guys", "so here\'s the thing"). Start with a casual but gripping hook.' :
  style === 'podcast-deep' ? 'Write in an analytical, investigative tone. Be thorough with evidence analysis, cite specific details, and present multiple theories objectively. This is for a serious true crime audience that wants depth.' :
  style === 'documentary' ? 'Write in a cinematic narration style. Include direction cues like [AMBIENT SOUND], [VISUAL], [MUSIC CUE]. Build tension through pacing. Use vivid, atmospheric descriptions.' :
  style === 'youtube' ? 'Write with high engagement in mind. Start with a strong hook, use chapter markers, include calls to action. Break complex info into digestible segments. Reference visuals and on-screen elements.' :
  style === 'news-report' ? 'Write in formal journalistic style. Use inverted pyramid structure, attribute all claims, maintain objectivity. Include [ANCHOR], [REPORTER], and [SOUND BITE] cues.' :
  'Write in a literary narrative style. Use vivid prose, atmospheric scene-setting, and dramatic tension. Build the story like a chapter from a true crime book.'}

## Important Guidelines
- Treat the victim(s) with respect and humanity — never sensationalize their suffering
- Present facts accurately based on the case information provided
- For unsolved cases, present theories without making definitive claims
- Include content warnings where appropriate
- Make the script engaging while remaining ethical

Write the complete script now. Make it compelling, well-researched, and ready for production.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0].text;
    const wordCount = content.split(/\s+/).length;

    res.json({
      content,
      metadata: {
        style,
        tone,
        wordCount,
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

    const prompt = `You are a podcast producer creating professional show notes for a true crime episode.

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
- **Tags:** ${(caseData.tags || []).join(', ')}

## Episode Format: ${template.name} (${template.duration})

Generate professional podcast show notes in Markdown format that include:

1. **Episode Title** — catchy but respectful
2. **Episode Description** — 2-3 compelling paragraphs for podcast platforms
3. **Key Facts** — bullet-pointed case overview
4. **Detailed Timeline** — chronological events
5. **Evidence Summary** — what investigators found
6. **Suspects/Persons of Interest** — with context for each
7. **Discussion Points** — 5-7 thought-provoking questions for the episode
8. **Trigger/Content Warnings** — appropriate warnings for listeners
9. **Keywords/Tags** — for SEO and discoverability
10. **Suggested Further Reading** — types of sources listeners could explore

Make the show notes comprehensive, engaging, and useful both for the host during recording and for listeners after the episode.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ content: message.content[0].text });
  } catch (error) {
    console.error('Show notes error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate show notes' });
  }
});

// ─── Case Research / Deep Search ─────────────────────────────────────
app.post('/api/research-case', async (req, res) => {
  try {
    const { caseData, researchType } = req.body;

    const prompts = {
      'deep-dive': `You are an expert true crime researcher. Provide a comprehensive deep-dive analysis of ${caseData.title}.

Case info: ${caseData.summary} ${caseData.details}

Cover these areas in detail:
1. **Complete Background** — full context of the crime, the era, the location
2. **Victim Profile** — everything known about ${caseData.victim}
3. **Detailed Timeline** — expand on known events with context
4. **Evidence Analysis** — evaluate each piece of evidence: ${(caseData.evidence || []).join(', ')}
5. **Suspect Analysis** — for each suspect (${(caseData.suspects || []).join(', ')}), discuss motive, means, opportunity, and evidence for/against
6. **Investigative Failures/Successes** — what went right and wrong
7. **Theories** — present the major theories with evidence supporting each
8. **Modern Forensic Potential** — could modern technology solve/advance this case?
9. **Cultural Impact** — how this case affected law enforcement, legislation, or public awareness
10. **Current Status** — latest developments

Be thorough, factual, and analytical. Present multiple perspectives where applicable.`,

      'suspect-profile': `You are a criminal profiler. Create detailed profiles for each suspect/person of interest in ${caseData.title}.

Case context: ${caseData.summary}
Suspects: ${(caseData.suspects || []).join(', ')}

For each person, analyze:
1. Background and connection to the case
2. Motive (potential or proven)
3. Means and opportunity
4. Evidence linking them to the crime
5. Evidence exonerating them
6. Behavioral analysis
7. Current status (convicted, cleared, deceased, etc.)
8. Expert opinions and public theories about their involvement

Be objective and analytical. Present facts, not speculation.`,

      'evidence-analysis': `You are a forensic analyst. Provide a detailed analysis of the evidence in ${caseData.title}.

Case: ${caseData.summary}
Evidence items: ${(caseData.evidence || []).join(', ')}

For each piece of evidence:
1. What it is and where/how it was found
2. What it tells us (or could tell us) about the crime
3. How it was processed and analyzed
4. Any controversies about its handling or interpretation
5. How modern forensic technology might yield new insights
6. Its significance in the overall investigation

Also discuss:
- Evidence that may have been overlooked or lost
- Chain of custody issues
- How forensic science has evolved since this case`,

      'theories': `You are a true crime analyst. Present and evaluate all major theories about ${caseData.title}.

Case context: ${caseData.summary} ${caseData.details}
Suspects: ${(caseData.suspects || []).join(', ')}
Evidence: ${(caseData.evidence || []).join(', ')}

For each major theory:
1. **Theory Name/Summary** — clear statement of what the theory proposes
2. **Supporting Evidence** — specific evidence and reasoning that supports it
3. **Contradicting Evidence** — what doesn't fit this theory
4. **Key Proponents** — who believes this theory and why
5. **Plausibility Rating** — your assessment of how likely this theory is
6. **Unanswered Questions** — what this theory fails to explain

Present at least 3-5 distinct theories. Be objective and analytical.`,
    };

    const prompt = prompts[researchType] || prompts['deep-dive'];

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ content: message.content[0].text, researchType });
  } catch (error) {
    console.error('Research error:', error);
    res.status(500).json({ error: error.message || 'Failed to research case' });
  }
});

// ─── Case Chat / Ask Questions ───────────────────────────────────────
app.post('/api/case-chat', async (req, res) => {
  try {
    const { caseData, question, history } = req.body;

    const systemPrompt = `You are a knowledgeable true crime research assistant integrated into CrimeCase Hub. You specialize in ${caseData.title}.

Here is everything you know about this case:
- **Title:** ${caseData.title}
- **Victim(s):** ${caseData.victim}
- **Type:** ${caseData.type}
- **Status:** ${caseData.status}
- **Date:** ${caseData.date}
- **Location:** ${caseData.location}
- **Summary:** ${caseData.summary}
- **Details:** ${caseData.details}
- **Suspects:** ${(caseData.suspects || []).join(', ')}
- **Evidence:** ${(caseData.evidence || []).join(', ')}
- **Timeline:** ${(caseData.timeline || []).map(e => `${e.date}: ${e.event}`).join(' | ')}
- **Tags:** ${(caseData.tags || []).join(', ')}

Answer questions about this case thoroughly and accurately. If something isn't known, say so. Be respectful of victims. Distinguish between established facts and theories/speculation.`;

    const messages = [
      ...(history || []),
      { role: 'user', content: question },
    ];

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages,
    });

    res.json({ answer: message.content[0].text });
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

    const prompt = `You are an exhaustive true crime research database. The user is searching for: "${query}"

Return a JSON array of up to 8 real criminal cases that match this search.

CRITICAL RULES:
- Include a MIX of well-known AND lesser-known cases. Do NOT only return famous cases.
- Include local/regional cases, not just nationally famous ones
- Every case MUST be real and documented with verifiable facts
- For each case, include real associated media: actual documentary names, real news outlet coverage, real YouTube channels that covered it, real podcast episodes about it
- Include cases that have actual news articles, videos, and documentaries available online

JSON structure (return ONLY valid JSON, no markdown fences, no extra text):
[
  {
    "id": ${searchIdCounter},
    "title": "<official case name>",
    "victim": "<victim name(s) and count>",
    "type": "<one of: Murder, Serial Killer, Kidnapping, Missing Person, Cold Case, Robbery, Fraud, Cybercrime, Organized Crime, Wrongful Conviction, Domestic Violence, Arson, Sexual Assault, White Collar Crime, Drug Trafficking, Mass Shooting, Terrorism, Cult Crime, Historical Crime, Heist>",
    "status": "<one of: Solved, Unsolved, Cold Case, Active, Reopened>",
    "date": "<YYYY-MM-DD>",
    "location": "<City, State/Country>",
    "summary": "<3-4 sentence factual summary covering what happened, who was involved, and current status>",
    "details": "<detailed 2-3 paragraph account of the case with specific facts, investigation details, and outcome>",
    "suspects": ["<name (status)>"],
    "evidence": ["<specific evidence item 1>", "<item 2>", "<item 3>", "<item 4>"],
    "timeline": [
      {"date": "<YYYY-MM-DD>", "event": "<specific event>"},
      {"date": "<YYYY-MM-DD>", "event": "<specific event>"},
      {"date": "<YYYY-MM-DD>", "event": "<specific event>"},
      {"date": "<YYYY-MM-DD>", "event": "<specific event>"},
      {"date": "<YYYY-MM-DD>", "event": "<specific event>"}
    ],
    "tags": ["<tag1>", "<tag2>", "<tag3>", "<tag4>"],
    "notoriety": <1-5 where 1 is local/obscure and 5 is world-famous>,
    "mediaCount": {"articles": <realistic number>, "videos": <realistic number>, "images": <realistic number>},
    "media": {
      "documentaries": ["<real documentary name (year, platform)>"],
      "podcasts": ["<real podcast name — episode title>"],
      "youtubeChannels": ["<real channel that covered this>"],
      "newsOutlets": ["<real news outlet that reported on this>"],
      "books": ["<real book title by author>"]
    }
  }
]

Increment the id for each case starting from ${searchIdCounter}.
Include at least 2-3 cases with notoriety 1-3 (lesser known).
Every case MUST have at least 5 timeline events and 4 evidence items.`;

    searchIdCounter += 10;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    let text = message.content[0].text.trim();
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

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ai: 'Claude (Anthropic)', model: 'claude-sonnet-4-6' });
});

// Serve frontend for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🔴 CrimeCase Hub running at http://localhost:${PORT}`);
  console.log(`  ✓ Claude AI integration active\n`);
});
