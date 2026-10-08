import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { SourcesList } from '@/components/ui/SourcesList';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { DynastyTree } from '@/components/dynasty/DynastyTree';

export const metadata: Metadata = {
  title: 'The House of Osman — Family Tree of the Ottoman Dynasty',
  description: 'A zoomable family tree of the Ottoman dynasty: 36 sultans across 21 generations, from Ertuğrul and Osman I to Mehmed VI, with notable princes and Abdülmecid II, the last Caliph.',
  alternates: { canonical: '/dynasty/' },
};

const RULES = [
  { years: '1300s – 1603', title: 'Open succession', text: 'Any son of a sultan could claim the throne. Princes governed provinces as training, and the one who reached the capital and won the army’s support prevailed — often in civil war.', kind: 'confirmed' as const },
  { years: 'c. 1389 – 1595', title: 'Royal fratricide', text: 'New sultans frequently had their brothers executed to prevent rebellion — a practice sanctioned in the law code attributed to Mehmed II. Mehmed III’s accession in 1595, with the deaths of nineteen brothers, was the last on that scale.', kind: 'confirmed' as const },
  { years: '1603 – 1617', title: 'From provinces to the palace', text: 'Ahmed I spared his brother Mustafa. Princes stopped governing provinces and were instead kept in the palace — later in the secluded apartments known as the kafes (“cage”).', kind: 'confirmed' as const },
  { years: '1617 – 1922', title: 'Seniority', text: 'The throne now usually passed to the eldest male of the dynasty — a brother, uncle or cousin rather than a son. That is why the tree branches so widely after Ahmed I.', kind: 'confirmed' as const },
];

export default function DynastyPage() {
  return (
    <>
      <PageHero
        kicker="1299 — 1922 · twenty-one generations"
        tone="gold"
        title={
          <>
            The House of <span className="text-gold-gradient">Osman</span>
          </>
        }
        intro="Thirty-six sultans, all descended in the male line from Osman I, ruled for more than six centuries — one of the longest-lasting dynasties in history. Explore who descended from whom, how the rules of succession changed, and the princes who never reigned."
      />
      <section className="mx-auto max-w-[1500px] px-4 sm:px-8" aria-label="Family tree">
        <DynastyTree />
      </section>
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8" aria-labelledby="succession-title">
        <p className="label-caps text-gold">How the throne passed</p>
        <h2 id="succession-title" className="display-title mt-3 text-4xl text-ivory sm:text-5xl">
          The rules of succession
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {RULES.map((r, i) => (
            <li key={r.title} className="rounded-3xl border hairline bg-white/[0.02] p-6">
              <p className="font-display text-4xl text-gold/40">{i + 1}</p>
              <p className="label-caps mt-2 text-gold-light">{r.years}</p>
              <h3 className="mt-2 font-display text-2xl text-ivory">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/70">{r.text}</p>
              <CertaintyBadge kind={r.kind} className="mt-4" />
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-sm text-ivory/55">
          The tree shows fathers and sons who reigned, plus a few princes who shaped the succession. Sultans had many more children, including daughters whose marriages to viziers were politically important; they are not shown here. Mothers of sultans are discussed in the profiles and on the Figures page.
        </p>
        <SourcesList ids={['alderson-dynasty', 'peirce-harem', 'kastritsis-sons', 'finkel-osman', 'imber-structure', 'tezcan-second']} className="mt-10" />
      </section>
    </>
  );
}
