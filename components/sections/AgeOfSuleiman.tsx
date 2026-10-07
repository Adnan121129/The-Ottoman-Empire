'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { suleimanChapters } from '@/data/narratives';
import { getRuler } from '@/data/rulers';
import { Portrait } from '@/components/ui/Portrait';
import { SourcesList } from '@/components/ui/SourcesList';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

/** A stylized silhouette of the Süleymaniye: dome, semi-domes, cascading domes, four minarets. */
function SuleymaniyeSilhouette({ className }: { className?: string }) {
  const minaret = (x: number, h: number, balconies: number) => (
    <g key={x}>
      <rect x={x - 5} y={400 - h} width="10" height={h} />
      {Array.from({ length: balconies }).map((_, i) => (
        <rect key={i} x={x - 9} y={400 - h + 40 + i * 34} width="18" height="5" />
      ))}
      <path d={`M${x - 6} ${400 - h}L${x} ${400 - h - 46}L${x + 6} ${400 - h}Z`} />
    </g>
  );
  return (
    <svg viewBox="0 0 800 420" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M120 400V300h560v100z" />
        <path d="M250 300a150 150 0 0 1 300 0z" />
        <rect x="240" y="292" width="320" height="16" />
        <path d="M160 300a90 70 0 0 1 180 0zM460 300a90 70 0 0 1 180 0z" />
        <path d="M130 320a40 32 0 0 1 80 0zM590 320a40 32 0 0 1 80 0z" />
        {[180, 240, 300, 500, 560, 620].map((x) => (
          <path key={x} d={`M${x - 20} 300a20 18 0 0 1 40 0z`} />
        ))}
        <rect x="396" y="132" width="8" height="22" />
        <circle cx="400" cy="130" r="5" />
        {minaret(110, 300, 3)}
        {minaret(690, 300, 3)}
        {minaret(40, 220, 2)}
        {minaret(760, 220, 2)}
        <path d="M0 400h800v20H0z" />
      </g>
    </svg>
  );
}

export function AgeOfSuleiman() {
  const { reducedMotion } = useSettings();
  const section = useRef<HTMLElement>(null);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const rise = useTransform(scrollYProgress, [0.05, 0.45], ['38%', '0%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const glow = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.2, 0.75, 0.35]);
  const suleiman = getRuler('suleiman-i')!;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.idx))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const chapter = suleimanChapters[active];

  return (
    <section ref={section} id="suleyman" tabIndex={-1} aria-labelledby="suleyman-title" className="relative bg-gradient-to-b from-ink via-[#171006] to-ink outline-none">
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-8 sm:pt-36">
        <p className="label-caps text-gold">Chapter IV · 1520 — 1566</p>
        <h2 id="suleyman-title" className="display-title mt-4 text-5xl text-ivory sm:text-7xl lg:text-8xl">
          The Age of <span className="text-gold-gradient">Süleyman</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-ivory/70">
          Forty-six years of conquest, law, architecture and court culture — remembered as a golden age, experienced by contemporaries as a time of costly wars and dynastic tragedy too.
        </p>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-[1500px] gap-10 px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Layered stage */}
        <div className="sticky top-16 z-10 h-[46vh] lg:top-20 lg:h-[calc(100vh-6rem)]">
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-gold/20 bg-[#120c05]">
            <motion.div className="absolute inset-0" style={{ opacity: reducedMotion ? 0.6 : glow, background: 'radial-gradient(70% 60% at 50% 75%, #c9a24a55, transparent 70%)' }} aria-hidden="true" />
            <motion.div className="pattern-girih absolute -inset-1/4 opacity-[0.08]" style={{ rotate: reducedMotion ? 0 : rotate }} aria-hidden="true" />
            <motion.svg viewBox="-100 -100 200 200" className="absolute left-1/2 top-[42%] w-[78%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 text-gold" style={{ rotate: reducedMotion ? 0 : rotate }} aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.55">
                {[96, 88, 70, 52].map((r) => (
                  <circle key={r} r={r} />
                ))}
                {Array.from({ length: 16 }).map((_, i) => (
                  <path key={i} d="M0 -88 L8 -70 L0 -52 L-8 -70Z" transform={`rotate(${i * 22.5})`} />
                ))}
                <rect x="-45" y="-45" width="90" height="90" />
                <rect x="-45" y="-45" width="90" height="90" transform="rotate(45)" />
                <rect x="-30" y="-30" width="60" height="60" transform="rotate(22.5)" />
                <rect x="-30" y="-30" width="60" height="60" transform="rotate(67.5)" />
              </g>
            </motion.svg>
            <motion.div className="absolute -inset-x-[6%] bottom-0 text-[#0a0703]" style={{ y: reducedMotion ? 0 : rise }}>
              <SuleymaniyeSilhouette className="w-full drop-shadow-[0_-10px_30px_rgba(201,162,74,0.35)]" />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" aria-hidden="true" />
            <div className="absolute left-5 top-5 w-24 sm:w-32 lg:left-8 lg:top-8 lg:w-40">
              <Portrait spec={suleiman.portrait} name={suleiman.name} className="aspect-[4/5]" size="sm" />
            </div>
            <div className="absolute right-5 top-6 text-right lg:right-8 lg:top-8">
              <AnimatePresence mode="wait">
                <motion.div key={chapter.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reducedMotion ? 0 : 0.5 }}>
                  <p className="label-caps text-gold">{chapter.kicker}</p>
                  <p className="display-title mt-2 text-4xl text-ivory sm:text-6xl">{chapter.years}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="absolute bottom-4 left-5 text-[0.62rem] text-ivory/45 lg:left-8">Stylized silhouette of the Süleymaniye (1550–1557) · artistic reconstruction</p>
          </div>
        </div>

        {/* Chapters */}
        <ol className="relative pb-[20vh]">
          {suleimanChapters.map((c, i) => (
            <li
              key={c.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-idx={i}
              className="flex min-h-[60vh] items-center py-8 lg:min-h-[75vh]"
            >
              <motion.article
                initial={reducedMotion ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-3xl border p-7 transition-colors duration-700 sm:p-9', active === i ? 'border-gold/40 bg-white/[0.05]' : 'hairline bg-transparent')}
              >
                <p className="label-caps text-gold">
                  {String(i + 1).padStart(2, '0')} · {c.kicker}
                </p>
                <h3 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">{c.title}</h3>
                <p className="mt-4 leading-relaxed text-ivory/75">{c.text}</p>
                {c.link && (
                  <Link href={c.link.href} className="mt-5 inline-block text-sm font-semibold text-gold-light underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
                    {c.link.label} →
                  </Link>
                )}
              </motion.article>
            </li>
          ))}
        </ol>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <SourcesList ids={['inalcik-classical', 'cht-2', 'imber-ebussuud', 'necipoglu-sinan', 'isom-allies', 'peirce-empress', 'busbecq', 'agoston-last']} />
      </div>
    </section>
  );
}
