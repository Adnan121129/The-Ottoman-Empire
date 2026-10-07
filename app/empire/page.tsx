import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SourcesList } from '@/components/ui/SourcesList';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { ArmySection } from '@/components/empire/ArmySection';
import { NavySection } from '@/components/empire/NavySection';
import { TransformationExplorer } from '@/components/empire/TransformationExplorer';
import { ReformExplorer } from '@/components/empire/ReformExplorer';

export const metadata: Metadata = {
  title: 'The Imperial System — Army, Navy, Government and Reform',
  description: 'How the Ottoman Empire worked: the Janissaries and sipahis, a 3D armoury and war galley, the Imperial Council and provinces, the long transformation from rise to end, and the Tanzimat reforms.',
  alternates: { canonical: '/empire/' },
};

const GOVERNMENT: { title: string; term?: string; text: string }[] = [
  { title: 'The Sultan', term: 'sultan', text: 'Head of the dynasty and supreme ruler, legitimized by descent from Osman, by Islamic law (sharia) and by his own legislation (kanun). From 1517 Ottoman sultans increasingly also claimed the title of caliph.' },
  { title: 'The Imperial Council', term: 'divan', text: 'The Divan met in the second court of Topkapı: viziers, the two chief military judges (kadıasker), the treasurers (defterdar) and the chancellor (nişancı), presided over by the grand vizier.' },
  { title: 'The Grand Vizier', term: 'grand-vizier', text: 'The sultan’s absolute deputy. From the mid-seventeenth century his office, the Sublime Porte (Bab-ı Âli), became the real centre of government.' },
  { title: 'Provinces', term: 'eyalet', text: 'Provinces (eyalet) under a governor-general (beylerbeyi) were divided into districts (sancak) and judicial districts (kaza). In 1864 the Vilayet Law reorganized them.' },
  { title: 'Land & revenue', term: 'timar', text: 'Timar grants paid cavalrymen from village revenues. Over time cash needs led to tax farming (iltizam) and, from 1695, life-term tax farms (malikâne).' },
  { title: 'Law & the ulema', term: 'kadi', text: 'Kadı courts applied sharia and kanun for all subjects. The şeyhülislam, chief jurist of Istanbul, issued fatwas and headed the learned hierarchy.' },
  { title: 'Communities', term: 'millet', text: 'Christian and Jewish communities kept their own religious leaders and family law, paid special taxes and faced legal limits — a system historians now see as more flexible and less uniform than the later term “millet system” implies.' },
  { title: 'Servants of the sultan', term: 'devshirme', text: 'Through the devshirme, Christian boys were levied, converted and trained as Janissaries or, in the palace school (Enderun), as future governors and viziers.' },
];

