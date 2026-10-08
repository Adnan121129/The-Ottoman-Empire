import type { Metadata } from 'next';
import { Info } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { SourcesList } from '@/components/ui/SourcesList';
import { ComparisonChart } from '@/components/compare/ComparisonChart';

export const metadata: Metadata = {
  title: 'Compare the Sultans — Reigns, Battles, Reforms and Buildings',
  description: 'Compare up to four Ottoman sultans side by side: years on the throne, battles, reforms, building projects and territorial change — with no simplistic “best sultan” ranking.',
  alternates: { canonical: '/compare/' },
};

export default function ComparePage() {
  return (
    <>
      <PageHero
        kicker="Data explorer"
        title={
          <>
            Compare the <span className="text-gold-gradient">Sultans</span>
          </>
        }
        intro="Set reigns side by side to see how long sultans ruled, which battles, reforms and buildings this site records for them, and what happened to the empire’s territory in their time."
      >
        <div className="mt-8 flex max-w-3xl gap-4 rounded-2xl border border-gold/25 bg-gold/[0.05] p-5 text-sm leading-relaxed text-ivory/80">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
          <p>
            <strong className="text-ivory">There is no “best sultan” score here.</strong> These are counts of entries in this site’s own, selective dataset. A long reign is not the same as a successful one, a battle count says nothing about the cost of war, and many achievements belonged to viziers, mothers, commanders and ordinary subjects as much as to the ruler. Use the numbers as a starting point for questions, then read the profiles.
          </p>
        </div>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-8" aria-label="Comparison">
        <ComparisonChart />
        <SourcesList ids={['finkel-osman', 'imber-structure', 'alderson-dynasty', 'pitcher-geography', 'cht-2', 'cht-3']} className="mt-12" />
      </section>
    </>
  );
}
