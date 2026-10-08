'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AmbientEngine, type Mood } from './audio';

/* ------------------------------------------------------------------------ */
/*  Persisted per-viewer preferences (browser storage is best-effort only)   */
/* ------------------------------------------------------------------------ */

type MotionPref = 'system' | 'reduced' | 'full';
type QualityPref = 'auto' | 'high' | 'low';
export type Quality = 'high' | 'medium' | 'low';

interface Prefs {
  motion: MotionPref;
  quality: QualityPref;
  audioMood: Mood | 'auto';
  volume: number;
}

const DEFAULT_PREFS: Prefs = { motion: 'system', quality: 'auto', audioMood: 'auto', volume: 0.35 };
const STORAGE_KEY = 'ottoman-prefs-v1';

function readPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function writePrefs(p: Prefs) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — preferences simply won't persist */
  }
}

function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'medium';
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 820;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  // Without WebGL, 3D views fall back to the pre-rendered video and posters.
  try {
    const c = document.createElement('canvas');
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) return 'low';
  } catch {
    return 'low';
  }
  if ((coarse && small) || cores <= 2 || memory <= 2) return 'low';
  if (coarse || cores <= 4 || memory <= 4) return 'medium';
  return 'high';
}

/** Route → ambient mood used when the viewer chose “auto”. */
function moodForPath(path: string): Mood {
  if (path.startsWith('/battles') || path.startsWith('/final-years')) return 'battle';
  if (path.startsWith('/culture') || path.startsWith('/map')) return 'bazaar';
  if (path.startsWith('/sultans') || path.startsWith('/figures') || path.startsWith('/architecture') || path.startsWith('/dynasty')) return 'palace';
  return 'bosphorus';
}

interface SettingsValue {
  prefs: Prefs;
  reducedMotion: boolean;
  quality: Quality;
  audioOn: boolean;
  activeMood: Mood;
  setMotion: (m: MotionPref) => void;
  setQuality: (q: QualityPref) => void;
  setAudioMood: (m: Mood | 'auto') => void;
  setVolume: (v: number) => void;
  toggleAudio: () => void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

interface UIValue {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  archiveOpen: boolean;
  setArchiveOpen: (v: boolean) => void;
}

const UIContext = createContext<UIValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [systemReduced, setSystemReduced] = useState(false);
  const [detected, setDetected] = useState<Quality>('medium');
  const [audioOn, setAudioOn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const engine = useRef<AmbientEngine | null>(null);
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    setPrefs(readPrefs());
    setDetected(detectQuality());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduced(mq.matches);
    const onChange = () => setSystemReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const reducedMotion = prefs.motion === 'reduced' || (prefs.motion === 'system' && systemReduced);
  const quality: Quality = reducedMotion ? 'low' : prefs.quality === 'auto' ? detected : prefs.quality === 'high' ? 'high' : 'low';
  const activeMood: Mood = prefs.audioMood === 'auto' ? moodForPath(pathname) : prefs.audioMood;

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      writePrefs(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!audioOn) return;
    engine.current ??= new AmbientEngine();
    engine.current.setVolume(prefs.volume);
    engine.current.play(activeMood);
  }, [audioOn, activeMood, prefs.volume]);

  const toggleAudio = useCallback(() => {
    setAudioOn((on) => {
      if (on) engine.current?.stop();
      return !on;
    });
  }, []);

  const settings = useMemo<SettingsValue>(
    () => ({
      prefs,
      reducedMotion,
      quality,
      audioOn,
      activeMood,
      setMotion: (motion) => update({ motion }),
      setQuality: (q) => update({ quality: q }),
      setAudioMood: (audioMood) => update({ audioMood }),
      setVolume: (volume) => update({ volume }),
      toggleAudio,
    }),
    [prefs, reducedMotion, quality, audioOn, activeMood, update, toggleAudio],
  );

  const ui = useMemo<UIValue>(
    () => ({
      searchOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      archiveOpen,
      setArchiveOpen,
    }),
    [searchOpen, archiveOpen],
  );

  return (
    <SettingsContext.Provider value={settings}>
      <UIContext.Provider value={ui}>{children}</UIContext.Provider>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside AppProviders');
  return ctx;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside AppProviders');
  return ctx;
}
