'use client';

import { useEffect } from 'react';

/**
 * Fires a callback when the visitor types one of the given sequences anywhere
 * outside a text field — used for the hidden “time jump” easter eggs.
 */
export function useKeySequence(sequences: Record<string, () => void>) {
  useEffect(() => {
    let buffer = '';
    const max = Math.max(...Object.keys(sequences).map((s) => s.length));
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key).slice(-max);
      for (const [seq, fn] of Object.entries(sequences)) {
        if (buffer.endsWith(seq)) {
          buffer = '';
          fn();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sequences]);
}
