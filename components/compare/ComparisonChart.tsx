'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { rulers, reignLength, reignLabel, trendLabel, trendScore } from '@/data/rulers';
import type { Ruler } from '@/data/types';
import { Portrait } from '@/components/ui/Portrait';
import { cn } from '@/lib/utils';

/**
 * Side-by-side comparison of up to four sultans. Categorical colours come from a
 * validated colour-blind-safe order (checked against the dark chart surface);
 * colour follows the sultan, never the rank. Every bar is also labelled in text.
 */
const SERIES = ['#c98500', '#3987e5', '#d95926', '#199e70'];
const MAX = 4;

type Metric = { id: string; label: string; unit: string; value: (r: Ruler) => number; items?: (r: Ruler) => string[]; note: string };

const METRICS: Metric[] = [
  { id: 'reign', label: 'Years on the throne', unit: 'years', value: reignLength, note: 'Split reigns are added together.' },
  { id: 'battles', label: 'Battles & sieges in this collection', unit: '', value: (r) => r.battleIds.length, note: 'Only the 41 battles covered on this site — not every campaign of the reign.' },
  { id: 'reforms', label: 'Reforms recorded', unit: '', value: (r) => r.reforms.length, items: (r) => r.reforms, note: 'Major reforms named in the profile; a count is not a measure of their impact.' },
  { id: 'buildings', label: 'Building projects recorded', unit: '', value: (r) => r.architecture.length, items: (r) => r.architecture, note: 'Major works named in the profile, including those built by family members and officials.' },
];

const fmt = (v: number, unit: string) => (unit === 'years' ? (v < 1 ? 'under 1 year' : `${Math.round(v)} ${Math.round(v) === 1 ? 'year' : 'years'}`) : String(v));

