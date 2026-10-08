import type { Metadata } from 'next';
import Link from 'next/link';
import { finalYears } from '@/data/narratives';
import { getRuler } from '@/data/rulers';
import { getFigure } from '@/data/people';
import { FinalYearsTimeline, AbolitionMoment, TwoEndings } from '@/components/sections/FinalYears';
import { Portrait } from '@/components/ui/Portrait';
import { NotesList, CertaintyBadge } from '@/components/ui/Certainty';
import { SourcesList } from '@/components/ui/SourcesList';
import { Ornament } from '@/components/ui/Ornament';

export const metadata: Metadata = {
  title: 'The Final Years, 1908 – 1922 — and the Separate End of the Caliphate in 1924',
  description: 'Revolution, the Balkan Wars, the First World War, the Armenian Genocide, occupation and the Turkish War of Independence. Mehmed VI, the abolition of the Sultanate on 1 November 1922, and Abdülmecid II, the last Caliph (1922–1924).',
  alternates: { canonical: '/final-years/' },
};

const INDEPENDENCE: { date: string; title: string; text: string; kind?: 'disputed' }[] = [
  { date: '19 May 1919', title: 'Mustafa Kemal lands at Samsun', text: 'Sent to Anatolia as an army inspector by the Istanbul government, he begins organizing resistance. The date later became a national holiday in Turkey.' },
  { date: 'July – September 1919', title: 'Congresses of Erzurum and Sivas', text: 'Regional resistance groups unite and declare that the Ottoman lands within the armistice lines are indivisible.' },
  { date: '28 January 1920', title: 'The National Pact', text: 'The last Ottoman parliament, meeting in Istanbul, adopts the National Pact (Misak-ı Millî) defining the nationalists’ territorial aims.' },
  { date: '16 March 1920', title: 'Formal occupation of Istanbul', text: 'Allied forces occupy the capital, arrest nationalist deputies and deport some to Malta. Parliament is dissolved in April.' },
  { date: '23 April 1920', title: 'The Grand National Assembly opens in Ankara', text: 'A rival parliament claims to act for the nation while the Sultan is, in its view, captive of the occupiers.' },
  { date: '10 August 1920', title: 'Treaty of Sèvres', text: 'Signed by the Sultan’s government, it would have partitioned Anatolia. Rejected by Ankara, it was never ratified.' },
  { date: '1921', title: 'İnönü and Sakarya', text: 'The Greek advance is checked at İnönü and finally halted at the Sakarya river after three weeks of fighting (23 August – 13 September). Treaties with Soviet Russia and France secure the eastern and southern fronts.' },
  { date: '26 – 30 August 1922', title: 'The Great Offensive', text: 'The nationalist army breaks the Greek front at Dumlupınar and advances to the Aegean.' },
  { date: '9 – 22 September 1922', title: 'İzmir (Smyrna)', text: 'Nationalist forces enter İzmir. A great fire destroys the Armenian, Greek and European quarters amid killings and the flight of tens of thousands; responsibility for the fire remains contested between national historiographies.', kind: 'disputed' },
  { date: '11 October 1922', title: 'Armistice of Mudanya', text: 'Ends the fighting. Eastern Thrace is to be handed to the Ankara government. Three weeks later the Assembly abolishes the Sultanate.' },
];

