'use client';

import { useMemo, useState } from 'react';
import type { LocationLink } from '@/data/types';
import { placeById } from '@/data/places';
import { snapshotForYear } from '@/data/territories';
import { MapCanvas, type MapMarker } from './MapCanvas';
import { viewBoxFor, MAP_WIDTH, MAP_HEIGHT } from '@/lib/geo';
import { cn } from '@/lib/utils';

/** Numbered map of the places associated with a person (“Where were they?”). */
export function LocationsMap({ locations, snapshotYear, className, heading = true }: { locations: LocationLink[]; snapshotYear?: number; className?: string; heading?: boolean }) {
  const [selected, setSelected] = useState(0);
  const resolved = useMemo(() => locations.map((l) => ({ ...l, place: placeById[l.placeId] })).filter((l) => l.place), [locations]);
  const view = useMemo(() => {
    const lons = resolved.map((l) => l.place!.coords[0]);
    const lats = resolved.map((l) => l.place!.coords[1]);
    const pad = 2.5;
    return viewBoxFor([Math.min(...lons) - pad, Math.min(...lats) - pad, Math.max(...lons) + pad, Math.max(...lats) + pad], MAP_WIDTH / MAP_HEIGHT, 0.08);
  }, [resolved]);
  const markers: MapMarker[] = resolved.map((l, i) => ({ id: `${l.placeId}-${i}`, coords: l.place!.coords, label: l.place!.name.split(' / ')[0], kind: i === selected ? 'focus' : 'city', importance: 3, number: i + 1 }));
  const snapshot = snapshotYear ? snapshotForYear(snapshotYear) : null;
  if (!resolved.length) return null;
  return (
    <div className={cn('grid gap-5 lg:grid-cols-[1.4fr_1fr]', className)}>
      <div className="relative aspect-[1000/657] overflow-hidden rounded-3xl border hairline">
        <MapCanvas snapshot={snapshot} view={view} markers={markers} selectedMarkerId={markers[selected]?.id} onMarkerClick={(id) => setSelected(markers.findIndex((m) => m.id === id))} ariaLabel="Map of places associated with this person" className="h-full w-full" showSeaLabels={false} territoryOpacity={0.45} />
      </div>
      <div>
        {heading && <p className="label-caps mb-3 text-gold">Where were they?</p>}
        <ol className="space-y-2">
          {resolved.map((l, i) => (
            <li key={`${l.placeId}-${i}`}>
              <button onClick={() => setSelected(i)} className={cn('flex w-full gap-3 rounded-2xl border p-3 text-left transition', i === selected ? 'border-gold/50 bg-gold/10' : 'hairline hover:border-gold/30')} aria-pressed={i === selected}>
                <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold', i === selected ? 'bg-gold-light text-ink' : 'bg-white/10 text-ivory')}>{i + 1}</span>
                <span>
                  <span className="block text-ivory">
                    {l.place!.name} {l.year && <span className="text-xs text-gold-light">· {l.year}</span>}
                  </span>
                  <span className="block text-sm text-ivory/65">{l.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
