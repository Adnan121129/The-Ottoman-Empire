'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { glossary } from '@/data/glossary';
import { cn } from '@/lib/utils';

const fold = (s: string) =>
  s
    .toLocaleLowerCase('en')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i');

export function GlossaryList() {
  const [q, setQ] = useState('');
  const [highlight, setHighlight] = useState<string | null>(null);
  const sorted = useMemo(() => [...glossary].sort((a, b) => fold(a.term).localeCompare(fold(b.term))), []);
  const list = useMemo(() => {
    const f = fold(q.trim());
    if (!f) return sorted;
    return sorted.filter((g) => fold(`${g.term} ${g.turkish ?? ''} ${g.definition} ${g.context}`).includes(f));
  }, [q, sorted]);
  const letters = useMemo(() => [...new Set(sorted.map((g) => fold(g.term)[0].toUpperCase()))], [sorted]);

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (glossary.some((g) => g.id === id)) {
        setQ('');
        setHighlight(id);
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'center' }), 30);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <label className="relative block">
          <span className="sr-only">Filter terms</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter terms…" className="w-full rounded-full border hairline bg-black/40 py-3 pl-11 pr-4 text-sm text-ivory placeholder:text-ash focus:border-gold/60 focus:outline-none" />
        </label>
        <p className="mt-3 px-2 text-xs text-ash" aria-live="polite">
          {list.length} of {glossary.length} terms
        </p>
        <nav aria-label="Jump to letter" className="mt-6 hidden flex-wrap gap-1.5 lg:flex">
          {letters.map((l) => {
            const first = sorted.find((g) => fold(g.term)[0].toUpperCase() === l);
            return (
              <a key={l} href={`#${first?.id}`} className="grid h-8 w-8 place-items-center rounded-lg border hairline font-display text-lg text-ivory/80 transition hover:border-gold/50 hover:text-gold-light">
                {l}
              </a>
            );
          })}
        </nav>
      </div>
      <dl className="grid gap-4 md:grid-cols-2">
        {list.map((g) => (
          <div key={g.id} id={g.id} className={cn('scroll-mt-28 rounded-2xl border p-6 transition-colors duration-700', highlight === g.id ? 'border-gold/60 bg-gold/[0.07]' : 'hairline bg-white/[0.02]')}>
            <dt>
              <span className="font-display text-3xl text-ivory">{g.term}</span>
              {g.turkish && <span className="ml-3 text-sm italic text-gold-light/80">{g.turkish}</span>}
            </dt>
            <dd className="mt-3 text-ivory/85">{g.definition}</dd>
            <dd className="mt-2 text-sm leading-relaxed text-ivory/60">{g.context}</dd>
            {g.related && g.related.length > 0 && (
              <dd className="mt-4 flex flex-wrap gap-2">
                <span className="sr-only">Related terms:</span>
                {g.related.map((r) => {
                  const t = glossary.find((x) => x.id === r);
                  return t ? (
                    <a key={r} href={`#${r}`} className="rounded-full border hairline px-3 py-1 text-xs text-gold-light transition hover:border-gold/50">
                      {t.term}
                    </a>
                  ) : null;
                })}
              </dd>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="text-ivory/60">No terms match “{q}”. Try the site search for people, places and events.</p>}
      </dl>
    </div>
  );
}
