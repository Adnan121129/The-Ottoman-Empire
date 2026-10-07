'use client';

import { useMemo, useState } from 'react';
import { allFigures, categoryLabel } from '@/data/people';
import type { Figure, FigureGroup } from '@/data/types';
import { FigureCard } from './FigureCard';
import { cn } from '@/lib/utils';

const groups: { id: FigureGroup; title: string; intro: string }[] = [
  { id: 'figures', title: 'Founders, admirals, architects & scholars', intro: 'The people who built the empire’s fleets, buildings, maps and books — and the officer who ended it.' },
  { id: 'statesmen', title: 'Grand viziers & statesmen', intro: 'The ministers who governed in the sultans’ name — reformers, conquerors, and the leaders of the final, catastrophic decade.' },
  { id: 'women', title: 'Women of the empire', intro: 'Queen mothers, consorts and princesses who shaped dynastic politics and patronage — and the writers and activists of the late empire.' },
];

export function FiguresGallery() {
  const [cat, setCat] = useState<Figure['category'] | 'all'>('all');
  const cats = useMemo(() => [...new Set(allFigures.map((f) => f.category))], []);
  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by role">
        {(['all', ...cats] as const).map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-xs transition', cat === c ? 'border-gold bg-gold text-ink' : 'border-white/10 text-ivory/65 hover:text-ivory')}>
            {c === 'all' ? 'Everyone' : categoryLabel[c]}
          </button>
        ))}
      </div>
      {groups.map((g) => {
        const list = allFigures.filter((f) => f.group === g.id && (cat === 'all' || f.category === cat)).sort((a, b) => a.activeFrom - b.activeFrom);
        if (!list.length) return null;
        return (
          <section key={g.id} className="mt-16" aria-labelledby={`g-${g.id}`}>
            <h2 id={`g-${g.id}`} className="display-title text-4xl text-ivory sm:text-5xl">
              {g.title}
            </h2>
            <p className="mt-3 max-w-2xl text-ivory/60">{g.intro}</p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map((f) => (
                <li key={f.id}>
                  <FigureCard figure={f} className="h-full" />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
