'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { siegeSteps, type SiegeStep } from '@/data/narratives';
import { getRuler } from '@/data/rulers';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { Portrait } from '@/components/ui/Portrait';
import { SourcesList } from '@/components/ui/SourcesList';
import { useInView } from '@/hooks/useInView';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

type Focus = SiegeStep['focus'][number];

const WALL_TOP: [number, number] = [252, 178];
const WALL_BOTTOM: [number, number] = [240, 572];

/** Schematic, not-to-scale reconstruction of Constantinople in 1453. */
function SiegeMap({ step }: { step: SiegeStep }) {
  const { reducedMotion } = useSettings();
  const on = (f: Focus) => step.focus.includes(f);
  const o = (f: Focus) => (on(f) ? 1 : 0.18);
  const t = { duration: reducedMotion ? 0 : 0.8 };
  const towers = Array.from({ length: 16 }, (_, i) => {
    const k = i / 15;
    return [WALL_TOP[0] + (WALL_BOTTOM[0] - WALL_TOP[0]) * k, WALL_TOP[1] + (WALL_BOTTOM[1] - WALL_TOP[1]) * k] as const;
  });
  const captured = step.id === 'capture';

  return (
    <svg viewBox="0 0 1000 700" className="h-full w-full" role="img" aria-label={`Schematic map of the siege of Constantinople, step: ${step.title}. ${step.text}`}>
      <defs>
        <radialGradient id="sg-sea" cx="0.6" cy="0.6" r="0.9">
          <stop offset="0" stopColor="#14222c" />
          <stop offset="1" stopColor="#070b0f" />
        </radialGradient>
        <linearGradient id="sg-city" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2c22" />
          <stop offset="1" stopColor="#2a1f19" />
        </linearGradient>
        <pattern id="sg-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="none" />
          <rect width="1.2" height="8" fill="#c9a24a" opacity="0.25" />
        </pattern>
        <marker id="sg-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" fill="#e8cd86" />
        </marker>
        <marker id="sg-arrow-b" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" fill="#8db0d6" />
        </marker>
      </defs>
      <rect width="1000" height="700" fill="url(#sg-sea)" />
      {/* Land masses */}
      <path d="M0 0L170 0L190 60L230 140L250 175L330 205L430 235L540 255L640 270L715 300L700 360L660 420L580 480L470 530L360 560L240 575L120 590L0 600Z" fill="#1f1914" />
      <path d="M250 175L330 205L430 235L540 255L640 270L715 300L700 360L660 420L580 480L470 530L360 560L240 575Z" fill="url(#sg-city)" />
      <motion.path d="M250 175L330 205L430 235L540 255L640 270L715 300L700 360L660 420L580 480L470 530L360 560L240 575Z" fill="#e8cd86" initial={false} animate={{ opacity: captured ? 0.16 : 0 }} transition={t} />
      <path d="M250 175L330 205L430 235L540 255L640 270L715 300L700 360L660 420L580 480L470 530L360 560L240 575Z" fill="url(#sg-hatch)" opacity="0.5" />
      <path d="M210 0L800 0L770 120L740 200L730 235L640 225L540 215L430 195L330 165L265 135L230 70Z" fill="#1f1914" />
      <path d="M860 0L1000 0L1000 700L900 700L880 560L860 440L845 330L830 230L840 120Z" fill="#1f1914" />
      {/* Galata walls (Genoese colony) */}
      <path d="M560 222L600 160L690 150L735 232" fill="none" stroke="#a99f8c" strokeWidth="2" strokeDasharray="4 3" />

      {/* Sea walls */}
      <path d="M250 175L330 205L430 235L540 255L640 270L715 300L700 360L660 420L580 480L470 530L360 560L240 575" fill="none" stroke="#c9a24a" strokeOpacity="0.45" strokeWidth="2" />

      {/* Land walls with towers */}
      <motion.g initial={false} animate={{ opacity: o('walls') }} transition={t}>
        <line x1={WALL_TOP[0]} y1={WALL_TOP[1]} x2={WALL_BOTTOM[0]} y2={WALL_BOTTOM[1]} stroke="#e8cd86" strokeWidth="6" />
        <line x1={WALL_TOP[0] - 12} y1={WALL_TOP[1] + 6} x2={WALL_BOTTOM[0] - 12} y2={WALL_BOTTOM[1] - 4} stroke="#e8cd86" strokeWidth="2.5" strokeOpacity="0.7" />
        <line x1={WALL_TOP[0] - 22} y1={WALL_TOP[1] + 10} x2={WALL_BOTTOM[0] - 22} y2={WALL_BOTTOM[1] - 6} stroke="#8db0d6" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="6 4" />
        {towers.map(([x, y], i) => (
          <rect key={i} x={x - 5} y={y - 5} width="10" height="10" fill="#e8cd86" />
        ))}
        <text x="270" y="300" fill="#e8cd86" fontSize="13" fontFamily="var(--font-manrope)" fontWeight="600">Gate of Charisius</text>
        <text x="268" y="384" fill="#e8cd86" fontSize="13" fontFamily="var(--font-manrope)" fontWeight="600">Gate of St Romanus</text>
        <text x="258" y="560" fill="#e8cd86" fontSize="13" fontFamily="var(--font-manrope)" fontWeight="600">Golden Gate</text>
        <text x="40" y="640" fill="#a99f8c" fontSize="12" fontFamily="var(--font-manrope)">Theodosian land walls · moat · outer and inner walls</text>
      </motion.g>

      {/* Breach in the Lycus valley */}
      <motion.g initial={false} animate={{ opacity: on('breach') ? 1 : 0 }} transition={t}>
        <ellipse cx="246" cy="355" rx="34" ry="52" fill="#a31d33" fillOpacity="0.35" stroke="#f07a8a" strokeDasharray="5 4" />
        {[300, 330, 360, 390, 420].map((y, i) => (
          <motion.path key={y} d={`M150 ${y + 20}Q200 ${y} 236 ${355 + (i - 2) * 8}`} fill="none" stroke="#e8cd86" strokeWidth="3" markerEnd="url(#sg-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: on('breach') ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : i * 0.15 }} />
        ))}
        <text x="290" y="345" fill="#f3a4ae" fontSize="14" fontFamily="var(--font-manrope)" fontWeight="700">Mesoteichion — the breach</text>
      </motion.g>

      {/* Ottoman camp & Mehmed's tent */}
      <motion.g initial={false} animate={{ opacity: o('camp') }} transition={t}>
        {Array.from({ length: 22 }).map((_, i) => {
          const x = 70 + (i % 6) * 26 + (Math.floor(i / 6) % 2) * 12;
          const y = 250 + Math.floor(i / 6) * 70 + (i % 3) * 8;
          return <path key={i} d={`M${x} ${y}l9 -14l9 14z`} fill="#a31d33" stroke="#e8cd86" strokeWidth="0.8" />;
        })}
        <path d="M168 372l16 -26l16 26z" fill="#c8283f" stroke="#f3dc9a" strokeWidth="1.5" />
        <text x="60" y="230" fill="#f3a4ae" fontSize="14" fontFamily="var(--font-manrope)" fontWeight="700">Ottoman camp</text>
        <text x="118" y="396" fill="#f3dc9a" fontSize="12" fontFamily="var(--font-manrope)">Mehmed II’s tent</text>
      </motion.g>

      {/* Cannon batteries */}
      <motion.g initial={false} animate={{ opacity: o('cannon') }} transition={t}>
        {[290, 330, 370, 410, 470].map((y, i) => (
          <g key={y}>
            <rect x="200" y={y - 5} width="18" height="10" rx="3" fill="#8a6a28" stroke="#f3dc9a" />
            {on('cannon') && !reducedMotion && (
              <motion.circle cx="226" cy={y} r="4" fill="#ffb85c" initial={{ cx: 222, opacity: 0 }} animate={{ cx: [222, 240], opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.35, repeatDelay: 1.2 }} />
            )}
          </g>
        ))}
        <text x="120" y="500" fill="#e8cd86" fontSize="12" fontFamily="var(--font-manrope)" fontWeight="600">Batteries incl. Urban’s great bombard</text>
      </motion.g>

      {/* Chain across the Golden Horn */}
      <motion.g initial={false} animate={{ opacity: o('chain') }} transition={t}>
        <line x1="690" y1="283" x2="708" y2="234" stroke="#8db0d6" strokeWidth="4" strokeDasharray="3 3" />
        <text x="720" y="268" fill="#8db0d6" fontSize="12" fontFamily="var(--font-manrope)" fontWeight="600">The chain (boom)</text>
      </motion.g>

      {/* Rumelihisarı */}
      <motion.g initial={false} animate={{ opacity: o('rumelihisari') }} transition={t}>
        <path d="M776 48l8 -12l8 12v14h-16z" fill="#a31d33" stroke="#f3dc9a" />
        <text x="640" y="40" fill="#f3dc9a" fontSize="13" fontFamily="var(--font-manrope)" fontWeight="700">Rumelihisarı (1452) ↑</text>
      </motion.g>

      {/* Fleet & overland transport */}
      <motion.g initial={false} animate={{ opacity: o('fleet') }} transition={t}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${800 + (i % 3) * 14} ${130 + Math.floor(i / 3) * 18}l12 0l-3 5l-6 0z`} fill="#e8cd86" />
        ))}
        <text x="868" y="118" fill="#e8cd86" fontSize="12" fontFamily="var(--font-manrope)" fontWeight="600" textAnchor="start">Ottoman fleet</text>
        <motion.path d="M940 640C900 560 820 420 760 330C735 300 715 280 700 262" fill="none" stroke="#8db0d6" strokeWidth="3" markerEnd="url(#sg-arrow-b)" initial={{ pathLength: 0 }} animate={{ pathLength: on('fleet') ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 2 }} />
        <text x="850" y="600" fill="#8db0d6" fontSize="12" fontFamily="var(--font-manrope)">Relief ships, 20 April</text>
      </motion.g>
      <motion.g initial={false} animate={{ opacity: on('overland') ? 1 : 0 }} transition={t}>
        <motion.path d="M805 150C760 120 680 95 600 110C530 125 480 170 455 215" fill="none" stroke="#e8cd86" strokeWidth="4" strokeDasharray="10 7" markerEnd="url(#sg-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: on('overland') ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 2.4 }} />
        <text x="520" y="92" fill="#f3dc9a" fontSize="14" fontFamily="var(--font-manrope)" fontWeight="700">Ships hauled overland, 22 April</text>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${430 + i * 22} ${222 + i * 3}l12 0l-3 5l-6 0z`} fill="#e8cd86" />
        ))}
      </motion.g>

      {/* Hagia Sophia */}
      <motion.g initial={false} animate={{ opacity: on('hagia') ? 1 : 0.55 }} transition={t}>
        <path d="M632 340a16 16 0 0 1 32 0z" fill="#e8cd86" />
        <rect x="628" y="340" width="40" height="8" fill="#e8cd86" />
        <text x="600" y="372" fill="#f3dc9a" fontSize="12" fontFamily="var(--font-manrope)" fontWeight="600">Hagia Sophia</text>
      </motion.g>

      {/* Labels */}
      <text x="470" y="430" fill="#f4ecda" fillOpacity="0.85" fontSize="26" fontFamily="var(--font-cormorant)" letterSpacing="6" textAnchor="middle">CONSTANTINOPLE</text>
      <text x="420" y="214" fill="#8db0d6" fillOpacity="0.8" fontSize="14" fontStyle="italic" fontFamily="var(--font-cormorant)" transform="rotate(14 420 214)">Golden Horn</text>
      <text x="600" y="190" fill="#a99f8c" fontSize="12" fontFamily="var(--font-manrope)">Galata (Genoese)</text>
      <text x="610" y="620" fill="#8db0d6" fillOpacity="0.7" fontSize="18" fontStyle="italic" fontFamily="var(--font-cormorant)">Sea of Marmara</text>
      <text x="842" y="330" fill="#8db0d6" fillOpacity="0.7" fontSize="16" fontStyle="italic" fontFamily="var(--font-cormorant)" transform="rotate(80 842 330)">Bosphorus</text>
      <text x="60" y="120" fill="#a99f8c" fontSize="16" fontFamily="var(--font-cormorant)" letterSpacing="4">THRACE</text>
      <text x="900" y="420" fill="#a99f8c" fontSize="15" fontFamily="var(--font-cormorant)" letterSpacing="3">ASIA</text>
      <text x="990" y="690" fill="#a99f8c" fillOpacity="0.6" fontSize="11" fontFamily="var(--font-manrope)" textAnchor="end">Schematic reconstruction · not to scale · positions approximate</text>
    </svg>
  );
}

