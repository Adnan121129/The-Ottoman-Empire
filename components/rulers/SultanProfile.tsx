import { ArrowLeft, ArrowRight, Building2, Crown, Gavel, Swords } from 'lucide-react';
import Link from 'next/link';
import type { Ruler } from '@/data/types';
import { eraById, eraTones } from '@/data/eras';
import { getRuler, reignLabel, reignLength, trendLabel } from '@/data/rulers';
import { getBattle, resultLabel } from '@/data/battles';
import { getBuilding } from '@/data/buildings';
import { allFigures } from '@/data/people';
import { Portrait } from '@/components/ui/Portrait';
import { AssessmentPanel, NotesList } from '@/components/ui/Certainty';
import { SourcesList } from '@/components/ui/SourcesList';
import { Ornament } from '@/components/ui/Ornament';
import { LocationsMap } from '@/components/maps/LocationsMap';
import { cn } from '@/lib/utils';

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-charcoal/95 px-4 py-3">
      <dt className="label-caps text-ash">{label}</dt>
      <dd className="mt-1 text-sm text-ivory/90">{children}</dd>
    </div>
  );
}

function PersonLink({ id, fallback }: { id?: string; fallback?: string }) {
  const r = getRuler(id);
  if (r) return <Link href={`/sultans/${r.id}/`} className="text-gold-light underline decoration-gold/30 underline-offset-2 hover:decoration-gold">{r.name}</Link>;
  return <>{fallback ?? '—'}</>;
}

