import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { HistoricalMap } from '@/components/maps/HistoricalMap';
import { WhereWereThey } from '@/components/maps/WhereWereThey';
import { SourcesList } from '@/components/ui/SourcesList';
import { CertaintyBadge } from '@/components/ui/Certainty';

export const metadata: Metadata = {
  title: 'Map of the Empire — territorial change 1300–1922',
  description: 'Interactive map of Ottoman territorial expansion and contraction across 13 snapshots, with cities, capitals, battles, rivers and trade routes — plus “Where were they?”.',
  alternates: { canonical: '/map/' },
};

export default function MapPage() {
  return (
    <>
      <PageHero
        kicker="Historical atlas · 13 snapshots"
        tone="gold"
        title={
          <>
            Map of the <span className="text-gold-gradient">Empire</span>
          </>
        }
        intro="Watch six centuries of expansion and contraction. Zoom into the Balkans, follow the pilgrimage routes to Mecca, or click a city to read its Ottoman story."
      >
        <div className="mt-6 flex max-w-3xl items-start gap-3 text-sm text-ivory/60">
          <CertaintyBadge kind="interpretation" />
          <p>Pre-modern borders were zones, not lines, and Ottoman authority ranged from direct rule to loose suzerainty. Coastlines are real (Natural Earth); inland borders are simplified reconstructions.</p>
        </div>
      </PageHero>
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <HistoricalMap />
      </div>
      <section id="where" className="mx-auto mt-28 max-w-[1500px] scroll-mt-24 px-4 pb-24 sm:px-8" aria-labelledby="where-title">
        <p className="label-caps text-gold">Historical geography</p>
        <h2 id="where-title" className="display-title mt-3 text-5xl text-ivory">
          Where Were They?
        </h2>
        <p className="mt-4 max-w-2xl text-ivory/65">Choose a sultan or figure to see the places that shaped their life — where they were born, governed, fought, built and died.</p>
        <div className="mt-10">
          <WhereWereThey />
        </div>
        <SourcesList ids={['pitcher-geography', 'cht-2', 'cht-3', 'agoston-masters', 'natural-earth', 'world-atlas']} className="mt-16" />
      </section>
    </>
  );
}
