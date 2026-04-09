export const scriptStyles = [
  { id: 'documentary', name: 'Documentary Narration', icon: 'Film', description: 'Serious, fact-driven narration style like Netflix documentaries' },
  { id: 'podcast-casual', name: 'Casual Podcast', icon: 'Mic', description: 'Conversational tone for casual true crime podcasts' },
  { id: 'podcast-deep', name: 'Deep Dive Podcast', icon: 'Search', description: 'Detailed investigative analysis with evidence breakdown' },
  { id: 'youtube', name: 'YouTube Video', icon: 'Video', description: 'Engaging, visual-focused script with hooks and chapters' },
  { id: 'news-report', name: 'News Report', icon: 'Newspaper', description: 'Formal journalistic style with attribution' },
  { id: 'storytelling', name: 'Narrative Storytelling', icon: 'BookOpen', description: 'Dramatic narrative that reads like true crime literature' },
];

export const scriptSections = [
  { id: 'hook', name: 'Cold Open / Hook', required: true },
  { id: 'intro', name: 'Introduction', required: true },
  { id: 'background', name: 'Background & Context', required: true },
  { id: 'victim-profile', name: 'Victim Profile', required: false },
  { id: 'crime-scene', name: 'Crime Scene Details', required: true },
  { id: 'investigation', name: 'Investigation', required: true },
  { id: 'suspects', name: 'Suspects & Persons of Interest', required: false },
  { id: 'evidence', name: 'Evidence Breakdown', required: false },
  { id: 'timeline', name: 'Timeline of Events', required: true },
  { id: 'theories', name: 'Theories & Analysis', required: false },
  { id: 'trial', name: 'Trial & Legal Proceedings', required: false },
  { id: 'resolution', name: 'Resolution / Current Status', required: true },
  { id: 'impact', name: 'Cultural Impact & Legacy', required: false },
  { id: 'outro', name: 'Conclusion / Call to Action', required: true },
];

export const toneOptions = [
  'Serious & Respectful',
  'Investigative & Analytical',
  'Dramatic & Suspenseful',
  'Empathetic & Victim-Centered',
  'Conversational & Accessible',
  'Dark & Atmospheric',
];

