import type { Metadata } from 'next';
import Link from 'next/link';
import { sources } from '@/data/sources';
import type { Source } from '@/data/types';
import { rulers } from '@/data/rulers';
import { allFigures } from '@/data/people';
import { battles } from '@/data/battles';
import { events } from '@/data/events';
import { places } from '@/data/places';
import { buildings } from '@/data/buildings';
import { glossary } from '@/data/glossary';
import { PageHero } from '@/components/ui/PageHero';
import { CertaintyLegend } from '@/components/ui/Certainty';
import { SourceCitation } from '@/components/ui/SourcesList';

export const metadata: Metadata = {
  title: 'Sources, Method & Credits',
  description: 'How this site was researched: the bibliography of scholarship, primary sources and reference works, how certainty is labelled, how maps and reconstructions were made, and media credits.',
  alternates: { canonical: '/sources/' },
};

const GROUPS: { type: Source['type']; title: string; intro: string }[] = [
  { type: 'book', title: 'Scholarship', intro: 'Modern historical research — the backbone of every section.' },
  { type: 'primary', title: 'Primary sources', intro: 'Chronicles, eyewitness accounts and travel writing, in published editions and translations. They are evidence, not neutral truth.' },
  { type: 'document', title: 'Documents', intro: 'Official texts: edicts, constitutions, treaties and parliamentary records.' },
  { type: 'reference', title: 'Reference works', intro: 'Encyclopedias used for orientation and cross-checking dates and names.' },
  { type: 'institution', title: 'Institutions & collections', intro: 'Museums, archives and heritage bodies.' },
  { type: 'web', title: 'Web resources', intro: 'Online reference and heritage pages.' },
  { type: 'data', title: 'Data', intro: 'Geographic data used to build the maps.' },
];

const PRINCIPLES = [
  { title: 'Nothing invented', text: 'No quotation, date, battle, title, relationship or achievement on this site was invented. Where a famous saying is only attributed by later writers, it is labelled as tradition — or left out.' },
  { title: 'Fact, tradition, interpretation', text: 'Statements that are traditional, interpretive or disputed carry a label. Unlabelled narrative reflects broad scholarly consensus as represented in the sources cited beside it.' },
  { title: 'Neither hero nor villain', text: 'The empire is presented as historians now see it: a durable, adaptable and diverse state that also waged brutal wars, enslaved people and, in its last years, carried out mass atrocities.' },
  { title: 'Dates and names', text: 'Dates are Common Era; regnal dates follow standard reference works, which sometimes differ by a year. Names use modern Turkish spellings with familiar English forms (Süleyman, Constantinople/Istanbul).' },
  { title: 'Maps are approximations', text: 'Borders before the nineteenth century were often zones rather than lines. Territorial maps show approximate extent, vassals and contested areas; they are drawn from the historical atlases and surveys cited, not surveyed boundaries.' },
  { title: 'Reconstructions are labelled', text: 'Portraits, 3D models, battle diagrams and the siege sequence are artistic or schematic reconstructions, always marked as such. They show general forms, not specific documented appearances.' },
];

const CREDITS = [
  { title: 'Portraits', text: 'All portraits are procedural vector illustrations generated in code from simple descriptors (headwear, beard, palette). They are not likenesses. Historical portraits of later sultans exist in museum collections; replace them via the media fields in the data files (see the README).' },
  { title: '3D models', text: 'Constantinople skyline, mosques, Istanbul city, galley and arms are built procedurally with Three.js — no external model files.' },
  { title: 'Maps', text: 'Coastlines from Natural Earth (public domain) via the world-atlas package, projected at build time. Territories, routes and battle movements were drawn for this site as approximations.' },
  { title: 'Sound', text: 'Ambient sound is synthesized live in the browser with the Web Audio API. No recorded or copyrighted music is used.' },
  { title: 'Typography', text: 'Cormorant Garamond, Manrope and Amiri, served via Google Fonts under the SIL Open Font License.' },
];

