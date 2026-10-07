import Link from 'next/link';
import { phases } from '@/data/narratives';
import { Reveal } from '@/components/ui/Reveal';
import { CertaintyBadge } from '@/components/ui/Certainty';

const hues = ['#d9b562', '#f0cf78', '#c98a4a', '#9a4a3a', '#6b1624'];

export function TransformationStrip() {
  return (
    <section id="transformation" aria-labelledby="tr-title" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="label-caps text-gold">Chapter VI · Not simply “glory, then decline”</p>
            <h2 id="tr-title" className="display-title mt-4 text-5xl text-ivory sm:text-6xl">
              Rise <span className="text-gold">→</span> Peak <span className="text-gold">→</span> Transformation <span className="text-gold">→</span> Decline <span className="text-gold">→</span> End
            </h2>
          </div>
          <div className="space-y-3">
            <CertaintyBadge kind="interpretation" long />
            <p className="text-ivory/70">
              For much of the twentieth century historians described the post-1566 empire as being in “decline”. Since the 1980s most specialists have rejected that model: the empire adapted, reformed and fought effectively for centuries. Decline, where it happened, was a complex process — not a single event.
            </p>
          </div>
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border hairline bg-gold/10 md:grid-cols-5">
          {phases.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08} className="relative bg-ink p-6">
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: hues[i] }} aria-hidden="true" />
              <p className="font-display text-3xl text-ivory">{p.name}</p>
              <p className="mt-1 text-xs font-semibold tracking-wider text-gold-light">{p.years}</p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/70">{p.text}</p>
              <p className="mt-4 border-t hairline pt-3 text-xs italic text-ivory/50">{p.caveat}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/empire/#transformation" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light">
            Explore the factors of change
          </Link>
          <Link href="/empire/#tanzimat" className="rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold-light transition hover:border-gold">
            The Tanzimat & reform era
          </Link>
        </div>
      </div>
    </section>
  );
}
