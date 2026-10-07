import Link from 'next/link';
import type { Ruler } from '@/data/types';
import { eraById, eraTones } from '@/data/eras';
import { reignLabel } from '@/data/rulers';
import { Portrait } from '@/components/ui/Portrait';
import { cn } from '@/lib/utils';

export function SultanCard({ ruler, className }: { ruler: Ruler; className?: string }) {
  const era = eraById[ruler.eraId];
  const tone = eraTones[era.tone];
  return (
    <Link
      href={`/sultans/${ruler.id}/`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[1.6rem] border bg-white/[0.025] transition duration-500 hover:-translate-y-1 hover:bg-white/[0.05]',
        ruler.featured ? 'border-gold/30 hover:border-gold/60' : 'hairline hover:border-gold/40',
        className,
      )}
    >
      <div className="relative">
        <Portrait spec={ruler.portrait} name={ruler.name} image={ruler.image} className="aspect-[4/5] w-full rounded-none border-0" size="sm" />
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-black/60 font-display text-lg text-gold-light backdrop-blur">{ruler.order}</span>
        {ruler.turningPoint && <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-10 text-[0.6rem] font-bold tracking-[0.2em] text-gold-light uppercase">{ruler.turningPoint}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase" style={{ color: tone.accent }}>
          {reignLabel(ruler)}
        </p>
        <h3 className="mt-1.5 font-display text-2xl leading-tight text-ivory">{ruler.name}</h3>
        {ruler.epithet && <p className="mt-0.5 text-xs italic text-ivory/55">{ruler.epithet}</p>}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ivory/65">{ruler.summary}</p>
        <p className="mt-auto pt-4 text-[0.65rem] text-ash">{era.name}</p>
      </div>
    </Link>
  );
}
