import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { BattleExplorer } from '@/components/battles/BattleExplorer';

export const metadata: Metadata = {
  title: 'Battles & Campaigns — from Bapheus to Gallipoli',
  description: 'Explore 41 Ottoman battles, sieges and campaigns with campaign maps, commanders, objectives, outcomes and consequences.',
  alternates: { canonical: '/battles/' },
};

export default function BattlesPage() {
  return (
    <>
      <PageHero
        kicker="1302 — 1918"
        tone="night"
        title={
          <>
            Battles &amp; <span className="text-gold-gradient">Campaigns</span>
          </>
        }
        intro="Victories and defeats, sieges and naval clashes — from Osman’s first recorded battle to the trenches of Gallipoli. Each entry shows schematic campaign routes, the commanders, objectives and consequences, and what the sources do and don’t tell us."
      />
      <div className="mx-auto max-w-[1500px] px-4 pb-24 sm:px-8">
        <BattleExplorer />
      </div>
    </>
  );
}