export function SultanProfile({ ruler }: { ruler: Ruler }) {
  const era = eraById[ruler.eraId];
  const tone = eraTones[era.tone];
  const prev = getRuler(ruler.predecessorId);
  const next = getRuler(ruler.successorId);
  const battles = ruler.battleIds.map(getBattle).filter((b): b is NonNullable<typeof b> => Boolean(b));
  const builds = ruler.buildingIds.map(getBuilding).filter((b): b is NonNullable<typeof b> => Boolean(b));
  const people = allFigures.filter((f) => f.relatedRulerIds?.includes(ruler.id));
  const years = Math.round(reignLength(ruler));

  return (
    <article>
      {/* Hero */}
      <header className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40" style={{ background: `radial-gradient(90% 80% at 75% 20%, ${tone.to}, ${tone.from} 60%, #0a0908)` }}>
        <div className="pattern-girih absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-end">
          <Portrait spec={ruler.portrait} name={ruler.name} image={ruler.image} className={cn('aspect-[4/5] w-full max-w-sm', ruler.featured && 'shadow-[0_40px_80px_-30px_rgba(201,162,74,0.45)]')} />
          <div>
            <p className="label-caps" style={{ color: tone.accent }}>
              {ruler.order}
              {ruler.order === 1 ? 'st' : ruler.order === 2 ? 'nd' : ruler.order === 3 ? 'rd' : 'th'} ruler of the House of Osman · {era.name}
            </p>
            {ruler.turningPoint && <p className="mt-4 inline-block rounded-full bg-gold px-3 py-1 text-[0.62rem] font-bold tracking-[0.2em] text-ink uppercase">{ruler.turningPoint}</p>}
            <h1 className="display-title mt-4 text-6xl text-ivory sm:text-8xl">{ruler.name}</h1>
            {ruler.epithet && <p className="mt-3 font-display text-2xl italic text-ivory/75">{ruler.epithet}</p>}
            <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p className="font-display text-3xl tracking-[0.12em] text-gold-light">{reignLabel(ruler)}</p>
              {ruler.ottomanName && (
                <p className="font-arabic text-3xl text-ivory/70" lang="ota" dir="rtl">
                  {ruler.ottomanName}
                </p>
              )}
              <p className="text-sm text-ash">Turkish: {ruler.turkishName}</p>
            </div>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ivory/80">{ruler.summary}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <dl className="mt-2 grid gap-px overflow-hidden rounded-3xl border hairline bg-gold/10 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Reign">{reignLabel(ruler)} {years > 0 && <span className="text-ash">({years} yr{years === 1 ? '' : 's'})</span>}</Fact>
          <Fact label="Born">{ruler.born ?? 'Unknown'}</Fact>
          <Fact label="Died">{ruler.died ?? 'Unknown'}</Fact>
          <Fact label="Fate">{ruler.fate}</Fact>
          <Fact label="Father">
            <PersonLink id={ruler.fatherId} fallback={ruler.father} />
          </Fact>
          <Fact label="Mother">{ruler.mother ?? 'Unknown'}</Fact>
          <Fact label="Predecessor">
            <PersonLink id={ruler.predecessorId} fallback="— (founder)" />
          </Fact>
          <Fact label="Successor">
            <PersonLink id={ruler.successorId} fallback={ruler.id === 'mehmed-vi' ? 'None — Sultanate abolished (1922)' : '—'} />
          </Fact>
        </dl>

        <section className="mt-10" aria-labelledby="accuracy">
          <h2 id="accuracy" className="label-caps mb-3 text-gold">
            Accuracy at a glance
          </h2>
          <AssessmentPanel assessment={ruler.assessment} />
        </section>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <section aria-labelledby="bio">
              <h2 id="bio" className="display-title text-4xl text-ivory">
                Biography
              </h2>
              <div className="prose-history mt-6">
                {ruler.biography.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
            <section className="mt-14" aria-labelledby="context">
              <h2 id="context" className="display-title text-3xl text-ivory">
                Historical context
              </h2>
              <p className="prose-history mt-4">{ruler.historicalContext}</p>
            </section>
            <section className="mt-14" aria-labelledby="legacy-h">
              <h2 id="legacy-h" className="display-title text-3xl text-ivory">
                Legacy
              </h2>
              <p className="prose-history mt-4">{ruler.legacy}</p>
            </section>
            {ruler.notes.length > 0 && (
              <section className="mt-14" aria-labelledby="notes">
                <h2 id="notes" className="display-title text-3xl text-ivory">
                  Fact, tradition &amp; interpretation
                </h2>
                <NotesList notes={ruler.notes} className="mt-5" />
              </section>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
              <h2 className="label-caps flex items-center gap-2 text-gold">
                <Crown className="h-4 w-4" aria-hidden="true" /> Major achievements
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
                {ruler.achievements.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
              <h2 className="label-caps flex items-center gap-2 text-gold">
                <Swords className="h-4 w-4" aria-hidden="true" /> Major wars
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ruler.wars.map((w) => (
                  <li key={w} className="rounded-full border hairline px-3 py-1 text-xs text-ivory/75">
                    {w}
                  </li>
                ))}
              </ul>
              {battles.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {battles.map((b) => (
                    <li key={b.id}>
                      <Link href={`/battles/#${b.id}`} className="flex items-center justify-between gap-3 rounded-xl border hairline px-3 py-2 text-sm transition hover:border-gold/40">
                        <span className="text-ivory">{b.name}</span>
                        <span className={cn('shrink-0 text-[0.65rem]', b.result === 'ottoman-victory' ? 'text-gold-light' : b.result === 'ottoman-defeat' ? 'text-[#f3a4ae]' : 'text-ash')}>
                          {b.year} · {resultLabel[b.result]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {ruler.reforms.length > 0 && (
              <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
                <h2 className="label-caps flex items-center gap-2 text-gold">
                  <Gavel className="h-4 w-4" aria-hidden="true" /> Major reforms
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-ivory/80">
                  {ruler.reforms.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </div>
            )}
            {(ruler.architecture.length > 0 || builds.length > 0) && (
              <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
                <h2 className="label-caps flex items-center gap-2 text-gold">
                  <Building2 className="h-4 w-4" aria-hidden="true" /> Architecture
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-ivory/80">
                  {ruler.architecture.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
                {builds.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {builds.map((b) => (
                      <Link key={b.id} href={`/architecture/#${b.id}`} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold-light hover:border-gold">
                        {b.name} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
              <h2 className="label-caps text-gold">Empire status</h2>
              <p className="mt-3 text-sm text-ivory/80">{ruler.empireStatus}</p>
              <p className="label-caps mt-5 text-gold">Territorial change</p>
              <p className="mt-2 text-sm text-ivory/80">
                <span className="text-gold-light">{trendLabel[ruler.territorialChange.trend]}</span> — {ruler.territorialChange.summary}
              </p>
            </div>
          </aside>
        </div>

        {ruler.keyEvents.length > 0 && (
          <section className="mt-20" aria-labelledby="events">
            <h2 id="events" className="display-title text-3xl text-ivory">
              Important events
            </h2>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ruler.keyEvents.map((e) => (
                <li key={e.year + e.text} className="flex gap-4 rounded-2xl border hairline p-4">
                  <span className="font-display text-2xl text-gold-light">{e.year}</span>
                  <span className="text-sm text-ivory/80">{e.text}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {ruler.locations && ruler.locations.length > 0 && (
          <section className="mt-20" aria-labelledby="where">
            <h2 id="where" className="display-title mb-6 text-3xl text-ivory">
              Places in the life of {ruler.name}
            </h2>
            <LocationsMap locations={ruler.locations} snapshotYear={ruler.reignEnd} heading={false} />
          </section>
        )}

        {people.length > 0 && (
          <section className="mt-20" aria-labelledby="people">
            <h2 id="people" className="display-title text-3xl text-ivory">
              People of the reign
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {people.map((f) => (
                <li key={f.id}>
                  <Link href={`/figures/${f.id}/`} className="block rounded-full border hairline px-4 py-2 text-sm text-ivory/85 transition hover:border-gold/50">
                    {f.name} <span className="text-xs text-ash">· {f.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <SourcesList ids={ruler.sources} className="mt-16" defaultOpen />
        <Ornament className="my-16" />
        <nav aria-label="Previous and next sultan" className="grid gap-4 pb-24 sm:grid-cols-2">
          {prev ? (
            <Link href={`/sultans/${prev.id}/`} className="group flex items-center gap-4 rounded-3xl border hairline p-5 transition hover:border-gold/40">
              <ArrowLeft className="h-5 w-5 text-gold transition group-hover:-translate-x-1" aria-hidden="true" />
              <span>
                <span className="label-caps block text-ash">Predecessor</span>
                <span className="font-display text-2xl text-ivory">{prev.name}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/sultans/${next.id}/`} className="group flex items-center justify-end gap-4 rounded-3xl border hairline p-5 text-right transition hover:border-gold/40">
              <span>
                <span className="label-caps block text-ash">Successor</span>
                <span className="font-display text-2xl text-ivory">{next.name}</span>
              </span>
              <ArrowRight className="h-5 w-5 text-gold transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
