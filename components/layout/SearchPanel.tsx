'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useUI, useSettings } from '@/lib/providers';
import type { SearchItem, SearchKind } from '@/lib/searchIndex';
import { cn } from '@/lib/utils';

type IndexModule = typeof import('@/lib/searchIndex');

const kindStyle: Record<SearchKind, string> = {
  Sultan: 'text-gold-light border-gold/30',
  Person: 'text-[#f3c1a0] border-[#f3c1a0]/30',
  Battle: 'text-[#f3a4ae] border-ember/40',
  Place: 'text-[#9fe0c6] border-jade/40',
  Event: 'text-sky-200 border-sky-300/30',
  Building: 'text-ivory border-ivory/30',
  Reform: 'text-[#d8c2f0] border-[#d8c2f0]/30',
  Period: 'text-gold border-gold/30',
  Glossary: 'text-ash border-ash/40',
};

/** Global fuzzy search (⌘K / Ctrl+K) across every dataset, entirely client-side. */
export function SearchPanel() {
  const { searchOpen, closeSearch, openSearch } = useUI();
  const { reducedMotion } = useSettings();
  const router = useRouter();
  const [mod, setMod] = useState<IndexModule | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
      }
      if (e.key === '/' && !searchOpen) {
        const t = e.target as HTMLElement;
        if (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA') {
          e.preventDefault();
          openSearch();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, openSearch, closeSearch]);

  useEffect(() => {
    if (!searchOpen) return;
    if (!mod) import('@/lib/searchIndex').then(setMod);
    setQuery('');
    setActive(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.current?.focus(), 40);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [searchOpen, mod]);

  const results: SearchItem[] = useMemo(() => {
    if (!mod) return [];
    if (query.trim().length < 2) return mod.suggestions;
    return mod.fuse.search(query.trim(), { limit: 24 }).map((r) => r.item);
  }, [mod, query]);

  useEffect(() => setActive(0), [query]);

  const go = (item: SearchItem) => {
    closeSearch();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-[10vh]">
          <motion.div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={closeSearch} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the empire"
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border hairline bg-night/95 shadow-2xl shadow-black"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b hairline px-5">
              <Search className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <input
                ref={input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search sultans, battles, cities, mosques, reforms…"
                className="h-16 w-full bg-transparent text-lg text-ivory placeholder:text-ash/70 focus:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `sr-${results[active].id}` : undefined}
                aria-autocomplete="list"
              />
              <button onClick={closeSearch} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ash hover:text-ivory" aria-label="Close search">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!mod && <p className="px-4 py-8 text-center text-sm text-ash">Loading the archive…</p>}
              {mod && query.trim().length < 2 && <p className="label-caps px-4 pt-3 pb-2 text-ash">Suggestions</p>}
              {mod && query.trim().length >= 2 && results.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-ash">No matches for “{query}”. Try a sultan, city, battle or term — e.g. “Mohács”, “Sinan”, “janissary”.</p>
              )}
              <ul id="search-results" ref={list} role="listbox" aria-label="Search results">
                {results.map((item, i) => (
                  <li key={item.id} id={`sr-${item.id}`} role="option" aria-selected={i === active} data-index={i}>
                    <button
                      onClick={() => go(item)}
                      onMouseMove={() => setActive(i)}
                      className={cn('flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition', i === active ? 'bg-gold/10' : 'hover:bg-white/[0.03]')}
                    >
                      <span className={cn('w-20 shrink-0 rounded-full border px-2 py-0.5 text-center text-[0.6rem] font-semibold uppercase tracking-wider', kindStyle[item.kind])}>{item.kind}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-lg text-ivory">{item.title}</span>
                        <span className="block truncate text-xs text-ash">{item.subtitle}</span>
                      </span>
                      {i === active ? <CornerDownLeft className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" /> : <ArrowRight className="h-4 w-4 shrink-0 text-ash/50" aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between border-t hairline px-5 py-2.5 text-[0.65rem] text-ash">
              <span>↑ ↓ to navigate · Enter to open · Esc to close</span>
              <span>Fuzzy search · local data</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
