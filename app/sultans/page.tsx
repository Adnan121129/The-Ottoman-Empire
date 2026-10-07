import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { SultanGallery } from '@/components/rulers/SultanGallery';
import { SourcesList } from '@/components/ui/SourcesList';

export const metadata: Metadata = {
  title: 'The Sultans — all 36 rulers of the House of Osman',
  description: 'Profiles of all 36 Ottoman sultans from Osman I to Mehmed VI, with reigns, achievements, wars, reforms, legacy and sources.',
  alternates: { canonical: '/sultans/' },
};

export default function SultansPage() {
  return (
    <>
      <PageHero
        kicker="The House of Osman · 36 rulers"
        title={
          <>
            The <span className="text-gold-gradient">Sultans</span>
          </>
        }
        intro="Thirty-six rulers, one dynasty, six centuries. From frontier warriors to palace sovereigns, constitutional monarchs and an exile in Sanremo — every sultan, with what is known, what is legend and what is still debated."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dynasty/" className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-light">
            The family tree
          </Link>
          <Link href="/compare/" className="rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold-light transition hover:border-gold">
            Compare the sultans
          </Link>
        </div>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <SultanGallery />
        <p className="mt-12 max-w-3xl text-sm text-ash">
          Portraits are stylized artistic reconstructions showing period dress, not likenesses. Authentic images exist for some sultans — for example the portrait of Mehmed II attributed to Gentile Bellini (1480) and photographs of the late sultans — and can be added through the data files.
        </p>
        <SourcesList ids={['alderson-dynasty', 'finkel-osman', 'inalcik-classical', 'quataert-1700', 'agoston-masters', 'tdv']} className="mt-8" />
      </div>
    </>
  );
}
