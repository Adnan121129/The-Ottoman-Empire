'use client';

import Link from 'next/link';
import { useState } from 'react';
import { shipHotspots } from '@/data/narratives';
import { battles, resultLabel } from '@/data/battles';
import { getFigure } from '@/data/people';
import { Viewer3D, loadShip } from '@/components/3d/Viewer3D';
import { Portrait } from '@/components/ui/Portrait';
import { cn } from '@/lib/utils';

const ADMIRALS = ['kemal-reis', 'barbarossa', 'turgut-reis', 'piri-reis'];
const NAVAL = ['zonchio', 'preveza', 'djerba', 'lepanto', 'chesme', 'navarino'];

const ERAS = [
  { years: '1390s – 1470s', text: 'A fleet built at Gallipoli contests the Aegean with Venice; in 1453 ships are dragged overland into the Golden Horn.' },
  { years: '1499 – 1571', text: 'The age of the galley fleets: victories at Zonchio, Preveza and Djerba; corsair-admirals such as Barbarossa and Turgut extend Ottoman power to North Africa.' },
  { years: '1571 – 1700', text: 'After Lepanto the fleet is rebuilt within a year. Long war for Crete (1645–69); sailing galleons gradually join the galleys.' },
  { years: '1700 – 1827', text: 'Ships of the line built at the Imperial Arsenal; disasters at Chesma (1770) and Navarino (1827).' },
  { years: '1860s – 1918', text: 'Steam and ironclads under Abdülaziz, neglect under Abdülhamid II, German-built warships and the defence of the Dardanelles in 1915.' },
];

export function NavySection() {
  const [hotspot, setHotspot] = useState('gun');
  const h = shipHotspots.find((x) => x.id === hotspot)!;
  const navalBattles = NAVAL.map((id) => battles.find((b) => b.id === id)).filter((b): b is NonNullable<typeof b> => !!b);

  return (
    <div className="space-y-16">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Viewer3D
          load={loadShip}
          props={{ selected: hotspot, onSelect: setHotspot }}
          label="Interactive 3D model of a sixteenth-century Ottoman war galley with selectable hotspots"
          className="aspect-[4/3] w-full lg:aspect-[16/11]"
          caption={<>Artistic reconstruction of a generic kadırga (war galley), c. 1550 — not a specific ship · drag to rotate</>}
        />
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-gold/30 bg-gold/[0.05] p-7" aria-live="polite">
            <p className="label-caps text-gold">Kadırga · war galley</p>
            <h3 className="mt-2 font-display text-3xl text-ivory">{h.label}</h3>
            <p className="mt-3 leading-relaxed text-ivory/80">{h.text}</p>
          </div>
          <ul className="grid grid-cols-2 gap-2" aria-label="Parts of the galley">
            {shipHotspots.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setHotspot(s.id)}
                  aria-pressed={s.id === hotspot}
                  className={cn('w-full rounded-xl border px-3 py-2.5 text-left text-sm transition', s.id === hotspot ? 'border-gold bg-gold/15 text-ivory' : 'hairline text-ivory/75 hover:border-gold/40')}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-ash">Galleys were long, low and fast under oars, ideal for the enclosed waters of the Mediterranean. Fleets were built and maintained at the Imperial Arsenal (Tersane-i Amire) on the Golden Horn and at Gallipoli.</p>
        </div>
      </div>

      <div>
        <p className="label-caps text-gold">Five naval ages</p>
        <ol className="mt-5 grid gap-3 md:grid-cols-5">
          {ERAS.map((e, i) => (
            <li key={e.years} className="rounded-2xl border hairline bg-white/[0.02] p-5">
              <p className="font-display text-3xl text-gold/50">{i + 1}</p>
              <p className="label-caps mt-2 text-gold-light">{e.years}</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/70">{e.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="label-caps text-gold">Admirals &amp; navigators</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {ADMIRALS.map((id) => {
              const f = getFigure(id);
              if (!f) return null;
              return (
                <li key={id}>
                  <Link href={`/figures/${f.id}/`} className="group flex items-center gap-4 rounded-2xl border hairline bg-white/[0.02] p-3 transition hover:border-gold/40">
                    <Portrait spec={f.portrait} name={f.name} size="sm" showLabel={false} className="aspect-[4/5] w-14 shrink-0 rounded-xl" />
                    <span>
                      <span className="block font-display text-xl text-ivory group-hover:text-gold-light">{f.name}</span>
                      <span className="block text-xs text-ash">{f.lifespan}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-ash">Portraits are procedural artistic reconstructions, not likenesses.</p>
        </div>
        <div>
          <p className="label-caps text-gold">Battles at sea</p>
          <ul className="mt-5 space-y-2">
            {navalBattles.map((b) => (
              <li key={b.id}>
                <Link href={`/battles/#${b.id}`} className="flex items-center justify-between gap-4 rounded-2xl border hairline bg-white/[0.02] px-4 py-3 transition hover:border-gold/40">
                  <span>
                    <span className="block font-display text-lg text-ivory">{b.name}</span>
                    <span className="block text-xs text-ash">{b.date}</span>
                  </span>
                  <span className="shrink-0 text-xs text-ivory/70">{resultLabel[b.result]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
