import Fuse from 'fuse.js';
import { rulers, reignLabel } from '@/data/rulers';
import { allFigures, categoryLabel } from '@/data/people';
import { battles } from '@/data/battles';
import { places } from '@/data/places';
import { events } from '@/data/events';
import { buildings, buildingTypeLabel } from '@/data/buildings';
import { glossary } from '@/data/glossary';
import { eras } from '@/data/eras';
import { reformAreas } from '@/data/narratives';

export type SearchKind = 'Sultan' | 'Person' | 'Battle' | 'Place' | 'Event' | 'Building' | 'Reform' | 'Period' | 'Glossary';

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}

const items: SearchItem[] = [
  ...rulers.map((r) => ({ id: `r-${r.id}`, kind: 'Sultan' as const, title: r.name, subtitle: `${reignLabel(r)}${r.epithet ? ' · ' + r.epithet : ''}`, href: `/sultans/${r.id}/`, keywords: [r.turkishName, r.epithet, r.summary, ...r.achievements].join(' ') })),
  ...allFigures.map((f) => ({ id: `f-${f.id}`, kind: 'Person' as const, title: f.name, subtitle: `${categoryLabel[f.category]} · ${f.lifespan}`, href: `/figures/${f.id}/`, keywords: [...(f.altNames ?? []), f.role, f.summary].join(' ') })),
  ...battles.map((b) => ({ id: `b-${b.id}`, kind: 'Battle' as const, title: b.name, subtitle: `${b.date} · ${b.location}`, href: `/battles/#${b.id}`, keywords: [b.altName, b.opponents, ...b.ottomanCommanders, ...b.opponentCommanders, b.summary].join(' ') })),
  ...places.map((p) => ({ id: `p-${p.id}`, kind: 'Place' as const, title: p.name, subtitle: p.modern, href: `/map/?place=${p.id}`, keywords: [...(p.altNames ?? []), p.description].join(' ') })),
  ...events.map((e) => ({ id: `e-${e.id}`, kind: 'Event' as const, title: e.title, subtitle: e.dateLabel, href: e.battleId ? `/battles/#${e.battleId}` : e.rulerId ? `/sultans/${e.rulerId}/` : '/#timeline', keywords: e.description })),
  ...buildings.map((b) => ({ id: `bu-${b.id}`, kind: 'Building' as const, title: b.name, subtitle: `${buildingTypeLabel[b.type]} · ${b.built}`, href: `/architecture/#${b.id}`, keywords: [b.altName, b.architect, b.patron, b.summary].join(' ') })),
  ...reformAreas.flatMap((a) => a.milestones.map((m, i) => ({ id: `rf-${a.id}-${i}`, kind: 'Reform' as const, title: m.text, subtitle: `${a.name} reform · ${m.year}`, href: '/empire/#tanzimat', keywords: `${a.name} ${a.summary} Tanzimat reform` }))),
  ...eras.map((e) => ({ id: `era-${e.id}`, kind: 'Period' as const, title: e.name, subtitle: e.range, href: '/#timeline', keywords: `${e.tagline} ${e.summary}` })),
  ...glossary.map((g) => ({ id: `g-${g.id}`, kind: 'Glossary' as const, title: g.term, subtitle: g.definition, href: `/glossary/#${g.id}`, keywords: `${g.turkish ?? ''} ${g.context}` })),
];

export const fuse = new Fuse(items, {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'subtitle', weight: 0.2 },
    { name: 'keywords', weight: 0.2 },
  ],
  threshold: 0.36,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeMatches: false,
});

export const suggestions: SearchItem[] = ['r-mehmed-ii', 'r-suleiman-i', 'f-sinan', 'b-constantinople-1453', 'f-hurrem', 'g-janissary', 'r-mehmed-vi', 'p-bursa']
  .map((id) => items.find((i) => i.id === id))
  .filter((x): x is SearchItem => Boolean(x));
