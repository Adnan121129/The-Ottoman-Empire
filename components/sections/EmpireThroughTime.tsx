'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapCanvas, MapLegend, placeMarkers, FULL_VIEW, type ViewBox } from '@/components/maps/MapCanvas';
import { Portrait } from '@/components/ui/Portrait';
import { snapshotForYear } from '@/data/territories';
import { places } from '@/data/places';
import { capitalForYear } from '@/data/places';
import { getRuler } from '@/data/rulers';
import { viewBoxFor, MAP_WIDTH, MAP_HEIGHT } from '@/lib/geo';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

const steps = [
  { year: 1300, bounds: [26, 37.5, 34, 42.5] as [number, number, number, number], rulerId: 'osman-i', kicker: 'c. 1300', title: 'A principality in Bithynia', text: 'Osman’s followers hold a small territory around Söğüt, on the frontier of a weakened Byzantine Empire.' },
  { year: 1453, bounds: [18, 35, 42, 46] as [number, number, number, number], rulerId: 'mehmed-ii', kicker: '1453', title: 'Constantinople becomes the capital', text: 'Mehmed II takes the Byzantine capital. The Ottoman lands in Europe and Asia are joined at the Bosphorus.' },
  { year: 1566, bounds: [-6, 11, 56, 50] as [number, number, number, number], rulerId: 'suleiman-i', kicker: '1566', title: 'Three continents', text: 'At Süleyman’s death the empire reaches from Algiers to Basra and from Buda to Aden.' },
  { year: 1700, bounds: [10, 33, 42, 50] as [number, number, number, number], rulerId: 'mustafa-ii', kicker: '1699 – 1700', title: 'The first great retreat', text: 'After Vienna (1683) and the Treaty of Karlowitz, Hungary and Transylvania are lost — though Crete has been won.' },
  { year: 1878, bounds: [14, 30, 48, 47] as [number, number, number, number], rulerId: 'abdulhamid-ii', kicker: '1878', title: 'The Balkans break away', text: 'After the war with Russia, the Congress of Berlin recognizes independent Serbia, Montenegro and Romania and an autonomous Bulgaria.' },
  { year: 1914, bounds: [24, 12, 52, 43] as [number, number, number, number], rulerId: 'mehmed-v', kicker: '1914', title: 'An Anatolian and Arab empire', text: 'Libya and almost all European territory have gone. The empire enters the First World War.' },
  { year: 1922, bounds: [24, 34, 46, 43] as [number, number, number, number], rulerId: 'mehmed-vi', kicker: '1922', title: 'The end of the Sultanate', text: 'The Ankara government controls Anatolia and Eastern Thrace. On 1 November 1922 the Sultanate is abolished.' },
];

const ASPECT = MAP_WIDTH / MAP_HEIGHT;

function useTweenedView(target: ViewBox, reduced: boolean) {
  const [view, setView] = useState<ViewBox>(target);
  const from = useRef<ViewBox>(target);
  const current = useRef<ViewBox>(target);
  useEffect(() => {
    if (reduced) {
      current.current = target;
      setView(target);
      return;
    }
    from.current = current.current;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const v = from.current.map((a, i) => a + (target[i] - a) * e) as ViewBox;
      current.current = v;
      setView(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced]);
  return view;
}

export function EmpireThroughTime() {
  const { reducedMotion } = useSettings();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = steps[active];
  const snapshot = snapshotForYear(step.year);
  const previous = active > 0 ? snapshotForYear(steps[active - 1].year) : null;
  const target = useMemo<ViewBox>(() => (step.year === 1566 ? FULL_VIEW : viewBoxFor(step.bounds, ASPECT, 0.04)), [step]);
  const view = useTweenedView(target, reducedMotion);
  const capital = capitalForYear(step.year);
  const ruler = getRuler(step.rulerId)!;
  const markers = useMemo(() => placeMarkers(places.filter((p) => p.importance === 3 || p.id === capital.placeId), capital.placeId), [capital.placeId]);

  return (
    <section id="empire-through-time" aria-labelledby="ett-title" className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-8">
        <p className="label-caps text-gold">Chapter II · Expansion and contraction</p>
        <h2 id="ett-title" className="display-title mt-4 max-w-4xl text-5xl text-ivory sm:text-6xl">
          The Empire Through Time
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-ivory/65">Scroll to watch six centuries of territorial change. Borders are simplified and approximate — hover a region for its status.</p>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-[1500px] gap-0 px-4 sm:px-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-12">
        {/* Sticky map (top on mobile, right on desktop) */}
        <div className="sticky top-16 z-10 order-first h-[48vh] lg:top-24 lg:order-last lg:h-[calc(100vh-8rem)]">
          <div className="relative h-full overflow-hidden rounded-[2rem] border hairline bg-black shadow-2xl shadow-black">
            <MapCanvas snapshot={snapshot} previous={previous} view={view} markers={markers} ariaLabel={`Map of Ottoman territory: ${snapshot.title}`} className="h-full w-full" showSeaLabels={step.year === 1566} fit="slice" />
            <div className="pointer-events-none absolute left-4 top-4 sm:left-6 sm:top-6">
              <AnimatePresence mode="wait">
                <motion.p key={step.year} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: reducedMotion ? 0 : 0.5 }} className="display-title text-gold-gradient text-6xl sm:text-8xl">
                  {step.year}
                </motion.p>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={ruler.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: reducedMotion ? 0 : 0.6 }}
                className="absolute right-3 top-3 hidden w-28 sm:block lg:right-5 lg:top-5 lg:w-36"
              >
                <Portrait spec={ruler.portrait} name={ruler.name} className="aspect-[4/5]" size="sm" />
                <p className="mt-1.5 text-right text-xs text-ivory/80">{ruler.name}</p>
              </motion.div>
            </AnimatePresence>
            <MapLegend statuses={step.year === 1922 ? ['successor'] : ['core', 'vassal', 'contested']} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-8 text-[0.65rem] sm:px-6" />
          </div>
        </div>

        {/* Narrative steps */}
        <ol className="relative z-0 pb-[30vh] lg:pb-[40vh]">
          {steps.map((s, i) => (
            <li
              key={s.year}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step={i}
              className="flex min-h-[70vh] items-center py-10 lg:min-h-[90vh]"
            >
              <div className={cn('rounded-3xl border p-7 backdrop-blur-sm transition duration-700 sm:p-9', active === i ? 'border-gold/40 bg-black/60' : 'hairline bg-black/30 opacity-50')}>
                <p className="label-caps text-gold">{s.kicker}</p>
                <h3 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-ivory/75">{s.text}</p>
                <p className="mt-4 text-sm text-ivory/55">{snapshotForYear(s.year).caption}</p>
                <p className="mt-5 text-xs text-ash">
                  Capital: <span className="text-gold-light">{capitalForYear(s.year).label}</span> · Ruler: <Link href={`/sultans/${s.rulerId}/`} className="text-gold-light underline decoration-gold/30 underline-offset-2">{getRuler(s.rulerId)!.name}</Link>
                </p>
              </div>
            </li>
          ))}
          <li className="pb-10">
            <Link href="/map/" className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold-light transition hover:bg-gold hover:text-ink">
              Open the full interactive map — 13 snapshots, cities, battles and trade routes
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
