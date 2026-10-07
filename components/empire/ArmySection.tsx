'use client';

import { useState } from 'react';
import { armyUnits } from '@/data/narratives';
import { Viewer3D, loadArmory } from '@/components/3d/Viewer3D';
import type { ArmoryItem } from '@/components/3d/ArmoryModel';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { cn } from '@/lib/utils';

const ARMORY: { id: ArmoryItem; name: string; turkish: string; text: string }[] = [
  {
    id: 'kilij',
    name: 'Sabre',
    turkish: 'Kılıç',
    text: 'The curved cavalry sword. Many Ottoman blades of the sixteenth to eighteenth centuries widen near the tip into a back-edged section (yelman) that adds force to a cut. Hilts typically have a cross-guard with langets and an angled pommel.',
  },
  {
    id: 'yatagan',
    name: 'Yatağan',
    turkish: 'Yatağan',
    text: 'A short sword with a forward-curving single-edged blade, no cross-guard and a distinctive “eared” pommel of bone, ivory or metal. It is especially associated with the Janissaries and was widely carried from the seventeenth to the nineteenth century.',
  },
  {
    id: 'kalkan',
    name: 'Round shield',
    turkish: 'Kalkan',
    text: 'A light, resilient shield of spirally coiled cane bound with coloured silk or cotton thread, often with a central steel boss. Surviving examples in museum collections show elaborate woven patterns.',
  },
  {
    id: 'cannon',
    name: 'Bronze field gun',
    turkish: 'Top',
    text: 'Gun-founders at the imperial foundry of Tophane in Istanbul cast bronze guns of every size, from giant siege bombards to light field pieces. The model shows a generic field gun on a wheeled carriage.',
  },
];

export function ArmySection() {
  const [unitId, setUnitId] = useState(armyUnits[0].id);
  const [item, setItem] = useState<ArmoryItem>('kilij');
  const unit = armyUnits.find((u) => u.id === unitId)!;
  const arm = ARMORY.find((a) => a.id === item)!;

  return (
    <div className="space-y-16">
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div role="tablist" aria-label="Branches of the army" aria-orientation="vertical" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {armyUnits.map((u) => (
            <button
              key={u.id}
              role="tab"
              id={`unit-tab-${u.id}`}
              aria-selected={u.id === unitId}
              aria-controls="unit-panel"
              onClick={() => setUnitId(u.id)}
              className={cn('shrink-0 rounded-2xl border px-4 py-3 text-left transition lg:w-full', u.id === unitId ? 'border-gold bg-gold/15' : 'hairline hover:border-gold/40')}
            >
              <span className="block font-display text-lg text-ivory">{u.name}</span>
              <span className="block text-xs text-ash">{u.era}</span>
            </button>
          ))}
        </div>
        <article id="unit-panel" role="tabpanel" aria-labelledby={`unit-tab-${unit.id}`} className="rounded-3xl border hairline bg-white/[0.02] p-7 sm:p-10">
          <p className="label-caps text-gold">
            {unit.turkish ? `${unit.turkish} · ` : ''}
            {unit.era}
          </p>
          <h3 className="display-title mt-3 text-4xl text-ivory sm:text-5xl">{unit.name}</h3>
          <p className="mt-5 text-lg text-ivory/85">{unit.summary}</p>
          <div className="mt-4 space-y-3 text-ivory/70">
            {unit.details.map((d) => (
              <p key={d.slice(0, 20)}>{d}</p>
            ))}
          </div>
          <h4 className="label-caps mt-8 text-gold-light">Equipment &amp; elements</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {unit.equipment.map((e) => (
              <li key={e} className="rounded-full border hairline bg-black/30 px-3 py-1.5 text-sm text-ivory/80">
                {e}
              </li>
            ))}
          </ul>
          {unit.note && (
            <div className="mt-8 flex items-start gap-3 rounded-2xl border hairline bg-black/30 p-4">
              <CertaintyBadge kind={unit.note.kind} />
              <p className="text-sm text-ivory/75">{unit.note.text}</p>
            </div>
          )}
        </article>
      </div>

      <div id="armory" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-caps text-gold">The armoury</p>
            <h3 className="display-title mt-2 text-3xl text-ivory sm:text-4xl">Arms in three dimensions</h3>
          </div>
          <div role="tablist" aria-label="Choose an object" className="flex flex-wrap gap-2">
            {ARMORY.map((a) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={a.id === item}
                onClick={() => setItem(a.id)}
                className={cn('rounded-full border px-4 py-2 text-sm transition', a.id === item ? 'border-gold bg-gold text-ink' : 'hairline text-ivory/80 hover:border-gold/50')}
              >
                {a.turkish}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Viewer3D
            load={loadArmory}
            props={{ item }}
            label={`Rotating 3D model of an Ottoman ${arm.name.toLowerCase()}`}
            className="aspect-[4/3] w-full"
            caption={<>Artistic reconstruction based on general museum types — not a specific object · drag to rotate</>}
          />
          <div className="rounded-3xl border hairline bg-white/[0.02] p-7">
            <p className="label-caps text-gold">{arm.turkish}</p>
            <h4 className="mt-2 font-display text-3xl text-ivory">{arm.name}</h4>
            <p className="mt-4 leading-relaxed text-ivory/75">{arm.text}</p>
            <p className="mt-6 text-xs text-ash">To see real objects, explore the online collections of the Topkapı Palace Museum and the Metropolitan Museum of Art (see sources below).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
