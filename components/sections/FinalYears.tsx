'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { finalYears, type Moment } from '@/data/narratives';
import { getRuler } from '@/data/rulers';
import { getFigure } from '@/data/people';
import { Portrait } from '@/components/ui/Portrait';
import { SourcesList } from '@/components/ui/SourcesList';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

const toneClass = {
  grave: 'border-l-[#7a5a62] bg-[#160d10]',
  war: 'border-l-ember/70 bg-white/[0.02]',
  politics: 'border-l-gold/70 bg-white/[0.02]',
  end: 'border-l-ivory/70 bg-white/[0.04]',
} as const;

export function AbolitionMoment() {
  const { reducedMotion } = useSettings();
  return (
    <div id="abolition" className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-24 text-center" tabIndex={-1}>
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(107,22,36,0.35),transparent_70%)]" aria-hidden="true" />
      <motion.div initial={reducedMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-30%' }} transition={{ duration: 2.4 }} className="relative px-4">
        <p className="font-display text-3xl tracking-[0.3em] text-gold-light sm:text-4xl">1 November 1922</p>
        <motion.span initial={reducedMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, delay: 0.6 }} className="mx-auto my-10 block h-px w-64 origin-center bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />
        <h3 className="display-title text-5xl text-ivory sm:text-7xl lg:text-8xl">
          THE SULTANATE
          <br />
          IS ABOLISHED
        </h3>
        <p className="mx-auto mt-10 max-w-xl text-lg text-ivory/60">The Grand National Assembly in Ankara ends more than six centuries of Ottoman monarchy. Sixteen days later, Mehmed VI leaves Istanbul for exile.</p>
      </motion.div>
    </div>
  );
}

export function TwoEndings() {
  const mehmed = getRuler('mehmed-vi')!;
  const caliph = getFigure('abdulmejid-ii')!;
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8">
      <p className="label-caps text-center text-gold">Two separate endings — do not merge them</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-gold/30 bg-gradient-to-br from-wine/40 to-transparent p-8">
          <p className="font-display text-6xl text-gold-light">1922</p>
          <h4 className="mt-2 font-display text-3xl text-ivory">End of the Ottoman Sultanate</h4>
          <ul className="mt-5 space-y-2 text-ivory/75">
            <li>• 1 November 1922: the Grand National Assembly abolishes the Sultanate.</li>
            <li>• 17 November: Mehmed VI, the 36th and last sultan, departs on HMS Malaya.</li>
            <li>• Political rule by the House of Osman ends.</li>
          </ul>
          <div className="mt-6 flex items-center gap-4">
            <Portrait spec={mehmed.portrait} name={mehmed.name} className="aspect-[4/5] w-20" showLabel={false} />
            <Link href="/sultans/mehmed-vi/" className="text-sm text-gold-light underline decoration-gold/40 underline-offset-2">
              Mehmed VI — the last sultan →
            </Link>
          </div>
        </article>
        <article className="rounded-[2rem] border hairline bg-gradient-to-br from-emerald/25 to-transparent p-8">
          <p className="font-display text-6xl text-[#9fe0c6]">1924</p>
          <h4 className="mt-2 font-display text-3xl text-ivory">Abolition of the Ottoman Caliphate</h4>
          <ul className="mt-5 space-y-2 text-ivory/75">
            <li>• November 1922: Abdülmecid II elected Caliph — a religious office only, never Sultan.</li>
            <li>• 29 October 1923: the Republic of Turkey is proclaimed.</li>
            <li>• 3 March 1924: the Caliphate is abolished and the dynasty exiled.</li>
          </ul>
          <div className="mt-6 flex items-center gap-4">
            <Portrait spec={caliph.portrait} name={caliph.name} className="aspect-[4/5] w-20" showLabel={false} />
            <Link href="/figures/abdulmejid-ii/" className="text-sm text-gold-light underline decoration-gold/40 underline-offset-2">
              Abdülmecid II — the last caliph →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

export function FinalYearsTimeline({ moments, className }: { moments: Moment[]; className?: string }) {
  const { reducedMotion } = useSettings();
  return (
    <ol className={cn('relative space-y-5 border-l border-white/10 pl-6 sm:pl-10', className)}>
      {moments.map((m, i) => (
        <motion.li
          key={m.year + m.title}
          initial={reducedMotion ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: Math.min(i * 0.03, 0.2) }}
          className={cn('relative rounded-r-2xl border-l-2 p-6 sm:grid sm:grid-cols-[10rem_1fr] sm:gap-8', toneClass[m.tone ?? 'war'])}
        >
          <span className="absolute top-8 -left-[2.05rem] h-3 w-3 rotate-45 border border-gold/60 bg-ink sm:-left-[2.85rem]" aria-hidden="true" />
          <div>
            <p className="font-display text-3xl text-ivory/90">{m.year}</p>
            {m.date && <p className="text-xs text-ash">{m.date}</p>}
          </div>
          <div className="mt-2 sm:mt-0">
            <h3 className={cn('font-display text-2xl', m.tone === 'grave' ? 'text-[#e3c9cf]' : 'text-ivory')}>{m.title}</h3>
            <p className="mt-2 leading-relaxed text-ivory/70">{m.text}</p>
            {m.tone === 'grave' && m.title.includes('Armenian') && (
              <SourcesList ids={['suny-desert', 'akcam-crime', 'brit-armenian-genocide', 'rogan-fall']} title="Sources on the Armenian Genocide" className="mt-4" />
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export function FinalYearsChapter({ compact = false, id = 'final-years' }: { compact?: boolean; id?: string }) {
  const moments = compact ? finalYears.filter((m) => ['1908', '1912–13', '1914', '1915–16', '1918', '1919–22'].includes(m.year)) : finalYears;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative overflow-hidden bg-[#070607]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_40%_at_50%_0%,rgba(107,22,36,0.35),transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pt-28 sm:px-8 sm:pt-36">
        <p className="label-caps text-[#d07a88]">{compact ? 'Chapter VII · ' : ''}1908 — 1922</p>
        <h2 id={`${id}-title`} className="display-title mt-4 text-5xl text-ivory sm:text-7xl lg:text-8xl">
          The Final Years
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-ivory/65">Revolution, wars on every frontier, mass atrocity, occupation and a new state rising in Anatolia. The last chapter of the empire is also its darkest.</p>

        <FinalYearsTimeline moments={moments} className="mt-16" />
        {compact && (
          <Link href="/final-years/" className="mt-10 inline-block rounded-full border border-[#d07a88]/50 px-6 py-3 text-sm font-semibold text-[#f3a4ae] transition hover:bg-[#d07a88]/10">
            The full chapter: Mehmed VI, Abdülmecid II and the War of Independence →
          </Link>
        )}
      </div>
      <AbolitionMoment />
      <div className="pb-28">
        <TwoEndings />
      </div>
    </section>
  );
}
