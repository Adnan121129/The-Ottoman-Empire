'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { factors, phases, type Factor } from '@/data/narratives';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

const KINDS: { id: Factor['kind'] | 'all'; label: string }[] = [
  { id: 'all', label: 'All factors' },
  { id: 'external', label: 'External pressure' },
  { id: 'internal', label: 'Internal politics' },
  { id: 'economic', label: 'Economy' },
  { id: 'ideas', label: 'Ideas & reform' },
];

const kindColor: Record<Factor['kind'], string> = {
  external: 'bg-crimson',
  internal: 'bg-gold',
  economic: 'bg-jade',
  ideas: 'bg-[#8fa7d6]',
};

export function TransformationExplorer() {
  const { reducedMotion } = useSettings();
  const [phaseId, setPhaseId] = useState('transformation');
  const [kind, setKind] = useState<Factor['kind'] | 'all'>('all');
  const phase = phases.find((p) => p.id === phaseId)!;
  const idx = phases.findIndex((p) => p.id === phaseId);
  const active = factors.filter((f) => f.phases.includes(phaseId) && (kind === 'all' || f.kind === kind));
  const other = factors.filter((f) => !f.phases.includes(phaseId) && (kind === 'all' || f.kind === kind));

  return (
    <div>
      {/* Phase rail */}
      <div className="relative">
        <div className="absolute inset-x-0 top-[1.15rem] hidden h-px bg-gradient-to-r from-gold/10 via-gold/50 to-[#d07a88]/50 sm:block" aria-hidden="true" />
        <ol role="tablist" aria-label="Phases of Ottoman history" className="relative grid grid-cols-2 gap-3 sm:grid-cols-5">
          {phases.map((p, i) => (
            <li key={p.id} className="flex">
              <button
                role="tab"
                aria-selected={p.id === phaseId}
                onClick={() => setPhaseId(p.id)}
                className={cn('group flex w-full flex-col items-start rounded-2xl px-1 text-left sm:items-center sm:text-center', i === 4 && 'col-span-2 sm:col-span-1')}
              >
                <span className={cn('grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold transition', p.id === phaseId ? 'border-gold bg-gold text-ink' : 'border-gold/40 bg-ink text-gold-light group-hover:border-gold')}>{i + 1}</span>
                <span className={cn('mt-3 font-display text-xl uppercase leading-tight tracking-wide transition sm:text-[1.35rem] xl:text-2xl', p.id === phaseId ? 'text-ivory' : 'text-ivory/50 group-hover:text-ivory/80')}>{p.name}</span>
                <span className="text-xs text-ash">{p.years}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase.id}
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="mt-10 grid gap-6 rounded-3xl border hairline bg-white/[0.02] p-7 sm:p-10 lg:grid-cols-[1.3fr_1fr]"
          role="tabpanel"
        >
          <div>
            <p className="label-caps text-gold">
              Phase {idx + 1} of 5 · {phase.years}
            </p>
            <h3 className="display-title mt-3 text-4xl text-ivory sm:text-5xl">{phase.name}</h3>
            <p className="mt-4 text-lg leading-relaxed text-ivory/80">{phase.text}</p>
          </div>
          <div className="self-start rounded-2xl border border-[#8fa7d6]/30 bg-[#8fa7d6]/[0.06] p-5">
            <CertaintyBadge kind="interpretation" />
            <p className="mt-3 text-sm leading-relaxed text-ivory/80">{phase.caveat}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-3xl text-ivory">What drove change?</h3>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter factors by type">
          {KINDS.map((k) => (
            <button
              key={k.id}
              onClick={() => setKind(k.id)}
              aria-pressed={kind === k.id}
              className={cn('shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition', kind === k.id ? 'border-gold bg-gold text-ink' : 'hairline text-ivory/75 hover:border-gold/50')}
            >
              {k.id !== 'all' && <span className={cn('mr-2 inline-block h-2 w-2 rounded-full align-middle', kindColor[k.id])} aria-hidden="true" />}
              {k.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-ash">Factors highlighted below were most significant in the selected phase. None of them alone explains the empire’s history.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...active, ...other].map((f) => {
          const on = f.phases.includes(phaseId);
          return (
            <motion.li layout={!reducedMotion} key={f.id} className={cn('rounded-2xl border p-5 transition-colors duration-500', on ? 'border-gold/35 bg-gold/[0.05]' : 'hairline bg-transparent opacity-45')}>
              <p className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.18em] text-ash">
                <span className={cn('h-2 w-2 rounded-full', kindColor[f.kind])} aria-hidden="true" />
                {KINDS.find((k) => k.id === f.kind)!.label}
                {on && <span className="sr-only">(significant in this phase)</span>}
              </p>
              <h4 className="mt-2 font-display text-xl text-ivory">{f.name}</h4>
              <p className="mt-2 text-sm leading-relaxed text-ivory/70">{f.text}</p>
              <p className="mt-3 text-[0.65rem] uppercase tracking-wider text-gold/70">{f.phases.map((id) => phases.find((p) => p.id === id)?.name).join(' · ')}</p>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
