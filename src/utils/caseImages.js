// Generate case images using Picsum (reliable, free, no API key)
// Each case gets a deterministic image based on its ID

export function getCaseImageUrl(caseData, size = '800/450') {
  const seed = caseData.id || 1;
  return `https://picsum.photos/seed/crime${seed}/${size}?grayscale&blur=1`;
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

export function getCasePlaceholderSvg(caseData) {
  const colors = {
    'Murder': '#991b1b', 'Serial Killer': '#7f1d1d', 'Kidnapping': '#92400e',
    'Missing Person': '#1e3a5f', 'Cold Case': '#1e40af', 'Heist': '#a16207',
    'Terrorism': '#c2410c', 'Wrongful Conviction': '#6b21a8',
  };
  const color = colors[caseData.type] || '#27272a';
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='${encodeURIComponent(color)}'/%3E%3Cstop offset='100%25' stop-color='%2318181b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g)'/%3E%3Ctext x='400' y='225' text-anchor='middle' fill='%23ffffff15' font-size='20' font-family='sans-serif'%3ECASE FILE%3C/text%3E%3C/svg%3E`;
}
