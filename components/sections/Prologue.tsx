import { CertaintyLegend } from '@/components/ui/Certainty';
import { Reveal } from '@/components/ui/Reveal';
import { Ornament } from '@/components/ui/Ornament';

const numbers = [
  { value: '623', unit: 'years', text: 'From the traditional founding (c. 1299) to the abolition of the Sultanate (1922).' },
  { value: '36', unit: 'sultans', text: 'From Osman I to Mehmed VI — one dynasty, the House of Osman, throughout.' },
  { value: '3', unit: 'continents', text: 'At its height the empire reached from Algiers to Basra and from Buda to Aden.' },
  { value: '3', unit: 'capitals', text: 'Bursa, Edirne and — from 1453 — Constantinople/Istanbul.' },
];

export function Prologue() {
  return (
    <section id="prologue" tabIndex={-1} aria-labelledby="prologue-title" className="relative overflow-hidden py-28 outline-none sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal>
            <p className="label-caps text-gold">Prologue</p>
            <h2 id="prologue-title" className="display-title mt-5 text-balance text-5xl text-ivory sm:text-6xl">
              A frontier principality became a world empire — and then something else entirely.
            </h2>
            <div className="prose-history mt-8 max-w-xl">
              <p>
                Around 1300 a band of Turkmen warriors and settlers on the edge of Byzantium followed a leader named Osman. Six centuries later his descendants had ruled one of the largest and longest-lived states in history: a multi-ethnic, multi-faith empire that joined Europe, Asia and Africa.
              </p>
              <p>
                This is not a story of pure glory or of inevitable decline. It is a story of conquest and coexistence, of law and violence, of extraordinary art and catastrophic war — told with care to separate what we know from what was later believed.
              </p>
            </div>
          </Reveal>
          <ul className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-3xl border hairline bg-gold/10">
            {numbers.map((n, i) => (
              <Reveal key={n.unit} as="li" delay={i * 0.08} className="bg-ink p-6 sm:p-8">
                <p className="font-display text-6xl leading-none text-gold-light sm:text-7xl">{n.value}</p>
                <p className="label-caps mt-2 text-ivory">{n.unit}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/60">{n.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <Ornament className="my-20" />
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-caps text-gold">How to read this journey</p>
              <h3 className="mt-3 font-display text-3xl text-ivory">Every claim carries its level of certainty.</h3>
            </div>
            <p className="max-w-md text-sm text-ivory/60">Portraits, scenes and 3D models are artistic reconstructions unless stated otherwise. Maps are simplified. Sources are listed throughout.</p>
          </div>
          <CertaintyLegend className="mt-8" />
        </Reveal>
      </div>
    </section>
  );
}