export function ComparisonChart() {
  const [ids, setIds] = useState<string[]>(['mehmed-ii', 'suleiman-i', 'mahmud-ii', 'abdulhamid-ii']);
  // Colour follows the sultan: each keeps the slot it was given until removed.
  const [slots, setSlots] = useState<Record<string, number>>({ 'mehmed-ii': 0, 'suleiman-i': 1, 'mahmud-ii': 2, 'abdulhamid-ii': 3 });
  const picked = ids.map((id) => rulers.find((r) => r.id === id)!).filter(Boolean);
  const color = (id: string) => SERIES[slots[id] ?? 0];
  const [hoverBar, setHoverBar] = useState<string | null>(null);

  const add = (id: string) => {
    if (!id || ids.includes(id) || ids.length >= MAX) return;
    const used = new Set(ids.map((i) => slots[i]));
    const free = [0, 1, 2, 3].find((s) => !used.has(s)) ?? 0;
    setSlots((s) => ({ ...s, [id]: free }));
    setIds((x) => [...x, id]);
  };
  const remove = (id: string) => setIds((x) => x.filter((i) => i !== id));

  const maxByMetric = useMemo(() => Object.fromEntries(METRICS.map((m) => [m.id, Math.max(1, ...rulers.map(m.value))])), []);
  const maxReign = Math.max(...rulers.map(reignLength));

  return (
    <div>
      {/* Picker — doubles as the legend */}
      <div className="flex flex-wrap items-center gap-3">
        {picked.map((r) => (
          <span key={r.id} className="inline-flex items-center gap-2.5 rounded-full border hairline bg-white/[0.03] py-1.5 pl-2 pr-1.5">
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: color(r.id) }} aria-hidden="true" />
            <span className="text-sm text-ivory">{r.name}</span>
            <button onClick={() => remove(r.id)} className="grid h-6 w-6 place-items-center rounded-full text-ivory/60 hover:bg-white/10 hover:text-ivory" aria-label={`Remove ${r.name} from the comparison`}>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        ))}
        {ids.length < MAX && (
          <label className="inline-flex items-center gap-2 rounded-full border border-dashed border-gold/40 py-1 pl-3 pr-1 text-sm text-gold-light">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Add a sultan</span>
            <select value="" onChange={(e) => add(e.target.value)} className="rounded-full bg-transparent py-1 pr-2 text-sm text-gold-light outline-none">
              <option value="">Add a sultan…</option>
              {rulers
                .filter((r) => !ids.includes(r.id))
                .map((r) => (
                  <option key={r.id} value={r.id} className="bg-night text-ivory">
                    {r.order}. {r.name}
                  </option>
                ))}
            </select>
          </label>
        )}
        <span className="text-xs text-ash">Compare up to four.</span>
      </div>

      {picked.length === 0 ? (
        <p className="mt-10 rounded-2xl border hairline p-8 text-center text-ivory/60">Add a sultan to begin.</p>
      ) : (
        <>
          {/* Portrait row */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {picked.map((r) => (
              <Link key={r.id} href={`/sultans/${r.id}/`} className="group rounded-3xl border hairline bg-white/[0.02] p-4 transition hover:border-gold/40">
                <div className="flex items-center gap-3">
                  <Portrait spec={r.portrait} name={r.name} size="sm" showLabel={false} className="aspect-[4/5] w-14 shrink-0 rounded-xl" />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-display text-xl text-ivory group-hover:text-gold-light">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color(r.id) }} aria-hidden="true" />
                      <span className="truncate">{r.name}</span>
                    </p>
                    <p className="text-xs text-ash">{reignLabel(r)}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-ivory/60">{r.turningPoint}</p>
              </Link>
            ))}
          </div>

          {/* Small multiples — one scale per metric */}
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {METRICS.map((m) => (
              <figure key={m.id} className="rounded-3xl border hairline bg-[#131110] p-6">
                <figcaption>
                  <p className="font-display text-xl text-ivory">{m.label}</p>
                  <p className="mt-1 text-xs text-ash">{m.note}</p>
                </figcaption>
                <ul className="mt-5 space-y-[2px]">
                  {picked.map((r) => {
                    const v = m.value(r);
                    const items = m.items?.(r) ?? [];
                    return (
                      <li key={r.id} className="group relative grid grid-cols-[6.5rem_1fr] items-center gap-3 py-1.5 outline-none sm:grid-cols-[7.5rem_1fr]" tabIndex={0} aria-label={`${r.name}: ${fmt(v, m.unit)}`}>
                        <span className="truncate text-sm text-ivory/80">{r.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="h-3.5 rounded-r-[4px]" style={{ width: `${Math.max(v > 0 ? 1.5 : 0, (v / maxByMetric[m.id]) * 70)}%`, background: color(r.id) }} aria-hidden="true" />
                          <span className="whitespace-nowrap text-sm tabular-nums text-ivory">{fmt(v, m.unit)}</span>
                        </span>
                        {items.length > 0 && (
                          <span className="pointer-events-none invisible absolute left-[6.5rem] right-0 top-full sm:left-[7.5rem] z-20 mt-1 max-w-72 rounded-xl border hairline bg-night/95 p-3 text-xs text-ivory/85 shadow-xl group-hover:visible group-focus:visible" role="tooltip">
                            {items.slice(0, 6).map((it) => (
                              <span key={it} className="block py-0.5">
                                • {it}
                              </span>
                            ))}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-[0.65rem] text-ash">Scale: 0 – {fmt(maxByMetric[m.id], m.unit)} (the highest value among all 36 sultans){m.items ? ' · hover a row to see what is counted' : ''}</p>
              </figure>
            ))}
          </div>

          {/* Territorial trend — a diverging, categorical judgement, shown as positions not a score */}
          <figure className="mt-5 rounded-3xl border hairline bg-[#131110] p-6">
            <figcaption>
              <p className="font-display text-xl text-ivory">Territorial change during the reign</p>
              <p className="mt-1 text-xs text-ash">A broad historical characterization, not a score. Territory is only one measure of a reign — and often depended on circumstances beyond any ruler’s control.</p>
            </figcaption>
            <div className="mt-6 space-y-4">
              {picked.map((r) => {
                const s = trendScore[r.territorialChange.trend];
                return (
                  <div key={r.id} className="grid grid-cols-[7.5rem_1fr] items-center gap-3">
                    <span className="truncate text-sm text-ivory/80">{r.name}</span>
                    <div>
                      <div className="relative h-5">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" aria-hidden="true" />
                        <div className="absolute left-1/2 top-0 h-5 w-px bg-white/30" aria-hidden="true" />
                        <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#131110]" style={{ left: `${50 + s * 22}%`, background: color(r.id) }} aria-hidden="true" />
                      </div>
                      <p className="mt-1 text-xs text-ivory/70">
                        <strong className="font-semibold text-ivory">{trendLabel[r.territorialChange.trend]}</strong> — {r.territorialChange.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="grid grid-cols-[7.5rem_1fr] gap-3 text-[0.65rem] uppercase tracking-wider text-ash" aria-hidden="true">
                <span />
                <span className="flex justify-between">
                  <span>Major losses</span>
                  <span>Stable / mixed</span>
                  <span>Major expansion</span>
                </span>
              </div>
            </div>
          </figure>
        </>
      )}

      {/* All 36 reigns */}
      <figure className="mt-12 rounded-3xl border hairline bg-[#131110] p-6">
        <figcaption className="flex flex-wrap items-end justify-between gap-2">
          <span>
            <span className="block font-display text-2xl text-ivory">Length of every reign</span>
            <span className="block text-xs text-ash">All 36 sultans in order of accession; your selection is highlighted. Hover a bar for details.</span>
          </span>
        </figcaption>
        <div className="relative mt-6">
          <div className="no-scrollbar overflow-x-auto">
            <div className="relative h-64 min-w-[640px]">
              {[10, 20, 30, 40].map((y) => (
                <div key={y} className="absolute inset-x-0 border-t border-white/[0.07]" style={{ bottom: `${(y / maxReign) * 100}%` }} aria-hidden="true">
                  <span className="absolute -top-2 left-0 bg-[#131110] pr-1 text-[0.6rem] text-ash">{y} yrs</span>
                </div>
              ))}
              <div className="absolute inset-0 flex items-end gap-[2px] pl-10">
                {rulers.map((r) => {
                  const on = ids.includes(r.id);
                  const v = reignLength(r);
                  return (
                    <div
                      key={r.id}
                      className="group relative flex h-full flex-1 items-end"
                      onMouseEnter={() => setHoverBar(r.id)}
                      onMouseLeave={() => setHoverBar(null)}
                      onFocus={() => setHoverBar(r.id)}
                      onBlur={() => setHoverBar(null)}
                      tabIndex={0}
                      aria-label={`${r.order}. ${r.name}: ${fmt(v, 'years')} (${reignLabel(r)})`}
                    >
                      <div className={cn('w-full rounded-t-[4px] transition-opacity', hoverBar && hoverBar !== r.id && 'opacity-60')} style={{ height: `${Math.max(1, (v / maxReign) * 100)}%`, background: on ? color(r.id) : '#5b544a' }} />
                      {hoverBar === r.id && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 rounded-xl border hairline bg-night/95 p-2.5 text-xs shadow-xl" role="tooltip">
                          <p className="font-semibold text-ivory">
                            {r.order}. {r.name}
                          </p>
                          <p className="text-ivory/70">{reignLabel(r)}</p>
                          <p className="mt-1 text-ivory">{fmt(v, 'years')}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex min-w-[640px] gap-[2px] pl-10 pt-1" aria-hidden="true">
              {rulers.map((r) => (
                <span key={r.id} className={cn('flex-1 text-center text-[0.55rem] tabular-nums', ids.includes(r.id) ? 'font-semibold text-ivory' : 'text-ash')}>
                  {r.order}
                </span>
              ))}
            </div>
          </div>
        </div>
      </figure>

      {/* Table view */}
      <details className="mt-6 rounded-2xl border hairline bg-white/[0.02]">
        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-gold-light">Show the data as a table</summary>
        <div className="overflow-x-auto border-t hairline">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Comparison data for all 36 sultans</caption>
            <thead className="text-[0.65rem] uppercase tracking-wider text-ash">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Sultan</th>
                <th className="px-4 py-3">Reign</th>
                {METRICS.map((m) => (
                  <th key={m.id} className="px-4 py-3">
                    {m.label}
                  </th>
                ))}
                <th className="px-4 py-3">Territorial change</th>
              </tr>
            </thead>
            <tbody>
              {rulers.map((r) => (
                <tr key={r.id} className={cn('border-t hairline', ids.includes(r.id) && 'bg-gold/[0.06]')}>
                  <td className="px-4 py-2 text-ash">{r.order}</td>
                  <td className="px-4 py-2 text-ivory">{r.name}</td>
                  <td className="px-4 py-2 text-ivory/70">{reignLabel(r)}</td>
                  {METRICS.map((m) => (
                    <td key={m.id} className="px-4 py-2 tabular-nums text-ivory/85">
                      {fmt(m.value(r), m.unit)}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-ivory/70">{trendLabel[r.territorialChange.trend]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
