'use client';

import { AnimatePresence, motion } from 'motion/react';
import { MapPin, Pause, Play, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { battles, resultLabel } from '@/data/battles';
import { capitalForYear, placeById, places } from '@/data/places';
import { rulers } from '@/data/rulers';
import { allFigures } from '@/data/people';
import { snapshots } from '@/data/territories';
import { MapCanvas, MapLegend, placeMarkers, type MapMarker } from './MapCanvas';
import { SourcesList } from '@/components/ui/SourcesList';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

type Layer = 'cities' | 'battles' | 'routes' | 'rivers' | 'labels';

export function HistoricalMap() {
  const { reducedMotion } = useSettings();
  const [index, setIndex] = useState(5);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [layers, setLayers] = useState<Record<Layer, boolean>>({ cities: true, battles: true, routes: false, rivers: true, labels: true });
  const [battleScope, setBattleScope] = useState<'period' | 'all'>('period');
  const [placeId, setPlaceId] = useState<string | null>(null);

  const snapshot = snapshots[index];
  const previous = prevIndex !== null ? snapshots[prevIndex] : null;
  const go = (i: number) => {
    setPrevIndex(index);
    setIndex(i);
  };

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('place');
    if (p && placeById[p]) setPlaceId(p);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (index >= snapshots.length - 1) setPlaying(false);
      else go(index + 1);
    }, reducedMotion ? 2000 : 3200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  const capital = capitalForYear(snapshot.year);
  const markers = useMemo(() => {
    const m: MapMarker[] = [];
    if (layers.cities) m.push(...placeMarkers(places, capital.placeId));
    if (layers.battles) {
      const from = index > 0 ? snapshots[index - 1].year : 1280;
      battles
        .filter((b) => b.kind !== 'campaign' && (battleScope === 'all' || (b.year > from && b.year <= snapshot.year)))
        .forEach((b) => m.push({ id: `battle-${b.id}`, coords: b.coords, label: b.name.replace(/^(Battle|Siege|Great Siege|First Siege|Second Battle) of /, ''), kind: b.result === 'ottoman-victory' ? 'battle-win' : b.result === 'ottoman-defeat' ? 'battle-loss' : 'battle-other' }));
    }
    return m;
  }, [layers.cities, layers.battles, battleScope, index, snapshot.year, capital.placeId]);

  const onMarker = (id: string) => {
    if (id.startsWith('battle-')) {
      window.location.href = `/battles/#${id.slice(7)}`;
      return;
    }
    setPlaceId(id);
  };

  const place = placeId ? placeById[placeId] : null;
  const people = useMemo(() => {
    if (!place) return [];
    return [
      ...rulers.filter((r) => r.locations?.some((l) => l.placeId === place.id)).map((r) => ({ href: `/sultans/${r.id}/`, name: r.name })),
      ...allFigures.filter((f) => f.locations?.some((l) => l.placeId === place.id)).map((f) => ({ href: `/figures/${f.id}/`, name: f.name })),
    ];
  }, [place]);
  const nearbyBattles = useMemo(() => (place ? battles.filter((b) => Math.hypot(b.coords[0] - place.coords[0], b.coords[1] - place.coords[1]) < 0.8) : []), [place]);

  const toggle = (l: Layer) => setLayers((s) => ({ ...s, [l]: !s[l] }));

  return (
    <div>
      {/* Year selector */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <button onClick={() => (playing ? setPlaying(false) : (index === snapshots.length - 1 && go(0), setPlaying(true)))} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-gold-light" aria-pressed={playing}>
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {playing ? 'Pause' : 'Play 1300 → 1922'}
        </button>
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border hairline bg-black/40 p-1" role="group" aria-label="Select a year">
          {snapshots.map((s, i) => (
            <button key={s.year} onClick={() => go(i)} aria-pressed={i === index} className={cn('shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition', i === index ? 'bg-gold text-ink' : 'text-ivory/65 hover:text-ivory')}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="relative overflow-hidden rounded-[2rem] border hairline bg-black">
          <MapCanvas
            snapshot={snapshot}
            previous={previous}
            interactive
            markers={markers}
            selectedMarkerId={placeId ?? undefined}
            onMarkerClick={onMarker}
            showRoutes={layers.routes}
            showRivers={layers.rivers}
            showSeaLabels={layers.labels}
            ariaLabel={`Interactive map of the Ottoman Empire, ${snapshot.title}. Use arrow keys to pan and plus or minus to zoom.`}
            className="aspect-[1000/657] w-full"
          />
          <div className="pointer-events-none absolute left-4 top-4 sm:left-6 sm:top-6">
            <AnimatePresence mode="wait">
              <motion.p key={snapshot.year} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.4 }} className="display-title text-gold-gradient text-5xl sm:text-7xl">
                {snapshot.label}
              </motion.p>
            </AnimatePresence>
            <p className="mt-1 text-xs text-ivory/70">Capital: {capital.label}</p>
          </div>

          <AnimatePresence>
            {place && (
              <motion.aside
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: reducedMotion ? 0 : 0.35 }}
                className="absolute inset-y-3 right-3 w-[min(22rem,calc(100%-1.5rem))] overflow-y-auto rounded-3xl border hairline bg-night/95 p-5 shadow-2xl backdrop-blur-xl"
                aria-label={`About ${place.name}`}
              >
                <button onClick={() => setPlaceId(null)} className="float-right grid h-8 w-8 place-items-center rounded-full border hairline text-ivory/80 hover:text-ivory" aria-label="Close city panel">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="label-caps flex items-center gap-1.5 text-gold">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {place.type.replace('-', ' ')}
                </p>
                <h3 className="mt-2 font-display text-3xl text-ivory">{place.name}</h3>
                {place.altNames && <p className="text-xs text-ash">Also: {place.altNames.join(', ')}</p>}
                <p className="mt-1 text-xs text-ivory/60">Today: {place.modern}</p>
                {place.ottomanPeriod && <p className="mt-1 text-xs text-gold-light">Ottoman: {place.ottomanPeriod}</p>}
                <p className="mt-4 text-sm leading-relaxed text-ivory/80">{place.description}</p>
                {place.roles.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {place.roles.map((r) => (
                      <li key={r} className="rounded-full border hairline px-2.5 py-1 text-[0.68rem] text-ivory/75">
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
                {place.landmarks && (
                  <div className="mt-4">
                    <p className="label-caps text-ash">Landmarks</p>
                    <ul className="mt-1.5 space-y-1 text-sm text-ivory/75">
                      {place.landmarks.map((l) => (
                        <li key={l}>◆ {l}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {place.events && (
                  <div className="mt-4">
                    <p className="label-caps text-ash">Events</p>
                    <ul className="mt-1.5 space-y-1.5 text-sm">
                      {place.events.map((e) => (
                        <li key={e.year + e.text} className="flex gap-2">
                          <span className="w-16 shrink-0 text-gold-light">{e.year}</span>
                          <span className="text-ivory/75">{e.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(people.length > 0 || nearbyBattles.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {people.map((p) => (
                      <Link key={p.href} href={p.href} className="rounded-full border border-gold/30 px-2.5 py-1 text-[0.7rem] text-gold-light hover:border-gold">
                        {p.name}
                      </Link>
                    ))}
                    {nearbyBattles.map((b) => (
                      <Link key={b.id} href={`/battles/#${b.id}`} className="rounded-full border hairline px-2.5 py-1 text-[0.7rem] text-ivory/75 hover:border-gold/40">
                        ⚔ {b.name} ({resultLabel[b.result]})
                      </Link>
                    ))}
                  </div>
                )}
                {place.sources && <SourcesList ids={place.sources} className="mt-4" />}
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border hairline bg-white/[0.02] p-5" aria-live="polite">
            <p className="label-caps text-gold">{snapshot.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory/80">{snapshot.caption}</p>
            <ul className="mt-3 space-y-1.5 text-xs text-ash">
              {snapshot.notes.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border hairline bg-white/[0.02] p-5">
            <p className="label-caps text-gold">Layers</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                [
                  ['cities', 'Cities'],
                  ['battles', 'Battles'],
                  ['routes', 'Trade & pilgrim routes'],
                  ['rivers', 'Rivers'],
                  ['labels', 'Sea names'],
                ] as [Layer, string][]
              ).map(([k, label]) => (
                <button key={k} onClick={() => toggle(k)} aria-pressed={layers[k]} className={cn('rounded-xl border px-3 py-2 text-left text-xs transition', layers[k] ? 'border-gold/50 bg-gold/10 text-gold-light' : 'border-white/10 text-ivory/60')}>
                  {label}
                </button>
              ))}
            </div>
            {layers.battles && (
              <div className="mt-3 flex gap-1 rounded-full border hairline p-1 text-xs">
                {(['period', 'all'] as const).map((s) => (
                  <button key={s} onClick={() => setBattleScope(s)} aria-pressed={battleScope === s} className={cn('flex-1 rounded-full px-2 py-1 transition', battleScope === s ? 'bg-gold text-ink' : 'text-ivory/60')}>
                    {s === 'period' ? 'Battles of this period' : 'All battles'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-3xl border hairline bg-white/[0.02] p-5">
            <p className="label-caps mb-3 text-gold">Legend</p>
            <MapLegend statuses={snapshot.year === 1922 ? ['successor'] : ['core', 'vassal', 'contested']} className="flex-col !items-start" />
            <ul className="mt-3 space-y-1.5 text-xs text-ivory/70">
              <li>◆ Capital · ● City · ✕ Battle (gold: Ottoman victory, red: defeat)</li>
              {layers.routes && <li>Dashed lines: gold — land routes, blue — sea lanes, green — pilgrimage routes</li>}
              {snapshot.overlays?.map((o) => (
                <li key={o.id}>Hatched {o.kind === 'byzantine' ? 'violet' : 'blue'}: {o.label}</li>
              ))}
            </ul>
            <p className="mt-3 text-[0.68rem] text-ash">Drag to pan · scroll or pinch to zoom · click a city for its history. Borders are simplified and approximate.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
