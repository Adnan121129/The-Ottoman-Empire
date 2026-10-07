'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Star } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { eraTones } from '@/data/eras';
import { getRuler } from '@/data/rulers';
import { timelineByEra, type TimelineEntry } from '@/data/timeline';
import { Drawer } from '@/components/ui/Drawer';
import { Portrait } from '@/components/ui/Portrait';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';
import { TimelineDetail } from './TimelineDetail';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function EntryCard({ entry, onOpen, index }: { entry: TimelineEntry; onOpen: (e: TimelineEntry) => void; index: number }) {
  const ruler = getRuler(entry.rulerId);
  const isRuler = entry.kind === 'ruler';
  return (
    <li className={cn('relative shrink-0 lg:pt-14', entry.featured ? 'lg:w-[22rem]' : 'lg:w-[18rem]')} data-year={entry.year} data-entry>
      {/* Axis marker */}
      <span className="absolute top-[3.15rem] left-6 hidden h-3 w-3 rotate-45 border border-gold bg-ink lg:block" aria-hidden="true" />
      <span className="absolute top-[3.55rem] left-[1.55rem] hidden h-8 w-px bg-gradient-to-b from-gold/70 to-transparent lg:block" aria-hidden="true" />
      <button
        onClick={() => onOpen(entry)}
        className={cn(
          'group relative w-full overflow-hidden rounded-3xl border text-left transition duration-500',
          isRuler ? 'hairline bg-white/[0.035] hover:-translate-y-1 hover:border-gold/45 hover:bg-white/[0.06]' : 'border-gold/25 bg-gradient-to-br from-wine/40 to-transparent hover:-translate-y-1 hover:border-gold/60',
          entry.featured && 'shadow-[0_30px_60px_-30px_rgba(201,162,74,0.35)]',
        )}
        aria-label={`${entry.title}, ${entry.yearLabel}. Open details.`}
      >
        {entry.turningPoint && (
          <span className="absolute top-0 right-0 rounded-bl-2xl bg-gold px-3 py-1 text-[0.58rem] font-bold tracking-[0.18em] text-ink uppercase">{entry.turningPoint}</span>
        )}
        <div className="flex gap-4 p-5">
          {ruler ? (
            <Portrait spec={ruler.portrait} name={ruler.name} className="aspect-[4/5] w-16 shrink-0 rounded-xl" showLabel={false} />
          ) : (
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold" aria-hidden="true">
              <Star className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-gold-light uppercase">{entry.yearLabel}</p>
            <h3 className="mt-1 font-display text-[1.65rem] leading-tight text-ivory">{entry.title}</h3>
            <p className="mt-0.5 truncate text-xs italic text-ivory/55">{entry.subtitle}</p>
          </div>
        </div>
        <p className="line-clamp-3 px-5 text-sm leading-relaxed text-ivory/70">{entry.description}</p>
        <div className="mt-4 flex items-center justify-between gap-2 border-t hairline px-5 py-3">
          <span className="truncate text-[0.68rem] text-ash">{entry.status}</span>
          {entry.certainty && entry.certainty !== 'confirmed' ? <CertaintyBadge kind={entry.certainty} /> : <ChevronRight className="h-4 w-4 shrink-0 text-gold transition group-hover:translate-x-1" aria-hidden="true" />}
        </div>
        {isRuler && <span className="pointer-events-none absolute -bottom-6 right-3 font-display text-7xl text-white/[0.03]" aria-hidden="true">{String(index).padStart(2, '0')}</span>}
      </button>
    </li>
  );
}

export function Timeline() {
  const { reducedMotion } = useSettings();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const pinned = desktop && !reducedMotion;
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<{ start: number; end: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeEra, setActiveEra] = useState(timelineByEra[0].era.id);
  const [year, setYear] = useState(1280);
  const [open, setOpen] = useState<TimelineEntry | null>(null);

  const rulerIndex = useMemo(() => {
    const m = new Map<string, number>();
    timelineByEra.forEach(({ entries }) => entries.forEach((e) => e.rulerId && m.set(e.id, getRuler(e.rulerId)!.order)));
    return m;
  }, []);

  // Track which era / year is centred, from element positions.
  const sync = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const centre = window.innerWidth * 0.45;
    let bestEra = timelineByEra[0].era.id;
    let bestYear = 1280;
    t.querySelectorAll<HTMLElement>('[data-era]').forEach((el) => {
      if (el.getBoundingClientRect().left < centre) bestEra = el.dataset.era!;
    });
    t.querySelectorAll<HTMLElement>('[data-entry]').forEach((el) => {
      if (el.getBoundingClientRect().left < centre) bestYear = Number(el.dataset.year);
    });
    setActiveEra(bestEra);
    setYear(bestYear);
  }, []);

  useIsoLayoutEffect(() => {
    if (!pinned) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: viewport.current,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              setProgress(self.progress);
              trigger.current = { start: self.start, end: self.end };
              sync();
            },
            onRefresh: (self) => {
              trigger.current = { start: self.start, end: self.end };
            },
          },
        });
        void tween;
      }, section);
      ScrollTrigger.refresh();
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [pinned, sync]);

  const scrollToEl = useCallback(
    (el: HTMLElement) => {
      const t = track.current;
      const st = trigger.current;
      if (!t) return;
      if (pinned && st) {
        const distance = Math.max(1, t.scrollWidth - window.innerWidth);
        const left = el.offsetLeft;
        const p = Math.min(1, Math.max(0, (left - window.innerWidth * 0.12) / distance));
        window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: reducedMotion ? 'auto' : 'smooth' });
      } else {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start', inline: 'start' });
      }
    },
    [pinned, reducedMotion],
  );

  const jumpToEra = (id: string) => {
    const el = track.current?.querySelector<HTMLElement>(`[data-era="${id}"]`);
    if (el) scrollToEl(el);
  };

  // Keyboard users: bring focused cards into view inside the pinned track.
  const onFocusCapture = (e: React.FocusEvent) => {
    if (!pinned) return;
    const li = (e.target as HTMLElement).closest<HTMLElement>('[data-entry]');
    if (!li) return;
    const r = li.getBoundingClientRect();
    if (r.left < 0 || r.right > window.innerWidth) scrollToEl(li);
  };

  const tone = eraTones[timelineByEra.find((x) => x.era.id === activeEra)!.era.tone];

  return (
    <section ref={section} id="timeline" tabIndex={-1} aria-labelledby="timeline-title" className="relative outline-none">
      <div ref={viewport} className={cn('relative', pinned && 'h-screen overflow-hidden')}>
        {/* Era-tinted backdrop */}
        <div className="absolute inset-0 -z-10 transition-[background] duration-1000" style={{ background: `radial-gradient(90% 70% at 30% 60%, ${tone.to}, ${tone.from} 60%, #0a0908)` }} aria-hidden="true" />
        <div className="pattern-girih absolute inset-0 -z-10 opacity-[0.03]" aria-hidden="true" />

        {/* Giant year counter */}
        {pinned && (
          <div className="pointer-events-none absolute right-[4vw] bottom-[4vh] -z-10 select-none font-display text-[22vw] leading-none text-white/[0.04]" aria-hidden="true">
            <AnimatePresence mode="popLayout">
              <motion.span key={year} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="block">
                {year}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        <div className={cn('relative mx-auto max-w-[1500px] px-4 sm:px-8', pinned ? 'absolute inset-x-0 top-24 z-10' : 'pt-28 pb-10')}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label-caps text-gold">Chapter I · 1280 — 1924</p>
              <h2 id="timeline-title" className="display-title mt-3 text-4xl text-ivory sm:text-5xl">
                The Ottoman Timeline
              </h2>
            </div>
            <nav aria-label="Jump to era" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
              {timelineByEra.map(({ era }) => (
                <button
                  key={era.id}
                  onClick={() => jumpToEra(era.id)}
                  className={cn(
                    'shrink-0 rounded-full border px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition',
                    activeEra === era.id ? 'border-gold bg-gold text-ink' : 'border-white/10 text-ivory/60 hover:border-gold/40 hover:text-ivory',
                  )}
                  aria-current={activeEra === era.id ? 'true' : undefined}
                >
                  {era.name.replace('Late Empire · ', '')}
                </button>
              ))}
            </nav>
          </div>
          {pinned && (
            <div className="mt-5 h-px w-full bg-white/10" aria-hidden="true">
              <div className="h-px bg-gradient-to-r from-gold-dark via-gold to-gold-light" style={{ width: `${progress * 100}%` }} />
            </div>
          )}
        </div>

        <div
          ref={track}
          onFocusCapture={onFocusCapture}
          className={cn('relative flex flex-col gap-16 px-4 pb-24 sm:px-8 lg:flex-row lg:gap-0 lg:pb-0', pinned ? 'h-full items-center pt-24 lg:pl-[6vw] lg:pr-[30vw]' : 'lg:no-scrollbar lg:snap-x lg:overflow-x-auto lg:pb-16')}
        >
          {timelineByEra.map(({ era, entries }) => (
            <div key={era.id} data-era={era.id} className="relative flex shrink-0 flex-col gap-6 lg:snap-start lg:flex-row lg:items-start lg:gap-5 lg:pr-20">
              {/* Era intro */}
              <div className="lg:w-[23rem] lg:shrink-0 lg:pt-6">
                <p className="label-caps" style={{ color: eraTones[era.tone].accent }}>
                  {era.range}
                </p>
                <h3 className="display-title mt-3 text-4xl text-ivory lg:text-5xl">{era.name.replace('Late Empire · ', '')}</h3>
                <p className="mt-3 font-display text-lg italic text-ivory/70">{era.tagline}</p>
                <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-ivory/60">{era.summary}</p>
                <p className="mt-4 inline-block rounded-full border hairline px-3 py-1 text-[0.65rem] text-gold-light">{era.status}</p>
              </div>
              {/* Axis + entries */}
              <div className="relative">
                <span className="absolute top-[3.5rem] right-0 left-0 hidden h-px bg-gradient-to-r from-gold/60 via-gold/30 to-gold/10 lg:block" aria-hidden="true" />
                <ol className="grid gap-4 sm:grid-cols-2 lg:flex lg:gap-5">
                  {entries.map((e) => (
                    <EntryCard key={e.id} entry={e} onOpen={setOpen} index={rulerIndex.get(e.id) ?? 0} />
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.title ?? 'Timeline detail'} labelledBy="timeline-detail-title">
        {open && <TimelineDetail entry={open} />}
      </Drawer>
    </section>
  );
}
