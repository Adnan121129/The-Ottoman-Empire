import Link from 'next/link';
import type { Figure } from '@/data/types';
import { categoryLabel } from '@/data/people';
import { Portrait } from '@/components/ui/Portrait';
import { cn } from '@/lib/utils';

export function FigureCard({ figure, className }: { figure: Figure; className?: string }) {
  return (
    <Link href={`/figures/${figure.id}/`} className={cn('group flex gap-4 overflow-hidden rounded-[1.6rem] border bg-white/[0.025] p-4 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.05]', figure.featured ? 'border-gold/30 hover:border-gold/60' : 'hairline hover:border-gold/40', className)}>
      <Portrait spec={figure.portrait} name={figure.name} image={figure.image} className="aspect-[4/5] w-24 shrink-0 rounded-2xl" showLabel={false} />
      <div className="min-w-0">
        <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-gold uppercase">{categoryLabel[figure.category]}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight text-ivory">{figure.name}</h3>
        <p className="text-xs text-ash">{figure.lifespan}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ivory/65">{figure.summary}</p>
      </div>
    </Link>
  );
}