export function generateScript(caseData, options) {
  const { style, sections, tone, duration, includeTimestamps, includeSources } = options;

  const styleConfig = scriptStyles.find(s => s.id === style) || scriptStyles[0];
  const selectedSections = scriptSections.filter(s => sections.includes(s.id));

  let script = '';
  let timestamp = 0;
  const avgWordsPerMinute = 150;
  const targetWords = duration * avgWordsPerMinute;
  const wordsPerSection = Math.floor(targetWords / selectedSections.length);

  const formatTimestamp = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `[${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}]`;
  };

  selectedSections.forEach((section, index) => {
    if (includeTimestamps) {
      script += `${formatTimestamp(timestamp)}\n`;
    }

    script += `\n--- ${section.name.toUpperCase()} ---\n\n`;

    switch (section.id) {
      case 'hook':
        if (style === 'podcast-casual') {
          script += `Hey everyone, welcome back to the show. Today we're diving into a case that has haunted investigators for ${getYearsSince(caseData.date)} years — ${caseData.title}.\n\n`;
          script += `Before we get started, I just want to say — this is a real case involving real people. We approach this with respect for the victims and their families.\n\n`;
        } else if (style === 'documentary') {
          script += `[AMBIENT SOUND: ${getAmbientSound(caseData)}]\n\n`;
          script += `${caseData.location}. ${formatDate(caseData.date)}.\n\n`;
          script += `What happened that night would become one of the most ${caseData.status === 'Unsolved' ? 'baffling unsolved mysteries' : 'shocking criminal cases'} in American history.\n\n`;
        } else if (style === 'youtube') {
          script += `[THUMBNAIL TEXT: "${caseData.title}"]\n\n`;
          script += `What if I told you that ${caseData.status === 'Unsolved' ? 'after all these years, we still don\'t know who did this' : 'the truth behind this case is more disturbing than anyone imagined'}?\n\n`;
          script += `This is the story of ${caseData.title}. And trust me — you\'re going to want to stick around for this one.\n\n`;
        } else if (style === 'storytelling') {
          script += `The night was ${getAtmosphericOpener(caseData)}.\n\n`;
          script += `No one in ${caseData.location} could have known that within hours, their community would be changed forever. This is the story of ${caseData.title} — a case that would ${caseData.status === 'Unsolved' ? 'remain unanswered for decades' : 'eventually reveal a darkness no one expected'}.\n\n`;
        } else if (style === 'news-report') {
          script += `[ANCHOR LEAD]\n\n`;
          script += `Good evening. Tonight, we revisit ${caseData.title} — a case that first made headlines on ${formatDate(caseData.date)} in ${caseData.location}. ${caseData.summary.split('.')[0]}.\n\n`;
        } else {
          script += `${caseData.location}. ${formatDate(caseData.date)}. A case that would ${caseData.status === 'Unsolved' ? 'baffle investigators for decades' : 'eventually shock the nation'}.\n\n`;
          script += `This is the story of ${caseData.title}.\n\n`;
        }
        break;

      case 'intro':
        script += `${caseData.title} refers to the ${caseData.type.toLowerCase()} case involving ${caseData.victim}. `;
        script += `The events took place in ${caseData.location}, beginning on ${formatDate(caseData.date)}.\n\n`;
        script += `${caseData.summary}\n\n`;
        if (style === 'podcast-deep' || style === 'documentary') {
          script += `In this ${style === 'podcast-deep' ? 'episode' : 'documentary'}, we'll examine the evidence, explore the investigation, and analyze what we know — and what we don't — about this case.\n\n`;
        }
        break;

      case 'background':
        script += `To understand ${caseData.title}, we need to look at the broader context.\n\n`;
        script += `The case is classified as a ${caseData.type.toLowerCase()} and took place in ${caseData.location}. `;
        script += `${caseData.details}\n\n`;
        if (caseData.tags && caseData.tags.length > 0) {
          script += `Key themes in this case include: ${caseData.tags.join(', ')}.\n\n`;
        }
        break;

      case 'victim-profile':
        script += `At the center of this case is ${caseData.victim}.\n\n`;
        script += `[RESEARCHER NOTE: Include biographical details about ${caseData.victim} — their life before the crime, their relationships, their aspirations. Remember to humanize the victim beyond the crime itself.]\n\n`;
        if (tone === 'Empathetic & Victim-Centered') {
          script += `It's important that we remember — ${caseData.victim.split('(')[0].trim()} was more than a case number or a headline. They were a person with a life, with people who loved them.\n\n`;
        }
        break;

      case 'crime-scene':
        script += `[${style === 'documentary' ? 'VISUAL: Crime scene photographs, location footage' : 'CONTENT WARNING: The following section contains details about the crime scene.'}]\n\n`;
        script += `${caseData.details}\n\n`;
        if (caseData.evidence && caseData.evidence.length > 0) {
          script += `Key physical evidence found at the scene included:\n`;
          caseData.evidence.forEach(e => {
            script += `  • ${e}\n`;
          });
          script += '\n';
        }
        break;

      case 'investigation':
        script += `The investigation into ${caseData.title} ${caseData.status === 'Solved' ? 'would eventually lead to a breakthrough' : 'remains one of the most challenging in law enforcement history'}.\n\n`;
        script += `[RESEARCHER NOTE: Detail the investigative steps, agencies involved, search warrants, forensic analysis, and any missteps or controversies in the investigation.]\n\n`;
        if (caseData.suspects && caseData.suspects.length > 0) {
          script += `Investigators focused on ${caseData.suspects.length} key persons of interest over the course of the investigation.\n\n`;
        }
        break;

      case 'suspects':
        if (caseData.suspects && caseData.suspects.length > 0) {
          script += `Over the course of the investigation, several individuals came under scrutiny:\n\n`;
          caseData.suspects.forEach((suspect, i) => {
            script += `${i + 1}. **${suspect}**\n`;
            script += `   [RESEARCHER NOTE: Include details about why this person was considered a suspect, their alibi, and any evidence for/against them.]\n\n`;
          });
        } else {
          script += `No specific suspects have been publicly identified in this case.\n\n`;
        }
        break;

      case 'evidence':
        script += `Let's break down the key pieces of evidence in this case:\n\n`;
        if (caseData.evidence) {
          caseData.evidence.forEach((e, i) => {
            script += `**Evidence ${i + 1}: ${e}**\n`;
            script += `[RESEARCHER NOTE: Explain the significance of this evidence, how it was collected, and what it tells us about the case.]\n\n`;
          });
        }
        break;

      case 'timeline':
        script += `Here's the timeline of key events:\n\n`;
        if (caseData.timeline) {
          caseData.timeline.forEach(event => {
            script += `**${formatDate(event.date)}** — ${event.event}\n`;
          });
          script += '\n';
        }
        break;

      case 'theories':
        script += `Several theories have emerged about ${caseData.title}:\n\n`;
        script += `[RESEARCHER NOTE: Present the major theories about the case. For each theory, discuss:\n`;
        script += `  - The evidence supporting the theory\n`;
        script += `  - The evidence contradicting it\n`;
        script += `  - Expert opinions on its validity\n`;
        script += `  - Public reception of the theory]\n\n`;
        if (style === 'podcast-deep') {
          script += `Now, I want to be clear — we're presenting these as theories, not conclusions. The evidence doesn't always point in one clear direction, and that's what makes this case so compelling.\n\n`;
        }
        break;

      case 'trial':
        if (caseData.status === 'Solved') {
          script += `The legal proceedings in ${caseData.title} are a crucial chapter in this story.\n\n`;
          script += `[RESEARCHER NOTE: Detail the arrest, charges, trial proceedings, key testimony, verdict, and sentencing. Include any appeals or subsequent legal actions.]\n\n`;
        } else {
          script += `Without an arrest, there have been no formal legal proceedings in ${caseData.title}. However, the case has had significant legal implications.\n\n`;
          script += `[RESEARCHER NOTE: Discuss any inquests, grand jury proceedings, civil suits, or legal developments related to the case.]\n\n`;
        }
        break;

      case 'resolution':
        script += `As of today, ${caseData.title} is officially classified as ${caseData.status.toLowerCase()}.\n\n`;
        if (caseData.status === 'Unsolved') {
          script += `Despite ${getYearsSince(caseData.date)} years of investigation, the case remains open. `;
          script += `Advances in forensic technology, particularly DNA analysis and genetic genealogy, offer hope that this case may one day be resolved.\n\n`;
        } else if (caseData.status === 'Solved') {
          script += `The resolution of this case brought some measure of closure, but the impact on the victims' families and the broader community continues to be felt.\n\n`;
        } else {
          script += `The case remains ${caseData.status.toLowerCase()}, with investigators and the public continuing to search for answers.\n\n`;
        }
        break;

      case 'impact':
        script += `${caseData.title} has had a lasting impact beyond the immediate case.\n\n`;
        script += `[RESEARCHER NOTE: Discuss how this case influenced:\n`;
        script += `  - Law enforcement procedures\n`;
        script += `  - Legislation changes\n`;
        script += `  - Public awareness\n`;
        script += `  - Media and cultural representations\n`;
        script += `  - Forensic science advancements]\n\n`;
        break;

      case 'outro':
        if (style === 'podcast-casual' || style === 'podcast-deep') {
          script += `And that's where we'll leave it for today. ${caseData.title} is a case that continues to ${caseData.status === 'Unsolved' ? 'haunt investigators and true crime enthusiasts alike' : 'serve as a reminder of both the darkness and resilience of the human spirit'}.\n\n`;
          script += `If you have any information about this case, please contact your local law enforcement.\n\n`;
          script += `Thank you for listening. If you enjoyed this episode, please subscribe, leave a review, and share it with someone who loves true crime. Until next time — stay safe, and stay curious.\n\n`;
        } else if (style === 'youtube') {
          script += `And that's the story of ${caseData.title}. What do you think happened? Let me know your theories in the comments below.\n\n`;
          script += `If you found this video interesting, hit that like button and subscribe for more deep dives into true crime. I'll see you in the next one.\n\n`;
          script += `[END SCREEN: Subscribe button, next video recommendation]\n`;
        } else if (style === 'documentary') {
          script += `[AMBIENT SOUND FADES]\n\n`;
          script += `${caseData.title} remains ${caseData.status === 'Unsolved' ? 'an open wound — a reminder that justice delayed is not justice served' : 'a case that changed how we think about crime, justice, and the human capacity for darkness'}.\n\n`;
          script += `[FADE TO BLACK]\n`;
        } else {
          script += `${caseData.title} stands as one of the most significant criminal cases in history. `;
          script += `${caseData.status === 'Unsolved' ? 'Until it is resolved, it will continue to capture the imagination and determination of those seeking answers.' : 'Its resolution brought closure, but the questions it raised about society, justice, and human nature endure.'}\n\n`;
        }
        break;

      default:
        script += `[Section content for ${section.name}]\n\n`;
    }

    if (includeSources) {
      script += `[SOURCES: Research required for verification]\n\n`;
    }

    const sectionDuration = Math.floor((wordsPerSection / avgWordsPerMinute) * 60);
    timestamp += sectionDuration;
  });

  const wordCount = script.split(/\s+/).length;
  const estimatedDuration = Math.ceil(wordCount / avgWordsPerMinute);

  return {
    content: script,
    metadata: {
      style: styleConfig.name,
      tone,
      wordCount,
      estimatedDuration,
      sectionCount: selectedSections.length,
      generatedAt: new Date().toISOString()
    }
  };
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getYearsSince(dateStr) {
  const date = new Date(dateStr);
  return new Date().getFullYear() - date.getFullYear();
}

function getAmbientSound(caseData) {
  const type = caseData.type.toLowerCase();
  if (type.includes('serial')) return 'distant sirens, quiet suburban streets';
  if (type.includes('heist')) return 'city traffic, museum silence';
  if (type.includes('kidnap') || type.includes('missing')) return 'wind through trees, a quiet neighborhood';
  return 'nighttime ambiance, distant traffic';
}

function getAtmosphericOpener(caseData) {
  const month = new Date(caseData.date).getMonth();
  if (month >= 3 && month <= 5) return 'warm, the kind of spring evening that promised nothing but possibility';
  if (month >= 6 && month <= 8) return 'thick with summer heat, the air heavy with humidity and the hum of cicadas';
  if (month >= 9 && month <= 11) return 'cool, autumn leaves skittering across empty sidewalks';
  return 'cold, a bitter winter wind cutting through the empty streets';
}
