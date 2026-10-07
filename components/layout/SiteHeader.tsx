'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Menu, Search, Settings2, Volume2, VolumeX, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Emblem } from '@/components/ui/Emblem';
import { moodLabels, type Mood } from '@/lib/audio';
import { exploreItems, navItems } from '@/lib/nav';
import { useSettings, useUI } from '@/lib/providers';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href.startsWith('/#')) return false;
  return pathname.startsWith(href.replace(/\/$/, ''));
}

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const { openSearch } = useUI();
  const settings = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSettingsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSettingsOpen(false);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [settingsOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink">
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background,border,backdrop-filter] duration-500',
          scrolled || menuOpen ? 'border-b hairline bg-ink/75 backdrop-blur-xl' : 'border-b border-transparent bg-gradient-to-b from-black/60 to-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:h-20 sm:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="The Ottoman Empire — home">
            <Emblem className="h-9 w-9 transition-transform duration-700 group-hover:rotate-45" title="" />
            <span className="hidden leading-none sm:block xl:hidden 2xl:block">
              <span className="block font-display text-[1.05rem] font-semibold tracking-[0.2em] text-ivory">THE OTTOMAN EMPIRE</span>
              <span className="mt-1 block text-[0.6rem] tracking-[0.42em] text-gold">1299 — 1922</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative whitespace-nowrap rounded-full px-2 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.13em] transition-colors 2xl:px-3 2xl:tracking-[0.16em]',
                      isActive(pathname, item.href) ? 'text-gold-light' : 'text-ivory/70 hover:text-ivory',
                    )}
                    aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  >
                    {item.label}
                    {isActive(pathname, item.href) && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" aria-hidden="true" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 xl:ml-3">
            <button
              onClick={openSearch}
              className="flex h-10 items-center gap-2 rounded-full border hairline bg-white/[0.03] px-3 text-ivory/80 transition hover:border-gold/40 hover:text-ivory"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <kbd className="hidden rounded border border-white/10 px-1.5 text-[0.6rem] text-ash md:inline">⌘K</kbd>
            </button>
            <button
              onClick={settings.toggleAudio}
              className={cn('grid h-10 w-10 place-items-center rounded-full border hairline transition', settings.audioOn ? 'border-gold/50 bg-gold/10 text-gold-light' : 'bg-white/[0.03] text-ivory/80 hover:text-ivory')}
              aria-label={settings.audioOn ? 'Mute ambient sound' : 'Play ambient sound'}
              aria-pressed={settings.audioOn}
            >
              {settings.audioOn ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
            </button>
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setSettingsOpen((o) => !o)}
                className="grid h-10 w-10 place-items-center rounded-full border hairline bg-white/[0.03] text-ivory/80 transition hover:text-ivory"
                aria-label="Experience settings"
                aria-expanded={settingsOpen}
                aria-haspopup="dialog"
              >
                <Settings2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <AnimatePresence>
                {settingsOpen && (
                  <motion.div
                    role="dialog"
                    aria-label="Experience settings"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border hairline bg-night/95 p-4 shadow-2xl shadow-black backdrop-blur-xl"
                  >
                    <SettingsBody />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border hairline bg-white/[0.03] text-ivory xl:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.35 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-ink/97 pt-24 backdrop-blur-xl xl:hidden"
          >
            <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
            <nav aria-label="Mobile" className="relative mx-auto grid max-w-5xl gap-12 px-6 pb-16 sm:grid-cols-2">
              <ul className="space-y-1">
                {navItems.map((item, i) => (
                  <motion.li key={item.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: settings.reducedMotion ? 0 : 0.03 * i }}>
                    <Link href={item.href} onClick={() => setMenuOpen(false)} className={cn('flex items-baseline gap-4 py-1.5 font-display text-3xl sm:text-4xl', isActive(pathname, item.href) ? 'text-gold-light' : 'text-ivory hover:text-gold-light')}>
                      <span className="w-6 text-xs font-sans text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div>
                <p className="label-caps mb-4 text-gold">Explore</p>
                <ul className="space-y-2">
                  {exploreItems.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-2xl border hairline bg-white/[0.02] px-4 py-3 transition hover:border-gold/40">
                        <span className="block font-display text-xl text-ivory">{item.label}</span>
                        <span className="text-xs text-ash">{item.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset className="mb-4">
      <legend className="label-caps mb-2 text-ash">{label}</legend>
      <div className="grid grid-flow-col gap-1 rounded-full border hairline bg-black/40 p-1">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={cn('rounded-full px-2 py-1.5 text-xs font-medium transition', value === o.value ? 'bg-gold text-ink' : 'text-ivory/70 hover:text-ivory')}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function SettingsBody() {
  const s = useSettings();
  return (
    <div>
      <Segmented
        label="Motion"
        value={s.prefs.motion}
        onChange={s.setMotion}
        options={[
          { value: 'system', label: 'System' },
          { value: 'full', label: 'Full' },
          { value: 'reduced', label: 'Reduced' },
        ]}
      />
      <Segmented
        label="3D quality"
        value={s.prefs.quality}
        onChange={s.setQuality}
        options={[
          { value: 'auto', label: 'Auto' },
          { value: 'high', label: 'High' },
          { value: 'low', label: 'Low' },
        ]}
      />
      <fieldset className="mb-3">
        <legend className="label-caps mb-2 text-ash">Ambient sound</legend>
        <select
          value={s.prefs.audioMood}
          onChange={(e) => s.setAudioMood(e.target.value as Mood | 'auto')}
          className="w-full rounded-xl border hairline bg-black/50 px-3 py-2 text-sm text-ivory"
          aria-label="Ambient soundscape"
        >
          <option value="auto">Automatic (follows the page)</option>
          {(Object.keys(moodLabels) as Mood[]).map((m) => (
            <option key={m} value={m}>
              {moodLabels[m]}
            </option>
          ))}
        </select>
        <label className="mt-3 flex items-center gap-3 text-xs text-ash">
          Volume
          <input type="range" min={0} max={1} step={0.05} value={s.prefs.volume} onChange={(e) => s.setVolume(Number(e.target.value))} className="flex-1 accent-[#c9a24a]" />
        </label>
        <button onClick={s.toggleAudio} className={cn('mt-3 w-full rounded-full py-2 text-sm font-semibold transition', s.audioOn ? 'border hairline text-ivory' : 'bg-gold text-ink')}>
          {s.audioOn ? 'Mute sound' : 'Play sound'}
        </button>
      </fieldset>
      <p className="text-[0.65rem] leading-relaxed text-ash">Sound is generated live in your browser — no recordings or copyrighted music. Current quality: {s.quality}.</p>
    </div>
  );
}