export default function EmpirePage() {
  return (
    <>
      <PageHero
        kicker="How the empire worked · 14th — 20th centuries"
        tone="imperial"
        title={
          <>
            The Imperial <span className="text-gold-gradient">System</span>
          </>
        }
        intro="An army that fought from Vienna to the Indian Ocean, a navy that ruled the Mediterranean, a government of viziers, judges and governors — and a state that transformed itself again and again, until war ended it."
      >
        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-3">
          {[
            ['#army', 'Army'],
            ['#armory', '3D armoury'],
            ['#navy', 'Navy'],
            ['#government', 'Government'],
            ['#transformation', 'Rise to end'],
            ['#tanzimat', 'Tanzimat & reform'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold-light transition hover:border-gold hover:bg-gold/10">
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      <section id="army" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-8" aria-labelledby="army-title">
        <SectionHeading
          id="army-title"
          kicker="The army"
          title="Sword, bow and gunpowder"
          intro="The Ottoman army combined a salaried household corps — Janissary infantry, artillery and cavalry — with provincial cavalry supported by land grants, frontier raiders and auxiliaries. Its logistics were among the most capable of the early modern world."
        />
        <div className="mt-12">
          <ArmySection />
        </div>
        <SourcesList ids={['agoston-guns', 'murphey-warfare', 'aksan-wars', 'goodwin-janissaries', 'brit-janissary', 'brit-devshirme', 'met-collection', 'topkapi-museum']} className="mt-12" />
      </section>

      <section id="navy" className="mt-24 scroll-mt-20 border-y hairline bg-[radial-gradient(80%_60%_at_80%_0%,#12303a55,transparent)] py-24 sm:mt-32 sm:py-32" aria-labelledby="navy-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <SectionHeading
            id="navy-title"
            kicker="The navy · Donanma-yı Hümayun"
            title="Masters of the Middle Sea"
            intro="From a few ships at Gallipoli to fleets of more than a hundred galleys, the Ottoman navy contested the Mediterranean with Venice, Spain and the Knights of St John, and reached the Red Sea and the Indian Ocean. Select the hotspots to explore a war galley."
          />
          <div className="mt-12">
            <NavySection />
          </div>
          <SourcesList ids={['guilmartin', 'brummett-seapower', 'hess-frontier', 'isom-allies', 'soucek-piri', 'mcintosh-piri', 'brit-barbarossa', 'brit-lepanto']} className="mt-12" />
        </div>
      </section>

      <section id="government" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-24 sm:px-8 sm:pt-32" aria-labelledby="government-title">
        <SectionHeading
          id="government-title"
          kicker="Government"
          title="How the empire was ruled"
          intro="The classical system of the fifteenth and sixteenth centuries, which changed considerably over time. Select a term to read its glossary entry."
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GOVERNMENT.map((g, i) => (
            <li key={g.title} className="flex flex-col rounded-3xl border hairline bg-white/[0.02] p-6">
              <p className="font-display text-4xl text-gold/40">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 font-display text-2xl text-ivory">{g.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ivory/70">{g.text}</p>
              {g.term && (
                <Link href={`/glossary/#${g.term}`} className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-light hover:text-gold">
                  Glossary →
                </Link>
              )}
            </li>
          ))}
        </ol>
        <SourcesList ids={['inalcik-classical', 'imber-structure', 'kunt-servants', 'findley-bureaucratic', 'brit-timar', 'brit-millet', 'goffman-europe']} className="mt-10" />
      </section>

      <section id="transformation" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-24 sm:px-8 sm:pt-32" aria-labelledby="transformation-title">
        <SectionHeading
          id="transformation-title"
          kicker="Rise → Peak → Transformation → Decline → End"
          title="Six centuries of change"
          intro={
            <>
              The old story of a “golden age” followed by three centuries of “decline” is now rejected by most historians. The empire adapted, reformed and often recovered. Explore the phases and the forces at work — and the debates about them.
            </>
          }
        />
        <div className="mt-6 flex items-center gap-3">
          <CertaintyBadge kind="interpretation" long />
        </div>
        <div className="mt-12">
          <TransformationExplorer />
        </div>
        <SourcesList ids={['quataert-1700', 'tezcan-second', 'howard-history', 'finkel-osman', 'aksan-wars', 'pamuk-monetary', 'hanioglu-brief', 'rogan-fall']} className="mt-12" />
      </section>

      <section id="tanzimat" className="mt-24 scroll-mt-20 border-t hairline bg-[radial-gradient(70%_50%_at_10%_0%,#1f4a3c55,transparent)] py-24 sm:mt-32 sm:py-32" aria-labelledby="tanzimat-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <SectionHeading
            id="tanzimat-title"
            kicker="Reform · 1789 — 1908"
            title={
              <>
                The age of <span className="text-jade">reorganization</span>
              </>
            }
            intro="From Selim III’s new army to the Tanzimat (“reorganization”) edicts of 1839 and 1856 and the constitution of 1876, Ottoman statesmen rebuilt the army, government, law and schools. Reform strengthened the state — and created new tensions over equality, centralization and identity."
          />
          <div className="mt-12">
            <ReformExplorer />
          </div>
          <SourcesList ids={['davison-reform', 'findley-bureaucratic', 'lewis-emergence', 'ortayli-longest', 'deringil-well', 'gulhane', 'kanun-esasi', 'brit-tanzimat', 'brit-mahmud2']} className="mt-12" />
        </div>
      </section>
    </>
  );
}
