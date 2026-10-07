'use client';

import { CalendarDays, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { eventsOnDay, upcomingEvents } from '@/data/events';
import { facts } from '@/data/facts';
import type { HistoricalEvent } from '@/data/types';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { MONTHS } from '@/lib/utils';

function eventHref(e: HistoricalEvent) {
  if (e.battleId) return `/battles/#${e.battleId}`;
  if (e.rulerId) return `/sultans/${e.rulerId}/`;
  return '/#timeline';
}

/** “On This Day” — local data only; dates before 1582 follow the Julian calendar. */
export function OnThisDay() {
  const [today, setToday] = useState<{ m: number; d: number } | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday({ m: now.getMonth() + 1, d: now.getDate() });
  }, []);
  const exact = useMemo(() => (today ? eventsOnDay(today.m, today.d) : []), [today]);
  const next = useMemo(() => (today ? upcomingEvents(today.m, today.d, exact.length ? 2 : 3) : []), [today, exact.length]);
  const fact = useMemo(() => (today ? facts[(today.m * 31 + today.d) % facts.length] : facts[0]), [today]);

  return (
    <section id="on-this-day" aria-labelledby="otd-title" className="relative py-24">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] border hairline bg-gradient-to-br from-burgundy/50 via-charcoal to-charcoal p-8 sm:p-10">
          <div className="pattern-girih absolute inset-0 opacity-[0.05]" aria-hidden="true" />
          <div className="relative">
            <p className="label-caps flex items-center gap-2 text-gold">
              <CalendarDays className="h-4 w-4" aria-hidden="true" /> On this day
            </p>
            <h2 id="otd-title" className="display-title mt-3 text-4xl text-ivory sm:text-5xl">
              {today ? `${today.d} ${MONTHS[today.m - 1]}` : 'Today'} in Ottoman history
            </h2>
            <div className="mt-8 space-y-4" aria-live="polite">
              {!today && <p className="text-ivory/50">Checking the calendar…</p>}
              {today && exact.length === 0 && <p className="text-ivory/65">No event in this site’s calendar falls on today’s date. Coming up next:</p>}
              {[...exact, ...next].map((e, i) => (
                <Link key={e.id} href={eventHref(e)} className="group flex gap-5 rounded-2xl border hairline bg-black/25 p-4 transition hover:border-gold/40">
                  <span className="w-20 shrink-0 font-display text-3xl leading-none text-gold-light">{e.year}</span>
                  <span className="min-w-0 flex-1">
                    <span className="label-caps block text-ash">
                      {i < exact.length ? 'Today' : 'Upcoming'} · {e.dateLabel}
                    </span>
                    <span className="mt-1 block font-display text-xl text-ivory">{e.title}</span>
                    <span className="mt-1 block text-sm text-ivory/65">{e.description}</span>
                    {e.certainty && e.certainty !== 'confirmed' && <CertaintyBadge kind={e.certainty} className="mt-2" />}
                  </span>
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gold transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <p className="mt-6 text-xs text-ash">Dates before 1582 are given in the Julian calendar, as conventionally cited.</p>
          </div>
        </div>
        <aside aria-label="Did you know?" className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-gold/25 bg-gradient-to-b from-emerald/30 to-charcoal p-8">
          <div>
            <p className="label-caps flex items-center gap-2 text-gold">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Did you know?
            </p>
            <p className="mt-5 font-display text-2xl leading-snug text-ivory">{fact.text}</p>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <CertaintyBadge kind={fact.kind} long />
            <span className="text-[0.65rem] text-ash">More in the hidden archive — find the emblem.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
