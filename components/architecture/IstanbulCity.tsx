'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Viewer3D, loadCity } from '@/components/3d/Viewer3D';
import { buildings, buildingTypeLabel } from '@/data/buildings';
import { cityEras } from '@/data/narratives';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

export const CITY_FOCUS_EVENT = 'ottoman:city-focus';

export function IstanbulCity() {
  const { reducedMotion } = useSettings();
  const [year, setYear] = useState(1560);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const era = cityEras.find((e) => e.year === year)!;
  const visible = useMemo(() => buildings.filter((b) => b.istanbul && b.startYear <= year), [year]);
  const selected = visible.find((b) => b.id === selectedId) ?? null;

  const changeYear = (y: number) => {
    setYear(y);
    if (selectedId && (buildings.find((b) => b.id === selectedId)?.startYear ?? 0) > y) setSelectedId(null);
  };

  const focus = useCallback(
    (id: string) => {
      const b = buildings.find((x) => x.id === id);
      if (!b?.istanbul) return;
      setYear((y) => (b.startYear <= y ? y : (cityEras.find((e) => e.year >= b.startYear)?.year ?? 1870)));
      setSelectedId(id);
      setTimeout(() => root.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }), 80);
    },
    [reducedMotion],
  );

  useEffect(() => {
    const onFocus = (e: Event) => focus((e as CustomEvent<string>).detail);
    window.addEventListener(CITY_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(CITY_FOCUS_EVENT, onFocus);
  }, [focus]);

  return (
    <div ref={root} className="scroll-mt-24">
      <div role="tablist" aria-label="Choose a period" className="flex flex-wrap items-center gap-2">
        {cityEras.map((e) => (
          <button
            key={e.year}
            role="tab"
            aria-selected={year === e.year}
            onClick={() => changeYear(e.year)}
            className={cn('rounded-full border px-5 py-2 font-display text-xl transition', year === e.year ? 'border-gold bg-gold text-ink' : 'hairline text-ivory/80 hover:border-gold/50')}
          >
            {e.label}
          </button>
        ))}
        <p className="ml-1 text-sm text-ivory/65 sm:ml-3" aria-live="polite">
          {era.caption}
        </p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Viewer3D
          load={loadCity}
          props={{ eraYear: year, selectedId, onSelect: setSelectedId }}
          label={`Interactive 3D map of Istanbul around ${year}. Select a landmark to fly to it.`}
          className="aspect-[4/3] w-full lg:aspect-auto lg:h-[min(78vh,760px)]"
          caption={<>Artistic reconstruction · coastlines simplified from modern geography, landmarks enlarged for legibility · drag to orbit, right-drag to pan</>}
        />
        <aside className="flex flex-col gap-4">
          {selected ? (
            <div className="rounded-3xl border border-gold/30 bg-gold/[0.05] p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="label-caps text-gold">
                  {buildingTypeLabel[selected.type]} · {selected.built}
                </p>
                <button onClick={() => setSelectedId(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border hairline text-ivory/70 hover:text-ivory" aria-label="Back to the whole city">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <h3 className="mt-2 font-display text-3xl text-ivory">{selected.name}</h3>
              {selected.startYear <= year && selected.endYear > year && selected.type !== 'palace' && selected.type !== 'bazaar' && selected.id !== 'hagia-sophia' && (
                <p className="mt-2 text-xs text-[#f3a4ae]">Still under construction in {year}.</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-ivory/80">{selected.summary}</p>
              <a href={`#${selected.id}`} className="mt-4 inline-block text-sm font-semibold text-gold-light underline decoration-gold/40 underline-offset-4">
                Read the full entry →
              </a>
            </div>
          ) : (
            <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
              <p className="label-caps text-gold">Istanbul · {year}</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/75">Select a landmark in the scene or below to fly to it. Switch periods to watch the skyline change.</p>
            </div>
          )}
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1" aria-label={`Landmarks standing in ${year}`}>
            {visible.map((b) => (
              <li key={b.id}>
                <button
                  onClick={() => setSelectedId(b.id === selectedId ? null : b.id)}
                  aria-pressed={b.id === selectedId}
                  className={cn('w-full rounded-xl border px-3 py-2 text-left text-sm transition', b.id === selectedId ? 'border-gold bg-gold/15 text-ivory' : 'hairline text-ivory/75 hover:border-gold/40')}
                >
                  {b.name}
                  <span className="block text-[0.7rem] text-ash">{b.built.split(';')[0]}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
