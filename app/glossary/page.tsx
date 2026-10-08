import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { SourcesList } from '@/components/ui/SourcesList';
import { GlossaryList } from '@/components/glossary/GlossaryList';

export const metadata: Metadata = {
  title: 'Ottoman Glossary — Terms Explained',
  description: 'Sultan, vizier, Divan, Janissary, devshirme, timar, millet, waqf, külliye, Tanzimat and more: key terms of Ottoman history explained in plain language.',
  alternates: { canonical: '/glossary/' },
};

export default function GlossaryPage() {
  return (
    <>
      <PageHero
        kicker="Reference"
        title={
          <>
            Ottoman <span className="text-gold-gradient">Glossary</span>
          </>
        }
        intro="The words that structured Ottoman government, society and culture — explained in plain language, with their Turkish forms. Spellings follow common English usage with modern Turkish in italics."
      />
      <div className="mx-auto max-w-7xl px-4 pb-28 sm:px-8">
        <GlossaryList />
        <SourcesList ids={['ei2', 'tdv', 'inalcik-classical', 'imber-structure']} className="mt-16" />
      </div>
    </>
  );
}
