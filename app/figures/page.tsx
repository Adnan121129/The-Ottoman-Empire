import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { FiguresGallery } from '@/components/figures/FiguresGallery';
import { SourcesList } from '@/components/ui/SourcesList';

export const metadata: Metadata = {
  title: 'Figures of the Empire — viziers, admirals, architects and women of the court',
  description: 'Profiles of Ertuğrul, Sinan, Barbarossa, Piri Reis, Sokollu Mehmed Pasha, the Köprülüs, Hürrem, Kösem and many more — with sources and certainty labels.',
  alternates: { canonical: '/figures/' },
};

export default function FiguresPage() {
  return (
    <>
      <PageHero
        kicker="Beyond the sultans"
        tone="emerald"
        title={
          <>
            Figures of the <span className="text-gold-gradient">Empire</span>
          </>
        }
        intro="Viziers and admirals, an architect who reshaped a skyline, a cartographer who saw Columbus’s map, queen mothers who ruled as regents — and the men responsible for the empire’s darkest crimes."
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <FiguresGallery />
        <SourcesList ids={['peirce-harem', 'necipoglu-sinan', 'cht-2', 'cht-3', 'agoston-masters', 'tdv']} className="mt-16" />
      </div>
    </>
  );
}
