'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Viewer3D, loadMosque } from '@/components/3d/Viewer3D';
import type { MosquePreset } from '@/components/3d/MosqueModel';
import { getBuilding } from '@/data/buildings';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { cn } from '@/lib/utils';

const STAGES: { id: MosquePreset; stage: string; years: string; place: string; idea: string }[] = [
  {
    id: 'sehzade',
    stage: 'Apprentice work',
    years: '1543 – 1548',
    place: 'Istanbul',
    idea: 'A perfectly symmetrical scheme: a central dome buttressed on all four sides by semi-domes, forming a quatrefoil.',
  },
  {
    id: 'suleymaniye',
    stage: 'Journeyman work',
    years: '1550 – 1557',
    place: 'Istanbul',
    idea: 'A dome flanked by two semi-domes on the mihrab axis — the Hagia Sophia scheme rethought with lighter supports, more windows and a cascading exterior.',
  },
  {
    id: 'selimiye',
    stage: 'Masterpiece',
    years: '1568 – 1575',
    place: 'Edirne',
    idea: 'One vast dome resting on an octagon of eight piers, with no semi-domes along an axis: the unified, centralized space Sinan had been working towards.',
  },
];

/** Schematic plans (not to scale): mihrab wall at the top, courtyard below. */
function FloorPlan({ preset }: { preset: MosquePreset }) {
  const hall = { x: 60, y: 30, w: 180, h: 180 };
  const cx = 150;
  const cy = 120;
  const domeR = preset === 'selimiye' ? 66 : preset === 'suleymaniye' ? 52 : 48;
  const pier = (x: number, y: number, k: string) => <rect key={k} x={x - 7} y={y - 7} width="14" height="14" className="fill-gold/80" />;
  const semi = (side: 'n' | 's' | 'e' | 'w') => {
    const r = domeR * 0.82;
    const paths = {
      n: `M${cx - r} ${cy - domeR}A${r} ${r} 0 0 1 ${cx + r} ${cy - domeR}`,
      s: `M${cx - r} ${cy + domeR}A${r} ${r} 0 0 0 ${cx + r} ${cy + domeR}`,
      w: `M${cx - domeR} ${cy - r}A${r} ${r} 0 0 0 ${cx - domeR} ${cy + r}`,
      e: `M${cx + domeR} ${cy - r}A${r} ${r} 0 0 1 ${cx + domeR} ${cy + r}`,
    };
    return <path key={side} d={paths[side]} className="fill-none stroke-gold-light" strokeWidth="1.5" strokeDasharray="4 3" />;
  };
  const minaret = (x: number, y: number) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" className="fill-crimson stroke-ivory/70" strokeWidth="1" />;
  const piers =
    preset === 'selimiye'
      ? Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
          return pier(cx + Math.cos(a) * (domeR + 4), cy + Math.sin(a) * (domeR + 4), `p${i}`);
        })
      : [pier(cx - domeR, cy - domeR, 'a'), pier(cx + domeR, cy - domeR, 'b'), pier(cx - domeR, cy + domeR, 'c'), pier(cx + domeR, cy + domeR, 'd')];
  const minarets =
    preset === 'selimiye'
      ? [minaret(hall.x, hall.y), minaret(hall.x + hall.w, hall.y), minaret(hall.x, hall.y + hall.h), minaret(hall.x + hall.w, hall.y + hall.h)]
      : preset === 'suleymaniye'
        ? [minaret(hall.x, hall.y + hall.h), minaret(hall.x + hall.w, hall.y + hall.h), minaret(hall.x - 4, 340), minaret(hall.x + hall.w + 4, 340)]
        : [minaret(hall.x, hall.y + hall.h), minaret(hall.x + hall.w, hall.y + hall.h)];
  return (
    <svg viewBox="0 0 300 360" className="h-full w-full" role="img" aria-label={`Schematic floor plan of the ${preset} mosque`}>
      <rect x={hall.x} y={hall.y} width={hall.w} height={hall.h} className="fill-white/[0.03] stroke-ivory/70" strokeWidth="2" />
      <rect x={cx - 10} y={hall.y - 7} width="20" height="7" className="fill-gold" />
      <text x={cx} y={hall.y - 12} textAnchor="middle" className="fill-ivory/60 text-[9px] uppercase tracking-widest">
        Mihrab · qibla
      </text>
      <rect x={hall.x + 8} y={hall.y + hall.h + 8} width={hall.w - 16} height={124} className="fill-none stroke-ivory/40" strokeWidth="1.5" />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={hall.x + 26 + i * 32} cy={hall.y + hall.h + 22} r="9" className="fill-none stroke-ivory/30" />
      ))}
      <rect x={cx - 12} y={hall.y + hall.h + 62} width="24" height="16" className="fill-none stroke-ivory/40" />
      <text x={cx} y={hall.y + hall.h + 104} textAnchor="middle" className="fill-ivory/55 text-[9px] uppercase tracking-widest">
        Courtyard · şadırvan
      </text>
      <circle cx={cx} cy={cy} r={domeR} className="fill-gold/[0.07] stroke-gold" strokeWidth="2" />
      {preset === 'selimiye' && (
        <polygon
          points={Array.from({ length: 8 })
            .map((_, i) => {
              const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
              return `${cx + Math.cos(a) * (domeR + 4)},${cy + Math.sin(a) * (domeR + 4)}`;
            })
            .join(' ')}
          className="fill-none stroke-gold/60"
          strokeWidth="1"
        />
      )}
      {preset === 'sehzade' && (['n', 's', 'e', 'w'] as const).map(semi)}
      {preset === 'suleymaniye' && (
        <>
          {(['n', 's'] as const).map(semi)}
          {[0, 1, 2, 3, 4].flatMap((i) => [
            <circle key={`l${i}`} cx={hall.x + 14} cy={hall.y + 22 + i * 34} r="10" className="fill-none stroke-ivory/35" />,
            <circle key={`r${i}`} cx={hall.x + hall.w - 14} cy={hall.y + 22 + i * 34} r="10" className="fill-none stroke-ivory/35" />,
          ])}
        </>
      )}
      {preset === 'selimiye' && <rect x={cx - 14} y={cy - 14} width="28" height="28" className="fill-none stroke-ivory/50" strokeDasharray="2 2" />}
      {piers}
      {minarets}
    </svg>
  );
}

