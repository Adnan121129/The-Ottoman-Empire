'use client';

import { motion } from 'motion/react';
import { ArrowUp, Building2, Gavel, Globe2, Handshake, Landmark, Languages, MapPinned, Palette, Soup, Sun, Users } from 'lucide-react';
import { legacy } from '@/data/narratives';
import { Emblem } from '@/components/ui/Emblem';
import { useSettings } from '@/lib/providers';

const icons = { turkey: Landmark, balkans: MapPinned, 'middle-east': Sun, 'north-africa': Globe2, architecture: Building2, cuisine: Soup, language: Languages, art: Palette, diplomacy: Handshake, law: Gavel, urban: Users } as const;

export function Legacy() {
  const { reducedMotion } = useSettings();
  const explore = () => {
    const el = document.getElementById('timeline');
    if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    else window.location.href = '/#timeline';
  };
  return (
    <section id="legacy" aria-labelledby="legacy-title" className="parchment-surface relative overflow-hidden pt-28 sm:pt-36">
      <div className="pattern-girih absolute inset-0 opacity-[0.07] [filter:sepia(1)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label-caps text-gold-dark">Epilogue</p>
        <h2 id="legacy-title" className="display-title mt-4 text-6xl text-sepia sm:text-8xl">
          The Legacy
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-sepia/80">The empire dissolved into more than thirty modern states. Its traces — remembered with pride, resentment, nostalgia or indifference — are everywhere.</p>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {legacy.map((l, i) => {
            const Icon = icons[l.id as keyof typeof icons] ?? Landmark;
            return (
              <motion.li key={l.id} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, delay: (i % 3) * 0.08 }} className="rounded-3xl border border-sepia/15 bg-white/40 p-6 shadow-[0_20px_40px_-30px_rgba(59,47,34,0.6)]">
                <Icon className="h-6 w-6 text-burgundy" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl text-sepia">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sepia/80">{l.text}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="relative mt-28 bg-ink py-32 text-center text-ivory">
        <motion.div initial={reducedMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-25%' }} transition={{ duration: 2 }}>
          <Emblem className="mx-auto h-16 w-16" title="" />
          <p className="display-title mt-10 text-5xl sm:text-7xl">Six centuries ended.</p>
          <p className="display-title text-gold-gradient mt-3 text-5xl sm:text-7xl">Their legacy did not.</p>
          <button onClick={explore} className="mt-14 inline-flex items-center gap-3 rounded-full bg-gold px-9 py-4 text-sm font-bold tracking-[0.25em] text-ink uppercase shadow-[0_0_50px_rgba(201,162,74,0.35)] transition hover:bg-gold-light">
            Explore again <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
