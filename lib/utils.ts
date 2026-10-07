import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** "1453" → "1453", negative never occurs here but keeps formatting in one place. */
export function formatYear(y: number) {
  return String(y);
}

export function century(year: number) {
  const c = Math.floor((year - 1) / 100) + 1;
  const suffix = c === 1 ? 'st' : c === 2 ? 'nd' : c === 3 ? 'rd' : 'th';
  return `${c}${suffix} century`;
}

/** Deterministic pseudo-random generator for procedural art and 3D scenes. */
export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
