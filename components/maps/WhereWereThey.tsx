'use client';

import { useMemo, useState } from 'react';
import { rulers } from '@/data/rulers';
import { allFigures } from '@/data/people';
import { LocationsMap } from './LocationsMap';
import { Portrait } from '@/components/ui/Portrait';
import { cn } from '@/lib/utils';

export function WhereWereThey() {
  const people = useMemo(
    () => [
      ...rulers.filter((r) => r.locations?.length).map((r) => ({ id: r.id, name: r.name, portrait: r.portrait, locations: r.locations!, year: r.reignEnd, href: `/sultans/${r.id}/` })),
      ...allFigures.filter((f) => f.locations && f.locations.length > 1).map((f) => ({ id: f.id, name: f.name, portrait: f.portrait, locations: f.locations!, year: f.activeTo, href: `/figures/${f.id}/` })),
    ],
    [],
  );
  const [id, setId] = useState('mehmed-ii');
  const person = people.find((p) => p.id === id) ?? people[0];
  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" role="group" aria-label="Choose a person">
        {people.map((p) => (
          <button key={p.id} onClick={() => setId(p.id)} aria-pressed={p.id === id} className={cn('flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-4 text-sm transition', p.id === id ? 'border-gold bg-gold/15 text-gold-light' : 'border-white/10 text-ivory/70 hover:text-ivory')}>
            <Portrait spec={p.portrait} name={p.name} className="h-8 w-8 rounded-full" showLabel={false} />
            {p.name}
          </button>
        ))}
      </div>
      <LocationsMap key={person.id} locations={person.locations} snapshotYear={person.year} className="mt-6" heading={false} />
    </div>
  );
}
