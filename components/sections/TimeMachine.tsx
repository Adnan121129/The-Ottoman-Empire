'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Building2, Crown, Flag, Landmark, Map as MapIcon, ScrollText, Swords, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import { MapCanvas, MapLegend, placeMarkers } from '@/components/maps/MapCanvas';
import { Portrait } from '@/components/ui/Portrait';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { eraForYear, eraTones, eras } from '@/data/eras';
import { events } from '@/data/events';
import { allFigures, categoryLabel } from '@/data/people';
import { buildings } from '@/data/buildings';
import { capitalForYear, places } from '@/data/places';
import { reignLabel, rulerForYear } from '@/data/rulers';
import { snapshotForYear } from '@/data/territories';
import { warsForYear } from '@/data/wars';
import { useSettings } from '@/lib/providers';
import { cn, century } from '@/lib/utils';

const MIN = 1299;
const MAX = 1924;
const PRESETS = [1326, 1389, 1402, 1453, 1517, 1529, 1566, 1571, 1683, 1699, 1774, 1826, 1839, 1876, 1908, 1915, 1922, 1924];

function Card({ icon, label, children, className }: { icon: ReactNode; label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-3xl border hairline bg-black/30 p-5 backdrop-blur-sm', className)}>
      <p className="label-caps mb-3 flex items-center gap-2 text-gold">
        {icon}
        {label}
      </p>
      {children}
    </div>
  );
}

