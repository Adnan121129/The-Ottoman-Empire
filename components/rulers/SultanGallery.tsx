'use client';

import { useMemo, useState } from 'react';
import { eras } from '@/data/eras';
import { rulers, reignLength } from '@/data/rulers';
import { SultanCard } from './SultanCard';
import { cn } from '@/lib/utils';

type Sort = 'order' | 'length';

export function SultanGallery() {
  const [era, setEra] = useState<string>('all');
  const [featured, setFeatured] = useState(false);
  const [sort, setSort] = useState<Sort>('order');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rulers
      .filter((r) => (era === 'all' ? true : r.eraId === era))
      .filter((r) => (featured ? r.featured : true))
      .filter((r) => (query ? `${r.name} ${r.turkishName} ${r.epithet ?? ''}`.toLowerCase().includes(query) : true))
      .sort((a, b) => (sort === 'order' ? a.order - b.order : reignLength(b) - reignLength(a)));
  }, [era, featured, sort, q]);

  const usedEras = eras.filter((e) => rulers.some((r) => r.eraId === e.id));

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-y hairline bg-ink/85 px-4 py-4 backdrop-blur-xl sm:top-20 sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto" role="group" aria-label="Filter by era">
            {[{ id: 'all', name: 'All eras' }, ...usedEras].map((e) => (
              <button key={e.id} onClick={() => setEra(e.id)} aria-pressed={era === e.id} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-xs transition', era === e.id ? 'border-gold bg-gold text-ink' : 'border-white/10 text-ivory/65 hover:text-ivory')}>
                {e.name.replace('Late Empire · ', '')}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <label className="sr-only" htmlFor="sultan-q">
              Filter sultans by name
            </label>
            <input id="sultan-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name…" className="h-9 w-40 rounded-full border hairline bg-black/40 px-4 text-sm text-ivory placeholder:text-ash focus:border-gold/60 focus:outline-none" />
            <button onClick={() => setFeatured((f) => !f)} aria-pressed={featured} className={cn('h-9 rounded-full border px-4 text-xs transition', featured ? 'border-gold bg-gold/15 text-gold-light' : 'border-white/10 text-ivory/65')}>
              Featured profiles
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-9 rounded-full border hairline bg-black/40 px-3 text-xs text-ivory" aria-label="Sort order">
              <option value="order">Order of accession</option>
              <option value="length">Length of reign</option>
            </select>
          </div>
        </div>
      </div>
      <p className="mt-6 text-sm text-ash" aria-live="polite">
        Showing {list.length} of {rulers.length} sultans
      </p>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((r) => (
          <li key={r.id} className={cn(r.featured && 'xl:[&:nth-child(1)]:col-span-1')}>
            <SultanCard ruler={r} className="h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
