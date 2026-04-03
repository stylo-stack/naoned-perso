const LINE_COLORS: Record<string, string> = {
  '1': '#16A34A', // green
  '2': '#DC2626', // red
  '3': '#2563EB', // blue
  '4': '#0284C7', // light blue
  '5': '#B8860B', // goldenrod
};

const NAVIBUS_COLOR = '#38A3C8'; // lighter blue for N-prefixed lines

const FALLBACK_COLORS = [
  '#7C3AED',
  '#EA580C',
  '#0891B2',
  '#0F766E',
  '#BE185D',
  '#1E293B',
  '#92400E',
  '#166534',
];

export function getLineColor(numLigne: string): string {
  if (LINE_COLORS[numLigne]) return LINE_COLORS[numLigne];
  if (numLigne.startsWith('N')) return NAVIBUS_COLOR;
  const hash = numLigne.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}