export function TimeMachine() {
  const { reducedMotion } = useSettings();
  const [year, setYear] = useState(1453);
  const [draft, setDraft] = useState('1453');

  const set = (y: number) => {
    const v = Math.min(MAX, Math.max(MIN, Math.round(y)));
    setYear(v);
    setDraft(String(v));
  };

  const data = useMemo(() => {
    const ruler = rulerForYear(year);
    const era = eraForYear(year);
    const snapshot = snapshotForYear(year);
    const capital = capitalForYear(year);
    const exact = events.filter((e) => e.year === year).sort((a, b) => b.importance - a.importance);
    const near = exact.length
      ? exact
      : events
          .map((e) => ({ e, d: Math.abs(e.year - year) }))
          .filter((x) => x.d <= 8)
          .sort((a, b) => a.d - b.d || b.e.importance - a.e.importance)
          .map((x) => x.e)
          .slice(0, 3);
    const wars = warsForYear(year);
    const figures = allFigures.filter((f) => year >= f.activeFrom && year <= f.activeTo).slice(0, 6);
    const arch = buildings
      .filter((b) => b.startYear >= 1000 && year >= b.startYear - 2 && year <= b.endYear + 12)
      .sort((a, b) => Math.abs(a.endYear - year) - Math.abs(b.endYear - year))
      .slice(0, 3);
    return { ruler, era, snapshot, capital, near, exact: exact.length > 0, wars, figures, arch };
  }, [year]);

  const tone = eraTones[data.era.tone];
  const markers = useMemo(() => placeMarkers(places.filter((p) => p.id === data.capital.placeId || p.importance === 3), data.capital.placeId), [data.capital.placeId]);
  const k = reducedMotion ? 0 : 1;

  return (
    <section id="time-machine" tabIndex={-1} aria-labelledby="tm-title" className="relative overflow-hidden py-28 outline-none sm:py-36">
      <div className="absolute inset-0 -z-10 transition-[background] duration-1000" style={{ background: `radial-gradient(80% 60% at 70% 30%, ${tone.to}, ${tone.from} 55%, #0a0908)` }} aria-hidden="true" />
      <div className="pattern-girih absolute inset-0 -z-10 opacity-[0.03]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="label-caps text-gold">Chapter V · A signature experience</p>
            <h2 id="tm-title" className="display-title mt-4 text-5xl text-ivory sm:text-7xl">
              The Ottoman Time Machine
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-ivory/70">Choose any year from 1299 to 1924. The ruler, capital, borders, wars, people and buildings of that moment assemble around you.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 rounded-[2rem] border border-gold/25 bg-black/40 p-5 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => set(year - 10)} className="h-11 rounded-full border hairline px-3 text-sm text-ivory/80 hover:border-gold/50" aria-label="Back ten years">
                −10
              </button>
              <button onClick={() => set(year - 1)} className="h-11 w-11 rounded-full border hairline text-ivory/80 hover:border-gold/50" aria-label="Back one year">
                −1
              </button>
              <label className="relative">
                <span className="sr-only">Year</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN}
                  max={MAX}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => set(Number(draft) || year)}
                  onKeyDown={(e) => e.key === 'Enter' && set(Number(draft) || year)}
                  className="w-44 rounded-2xl border border-gold/40 bg-black/50 py-1 text-center font-display text-6xl text-gold-light [appearance:textfield] focus:border-gold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </label>
              <button onClick={() => set(year + 1)} className="h-11 w-11 rounded-full border hairline text-ivory/80 hover:border-gold/50" aria-label="Forward one year">
                +1
              </button>
              <button onClick={() => set(year + 10)} className="h-11 rounded-full border hairline px-3 text-sm text-ivory/80 hover:border-gold/50" aria-label="Forward ten years">
                +10
              </button>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 flex h-2 -translate-y-1/2 overflow-hidden rounded-full" aria-hidden="true">
                  {eras.map((e) => (
                    <span key={e.id} style={{ flexGrow: Math.min(e.end, MAX) - Math.max(e.start, MIN), background: eraTones[e.tone].accent, opacity: data.era.id === e.id ? 0.9 : 0.3 }} />
                  ))}
                </div>
                <input type="range" min={MIN} max={MAX} value={year} onChange={(e) => set(Number(e.target.value))} className="relative z-10 w-full cursor-pointer appearance-none bg-transparent accent-[#e8cd86] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-gold-light [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(232,205,134,0.7)]" aria-label="Select a year between 1299 and 1924" />
              </div>
              <div className="mt-2 flex justify-between text-[0.65rem] text-ash">
                <span>1299</span>
                <span>
                  {data.era.name} · {century(year)}
                </span>
                <span>1924</span>
              </div>
            </div>
          </div>
          <div className="no-scrollbar mt-5 flex gap-1.5 overflow-x-auto">
            {PRESETS.map((p) => (
              <button key={p} onClick={() => set(p)} className={cn('shrink-0 rounded-full border px-3 py-1 text-xs transition', p === year ? 'border-gold bg-gold text-ink' : 'border-white/10 text-ivory/65 hover:text-ivory')}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 grid gap-4 lg:grid-cols-12" aria-live="polite">
          <div className="grid content-start gap-4 lg:col-span-5">
          <Card icon={<Crown className="h-3.5 w-3.5" aria-hidden="true" />} label="On the throne">
            <AnimatePresence mode="wait">
              <motion.div key={data.ruler?.id ?? (year > 1922 ? 'caliph' : 'interregnum')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 * k }} className="flex gap-4">
                {data.ruler ? (
                  <>
                    <Portrait spec={data.ruler.portrait} name={data.ruler.name} className="aspect-[4/5] w-24 shrink-0" showLabel={false} />
                    <div>
                      <p className="font-display text-3xl text-ivory">{data.ruler.name}</p>
                      <p className="text-sm italic text-ivory/60">{data.ruler.epithet}</p>
                      <p className="mt-1 text-xs text-ash">{reignLabel(data.ruler)}</p>
                      <Link href={`/sultans/${data.ruler.id}/`} className="mt-3 inline-block text-xs text-gold-light underline decoration-gold/40 underline-offset-2">
                        Profile →
                      </Link>
                    </div>
                  </>
                ) : year > 1922 ? (
                  <div>
                    <p className="font-display text-3xl text-ivory">No sultan</p>
                    <p className="mt-2 text-sm text-ivory/70">The Sultanate was abolished on 1 November 1922. Abdülmecid II served as Caliph only until 3 March 1924.</p>
                    <Link href="/figures/abdulmejid-ii/" className="mt-3 inline-block text-xs text-gold-light underline">
                      Abdülmecid II →
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="font-display text-3xl text-ivory">The Interregnum</p>
                    <p className="mt-2 text-sm text-ivory/70">After Ankara (1402) Bayezid I’s sons — Süleyman, İsa, Musa and Mehmed — fought for the throne until 1413.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>

          <Card icon={<Landmark className="h-3.5 w-3.5" aria-hidden="true" />} label="Capital">
            <p className="font-display text-2xl text-ivory">{data.capital.label}</p>
            {data.capital.note && <p className="mt-2 text-xs text-ash">{data.capital.note}</p>}
          </Card>
          <Card icon={<Flag className="h-3.5 w-3.5" aria-hidden="true" />} label="Territory & status">
            <p className="text-ivory">{data.era.status}</p>
            <p className="mt-2 text-xs text-ash">Era: {data.era.name}</p>
          </Card>
          </div>

          <Card icon={<MapIcon className="h-3.5 w-3.5" aria-hidden="true" />} label={`Empire map · snapshot ${data.snapshot.label}`} className="lg:col-span-7">
            <div className="relative aspect-[1000/657] overflow-hidden rounded-2xl border hairline">
              <MapCanvas snapshot={data.snapshot} markers={markers} ariaLabel={`Territory around ${data.snapshot.label}`} className="h-full w-full" showSeaLabels={false} />
            </div>
            <MapLegend statuses={data.snapshot.year === 1922 ? ['successor'] : ['core', 'vassal', 'contested']} className="mt-3" />
            <p className="mt-2 text-sm text-ivory/70">{data.snapshot.caption}</p>
            <p className="mt-1 text-[0.68rem] text-ash">The map shows the nearest available snapshot at or before {year}; borders are approximate.</p>
          </Card>

          <Card icon={<ScrollText className="h-3.5 w-3.5" aria-hidden="true" />} label={data.exact ? `Major events of ${year}` : 'Nearest major events'} className="lg:col-span-6">
            {data.near.length === 0 && <p className="text-sm text-ivory/60">No major event recorded in this site’s data within eight years of {year}.</p>}
            <ul className="space-y-3">
              {data.near.slice(0, 3).map((e) => (
                <li key={e.id} className="flex gap-3">
                  <span className="w-12 shrink-0 font-display text-xl text-gold-light">{e.year}</span>
                  <span>
                    <span className="block text-ivory">{e.title}</span>
                    <span className="block text-sm text-ivory/60">{e.description}</span>
                    {e.certainty && e.certainty !== 'confirmed' && <CertaintyBadge kind={e.certainty} className="mt-1" />}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card icon={<Swords className="h-3.5 w-3.5" aria-hidden="true" />} label="Current wars" className="lg:col-span-6">
            {data.wars.length === 0 ? (
              <p className="text-sm text-ivory/60">No major war in this year in the site’s data — though frontier warfare and revolts were common.</p>
            ) : (
              <ul className="space-y-2.5">
                {data.wars.map((w) => (
                  <li key={w.id}>
                    <span className="block text-ivory">{w.name}</span>
                    <span className="text-xs text-ash">
                      {w.start === w.end ? w.start : `${w.start}–${w.end}`} · vs {w.opponents} · {w.outcome}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card icon={<Users className="h-3.5 w-3.5" aria-hidden="true" />} label="Important figures" className="lg:col-span-6">
            {data.figures.length === 0 ? (
              <p className="text-sm text-ivory/60">No profiled figure (besides the ruler) is active in this year.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {data.figures.map((f) => (
                  <li key={f.id}>
                    <Link href={`/figures/${f.id}/`} className="block rounded-full border hairline px-3 py-1.5 text-sm text-ivory/85 transition hover:border-gold/50">
                      {f.name} <span className="text-[0.65rem] text-ash">· {categoryLabel[f.category]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card icon={<Building2 className="h-3.5 w-3.5" aria-hidden="true" />} label="Architecture" className="lg:col-span-6">
            {data.arch.length === 0 ? (
              <p className="text-sm text-ivory/60">No profiled monument was being built around {year}.</p>
            ) : (
              <ul className="space-y-2">
                {data.arch.map((b) => (
                  <li key={b.id}>
                    <Link href={`/architecture/#${b.id}`} className="text-ivory hover:text-gold-light">
                      {b.name}
                    </Link>
                    <span className="block text-xs text-ash">
                      {b.built}
                      {b.architect ? ` · ${b.architect}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card icon={<ScrollText className="h-3.5 w-3.5" aria-hidden="true" />} label="Historical context" className="lg:col-span-12">
            <AnimatePresence mode="wait">
              <motion.div key={data.era.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 * k }} className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-10">
                <div>
                  <p className="font-display text-3xl text-ivory">{data.era.name}</p>
                  <p className="text-sm text-gold-light">{data.era.range}</p>
                  <p className="mt-1 text-sm italic text-ivory/60">{data.era.tagline}</p>
                </div>
                <p className="leading-relaxed text-ivory/75">{data.era.summary}</p>
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </section>
  );
}
