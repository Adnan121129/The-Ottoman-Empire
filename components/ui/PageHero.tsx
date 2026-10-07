import type { ReactNode } from 'react';
import { Ornament } from './Ornament';
import { cn } from '@/lib/utils';

/** Editorial header used at the top of every secondary page. */
export function PageHero({ kicker, title, intro, children, className, tone = 'imperial' }: { kicker: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; className?: string; tone?: 'imperial' | 'emerald' | 'night' | 'gold' }) {
  const glow = {
    imperial: 'from-wine/50 via-burgundy/10',
    emerald: 'from-emerald/40 via-emerald/5',
    night: 'from-[#2a0f16]/70 via-black/10',
    gold: 'from-gold-dark/35 via-gold-dark/5',
  }[tone];
  return (
    <section className={cn('relative isolate overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24', className)}>
      <div className={cn('absolute inset-0 -z-10 bg-gradient-to-b to-transparent', glow)} aria-hidden="true" />
      <div className="pattern-girih absolute inset-0 -z-10 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label-caps text-gold">{kicker}</p>
        <h1 className="display-title mt-5 max-w-5xl text-balance text-5xl text-ivory sm:text-7xl lg:text-8xl">{title}</h1>
        {intro && <div className="mt-8 max-w-3xl text-pretty text-lg leading-relaxed text-ivory/70 sm:text-xl">{intro}</div>}
        {children}
        <Ornament className="mt-14 max-w-md" />
      </div>
    </section>
  );
}
