'use client';

import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

/**
 * Accessible immersive panel (dialog). Traps focus, closes on Escape or backdrop
 * click, restores focus to the trigger and locks page scroll while open.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'right',
  className,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: 'right' | 'center';
  className?: string;
  labelledBy?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const { reducedMotion } = useSettings();

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-autofocus], button, a, input')?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      restore.current?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const d = reducedMotion ? 0 : 0.45;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: d * 0.8 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={labelledBy ? undefined : title}
            aria-labelledby={labelledBy}
            className={cn(
              'absolute overflow-y-auto overscroll-contain border hairline bg-night/95 shadow-2xl shadow-black',
              side === 'right' ? 'inset-y-0 right-0 w-full max-w-2xl sm:rounded-l-3xl' : 'inset-x-3 top-[6vh] bottom-[6vh] mx-auto max-w-4xl rounded-3xl',
              className,
            )}
            initial={side === 'right' ? { x: '100%' } : { opacity: 0, y: 30, scale: 0.98 }}
            animate={side === 'right' ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={side === 'right' ? { x: '100%' } : { opacity: 0, y: 20 }}
            transition={{ duration: d, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              className="sticky top-4 z-10 float-right mr-4 mt-4 grid h-10 w-10 place-items-center rounded-full border hairline bg-black/60 text-ivory backdrop-blur transition hover:border-gold/50 hover:text-gold-light"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
