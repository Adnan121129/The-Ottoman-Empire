import Link from 'next/link';
import type { Figure } from '@/data/types';
import { categoryLabel } from '@/data/people';
import { getRuler } from '@/data/rulers';
import { getBattle } from '@/data/battles';
import { getBuilding } from '@/data/buildings';
import { Portrait } from '@/components/ui/Portrait';
import { AssessmentPanel, NotesList } from '@/components/ui/Certainty';
import { SourcesList } from '@/components/ui/SourcesList';
import { LocationsMap } from '@/components/maps/LocationsMap';

function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
      <h2 className="label-caps text-gold">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
        {items.map((a) => (
          <li key={a} className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FigureProfile({ figure }: { figure: Figure }) {
  const rulersRel = (figure.relatedRulerIds ?? []).map(getRuler).filter((r): r is NonNullable<typeof r> => Boolean(r));
  const battles = (figure.battleIds ?? []).map(getBattle).filter((b): b is NonNullable<typeof b> => Boolean(b));
  const builds = (figure.buildingIds ?? []).map(getBuilding).filter((b): b is NonNullable<typeof b> => Boolean(b));
  const isWoman = figure.group === 'women';
  return (
    <article>
      <header className={`relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 ${isWoman ? 'bg-[radial-gradient(90%_80%_at_75%_20%,#3a1119,#140c0e_60%,#0a0908)]' : 'bg-[radial-gradient(90%_80%_at_75%_20%,#123d33,#0d1311_60%,#0a0908)]'}`}>
        <div className="pattern-girih absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-end">
          <Portrait spec={figure.portrait} name={figure.name} image={figure.image} className="aspect-[4/5] w-full max-w-xs" />
          <div>
            <p className="label-caps text-gold">
              {categoryLabel[figure.category]} · {figure.lifespan}
            </p>
            <h1 className="display-title mt-4 text-5xl text-ivory sm:text-7xl">{figure.name}</h1>
            {figure.altNames && <p className="mt-2 text-sm text-ash">Also known as {figure.altNames.join(', ')}</p>}
            <p className="mt-4 font-display text-2xl italic text-gold-light/90">{figure.role}</p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ivory/80">{figure.summary}</p>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <section className="mt-4" aria-labelledby="acc">
          <h2 id="acc" className="label-caps mb-3 text-gold">
            Accuracy at a glance
          </h2>
          <AssessmentPanel assessment={figure.assessment} />
        </section>
        <div className="mt-16 grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="display-title text-4xl text-ivory">Biography</h2>
            <div className="prose-history mt-6">
              {figure.biography.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <h2 className="display-title mt-14 text-3xl text-ivory">Historical role</h2>
            <p className="prose-history mt-4">{figure.historicalRole}</p>
            {figure.politicalInfluence && (
              <>
                <h2 className="display-title mt-14 text-3xl text-ivory">Political influence</h2>
                <p className="prose-history mt-4">{figure.politicalInfluence}</p>
              </>
            )}
            <h2 className="display-title mt-14 text-3xl text-ivory">Historical significance</h2>
            <p className="prose-history mt-4">{figure.significance}</p>
            {figure.notes.length > 0 && (
              <>
                <h2 className="display-title mt-14 text-3xl text-ivory">Fact, tradition &amp; interpretation</h2>
                <NotesList notes={figure.notes} className="mt-5" />
              </>
            )}
          </div>
          <aside className="space-y-6">
            <Block title="Major accomplishments" items={figure.accomplishments} />
            <Block title="Military" items={figure.military} />
            <Block title="Cultural contributions" items={figure.cultural} />
            {figure.controversies && figure.controversies.length > 0 && (
              <div className="rounded-3xl border border-ember/30 bg-wine/15 p-6">
                <h2 className="label-caps text-[#f3a4ae]">Controversies</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
                  {figure.controversies.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
            )}
            {(rulersRel.length > 0 || battles.length > 0 || builds.length > 0) && (
              <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
                <h2 className="label-caps text-gold">Connections</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {rulersRel.map((r) => (
                    <Link key={r.id} href={`/sultans/${r.id}/`} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold-light hover:border-gold">
                      {r.name}
                    </Link>
                  ))}
                  {battles.map((b) => (
                    <Link key={b.id} href={`/battles/#${b.id}`} className="rounded-full border hairline px-3 py-1 text-xs text-ivory/80 hover:border-gold/40">
                      ⚔ {b.name}
                    </Link>
                  ))}
                  {builds.map((b) => (
                    <Link key={b.id} href={`/architecture/#${b.id}`} className="rounded-full border hairline px-3 py-1 text-xs text-ivory/80 hover:border-gold/40">
                      ◆ {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
        {figure.locations && figure.locations.length > 0 && (
          <section className="mt-20">
            <h2 className="display-title mb-6 text-3xl text-ivory">Where was {figure.name.split(' (')[0]}?</h2>
            <LocationsMap locations={figure.locations} snapshotYear={figure.activeTo} heading={false} />
          </section>
        )}
        <SourcesList ids={figure.sources} className="mt-16" defaultOpen />
      </div>
    </article>
  );
}
