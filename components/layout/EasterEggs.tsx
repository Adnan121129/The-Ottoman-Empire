'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Shuffle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { facts } from '@/data/facts';
import { CertaintyBadge } from '@/components/ui/Certainty';
import { SourcesList } from '@/components/ui/SourcesList';
import { Drawer } from '@/components/ui/Drawer';
import { Emblem } from '@/components/ui/Emblem';
import { useKeySequence } from '@/hooks/useKeySequence';
import { useSettings, useUI } from '@/lib/providers';

/** Wrap any element (the emblem) to make it open the hidden archive. */
export function ArchiveTrigger({ children }: { children: ReactNode }) {
  const { setArchiveOpen } = useUI();
  return (
    <button onClick={() => setArchiveOpen(true)} className="rounded-full transition hover:scale-105 hover:drop-shadow-[0_0_14px_rgba(201,162,74,0.6)]" aria-label="Open the hidden archive of historical discoveries">
      {children}
    </button>
  );
}

/**
 * Hidden discoveries:
 *  • clicking the emblem opens the “Hidden Archive” of verified curiosities;
 *  • typing a pivotal year (1299, 1453, 1529, 1683, 1826, 1922) anywhere jumps
 *    through time with a gold flash.
 */
export function EasterEggs() {
  const { archiveOpen, setArchiveOpen } = useUI();
  const { reducedMotion } = useSettings();
  const router = useRouter();
  const [index, setIndex] = useState(() => Math.floor(Math.random() * facts.length));
  const [flash, setFlash] = useState<string | null>(null);

  const jump = useCallback(
    (year: string, href: string) => {
      setFlash(year);
      setTimeout(() => setFlash(null), reducedMotion ? 600 : 1400);
      setTimeout(() => router.push(href), reducedMotion ? 0 : 450);
    },
    [router, reducedMotion],
  );

  const sequences = useMemo(
    () => ({
      '1299': () => jump('1299', '/#top'),
      '1453': () => jump('1453', '/#constantinople-1453'),
      '1529': () => jump('1529', '/battles/#vienna-1529'),
      '1683': () => jump('1683', '/battles/#vienna-1683'),
      '1826': () => jump('1826', '/sultans/mahmud-ii/'),
      '1922': () => jump('1922', '/final-years/#abolition'),
    }),
    [jump],
  );
  useKeySequence(sequences);

  const fact = facts[index % facts.length];

  return (
    <>
      <AnimatePresence>
        {flash && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[95] grid place-items-center bg-[radial-gradient(circle,rgba(201,162,74,0.35),rgba(10,9,8,0.9))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4 }}
            role="status"
            aria-live="polite"
          >
            <motion.p initial={{ scale: 0.8, letterSpacing: '0.1em' }} animate={{ scale: 1, letterSpacing: '0.3em' }} className="display-title text-gold-gradient text-8xl sm:text-[12rem]">
              {flash}
            </motion.p>
            <span className="sr-only">Time jump to {flash}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer open={archiveOpen} onClose={() => setArchiveOpen(false)} title="The Hidden Archive" side="center">
        <div className="px-6 pb-10 pt-6 sm:px-12">
          <div className="flex items-center gap-4">
            <Emblem className="h-12 w-12" title="" />
            <div>
              <p className="label-caps text-gold">You found it</p>
              <h2 className="display-title text-4xl text-ivory">The Hidden Archive</h2>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-ivory/60">Curiosities from six centuries — each labelled by how certain it is. Tip: type a year such as 1453 or 1922 anywhere on the site.</p>
          <AnimatePresence mode="wait">
            <motion.article
              key={fact.id}
              initial={{ opacity: 0, rotateX: -12, y: 10 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0 : 0.45 }}
              className="mt-8 rounded-3xl border border-gold/25 bg-gradient-to-br from-wine/30 to-transparent p-8"
            >
              <CertaintyBadge kind={fact.kind} long />
              <p className="mt-5 font-display text-2xl leading-snug text-ivory sm:text-3xl">{fact.text}</p>
              <SourcesList ids={fact.sources} className="mt-6" />
            </motion.article>
          </AnimatePresence>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-ash">
              {(index % facts.length) + 1} / {facts.length}
            </span>
            <button onClick={() => setIndex((i) => i + 1)} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-light" data-autofocus>
              <Shuffle className="h-4 w-4" aria-hidden="true" /> Another discovery
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