export function SinanStudio() {
  const [preset, setPreset] = useState<MosquePreset>('suleymaniye');
  const [explode, setExplode] = useState(0);
  const [labels, setLabels] = useState(true);
  const stage = STAGES.find((s) => s.id === preset)!;
  const building = getBuilding(preset)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div>
        <div role="tablist" aria-label="Choose a mosque" className="flex flex-wrap gap-2">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={preset === s.id}
              onClick={() => setPreset(s.id)}
              className={cn('rounded-2xl border px-4 py-2.5 text-left transition', preset === s.id ? 'border-gold bg-gold/15' : 'hairline hover:border-gold/40')}
            >
              <span className="label-caps block text-[0.6rem] text-gold">
                {String(i + 1).padStart(2, '0')} · {s.stage}
              </span>
              <span className="font-display text-lg text-ivory">{getBuilding(s.id)!.name.replace(' Mosque', '')}</span>
            </button>
          ))}
        </div>
        <Viewer3D
          load={loadMosque}
          props={{ preset, explode, labels }}
          label={`Interactive 3D model of the ${building.name}, drag to rotate`}
          className="mt-5 aspect-[4/3] w-full lg:aspect-square"
          caption={<>Artistic reconstruction · simplified massing, not to scale · drag to rotate, scroll to zoom</>}
        />
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border hairline bg-white/[0.02] px-5 py-4">
          <label className="flex min-w-[220px] flex-1 items-center gap-4">
            <span className="label-caps shrink-0 text-ash">Exploded view</span>
            <input type="range" min={0} max={1} step={0.01} value={explode} onChange={(e) => setExplode(Number(e.target.value))} className="w-full accent-[#c9a24a]" aria-valuetext={`${Math.round(explode * 100)}% separated`} />
          </label>
          <label className="flex items-center gap-2 text-sm text-ivory/80">
            <input type="checkbox" checked={labels} onChange={(e) => setLabels(e.target.checked)} className="accent-[#c9a24a]" /> Labels
          </label>
          <button onClick={() => setExplode(explode > 0.5 ? 0 : 1)} className="rounded-full border border-gold/40 px-4 py-1.5 text-sm font-semibold text-gold-light hover:border-gold">
            {explode > 0.5 ? 'Assemble' : 'Explode'}
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-3xl border hairline bg-white/[0.02] p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="label-caps text-gold">
              {stage.years} · {stage.place}
            </p>
            <CertaintyBadge kind="tradition" />
          </div>
          <h3 className="mt-3 font-display text-3xl text-ivory">“{stage.stage}”</h3>
          <p className="mt-3 text-ivory/75">{stage.idea}</p>
          <p className="mt-3 text-xs leading-relaxed text-ash">
            The apprentice–journeyman–master framing comes from Sinan’s autobiographical texts compiled late in his life; historians treat it as his own retrospective view of his career.
          </p>
          {building.facts && (
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              {building.facts.map((f) => (
                <div key={f.label} className="rounded-xl border hairline p-2.5">
                  <dt className="text-[0.6rem] uppercase tracking-wider text-ash">{f.label}</dt>
                  <dd className="mt-1 text-sm text-ivory">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <a href={`#${building.id}`} className="mt-5 inline-block text-sm font-semibold text-gold-light underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
            Full entry for the {building.name} →
          </a>
        </div>
        <figure className="rounded-3xl border hairline bg-[#0f0c09] p-5">
          <div className="mx-auto aspect-[5/6] max-w-[270px]">
            <FloorPlan preset={preset} />
          </div>
          <figcaption className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-ash">
            <span>
              <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border border-gold align-middle" /> Main dome
            </span>
            <span>
              <span className="mr-1 inline-block h-2.5 w-4 border-t border-dashed border-gold-light align-middle" /> Semi-dome
            </span>
            <span>
              <span className="mr-1 inline-block h-2.5 w-2.5 bg-gold/80 align-middle" /> Pier
            </span>
            <span>
              <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-crimson align-middle" /> Minaret
            </span>
            <span className="w-full">Schematic plan, not to scale.</span>
          </figcaption>
        </figure>
        <p className="text-sm text-ivory/60">
          Meet the architect: <Link href="/figures/sinan/" className="text-gold-light underline decoration-gold/40 underline-offset-2">Mimar Sinan</Link> — Janissary engineer, chief architect for fifty years.
        </p>
      </div>
    </div>
  );
}
