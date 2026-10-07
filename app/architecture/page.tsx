import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SourcesList } from '@/components/ui/SourcesList';
import { Reveal } from '@/components/ui/Reveal';
import { BuildingGallery } from '@/components/architecture/BuildingGallery';
import { SinanStudio } from '@/components/architecture/SinanStudio';
import { IstanbulCity } from '@/components/architecture/IstanbulCity';

export const metadata: Metadata = {
  title: 'The World They Built — Ottoman Architecture',
  description: 'Mosques, palaces, bazaars, bridges and baths of the Ottoman Empire: an illustrated gallery, Mimar Sinan’s three great mosques in 3D with exploded views and plans, and a 3D map of Istanbul across four centuries.',
  alternates: { canonical: '/architecture/' },
};

const THEMES = [
  {
    title: 'The külliye',
    text: 'Great mosques rarely stood alone. Endowed complexes (külliye) combined a mosque with schools, a hospital, a soup kitchen, baths, shops and tombs, funded in perpetuity by a pious foundation (waqf). They anchored new neighbourhoods and supplied public services.',
  },
  {
    title: 'An imperial skyline',
    text: 'After 1453 sultans and their families crowned Istanbul’s hills with domed mosques and pencil minarets, answering Hagia Sophia and creating one of the most recognizable skylines in the world.',
  },
  {
    title: 'Across three continents',
    text: 'From the early tiled mosques of Bursa to bridges in Bosnia, caravanserais on trade routes and fortresses on the Danube, Ottoman building adapted local materials and traditions while spreading a shared imperial style.',
  },
];

const STYLES = [
  { years: '14th – mid-15th c.', name: 'Early Ottoman', text: 'Bursa, İznik and Edirne: multi-domed and T-plan mosques, rich tile revetments — the Green Mosque of Bursa.' },
  { years: '1500s', name: 'Classical', text: 'Sinan and his office perfect the centralized domed mosque and the külliye — Şehzade, Süleymaniye, Selimiye.' },
  { years: '1700s', name: 'Tulip period & Ottoman Baroque', text: 'Garden pavilions, ornate fountains such as Ahmed III’s (1728), then curving baroque forms in the Nuruosmaniye Mosque (1748–55).' },
  { years: '1800s', name: 'Eclecticism', text: 'European neoclassical and beaux-arts forms blend with Ottoman motifs; the Balyan family builds Dolmabahçe on the Bosphorus.' },
  { years: 'c. 1908 – 1930', name: 'First National Architectural Movement', text: 'Architects such as Kemaleddin and Vedat (Tek) revive classical Ottoman domes and tiles for modern buildings — a style carried into the early Republic.' },
];

export default function ArchitecturePage() {
  return (
    <>
      <PageHero
        kicker="Architecture & the built world · 14th — 20th centuries"
        tone="gold"
        title={
          <>
            The World <span className="text-gold-gradient">They Built</span>
          </>
        }
        intro="Domes and minarets, palaces and bazaars, bridges, baths and caravanserais. Explore nineteen landmarks, take apart Sinan’s three great mosques in 3D, and walk the skyline of Istanbul as it changed from 1453 to 1870."
      >
        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-3">
          {[
            ['#gallery', 'Gallery'],
            ['#sinan', 'Sinan in 3D'],
            ['#istanbul', '3D Istanbul'],
            ['#styles', 'Styles through time'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold-light transition hover:border-gold hover:bg-gold/10">
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-8" aria-label="Themes">
        <div className="grid gap-5 md:grid-cols-3">
          {THEMES.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08} className="rounded-3xl border hairline bg-white/[0.02] p-7">
              <p className="font-display text-5xl text-gold/40">{String(i + 1).padStart(2, '0')}</p>
              <h2 className="mt-3 font-display text-2xl text-ivory">{t.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{t.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-24 sm:px-8 sm:pt-32" aria-labelledby="gallery-title">
        <SectionHeading id="gallery-title" kicker="Gallery" title="Landmarks of an empire" intro="Select a building for its history, architectural features, key measurements and sources. Illustrations are stylized silhouettes, not photographs." />
        <div className="mt-10">
          <BuildingGallery />
        </div>
      </section>

      <section id="sinan" className="relative mt-24 scroll-mt-20 border-y hairline bg-[radial-gradient(70%_60%_at_20%_0%,#3a2a1255,transparent)] py-24 sm:mt-32 sm:py-32" aria-labelledby="sinan-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <SectionHeading
            id="sinan-title"
            kicker="Mimar Sinan · c. 1488/90 – 1588"
            title={
              <>
                Three mosques, <span className="text-gold-gradient">one search</span>
              </>
            }
            intro="Over fifty years as chief architect, Sinan explored how a single great dome could cover an ever more unified space. Compare his three landmark mosques, pull them apart into their structural layers and read their plans."
          />
          <div className="mt-12">
            <SinanStudio />
          </div>
          <SourcesList ids={['necipoglu-sinan', 'crane-sinan', 'goodwin-arch', 'brit-sinan', 'unesco-selimiye']} className="mt-12" />
        </div>
      </section>

      <section id="istanbul" className="mx-auto max-w-[1500px] scroll-mt-20 px-4 pt-24 sm:px-8 sm:pt-32" aria-labelledby="istanbul-title">
        <SectionHeading
          id="istanbul-title"
          kicker="Constantinople / Istanbul"
          title="A city across four centuries"
          intro="The capital from 1453 until 1922. Choose a year to see which great buildings stood on its skyline, then select one to fly to it. The Theodosian land walls, the Golden Horn, Galata and Üsküdar frame the scene."
        />
        <div className="mt-10">
          <IstanbulCity />
        </div>
        <SourcesList ids={['mansel-constantinople', 'necipoglu-topkapi', 'necipoglu-sinan', 'unesco-istanbul', 'natural-earth']} className="mt-10" />
      </section>

      <section id="styles" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8 sm:py-32" aria-labelledby="styles-title">
        <SectionHeading id="styles-title" kicker="Styles through time" title="Six centuries of building" />
        <ol className="relative mt-12 space-y-4 border-l border-gold/25 pl-6 sm:pl-10">
          {STYLES.map((s) => (
            <li key={s.name} className="relative">
              <span className="absolute -left-[31px] top-2 h-3 w-3 rotate-45 border border-gold bg-ink sm:-left-[47px]" aria-hidden="true" />
              <p className="label-caps text-gold">{s.years}</p>
              <h3 className="mt-1 font-display text-2xl text-ivory">{s.name}</h3>
              <p className="mt-1 max-w-3xl text-ivory/70">{s.text}</p>
            </li>
          ))}
        </ol>
        <SourcesList ids={['goodwin-arch', 'necipoglu-sinan', 'unesco-bursa', 'erimtan-tulip', 'millisaraylar']} className="mt-12" />
      </section>
    </>
  );
}
