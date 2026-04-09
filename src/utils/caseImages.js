// Generate atmospheric case images using Unsplash source
// Maps case attributes to relevant, moody imagery keywords

const typeKeywords = {
  'Murder': 'dark alley crime scene night',
  'Serial Killer': 'dark forest fog mystery',
  'Kidnapping': 'abandoned building dark',
  'Missing Person': 'empty road fog missing',
  'Cold Case': 'frost ice cold dark window',
  'Robbery': 'vault bank dark night',
  'Fraud': 'documents shadows office dark',
  'Cybercrime': 'dark computer screen hacker',
  'Organized Crime': 'city night dark street',
  'Wrongful Conviction': 'prison bars dark justice',
  'Domestic Violence': 'broken window dark house',
  'Arson': 'fire flames dark building',
  'Sexual Assault': 'dark hallway shadows',
  'White Collar Crime': 'office shadows dark',
  'Drug Trafficking': 'dark warehouse night',
  'Mass Shooting': 'memorial candles dark',
  'Terrorism': 'city smoke dark',
  'Cult Crime': 'dark candles ritual',
  'Historical Crime': 'vintage dark noir',
  'Heist': 'museum dark night vault',
};

const locationKeywords = {
  'California': 'california noir',
  'Los Angeles': 'los angeles night',
  'New York': 'new york dark alley',
  'Chicago': 'chicago night noir',
  'London': 'london fog dark',
  'Texas': 'texas desert night',
  'Florida': 'florida swamp dark',
  'Boston': 'boston night dark',
  'San Francisco': 'san francisco fog',
  'Las Vegas': 'las vegas night dark',
  'Milwaukee': 'midwest dark industrial',
  'Portland': 'pacific northwest dark rain',
};

function getLocationKeyword(location) {
  if (!location) return '';
  for (const [key, value] of Object.entries(locationKeywords)) {
    if (location.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return '';
}

export function getCaseImageUrl(caseData, size = '800x450') {
  const [w, h] = size.split('x');
  const typeKey = typeKeywords[caseData.type] || 'dark mystery crime';
  const locKey = getLocationKeyword(caseData.location);
  const query = encodeURIComponent(`${typeKey} ${locKey}`.trim());
  // Use a deterministic seed based on case id for consistent images
  const seed = caseData.id || Math.floor(Math.random() * 10000);
  return `https://source.unsplash.com/${w}x${h}/?${query}&sig=${seed}`;
}

export function getCaseImageGradient(caseData) {
  const gradients = {
    'Murder': 'from-red-950/90 via-red-950/70 to-zinc-950/95',
    'Serial Killer': 'from-red-950/90 via-zinc-950/80 to-zinc-950/95',
    'Kidnapping': 'from-amber-950/80 via-zinc-950/80 to-zinc-950/95',
    'Missing Person': 'from-blue-950/80 via-zinc-950/80 to-zinc-950/95',
    'Cold Case': 'from-blue-950/90 via-zinc-950/80 to-zinc-950/95',
    'Heist': 'from-amber-950/80 via-zinc-950/80 to-zinc-950/95',
    'Terrorism': 'from-orange-950/80 via-zinc-950/80 to-zinc-950/95',
    'Wrongful Conviction': 'from-purple-950/80 via-zinc-950/80 to-zinc-950/95',
    'Cult Crime': 'from-violet-950/80 via-zinc-950/80 to-zinc-950/95',
  };
  return gradients[caseData.type] || 'from-zinc-950/90 via-zinc-950/80 to-zinc-950/95';
}

// Fallback SVG-based image for when Unsplash is slow/unavailable
export function getCasePlaceholderSvg(caseData) {
  const colors = {
    'Murder': '#991b1b',
    'Serial Killer': '#7f1d1d',
    'Kidnapping': '#92400e',
    'Missing Person': '#1e3a5f',
    'Cold Case': '#1e40af',
    'Heist': '#a16207',
    'Terrorism': '#c2410c',
    'Wrongful Conviction': '#6b21a8',
    'Solved': '#166534',
    'Unsolved': '#991b1b',
  };
  const color = colors[caseData.type] || colors[caseData.status] || '#27272a';
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='${encodeURIComponent(color)}'/%3E%3Cstop offset='100%25' stop-color='%2318181b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g)'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%23ffffff20' font-size='80' font-family='serif'%3E%3F%3C/text%3E%3Ctext x='400' y='270' text-anchor='middle' fill='%23ffffff15' font-size='18' font-family='sans-serif'%3ECASE FILE%3C/text%3E%3C/svg%3E`;
}
