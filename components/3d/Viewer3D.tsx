'use client';

import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { Box } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useSettings } from '@/lib/providers';
import { cn } from '@/lib/utils';

/**
 * Lazy 3D viewer shell: the WebGL bundle is only downloaded when the viewer
 * approaches the viewport, and rendering pauses when it scrolls away.
 * On low-quality settings the viewer waits for an explicit click.
 */
export function Viewer3D<P extends object>({
  load,
  props,
  label,
  caption,
  className,
  poster,
}: {
  load: () => Promise<{ default: ComponentType<P & { active: boolean; quality: 'high' | 'medium' | 'low' }> }>;
  props: P;
  label: string;
  caption?: ReactNode;
  className?: string;
  poster?: ReactNode;
}) {
  const { quality } = useSettings();
  const [ref, near] = useInView<HTMLDivElement>({ rootMargin: '400px' });
  const [visRef, visible] = useInView<HTMLDivElement>({ once: false, rootMargin: '0px' });
  const [optIn, setOptIn] = useState(false);
  const [Comp, setComp] = useState<ComponentType<P & { active: boolean; quality: 'high' | 'medium' | 'low' }> | null>(null);
  const enabled = near && (quality !== 'low' || optIn);

  useEffect(() => {
    if (!enabled || Comp) return;
    let alive = true;
    load().then((m) => alive && setComp(() => m.default));
    return () => {
      alive = false;
    };
  }, [enabled, Comp, load]);

  return (
    <figure ref={ref} className={cn('relative overflow-hidden rounded-[2rem] border hairline bg-[radial-gradient(80%_70%_at_50%_40%,#2a2016,#0a0908)]', className)}>
      <div ref={visRef} className="absolute inset-0" role="img" aria-label={label}>
        {Comp ? (
          <Comp {...props} active={visible} quality={quality} />
        ) : (
          <div className="grid h-full w-full place-items-center">
            {poster}
            {quality === 'low' && !optIn ? (
              <button onClick={() => setOptIn(true)} className="relative z-10 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
                <Box className="h-4 w-4" aria-hidden="true" /> Load 3D view
              </button>
            ) : (
              <span className="relative z-10 text-xs tracking-widest text-ash uppercase">Preparing 3D…</span>
            )}
          </div>
        )}
      </div>
      {caption && <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-4 pt-10 text-xs text-ivory/70">{caption}</figcaption>}
    </figure>
  );
}

export const loadMosque = () => import('./MosqueModel');
export const loadShip = () => import('./ShipModel');
export const loadArmory = () => import('./ArmoryModel');
export const loadCity = () => import('./CityModel');