export default function FinalYearsPage() {
  const mehmed = getRuler('mehmed-vi')!;
  const caliph = getFigure('abdulmejid-ii')!;
  return (
    <div className="bg-[#070607]">
      <section className="relative overflow-hidden pt-36 sm:pt-44" aria-labelledby="final-title">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_45%_at_50%_0%,rgba(107,22,36,0.4),transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <p className="label-caps text-[#d07a88]">1908 — 1922</p>
          <h1 id="final-title" className="display-title mt-5 text-6xl text-ivory sm:text-8xl lg:text-9xl">
            The Final Years
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ivory/65 sm:text-xl">
            Revolution and constitution, wars on every frontier, mass atrocity, famine, defeat and occupation — and a new state rising in Anatolia. Fourteen years that ended six centuries.
          </p>
          <div className="mt-8 max-w-3xl rounded-2xl border border-[#7a5a62]/50 bg-[#160d10] p-5 text-sm leading-relaxed text-ivory/70">
            This chapter includes the Armenian Genocide and other mass violence against civilians. They are described plainly and with sources, as historians document them.
          </div>
          <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-3">
            {[
              ['#collapse', '1908 – 1922'],
              ['#independence', 'War of Independence'],
              ['#mehmed-vi', 'Mehmed VI'],
              ['#abolition', '1 November 1922'],
              ['#caliph', 'Abdülmecid II, 1922 – 1924'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-[#d07a88]/40 px-5 py-2.5 text-sm font-semibold text-[#f3a4ae] transition hover:border-[#d07a88] hover:bg-[#d07a88]/10">
                {label}
              </a>
            ))}
          </nav>
          <Ornament className="mt-14 max-w-md" />
        </div>
      </section>

      <section id="collapse" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-16 sm:px-8" aria-labelledby="collapse-title">
        <h2 id="collapse-title" className="label-caps text-[#d07a88]">
          From revolution to armistice
        </h2>
        <FinalYearsTimeline moments={finalYears} className="mt-10" />
        <SourcesList ids={['hanioglu-brief', 'aksakal-1914', 'rogan-fall', 'reynolds-shattering', 'erickson-ordered', 'erickson-gallipoli', 'suny-desert', 'akcam-crime', 'mudros', 'brit-young-turks', 'brit-balkan-wars']} className="mt-10" />
      </section>

      <section id="independence" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-28 sm:px-8" aria-labelledby="independence-title">
        <p className="label-caps text-gold">1919 — 1922</p>
        <h2 id="independence-title" className="display-title mt-4 text-4xl text-ivory sm:text-6xl">
          The Turkish War of Independence
        </h2>
        <p className="mt-5 max-w-3xl text-lg text-ivory/65">
          While the Sultan’s government in occupied Istanbul sought accommodation with the Allies, a nationalist movement in Anatolia built an army and a parliament of its own. Its victory decided the fate of both the dynasty and the empire.
        </p>
        <ol className="mt-12 grid gap-4 md:grid-cols-2">
          {INDEPENDENCE.map((e, i) => (
            <li key={e.title} className="relative rounded-2xl border hairline bg-white/[0.02] p-6">
              <span className="absolute right-5 top-5 font-display text-3xl text-ivory/10">{String(i + 1).padStart(2, '0')}</span>
              <p className="label-caps text-gold-light">{e.date}</p>
              <h3 className="mt-2 font-display text-2xl text-ivory">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/70">{e.text}</p>
              {e.kind && <CertaintyBadge kind={e.kind} className="mt-3" />}
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-sm text-ivory/55">
          The nationalists fought Greek, Armenian and French forces as well as rebels and the Sultan’s own “Army of the Caliphate”. Civilians of every community suffered massacres, deportations and flight.{' '}
          <Link href="/figures/ataturk/" className="text-gold-light underline decoration-gold/40 underline-offset-2">
            Mustafa Kemal (Atatürk)
          </Link>{' '}
          led the movement; he later founded the Republic of Turkey — a new state, not a continuation of the Ottoman monarchy.
        </p>
        <SourcesList ids={['zurcher-turkey', 'gingeras-fall', 'mango-ataturk', 'hanioglu-ataturk', 'brit-sevres', 'brit-ataturk']} className="mt-10" />
      </section>

      <section id="mehmed-vi" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-28 sm:px-8" aria-labelledby="mehmed-title">
        <div className="grid gap-10 rounded-[2rem] border border-gold/20 bg-gradient-to-br from-[#1a0c10] to-transparent p-7 sm:p-12 lg:grid-cols-[18rem_1fr]">
          <div>
            <Portrait spec={mehmed.portrait} name={mehmed.name} className="aspect-[4/5] w-full max-w-[18rem]" />
            <dl className="mt-5 space-y-2 text-sm">
              <div>
                <dt className="label-caps text-ash">Reign</dt>
                <dd className="text-ivory">{mehmed.reigns[0].label}</dd>
              </div>
              <div>
                <dt className="label-caps text-ash">Born</dt>
                <dd className="text-ivory">{mehmed.born}</dd>
              </div>
              <div>
                <dt className="label-caps text-ash">Died</dt>
                <dd className="text-ivory">{mehmed.died}</dd>
              </div>
            </dl>
          </div>
          <div>
            <p className="label-caps text-gold">36th and last Sultan · 1918 — 1922</p>
            <h2 id="mehmed-title" className="display-title mt-3 text-4xl text-ivory sm:text-6xl">
              Mehmed VI Vahdeddin
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ivory/80">{mehmed.summary}</p>
            <div className="mt-4 space-y-4 leading-relaxed text-ivory/70">
              {mehmed.biography.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border hairline bg-black/30 p-5">
              <p className="label-caps text-gold-light">How historians see him</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">{mehmed.legacy}</p>
            </div>
            {mehmed.notes && <NotesList notes={mehmed.notes} className="mt-6" />}
            <Link href="/sultans/mehmed-vi/" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light">
              Full profile and places of exile →
            </Link>
          </div>
        </div>
        <SourcesList ids={mehmed.sources} className="mt-8" />
      </section>

      <AbolitionMoment />

      <section className="pb-12">
        <TwoEndings />
      </section>

      <section id="caliph" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-28 pt-12 sm:px-8" aria-labelledby="caliph-title">
        <div className="rounded-[2rem] border border-emerald/40 bg-gradient-to-br from-emerald/15 to-transparent p-7 sm:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <p className="label-caps text-[#9fe0c6]">After the Sultanate · November 1922 — 3 March 1924</p>
            <CertaintyBadge kind="confirmed" />
          </div>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_16rem]">
            <div>
              <h2 id="caliph-title" className="display-title text-4xl text-ivory sm:text-6xl">
                Abdülmecid II — Caliph, not Sultan
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ivory/80">{caliph.summary}</p>
              <div className="mt-4 space-y-4 leading-relaxed text-ivory/70">
                {caliph.biography.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <ol className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['24 July 1923', 'Treaty of Lausanne recognizes the new Turkey’s borders.'],
                  ['29 October 1923', 'The Republic of Turkey is proclaimed; Mustafa Kemal becomes its first President.'],
                  ['3 March 1924', 'The Assembly abolishes the Caliphate and exiles the House of Osman.'],
                ].map(([d, t]) => (
                  <li key={d} className="rounded-2xl border border-emerald/30 bg-black/30 p-4">
                    <p className="font-display text-xl text-[#9fe0c6]">{d}</p>
                    <p className="mt-1 text-sm text-ivory/75">{t}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <Portrait spec={caliph.portrait} name={caliph.name} className="aspect-[4/5] w-full" />
              <Link href="/figures/abdulmejid-ii/" className="mt-4 inline-block text-sm font-semibold text-gold-light underline decoration-gold/40 underline-offset-4">
                Full profile →
              </Link>
            </div>
          </div>
        </div>
        <SourcesList ids={['hassan-caliphate', 'zurcher-turkey', 'tbmm-1924', 'brit-caliphate', 'brit-lausanne']} className="mt-8" />
        <p className="mx-auto mt-20 max-w-2xl text-center font-display text-2xl leading-relaxed text-ivory/70 sm:text-3xl">The empire’s former lands now lie in dozens of modern states. Its legacy lives on in their cities, laws, languages, kitchens and memories.</p>
        <div className="mt-8 text-center">
          <Link href="/#legacy" className="rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold-light transition hover:border-gold">
            The legacy →
          </Link>
        </div>
      </section>
    </div>
  );
}
