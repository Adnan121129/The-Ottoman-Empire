import Link from 'next/link';
import { Emblem } from '@/components/ui/Emblem';
import { exploreItems, navItems } from '@/lib/nav';
import { ArchiveTrigger } from './EasterEggs';

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t hairline bg-night">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.035]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <ArchiveTrigger>
                <Emblem className="h-14 w-14" title="Imperial emblem — click to open the hidden archive" />
              </ArchiveTrigger>
              <div>
                <p className="font-display text-2xl tracking-[0.18em] text-ivory">THE OTTOMAN EMPIRE</p>
                <p className="mt-1 text-xs tracking-[0.4em] text-gold">1299 — 1922 · CALIPHATE TO 1924</p>
              </div>
            </div>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-ivory/60">
              An independent educational experience. Every major section distinguishes confirmed fact from tradition, interpretation and debate, and cites its sources. Portraits and scenes are artistic reconstructions unless stated otherwise.
            </p>
            <p className="mt-4 text-xs text-ash">
              Found an error? History is a conversation — see the <Link href="/sources/" className="text-gold-light underline decoration-gold/40 underline-offset-2">methodology</Link>.
            </p>
          </div>
          <nav aria-label="Footer — sections">
            <p className="label-caps mb-4 text-gold">Sections</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-ivory/70 transition hover:text-gold-light">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer — explore">
            <p className="label-caps mb-4 text-gold">Explore</p>
            <ul className="space-y-2 text-sm">
              {exploreItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-ivory/70 transition hover:text-gold-light">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t hairline pt-8 text-xs text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>Base map: Natural Earth (public domain). Audio, portraits, maps and 3D scenes generated procedurally for this site.</p>
          <p>
            Tip: press <kbd className="rounded border border-white/10 px-1">/</kbd> to search — or type a year such as <span className="text-gold">1453</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
