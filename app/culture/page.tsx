import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Coffee, FlaskConical, GraduationCap, Music, Palette, Users, Crown, type LucideIcon } from 'lucide-react';
import { cultureTopics } from '@/data/narratives';
import { glossary } from '@/data/glossary';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SourcesList } from '@/components/ui/SourcesList';
import { Reveal } from '@/components/ui/Reveal';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { IznikTile } from '@/components/culture/IznikTile';

export const metadata: Metadata = {
  title: 'Culture & Society — Faiths, Arts, Science, Music and Cuisine',
  description: 'Life in the Ottoman Empire: many peoples and faiths, calligraphy and İznik tiles, poetry, science and maps, schools, makam music and the mehter, the palace kitchens and the power of royal women.',
  alternates: { canonical: '/culture/' },
};

const ICONS: Record<string, LucideIcon> = {
  society: Users,
  arts: Palette,
  literature: BookOpen,
  science: FlaskConical,
  education: GraduationCap,
  music: Music,
  cuisine: Coffee,
  women: Crown,
};

const IZNIK = [
  { years: 'c. 1480 – 1520', name: 'Blue and white', text: 'Cobalt on white, inspired partly by Chinese porcelain prized at the Ottoman court.', colors: { ground: '#f3efe4', main: '#1f3f8f', accent: '#2c5bb8', leaf: '#3b6fd0' } },
  { years: 'c. 1520 – 1550', name: 'Turquoise and “Damascus” wares', text: 'Turquoise joins cobalt; later sage green and soft purple appear.', colors: { ground: '#f1ede2', main: '#1d4f8a', accent: '#2aa3a8', leaf: '#7d9a6a' } },
  { years: 'c. 1550 – 1600', name: 'The height of İznik', text: 'A raised, brilliant tomato red joins emerald green — the palette of the tiles in Sinan’s mosques.', colors: { ground: '#f6f2e8', main: '#1d4a99', accent: '#c8321f', leaf: '#1f8a5a' } },
];

export default function CulturePage() {
  const terms = ['millet', 'waqf', 'kulliye', 'mehter', 'tughra', 'madrasa', 'hamam', 'enderun'].map((id) => glossary.find((g) => g.id === id)).filter((g): g is NonNullable<typeof g> => !!g);
  return (
    <>
      <PageHero
        kicker="Culture & society"
        tone="emerald"
        title={
          <>
            A World of <span className="text-gold-gradient">Many Voices</span>
          </>
        }
        intro="The empire was home to Turks, Greeks, Armenians, Arabs, Kurds, Slavs, Albanians, Jews and many others — Muslims, Christians and Jews. Their worlds met in markets, courts, coffee-houses, kitchens and music, under a hierarchy that was real, and changed over time."
      >
        <nav aria-label="Topics" className="mt-10 flex flex-wrap gap-2">
          {cultureTopics.map((t) => (
            <a key={t.id} href={`#${t.id}`} className="rounded-full border border-gold/30 px-4 py-2 text-sm text-gold-light transition hover:border-gold hover:bg-gold/10">
              {t.kicker}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-8">
        {cultureTopics.map((t, i) => {
          const Icon = ICONS[t.id] ?? Users;
          return (
            <Reveal key={t.id} as="section">
              <article id={t.id} className="grid scroll-mt-28 gap-8 rounded-[2rem] border hairline bg-white/[0.02] p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="label-caps text-gold">
                      {String(i + 1).padStart(2, '0')} · {t.kicker}
                    </p>
                  </div>
                  <h2 className="display-title mt-5 text-4xl text-ivory sm:text-5xl">{t.title}</h2>
                  <p className="mt-5 text-lg leading-relaxed text-ivory/75">{t.text}</p>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <ul className="space-y-3">
                    {t.points.map((p) => (
                      <li key={p} className="flex gap-3 border-b hairline pb-3 text-ivory/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <SourcesList ids={t.sources} />
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <section id="iznik" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-28 sm:px-8" aria-labelledby="iznik-title">
        <SectionHeading id="iznik-title" kicker="Focus · İznik ceramics" title="A palette through time" intro="Potters at İznik in north-west Anatolia supplied the court with dishes and, from the mid-sixteenth century, tiles for mosques and palaces. Their colours changed in recognizable phases." />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {IZNIK.map((p) => (
            <li key={p.name} className="overflow-hidden rounded-3xl border hairline bg-white/[0.02]">
              <IznikTile colors={p.colors} className="aspect-square w-full" />
              <div className="p-6">
                <p className="label-caps text-gold">{p.years}</p>
                <h3 className="mt-2 font-display text-2xl text-ivory">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-ash">
          <CertaintyBadge kind="interpretation" />
          Tiles are stylized designs made for this site (artistic reconstruction); the phases and their dates are approximate, as given in museum literature.
        </div>
        <SourcesList ids={['met-collection', 'necipoglu-sinan', 'topkapi-museum']} className="mt-6" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-8" aria-labelledby="terms-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="terms-title" kicker="Words that shaped a world" title="From the glossary" />
          <Link href="/glossary/" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light">
            All {glossary.length} terms →
          </Link>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {terms.map((g) => (
            <li key={g.id}>
              <Link href={`/glossary/#${g.id}`} className="block h-full rounded-2xl border hairline bg-white/[0.02] p-5 transition hover:border-gold/40">
                <p className="font-display text-2xl text-ivory">{g.term}</p>
                {g.turkish && <p className="text-xs italic text-ash">{g.turkish}</p>}
                <p className="mt-2 line-clamp-3 text-sm text-ivory/70">{g.definition}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
