'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Crosshair, Flag, Target, Users } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { battles, kindLabel, resultLabel } from '@/data/battles';
import { eras } from '@/data/eras';
import { getRuler } from '@/data/rulers';
import { snapshotForYear } from '@/data/territories';
import { places } from '@/data/places';
import type { Battle } from '@/data/types';
import { MapCanvas, type MapMarker } from '@/components/maps/MapCanvas';
import { AssessmentPanel, NotesList } from '@/components/ui/Certainty';
import { SourcesList } from '@/components/ui/SourcesList';
import { BattleCard, resultTone } from './BattleCard';
import { viewBoxFor, MAP_HEIGHT, MAP_WIDTH } from '@/lib/geo';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

function BattleDetail({ battle }: { battle: Battle }) {
  const view = useMemo(() => viewBoxFor(battle.view, MAP_WIDTH / MAP_HEIGHT, 0.04), [battle]);
  const snapshot = snapshotForYear(battle.year);
  const ruler = getRuler(battle.rulerId);
  const [x0, y0, x1, y1] = battle.view;
  const context: MapMarker[] = places
    .filter((p) => p.type !== 'battlefield' && p.coords[0] > x0 && p.coords[0] < x1 && p.coords[1] > y0 && p.coords[1] < y1 && Math.hypot(p.coords[0] - battle.coords[0], p.coords[1] - battle.coords[1]) > 0.25)
    .map((p) => ({ id: p.id, coords: p.coords, label: p.name.split(' / ')[0], kind: 'city' as const, importance: 3 as const }));
  const markers: MapMarker[] = [...context, { id: battle.id, coords: battle.coords, label: battle.name.replace(/^(Battle|Siege) of /, ''), kind: battle.result === 'ottoman-victory' ? 'battle-win' : battle.result === 'ottoman-defeat' ? 'battle-loss' : 'battle-other' }];
  return (
    <article aria-labelledby="battle-title">
      <div className="relative aspect-[1000/657] overflow-hidden rounded-[2rem] border hairline bg-black">
        <MapCanvas key={battle.id} snapshot={snapshot} view={view} movements={battle.movements} markers={markers} selectedMarkerId={battle.id} ariaLabel={`Campaign map: ${battle.name}`} className="h-full w-full" territoryOpacity={0.4} showSeaLabels={false} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-5 gap-y-1 bg-gradient-to-t from-black/90 to-transparent px-5 pb-3 pt-10 text-[0.65rem] text-ivory/75">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-gold-light" aria-hidden="true" /> Ottoman forces
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-[#8db0d6]" aria-hidden="true" /> Opponents
          </span>
          <span className="text-ash">Schematic campaign routes — not precise troop positions. Borders: {snapshot.label} snapshot.</span>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="label-caps rounded-full border hairline px-3 py-1 text-gold">{kindLabel[battle.kind]}</span>
        <span className="flex items-center gap-2 rounded-full border hairline px-3 py-1 text-xs text-ivory/80">
          <span className={cn('h-2 w-2 rounded-full', resultTone[battle.result])} aria-hidden="true" />
          {resultLabel[battle.result]}
        </span>
        {ruler && (
          <Link href={`/sultans/${ruler.id}/`} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold-light hover:border-gold">
            Reign of {ruler.name}
          </Link>
        )}
      </div>
      <h2 id="battle-title" className="display-title mt-4 text-5xl text-ivory sm:text-6xl">
        {battle.name}
      </h2>
      {battle.altName && <p className="mt-1 text-ivory/60 italic">{battle.altName}</p>}
      <p className="mt-2 font-display text-2xl text-gold-light">{battle.date}</p>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ivory/80">{battle.summary}</p>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-3xl border hairline bg-gold/10 md:grid-cols-2">
        <div className="bg-charcoal p-5">
          <dt className="label-caps flex items-center gap-2 text-ash">
            <Crosshair className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> Location
          </dt>
          <dd className="mt-2 text-ivory/85">{battle.location}</dd>
        </div>
        <div className="bg-charcoal p-5">
          <dt className="label-caps flex items-center gap-2 text-ash">
            <Target className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> Strategic objective
          </dt>
          <dd className="mt-2 text-ivory/85">{battle.objective}</dd>
        </div>
        <div className="bg-charcoal p-5">
          <dt className="label-caps flex items-center gap-2 text-ash">
            <Users className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> Ottoman side · commanders
          </dt>
          <dd className="mt-2 text-ivory/85">{battle.ottomanCommanders.join(' · ')}</dd>
        </div>
        <div className="bg-charcoal p-5">
          <dt className="label-caps flex items-center gap-2 text-ash">
            <Users className="h-3.5 w-3.5 text-[#8db0d6]" aria-hidden="true" /> Opposing forces · commanders
          </dt>
          <dd className="mt-2 text-ivory/85">
            {battle.opponents}
            <span className="mt-1 block text-sm text-ivory/60">{battle.opponentCommanders.join(' · ')}</span>
          </dd>
        </div>
        <div className="bg-charcoal p-5 md:col-span-2">
          <dt className="label-caps flex items-center gap-2 text-ash">
            <Flag className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> Outcome
          </dt>
          <dd className="mt-2 text-ivory/85">{battle.outcome}</dd>
        </div>
      </dl>
      <section className="mt-8">
        <h3 className="label-caps text-gold">Historical consequences</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {battle.consequences.map((c) => (
            <li key={c} className="rounded-2xl border hairline p-3 text-sm text-ivory/80">
              {c}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8 space-y-4">
        <AssessmentPanel assessment={battle.assessment} />
        <NotesList notes={battle.notes} />
        <p className="text-xs text-ash">Army sizes are omitted deliberately: contemporary figures are unreliable and modern estimates vary widely.</p>
      </section>
      <SourcesList ids={battle.sources} className="mt-6" />
    </article>
  );
}

export function BattleExplorer() {
  const { reducedMotion } = useSettings();
  const [era, setEra] = useState('all');
  const [result, setResult] = useState<'all' | Battle['result']>('all');
  const [selectedId, setSelectedId] = useState(battles.find((b) => b.id === 'mohacs')!.id);
  const detailRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => battles.filter((b) => (era === 'all' || b.eraId === era) && (result === 'all' || b.result === result)).sort((a, b) => a.year - b.year), [era, result]);
  const selected = battles.find((b) => b.id === selectedId) ?? battles[0];

  const select = useCallback(
    (id: string, scroll = false) => {
      setSelectedId(id);
      history.replaceState(null, '', `#${id}`);
      if (scroll && window.innerWidth < 1024) detailRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    [reducedMotion],
  );

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (battles.some((b) => b.id === id)) {
        setSelectedId(id);
        setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' }), 50);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const usedEras = eras.filter((e) => battles.some((b) => b.eraId === e.id));

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[22rem_1fr]">
      <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
        <div className="space-y-3">
          <label className="block">
            <span className="label-caps text-ash">Era</span>
            <select value={era} onChange={(e) => setEra(e.target.value)} className="mt-1.5 w-full rounded-xl border hairline bg-black/50 px-3 py-2 text-sm text-ivory">
              <option value="all">All eras</option>
              {usedEras.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
          <div role="group" aria-label="Filter by outcome" className="flex flex-wrap gap-1.5">
            {(['all', 'ottoman-victory', 'ottoman-defeat', 'inconclusive', 'mixed'] as const).map((r) => (
              <button key={r} onClick={() => setResult(r)} aria-pressed={result === r} className={cn('rounded-full border px-2.5 py-1 text-[0.68rem] transition', result === r ? 'border-gold bg-gold text-ink' : 'border-white/10 text-ivory/65')}>
                {r === 'all' ? 'All outcomes' : resultLabel[r]}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-xs text-ash" aria-live="polite">
          {list.length} battles and campaigns
        </p>
        <ul className="mt-3 space-y-2">
          {list.map((b) => (
            <li key={b.id}>
              <BattleCard battle={b} active={b.id === selected.id} onSelect={() => select(b.id, true)} />
            </li>
          ))}
        </ul>
      </div>
      <div ref={detailRef} className="scroll-mt-24">
        <AnimatePresence mode="wait">
          <motion.div key={selected.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.4 }}>
            <BattleDetail battle={selected} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
