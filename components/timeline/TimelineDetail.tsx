import { ArrowUpRight, Flag, Map as MapIcon, Swords, Trophy } from 'lucide-react';
import Link from 'next/link';
import { getRuler } from '@/data/rulers';
import { eraById, eraTones } from '@/data/eras';
import type { TimelineEntry } from '@/data/timeline';
import { Portrait } from '@/components/ui/Portrait';
import { CertaintyBadge, NotesList } from '@/components/ui/Certainty';
import { SourcesList } from '@/components/ui/SourcesList';

/** The immersive panel opened from a timeline node. */
export function TimelineDetail({ entry }: { entry: TimelineEntry }) {
  const ruler = getRuler(entry.rulerId);
  const era = eraById[entry.eraId];
  const tone = eraTones[era.tone];
  return (
    <article className="pb-12">
      <header className="relative overflow-hidden px-6 pt-16 pb-10 sm:px-10" style={{ background: `linear-gradient(160deg, ${tone.to}, ${tone.from} 70%)` }}>
        <div className="pattern-girih absolute inset-0 opacity-[0.06]" aria-hidden="true" />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end">
          {ruler && <Portrait spec={ruler.portrait} name={ruler.name} image={ruler.image} className="aspect-[4/5] w-40 shrink-0" size="sm" />}
          <div>
            <p className="label-caps" style={{ color: tone.accent }}>
              {era.name} · {entry.yearLabel}
            </p>
            <h2 id="timeline-detail-title" className="display-title mt-3 text-5xl text-ivory sm:text-6xl">
              {entry.title}
            </h2>
            <p className="mt-2 font-display text-xl italic text-ivory/75">{entry.subtitle}</p>
            {ruler?.ottomanName && (
              <p className="mt-3 font-arabic text-2xl text-gold-light/80" lang="ota" dir="rtl">
                {ruler.ottomanName}
              </p>
            )}
            {entry.certainty && entry.certainty !== 'confirmed' && <CertaintyBadge kind={entry.certainty} long className="mt-4" />}
          </div>
        </div>
      </header>
      <div className="space-y-8 px-6 pt-8 sm:px-10">
        <p className="text-lg leading-relaxed text-ivory/85">{entry.description}</p>
        <dl className="grid gap-px overflow-hidden rounded-2xl border hairline bg-gold/10 sm:grid-cols-2">
          <div className="bg-charcoal p-4">
            <dt className="label-caps flex items-center gap-2 text-ash">
              <Flag className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> Empire status
            </dt>
            <dd className="mt-2 text-sm text-ivory/85">{entry.status}</dd>
          </div>
          <div className="bg-charcoal p-4">
            <dt className="label-caps flex items-center gap-2 text-ash">
              <MapIcon className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> Territorial changes
            </dt>
            <dd className="mt-2 text-sm text-ivory/85">{entry.territorial}</dd>
          </div>
        </dl>
        {entry.achievements.length > 0 && (
          <section>
            <h3 className="label-caps mb-3 flex items-center gap-2 text-gold">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> Major achievements
            </h3>
            <ul className="space-y-2 text-ivory/80">
              {entry.achievements.map((a) => (
                <li key={a} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}
        {entry.conflicts.length > 0 && (
          <section>
            <h3 className="label-caps mb-3 flex items-center gap-2 text-gold">
              <Swords className="h-3.5 w-3.5" aria-hidden="true" /> Major conflicts
            </h3>
            <ul className="flex flex-wrap gap-2">
              {entry.conflicts.map((c) => (
                <li key={c} className="rounded-full border hairline px-3 py-1 text-sm text-ivory/75">
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}
        {ruler && ruler.notes.length > 0 && (
          <section>
            <h3 className="label-caps mb-3 text-gold">Fact, tradition & debate</h3>
            <NotesList notes={ruler.notes.slice(0, 3)} />
          </section>
        )}
        {ruler && <SourcesList ids={ruler.sources} />}
        <Link href={entry.href} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light">
          {ruler ? `Open the full profile of ${ruler.name}` : 'Explore further'}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