export function Siege1453() {
  const { reducedMotion } = useSettings();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ref, inView] = useInView<HTMLElement>({ once: false, rootMargin: '-20%' });
  const step = siegeSteps[i];
  const mehmed = getRuler('mehmed-ii')!;

  useEffect(() => {
    if (!playing || !inView) return;
    const t = setTimeout(() => setI((x) => (x + 1) % siegeSteps.length), 6500);
    return () => clearTimeout(t);
  }, [playing, inView, i]);

  return (
    <section ref={ref} id="constantinople-1453" tabIndex={-1} aria-labelledby="siege-title" className="relative overflow-hidden bg-gradient-to-b from-ink via-[#140a0d] to-ink py-28 outline-none sm:py-36">
      <div className="pattern-girih absolute inset-0 opacity-[0.025]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="label-caps text-gold">Chapter III · 6 April – 29 May 1453</p>
            <h2 id="siege-title" className="display-title mt-4 text-5xl text-ivory sm:text-7xl">
              1453 — <span className="text-gold-gradient">The Fall of Constantinople</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-ivory/70">
              After 1,100 years as the capital of the Eastern Roman Empire, Constantinople fell to the 21-year-old Mehmed II. Step through the siege — every stage is a schematic reconstruction based on eyewitness accounts from both sides.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Portrait spec={mehmed.portrait} name={mehmed.name} className="aspect-[4/5] w-24" size="sm" />
            <div>
              <p className="font-display text-2xl text-ivory">Mehmed II</p>
              <p className="text-xs text-ash">Fâtih — “the Conqueror”</p>
              <Link href="/sultans/mehmed-ii/" className="mt-2 inline-block text-xs text-gold-light underline decoration-gold/40 underline-offset-2">
                Full profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <ol className="no-scrollbar mt-12 flex gap-2 overflow-x-auto" aria-label="Stages of the siege">
          {siegeSteps.map((s, idx) => (
            <li key={s.id} className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => {
                  setI(idx);
                  setPlaying(false);
                }}
                aria-current={idx === i ? 'step' : undefined}
                className={cn('rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition', idx === i ? 'border-gold bg-gold text-ink' : idx < i ? 'border-gold/40 text-gold-light' : 'border-white/10 text-ivory/50 hover:text-ivory')}
              >
                <span className="mr-2 opacity-60">{idx + 1}</span>
                {s.title}
              </button>
              {idx < siegeSteps.length - 1 && <span className="text-gold/50" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="relative aspect-[10/7] overflow-hidden rounded-[2rem] border hairline bg-black">
            <SiegeMap step={step} />
          </div>
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div key={step.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: reducedMotion ? 0 : 0.45 }} className="flex-1 rounded-[2rem] border hairline bg-white/[0.03] p-7" aria-live="polite">
                <p className="label-caps text-gold">
                  Stage {i + 1} of {siegeSteps.length} · {step.date}
                </p>
                <h3 className="mt-3 font-display text-4xl text-ivory">{step.title}</h3>
                <p className="mt-4 leading-relaxed text-ivory/75">{step.text}</p>
                {step.note && (
                  <div className="mt-6 rounded-2xl border hairline bg-black/30 p-4">
                    <CertaintyBadge kind={step.note.kind} long />
                    <p className="mt-2 text-sm text-ivory/70">{step.note.text}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0} className="grid h-11 w-11 place-items-center rounded-full border hairline text-ivory transition hover:border-gold/50 disabled:opacity-30" aria-label="Previous stage">
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => setPlaying((p) => !p)} className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-gold-light" aria-pressed={playing}>
                {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                {playing ? 'Pause' : 'Play the siege'}
              </button>
              <button onClick={() => setI((x) => Math.min(siegeSteps.length - 1, x + 1))} disabled={i === siegeSteps.length - 1} className="grid h-11 w-11 place-items-center rounded-full border hairline text-ivory transition hover:border-gold/50 disabled:opacity-30" aria-label="Next stage">
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { t: 'Eyewitnesses on both sides', d: 'Nicolò Barbaro (Venetian ship’s doctor), George Sphrantzes (Byzantine official), Leonard of Chios (archbishop), Kritovoulos and Tursun Beg (Ottoman perspectives) all wrote accounts — which do not always agree.' },
            { t: 'What remains uncertain', d: 'Army sizes, the role of the Kerkoporta postern, the circumstances of Constantine XI’s death and the length of the plunder are debated.' },
            { t: 'Why it mattered', d: 'The Ottomans gained an imperial capital and control of the Straits; the Byzantine Empire ended; Constantinople began a new life as Istanbul.' },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border hairline p-6">
              <p className="font-display text-xl text-ivory">{c.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/65">{c.d}</p>
            </div>
          ))}
        </div>
        <SourcesList ids={['barbaro', 'sphrantzes', 'doukas', 'kritovoulos', 'tursun', 'runciman-1453', 'philippides-1453', 'babinger-mehmed', 'brit-constantinople']} className="mt-6" />
      </div>
    </section>
  );
}