export default function SourcesPage() {
  const counts = [
    [rulers.length, 'sultans'],
    [allFigures.length, 'figures'],
    [battles.length, 'battles'],
    [events.length, 'dated events'],
    [places.length, 'places'],
    [buildings.length, 'buildings'],
    [glossary.length, 'glossary terms'],
    [sources.length, 'sources'],
  ] as const;
  return (
    <>
      <PageHero
        kicker="Method & bibliography"
        title={
          <>
            Sources &amp; <span className="text-gold-gradient">References</span>
          </>
        }
        intro="History is an argument from evidence. Here is how this site was put together, how to read its labels, and the books, documents and collections behind it."
      >
        <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {counts.map(([n, label]) => (
            <div key={label} className="rounded-2xl border hairline bg-white/[0.02] p-4">
              <dt className="text-xs text-ash">{label}</dt>
              <dd className="font-display text-3xl text-ivory">{n}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section id="method" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-8" aria-labelledby="method-title">
        <h2 id="method-title" className="display-title text-4xl text-ivory sm:text-5xl">
          Methodology
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="rounded-3xl border hairline bg-white/[0.02] p-6">
              <p className="font-display text-4xl text-gold/40">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 font-display text-2xl text-ivory">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/70">{p.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <h3 className="label-caps text-gold">How to read the labels</h3>
          <CertaintyLegend className="mt-5" />
        </div>
      </section>

      <section id="bibliography" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-28 sm:px-8" aria-labelledby="bib-title">
        <h2 id="bib-title" className="display-title text-4xl text-ivory sm:text-5xl">
          Bibliography
        </h2>
        <p className="mt-4 max-w-3xl text-ivory/65">
          Every section links to the works it draws on. Links to encyclopedia entries open a search on the publisher’s site. A note on balance: on contested subjects — such as the Armenian Genocide or the end of the empire — works from different historiographical traditions are cited, and the position of most historians is stated plainly.
        </p>
        <div className="mt-12 space-y-14">
          {GROUPS.map((g) => {
            const list = sources.filter((s) => s.type === g.type).sort((a, b) => (a.author ?? a.title).localeCompare(b.author ?? b.title));
            if (!list.length) return null;
            return (
              <div key={g.type}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b hairline pb-3">
                  <h3 className="font-display text-3xl text-ivory">{g.title}</h3>
                  <p className="text-xs text-ash">{list.length} entries</p>
                </div>
                <p className="mt-3 text-sm text-ivory/60">{g.intro}</p>
                <ul className="mt-5 grid gap-x-10 gap-y-3 text-sm leading-relaxed md:grid-cols-2">
                  {list.map((s) => (
                    <li key={s.id} id={`src-${s.id}`} className="scroll-mt-28">
                      <SourceCitation s={s} />
                      {s.note && <span className="block text-xs text-ash">{s.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section id="credits" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-28 sm:px-8" aria-labelledby="credits-title">
        <h2 id="credits-title" className="display-title text-4xl text-ivory sm:text-5xl">
          Media &amp; credits
        </h2>
        <dl className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CREDITS.map((c) => (
            <div key={c.title} className="rounded-3xl border hairline bg-white/[0.02] p-6">
              <dt className="font-display text-2xl text-ivory">{c.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ivory/70">{c.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 max-w-3xl text-sm text-ivory/60">
          Spotted an error or a claim that needs a better source? Corrections are welcome — the data lives in plain TypeScript files, described in the project README. Continue exploring with the{' '}
          <Link href="/glossary/" className="text-gold-light underline decoration-gold/40 underline-offset-2">
            glossary
          </Link>{' '}
          or return to the{' '}
          <Link href="/#timeline" className="text-gold-light underline decoration-gold/40 underline-offset-2">
            timeline
          </Link>
          .
        </p>
      </section>
    </>
  );
}
