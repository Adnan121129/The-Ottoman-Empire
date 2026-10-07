'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { GRATICULE_PATH, LAND_PATH } from '@/data/generated/basemap';
import { regionById, statusLabel, type Snapshot, type TerritoryStatus } from '@/data/territories';
import { rivers, seaLabels, tradeRoutes } from '@/data/mapLayers';
import type { Movement, Place } from '@/data/types';
import { MAP_HEIGHT, MAP_WIDTH, endAngle, project, ringsToPath, smoothLine } from '@/lib/geo';
import { useSettings } from '@/lib/providers';
import { clamp, cn } from '@/lib/utils';

export type ViewBox = [number, number, number, number];
export const FULL_VIEW: ViewBox = [0, 0, MAP_WIDTH, MAP_HEIGHT];

export interface MapMarker {
  id: string;
  coords: [number, number];
  label: string;
  kind: 'city' | 'capital' | 'battle-win' | 'battle-loss' | 'battle-other' | 'focus';
  importance?: 1 | 2 | 3;
  number?: number;
}

const statusFillFor = (uid: string): Record<TerritoryStatus, string> => ({
  core: '#a8243a',
  vassal: `url(#VASSAL-${uid})`,
  contested: `url(#CONTESTED-${uid})`,
  successor: '#1f7a5c',
});

export const statusSwatch: Record<TerritoryStatus, string> = {
  core: 'bg-[#a8243a]',
  vassal: 'bg-[repeating-linear-gradient(45deg,#c9a24a_0_2px,#5a1d24_2px_6px)]',
  contested: 'bg-[repeating-linear-gradient(45deg,#8f8676_0_1.5px,#2a241e_1.5px_6px)]',
  successor: 'bg-[#1f7a5c]',
};

