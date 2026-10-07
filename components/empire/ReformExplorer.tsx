'use client';

import { useState } from 'react';
import { reformAreas, constitutionalEras } from '@/data/narratives';
import { cn } from '@/lib/utils';

export function ReformExplorer() {
  const [areaId, setAreaId] = useState(reformAreas[0].id);
  const area = reformAreas.find((a) => a.id === areaId)!;
  return (
    <div>
      <div role="tablist" aria-label="Areas of reform" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {reformAreas.map((a) => (
          <button
            key={a.id}
            role="tab"
            id={`reform-tab-${a.id}`}
            aria-selected={a.id === areaId}
            aria-controls="reform-panel"
            onClick={() => setAreaId(a.id)}
            className={cn('shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition', a.id === areaId ? 'border-jade bg-jade/20 text-ivory' : 'hairline text-ivory/75 hover:border-jade/60')}
          >
            {a.name}
          </button>
        ))}
      </div>
      <div id="reform-panel" role="tabpanel" aria-labelledby={`reform-tab-${area.id}`} className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h3 className="display-title text-4xl text-ivory sm:text-5xl">{area.name}</h3>
          <p className="mt-4 text-lg text-ivory/75">{area.summary}</p>
        </div>
        <ol className="relative space-y-1 border-l border-jade/40 pl-6">
          {area.milestones.map((m) => (
            <li key={m.year + m.text} className="relative rounded-xl px-3 py-2.5 transition hover:bg-white/[0.03]">
              <span className="absolute -left-[30px] top-4 h-2.5 w-2.5 rotate-45 border border-jade bg-ink" aria-hidden="true" />
              <span className="font-display text-2xl text-jade">{m.year}</span>
              <span className="ml-3 text-ivory/85">{m.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {constitutionalEras.map((c) => (
          <article key={c.id} className="rounded-3xl border border-jade/25 bg-jade/[0.05] p-7">
            <p className="label-caps text-jade">{c.years}</p>
            <h4 className="mt-2 font-display text-3xl text-ivory">{c.name}</h4>
            <p className="mt-3 leading-relaxed text-ivory/75">{c.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
