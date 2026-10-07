import type { Ruler } from './types';
import { earlyRulers } from './rulers/early';
import { middleRulers } from './rulers/middle';
import { lateRulers } from './rulers/late';

/**
 * All 36 rulers of the House of Osman, in order of accession.
 * To add detail, edit the object in /data/rulers/*.ts — pages update automatically.
 */
export const rulers: Ruler[] = [...earlyRulers, ...middleRulers, ...lateRulers].sort((a, b) => a.order - b.order);

export const rulerById: Record<string, Ruler> = Object.fromEntries(rulers.map((r) => [r.id, r]));

export function getRuler(id: string | undefined): Ruler | undefined {
  return id ? rulerById[id] : undefined;
}

export const featuredRulers = rulers.filter((r) => r.featured);

/** Total years on the throne, summing split reigns. */
export function reignLength(r: Ruler): number {
  return r.reigns.reduce((sum, reign) => sum + Math.max(reign.end - reign.start, 0.25), 0);
}

export function reignLabel(r: Ruler): string {
  return r.reigns.map((x) => x.label).join(' · ');
}

/**
 * Who sat on the throne in a given year.
 * Returns null for the Interregnum (1402–1413) and after 1922.
 */
export function rulerForYear(year: number): Ruler | null {
  if (year > 1402 && year < 1413) return null;
  if (year > 1922) return null;
  let found: Ruler | null = null;
  for (const r of rulers) {
    for (const reign of r.reigns) {
      if (year >= reign.start && year <= reign.end) {
        // Later reign wins on boundary years (the successor took over that year).
        if (!found || reign.start >= (found.reigns.find((x) => year >= x.start && year <= x.end)?.start ?? 0)) found = r;
      }
    }
  }
  return found;
}

export const trendScore: Record<Ruler['territorialChange']['trend'], number> = {
  founding: 1,
  'major-expansion': 2,
  expansion: 1,
  stable: 0,
  mixed: 0,
  losses: -1,
  'major-losses': -2,
  dissolution: -2,
};

export const trendLabel: Record<Ruler['territorialChange']['trend'], string> = {
  founding: 'Founding',
  'major-expansion': 'Major expansion',
  expansion: 'Expansion',
  stable: 'Stable',
  mixed: 'Mixed',
  losses: 'Losses',
  'major-losses': 'Major losses',
  dissolution: 'Dissolution',
};
