'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapPin, Box } from 'lucide-react';
import { buildings, buildingTypeLabel } from '@/data/buildings';
import { getPlace } from '@/data/places';
import { getFigure } from '@/data/people';
import type { Building } from '@/data/types';
import { Drawer } from '@/components/ui/Drawer';
import { NotesList } from '@/components/ui/Certainty';
import { SourcesList } from '@/components/ui/SourcesList';
import { BuildingIllustration } from './BuildingIllustration';
import { CITY_FOCUS_EVENT } from './IstanbulCity';
import { cn } from '@/lib/utils';

const FILTERS: { id: string; label: string; test: (b: Building) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'mosques', label: 'Mosques & complexes', test: (b) => ['mosque', 'complex', 'madrasa'].includes(b.type) && b.id !== 'fountain-ahmed-iii' },
  { id: 'palaces', label: 'Palaces', test: (b) => b.type === 'palace' },
  { id: 'civic', label: 'Bazaars, baths, inns & fountains', test: (b) => ['bazaar', 'hamam', 'caravanserai'].includes(b.type) || b.id === 'fountain-ahmed-iii' },
  { id: 'engineering', label: 'Bridges, towers & fortresses', test: (b) => ['bridge', 'tower', 'fortress'].includes(b.type) },
  { id: 'sinan', label: 'By Sinan', test: (b) => !!b.architect?.includes('Sinan') },
];

export function BuildingDetail({ b }: { b: Building }) {
  const place = getPlace(b.placeId);
  const sinan = b.architect?.includes('Sinan') ? getFigure('sinan') : undefined;
  return (
    <article className="pb-10">
      <BuildingIllustration b={b} className="aspect-[16/9] w-full" />
      <div className="px-6 pt-6 sm:px-9">
        <p className="label-caps text-gold">
          {buildingTypeLabel[b.type]} · {b.built}
        </p>
        <h2 id="building-detail-title" className="display-title mt-3 text-4xl text-ivory sm:text-5xl">
          {b.name}
        </h2>
        {b.altName && <p className="mt-1 font-display text-lg italic text-ivory/60">{b.altName}</p>}
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {place && (
            <div className="rounded-xl border hairline p-3">
              <dt className="label-caps text-ash">Place</dt>
              <dd className="mt-1 text-ivory">{place.name}</dd>
            </div>
          )}
          {b.architect && (
            <div className="rounded-xl border hairline p-3">
              <dt className="label-caps text-ash">Architect</dt>
              <dd className="mt-1 text-ivory">{sinan ? <Link className="text-gold-light underline decoration-gold/40 underline-offset-2" href="/figures/sinan/">{b.architect}</Link> : b.architect}</dd>
            </div>
          )}
          {b.patron && (
            <div className="rounded-xl border hairline p-3">
              <dt className="label-caps text-ash">Patron</dt>
              <dd className="mt-1 text-ivory">{b.patron}</dd>
            </div>
          )}
          {b.facts?.map((f) => (
            <div key={f.label} className="rounded-xl border hairline p-3">
              <dt className="label-caps text-ash">{f.label}</dt>
              <dd className="mt-1 text-ivory">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-lg leading-relaxed text-ivory/85">{b.summary}</p>
        <div className="prose-history mt-4 space-y-4 text-ivory/75">
          {b.description.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <h3 className="label-caps mt-8 text-gold-light">Architectural features</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {b.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-ivory/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/[0.05] p-5">
          <p className="label-caps text-gold">Historical significance</p>
          <p className="mt-2 text-ivory/85">{b.significance}</p>
          {b.unesco && <p className="mt-3 text-xs text-ivory/60">UNESCO World Heritage: {b.unesco}</p>}
        </div>
        {b.notes && <NotesList notes={b.notes} className="mt-6" />}
        <div className="mt-6 flex flex-wrap gap-3">
          {place && (
            <Link href={`/map/?place=${place.id}`} className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold-light hover:border-gold">
              <MapPin className="h-4 w-4" aria-hidden="true" /> Show {place.name} on the map
            </Link>
          )}
          {b.istanbul && (
            <a href="#istanbul" data-city-focus={b.id} className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold-light hover:border-gold">
              <Box className="h-4 w-4" aria-hidden="true" /> Find it in 3D Istanbul
            </a>
          )}
        </div>
        <SourcesList ids={b.sources} className="mt-8" />
      </div>
    </article>
  );
}

export function BuildingGallery() {
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const list = useMemo(() => buildings.filter(FILTERS.find((f) => f.id === filter)!.test), [filter]);
  const open = buildings.find((b) => b.id === openId) ?? null;

  const show = useCallback((id: string | null) => {
    setOpenId(id);
    history.replaceState(null, '', id ? `#${id}` : location.pathname);
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (buildings.some((b) => b.id === id)) {
        document.getElementById(id)?.scrollIntoView({ block: 'center' });
        setOpenId(id);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter buildings">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn('shrink-0 rounded-full border px-4 py-2 text-sm transition', filter === f.id ? 'border-gold bg-gold text-ink' : 'hairline text-ivory/75 hover:border-gold/50 hover:text-ivory')}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((b) => (
          <li key={b.id} id={b.id} className="scroll-mt-28">
            <button onClick={() => show(b.id)} className="group block w-full overflow-hidden rounded-3xl border hairline bg-white/[0.02] text-left transition hover:-translate-y-1 hover:border-gold/40 focus-visible:border-gold">
              <BuildingIllustration b={b} decorative className="aspect-[16/10] w-full transition duration-700 group-hover:scale-[1.03]" />
              <div className="p-5">
                <p className="label-caps text-gold/90">
                  {buildingTypeLabel[b.type]} · {getPlace(b.placeId)?.name}
                </p>
                <h3 className="mt-2 font-display text-2xl text-ivory">{b.name}</h3>
                <p className="mt-1 text-sm text-ash">
                  {b.built}
                  {b.architect ? ` · ${b.architect}` : ''}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ivory/70">{b.summary}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <Drawer open={!!open} onClose={() => show(null)} title={open?.name ?? 'Building'} labelledBy="building-detail-title">
        {open && (
          <div
            onClick={(e) => {
              const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-city-focus]');
              if (a) {
                e.preventDefault();
                const id = a.dataset.cityFocus!;
                setOpenId(null);
                // Let the drawer restore focus first, then fly the 3D city to the building.
                setTimeout(() => window.dispatchEvent(new CustomEvent(CITY_FOCUS_EVENT, { detail: id })), 60);
              }
            }}
          >
            <BuildingDetail b={open} />
          </div>
        )}
      </Drawer>
    </div>
  );
}