export function MapCanvas({
  snapshot,
  previous,
  view,
  onViewChange,
  interactive = false,
  markers = [],
  movements = [],
  showRivers = true,
  showRoutes = false,
  showSeaLabels = true,
  showGraticule = true,
  selectedMarkerId,
  onMarkerClick,
  className,
  ariaLabel,
  children,
  territoryOpacity = 0.74,
  animateMovements = true,
  minimal = false,
  fit = 'meet',
}: {
  snapshot?: Snapshot | null;
  previous?: Snapshot | null;
  view?: ViewBox;
  onViewChange?: (v: ViewBox) => void;
  interactive?: boolean;
  markers?: MapMarker[];
  movements?: Movement[];
  showRivers?: boolean;
  showRoutes?: boolean;
  showSeaLabels?: boolean;
  showGraticule?: boolean;
  selectedMarkerId?: string;
  onMarkerClick?: (id: string) => void;
  className?: string;
  ariaLabel: string;
  children?: ReactNode;
  territoryOpacity?: number;
  animateMovements?: boolean;
  minimal?: boolean;
  /** 'meet' shows the whole view box; 'slice' fills the container (cropping). */
  fit?: 'meet' | 'slice';
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const statusFill = useMemo(() => statusFillFor(uid), [uid]);
  const { reducedMotion } = useSettings();
  const svgRef = useRef<SVGSVGElement>(null);
  const [internalView, setInternalView] = useState<ViewBox>(view ?? FULL_VIEW);
  const vb = view && !interactive ? view : internalView;
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (view) setInternalView(view);
  }, [view]);

  const setView = useCallback(
    (v: ViewBox) => {
      const w = clamp(v[2], 70, MAP_WIDTH * 1.05);
      const h = (w * MAP_HEIGHT) / MAP_WIDTH;
      const x = clamp(v[0], -w * 0.3, MAP_WIDTH - w * 0.7);
      const y = clamp(v[1], -h * 0.3, MAP_HEIGHT - h * 0.7);
      const next: ViewBox = [x, y, w, h];
      setInternalView(next);
      onViewChange?.(next);
    },
    [onViewChange],
  );

  // ----------------------------------------------------------- zoom & pan
  const drag = useRef<{ x: number; y: number; vb: ViewBox; pointers: Map<number, { x: number; y: number }>; pinch?: number } | null>(null);

  const toSvg = (clientX: number, clientY: number, v: ViewBox) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const scale = fit === 'slice' ? Math.min(v[2] / rect.width, v[3] / rect.height) : Math.max(v[2] / rect.width, v[3] / rect.height);
    const offX = (rect.width * scale - v[2]) / 2;
    const offY = (rect.height * scale - v[3]) / 2;
    return [v[0] + (clientX - rect.left) * scale - offX, v[1] + (clientY - rect.top) * scale - offY] as const;
  };

  const zoomAt = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      const v = internalView;
      const px = cx ?? v[0] + v[2] / 2;
      const py = cy ?? v[1] + v[3] / 2;
      const w = clamp(v[2] * factor, 70, MAP_WIDTH * 1.05);
      const h = (w * MAP_HEIGHT) / MAP_WIDTH;
      setView([px - ((px - v[0]) / v[2]) * w, py - ((py - v[1]) / v[3]) * h, w, h]);
    },
    [internalView, setView],
  );

  useEffect(() => {
    const el = svgRef.current;
    if (!el || !interactive) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const [px, py] = toSvg(e.clientX, e.clientY, internalView);
      zoomAt(e.deltaY > 0 ? 1.15 : 1 / 1.15, px, py);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [interactive, internalView, zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const pointers = drag.current?.pointers ?? new Map();
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag.current = { x: e.clientX, y: e.clientY, vb: internalView, pointers };
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      drag.current.pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!interactive || !d) return;
    d.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const rect = svgRef.current!.getBoundingClientRect();
    if (d.pointers.size === 2 && d.pinch) {
      const [a, b] = [...d.pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const [cx, cy] = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2, d.vb);
      const factor = d.pinch / dist;
      const w = clamp(d.vb[2] * factor, 70, MAP_WIDTH * 1.05);
      const h = (w * MAP_HEIGHT) / MAP_WIDTH;
      setView([cx - ((cx - d.vb[0]) / d.vb[2]) * w, cy - ((cy - d.vb[1]) / d.vb[3]) * h, w, h]);
      return;
    }
    const scale = fit === 'slice' ? Math.min(d.vb[2] / rect.width, d.vb[3] / rect.height) : Math.max(d.vb[2] / rect.width, d.vb[3] / rect.height);
    setView([d.vb[0] - (e.clientX - d.x) * scale, d.vb[1] - (e.clientY - d.y) * scale, d.vb[2], d.vb[3]]);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    d.pointers.delete(e.pointerId);
    if (d.pointers.size === 0) drag.current = null;
    else {
      const [p] = [...d.pointers.values()];
      drag.current = { x: p.x, y: p.y, vb: internalView, pointers: d.pointers };
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return;
    const step = internalView[2] * 0.1;
    const map: Record<string, () => void> = {
      ArrowLeft: () => setView([internalView[0] - step, internalView[1], internalView[2], internalView[3]]),
      ArrowRight: () => setView([internalView[0] + step, internalView[1], internalView[2], internalView[3]]),
      ArrowUp: () => setView([internalView[0], internalView[1] - step, internalView[2], internalView[3]]),
      ArrowDown: () => setView([internalView[0], internalView[1] + step, internalView[2], internalView[3]]),
      '+': () => zoomAt(1 / 1.25),
      '=': () => zoomAt(1 / 1.25),
      '-': () => zoomAt(1.25),
      '0': () => setView(FULL_VIEW),
    };
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  };

  // ----------------------------------------------------------- geometry
  const k = vb[2] / MAP_WIDTH; // scale factor: keeps strokes & labels constant on screen
  const prevIds = useMemo(() => new Set(previous?.regions.map((r) => r.id) ?? []), [previous]);
  const regionPaths = useMemo(
    () =>
      (snapshot?.regions ?? []).map((r) => ({
        ...r,
        name: regionById[r.id]?.name ?? r.id,
        d: regionById[r.id] ? ringsToPath(regionById[r.id].rings) : '',
        isNew: previous ? !prevIds.has(r.id) : false,
      })),
    [snapshot, previous, prevIds],
  );
  const overlayPaths = useMemo(() => (snapshot?.overlays ?? []).map((o) => ({ ...o, d: ringsToPath(o.rings) })), [snapshot]);
  const riverPaths = useMemo(() => rivers.map((r) => ({ ...r, d: smoothLine(r.path) })), []);
  const routePaths = useMemo(() => tradeRoutes.map((r) => ({ ...r, d: smoothLine(r.path, 0.6) })), []);
  const movementPaths = useMemo(() => movements.map((m, i) => ({ ...m, i, d: smoothLine(m.path, 0.55), angle: endAngle(m.path), end: project(m.path[m.path.length - 1]) })), [movements]);

  const hovered = hover ? regionPaths.find((r) => r.id === hover.id) : null;
  const dur = reducedMotion ? 0 : 0.9;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <svg
        ref={svgRef}
        viewBox={vb.join(' ')}
        preserveAspectRatio={fit === 'slice' ? 'xMidYMid slice' : 'xMidYMid meet'}
        className={cn('block h-full w-full select-none', interactive && 'cursor-grab touch-none active:cursor-grabbing')}
        role="img"
        aria-label={ariaLabel}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <clipPath id={`land-${uid}`}>
            <path d={LAND_PATH} />
          </clipPath>
          <radialGradient id={`sea-${uid}`} cx="0.55" cy="0.45" r="0.8">
            <stop offset="0" stopColor="#13202a" />
            <stop offset="1" stopColor="#070b0f" />
          </radialGradient>
          <pattern id={`VASSAL-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#5a1d24" />
            <rect width="2" height="6" fill="#d2ab55" />
          </pattern>
          <pattern id={`CONTESTED-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <rect width="6" height="6" fill="#2a241e" />
            <rect width="1.4" height="6" fill="#a99f8c" />
          </pattern>
          <pattern id={`BYZ-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="5" fill="#3b2a5a" />
            <rect width="1.6" height="5" fill="#a58fd4" />
          </pattern>
          <pattern id={`OCC-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="5" fill="#22344a" />
            <rect width="1.6" height="5" fill="#8db0d6" />
          </pattern>
          <marker id={`arrow-o-${uid}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10Z" fill="#e8cd86" />
          </marker>
          <marker id={`arrow-x-${uid}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10Z" fill="#8db0d6" />
          </marker>
          <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={3 * k} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x={-MAP_WIDTH} y={-MAP_HEIGHT} width={MAP_WIDTH * 3} height={MAP_HEIGHT * 3} fill={`url(#sea-${uid})`} />
        {showGraticule && <path d={GRATICULE_PATH} fill="none" stroke="#c9a24a" strokeOpacity="0.07" strokeWidth={0.6 * k} />}
        <path d={LAND_PATH} fill="#1f1a15" />

        <g clipPath={`url(#land-${uid})`}>
          <g opacity={territoryOpacity}>
            <AnimatePresence initial={false}>
              {regionPaths.map((r) => (
                <motion.path
                  key={r.id}
                  d={r.d}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur }}
                  style={{ fill: statusFill[r.status], transition: reducedMotion ? undefined : 'fill 0.8s ease' }}
                  stroke={statusFill[r.status].startsWith('url') ? '#5a1d24' : statusFill[r.status]}
                  strokeWidth={1.2 * k}
                  onPointerMove={(e) => {
                    if (minimal) return;
                    const rect = svgRef.current!.getBoundingClientRect();
                    setHover({ id: r.id, x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                />
              ))}
            </AnimatePresence>
            {overlayPaths.map((o) => (
              <path key={o.id} d={o.d} fill={o.kind === 'byzantine' ? `url(#BYZ-${uid})` : `url(#OCC-${uid})`} stroke={o.kind === 'byzantine' ? '#a58fd4' : '#8db0d6'} strokeWidth={1 * k} />
            ))}
          </g>
          {/* Newly gained regions pulse gold once */}
          <AnimatePresence>
            {!reducedMotion &&
              regionPaths
                .filter((r) => r.isNew)
                .map((r) => (
                  <motion.path
                    key={`new-${r.id}-${snapshot?.year}`}
                    d={r.d}
                    fill="#f3dc9a"
                    stroke="#f3dc9a"
                    strokeWidth={2 * k}
                    initial={{ opacity: 0.55 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, ease: 'easeOut' }}
                    pointerEvents="none"
                  />
                ))}
          </AnimatePresence>
          {showRivers && riverPaths.map((r) => <path key={r.id} d={r.d} fill="none" stroke="#5b8fb0" strokeOpacity="0.55" strokeWidth={1.1 * k} />)}
        </g>
        <path d={LAND_PATH} fill="none" stroke="#e8cd86" strokeOpacity="0.32" strokeWidth={0.6 * k} pointerEvents="none" />

        {showRoutes &&
          routePaths.map((r) => (
            <path
              key={r.id}
              d={r.d}
              fill="none"
              stroke={r.kind === 'pilgrimage' ? '#9fe0c6' : r.kind === 'sea' ? '#8db0d6' : '#e8cd86'}
              strokeOpacity="0.75"
              strokeWidth={1.3 * k}
              strokeDasharray={`${4 * k} ${3 * k}`}
              strokeLinecap="round"
            >
              <title>{r.name}</title>
            </path>
          ))}

        {showSeaLabels &&
          seaLabels.map((s) => {
            const [x, y] = project(s.at);
            return (
              <text key={s.name} x={x} y={y} textAnchor="middle" fill="#8db0d6" fillOpacity="0.45" fontSize={11 * k * (s.size ?? 1)} fontStyle="italic" fontFamily="var(--font-cormorant)" letterSpacing={2 * k} pointerEvents="none">
                {s.name}
              </text>
            );
          })}

        {movementPaths.map((m) => (
          <g key={`${m.side}-${m.i}-${m.label}`}>
            <path d={m.d} fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth={4.2 * k} strokeLinecap="round" />
            <motion.path
              d={m.d}
              fill="none"
              stroke={m.side === 'ottoman' ? '#e8cd86' : '#8db0d6'}
              strokeWidth={2.4 * k}
              strokeLinecap="round"
              markerEnd={`url(#arrow-${m.side === 'ottoman' ? 'o' : 'x'}-${uid})`}
              initial={animateMovements && !reducedMotion ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.3 + m.i * 0.45, ease: [0.65, 0, 0.35, 1] }}
            >
              <title>{m.label}</title>
            </motion.path>
          </g>
        ))}

        {markers.map((m) => {
          const [x, y] = project(m.coords);
          const selected = m.id === selectedMarkerId;
          const r = (m.kind === 'capital' ? 4.6 : m.kind === 'focus' ? 5 : m.importance === 3 ? 3.6 : 2.8) * k;
          const color = m.kind === 'battle-win' ? '#e8cd86' : m.kind === 'battle-loss' ? '#f07a8a' : m.kind === 'battle-other' ? '#a99f8c' : m.kind === 'focus' ? '#f3dc9a' : '#f4ecda';
          const showLabel = !minimal && (selected || m.kind === 'capital' || m.kind === 'focus' || (m.importance ?? 1) >= 3 || k < 0.55 || ((m.importance ?? 1) >= 2 && k < 0.8));
          const isBattle = m.kind.startsWith('battle');
          return (
            <g
              key={m.id}
              transform={`translate(${x} ${y})`}
              className={cn(onMarkerClick && 'cursor-pointer')}
              onClick={(e) => {
                e.stopPropagation();
                onMarkerClick?.(m.id);
              }}
              onPointerDown={(e) => onMarkerClick && e.stopPropagation()}
              role={onMarkerClick ? 'button' : undefined}
              tabIndex={onMarkerClick ? 0 : undefined}
              aria-label={onMarkerClick ? m.label : undefined}
              onKeyDown={(e) => {
                if (onMarkerClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onMarkerClick(m.id);
                }
              }}
            >
              {selected && <circle r={r * 3.2} fill="none" stroke="#f3dc9a" strokeWidth={1.2 * k} className={reducedMotion ? '' : 'animate-pulse'} />}
              {isBattle ? (
                <g stroke={color} strokeWidth={1.6 * k} strokeLinecap="round" filter={selected ? `url(#glow-${uid})` : undefined}>
                  <circle r={r * 1.5} fill="#0a0908" fillOpacity="0.85" stroke={color} strokeWidth={0.8 * k} />
                  <path d={`M${-r} ${-r}L${r} ${r}M${r} ${-r}L${-r} ${r}`} />
                </g>
              ) : m.kind === 'capital' ? (
                <g filter={`url(#glow-${uid})`}>
                  <rect x={-r} y={-r} width={r * 2} height={r * 2} fill="#e8cd86" stroke="#0a0908" strokeWidth={0.6 * k} />
                  <rect x={-r} y={-r} width={r * 2} height={r * 2} fill="#e8cd86" stroke="#0a0908" strokeWidth={0.6 * k} transform="rotate(45)" />
                </g>
              ) : (
                <circle r={r} fill={color} stroke="#0a0908" strokeWidth={0.8 * k} filter={m.kind === 'focus' ? `url(#glow-${uid})` : undefined} />
              )}
              {m.number !== undefined && (
                <text y={r * 0.45} textAnchor="middle" fontSize={r * 1.3} fontWeight={700} fill="#0a0908" pointerEvents="none">
                  {m.number}
                </text>
              )}
              {showLabel && (
                <text
                  x={r * 1.9}
                  y={r * 0.6}
                  fontSize={(m.kind === 'capital' || selected ? 12.5 : 10.5) * k}
                  fill={selected || m.kind === 'capital' ? '#f3dc9a' : '#f4ecda'}
                  fontFamily="var(--font-manrope)"
                  fontWeight={600}
                  stroke="#0a0908"
                  strokeWidth={3 * k}
                  paintOrder="stroke"
                  pointerEvents="none"
                >
                  {m.label}
                </text>
              )}
            </g>
          );
        })}
        {children}
      </svg>

      {hovered && hover && !minimal && (
        <div className="pointer-events-none absolute z-10 max-w-64 -translate-x-1/2 -translate-y-full rounded-xl border hairline bg-black/85 px-3 py-2 text-xs shadow-xl backdrop-blur" style={{ left: hover.x, top: hover.y - 12 }}>
          <p className="font-semibold text-ivory">{hovered.name}</p>
          <p className="mt-0.5 text-gold-light">{statusLabel[hovered.status]}</p>
          {hovered.note && <p className="mt-1 text-ash">{hovered.note}</p>}
        </div>
      )}

      {interactive && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
          <button onClick={() => zoomAt(1 / 1.35)} className="grid h-9 w-9 place-items-center rounded-full border hairline bg-black/70 text-ivory backdrop-blur hover:text-gold-light" aria-label="Zoom in">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button onClick={() => zoomAt(1.35)} className="grid h-9 w-9 place-items-center rounded-full border hairline bg-black/70 text-ivory backdrop-blur hover:text-gold-light" aria-label="Zoom out">
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button onClick={() => setView(FULL_VIEW)} className="grid h-9 w-9 place-items-center rounded-full border hairline bg-black/70 text-ivory backdrop-blur hover:text-gold-light" aria-label="Reset view">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export function MapLegend({ statuses, className, extra }: { statuses: TerritoryStatus[]; className?: string; extra?: ReactNode }) {
  return (
    <ul className={cn('flex flex-wrap gap-x-5 gap-y-2 text-xs text-ivory/75', className)}>
      {statuses.map((s) => (
        <li key={s} className="flex items-center gap-2">
          <span className={cn('h-3 w-5 rounded-sm border border-white/10', statusSwatch[s])} aria-hidden="true" />
          {statusLabel[s]}
        </li>
      ))}
      {extra}
    </ul>
  );
}

/** Markers for the cities and capital used on most maps. */
export function placeMarkers(places: Place[], capitalId?: string): MapMarker[] {
  return places
    .filter((p) => p.type !== 'battlefield')
    .map((p) => ({ id: p.id, coords: p.coords, label: p.name.split(' / ')[0], kind: p.id === capitalId ? 'capital' : 'city', importance: p.importance }));
}
