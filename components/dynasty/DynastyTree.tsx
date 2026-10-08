'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus, Maximize2, List, Network } from 'lucide-react';
import { rulers, reignLabel } from '@/data/rulers';
import { getFigure } from '@/data/people';
import { clamp, cn } from '@/lib/utils';

type Kind = 'ancestor' | 'ruler' | 'prince' | 'caliph';
interface TreeNode {
  id: string;
  kind: Kind;
  name: string;
  sub: string;
  parent?: string;
  href?: string;
  order?: number;
  note?: string;
  born: number;
}

const yearOf = (s: string | undefined, fallback: number) => {
  const m = s?.match(/\d{4}/);
  return m ? Number(m[0]) : fallback;
};

/** Princes who never reigned but shaped the succession (selected, not exhaustive). */
const PRINCES: Omit<TreeNode, 'kind'>[] = [
  { id: 'p-suleyman-celebi', name: 'Süleyman Çelebi', sub: 'd. 1411', parent: 'bayezid-i', born: 1377, note: 'Held Edirne and the Balkans during the Interregnum after Ankara (1402); defeated by his brother Musa and killed in 1411.' },
  { id: 'p-musa-celebi', name: 'Musa Çelebi', sub: 'd. 1413', parent: 'bayezid-i', born: 1388, note: 'Overthrew Süleyman in 1411; defeated and killed by Mehmed I at Çamurlu in 1413, ending the Interregnum.' },
  { id: 'p-cem', name: 'Cem Sultan', sub: '1459 – 1495', parent: 'mehmed-ii', born: 1459, note: 'Fought his brother Bayezid II for the throne in 1481–82, then lived as a hostage of the Knights of Rhodes, the French and the Papacy until his death in 1495.' },
  { id: 'p-mustafa', name: 'Şehzade Mustafa', sub: 'c. 1515 – 1553', parent: 'suleiman-i', born: 1515, note: 'Süleyman’s popular eldest son, executed on his father’s orders in 1553 during the campaign against Iran.' },
  { id: 'p-mehmed', name: 'Şehzade Mehmed', sub: '1521 – 1543', parent: 'suleiman-i', born: 1521, note: 'Died of illness at Manisa; Sinan’s Şehzade Mosque was built in his memory.' },
  { id: 'p-bayezid', name: 'Şehzade Bayezid', sub: '1525 – 1561', parent: 'suleiman-i', born: 1525, note: 'Fought his brother Selim for the succession, fled to Safavid Iran and was handed over and executed with his sons in 1561.' },
];

function buildNodes(): TreeNode[] {
  const ertugrul = getFigure('ertugrul');
  const caliph = getFigure('abdulmejid-ii');
  const nodes: TreeNode[] = [{ id: 'ertugrul', kind: 'ancestor', name: 'Ertuğrul', sub: ertugrul?.lifespan ?? 'd. c. 1280', href: '/figures/ertugrul/', born: 1200, note: 'Father of Osman. Almost everything told about him comes from later tradition.' }];
  for (const r of rulers)
    nodes.push({ id: r.id, kind: 'ruler', name: r.name, sub: reignLabel(r), parent: r.fatherId ?? 'ertugrul', href: `/sultans/${r.id}/`, order: r.order, born: yearOf(r.born, r.reignStart - 30), note: r.turningPoint });
  for (const p of PRINCES) nodes.push({ ...p, kind: 'prince' });
  if (caliph) nodes.push({ id: caliph.id, kind: 'caliph', name: caliph.name, sub: 'Caliph only · 1922 – 1924', parent: 'abdulaziz', href: `/figures/${caliph.id}/`, born: 1868, note: 'Elected Caliph after the Sultanate was abolished — never Sultan.' });
  return nodes;
}

const NODE_W = 168;
const NODE_H = 64;
const COL = 186;
const ROW = 112;
const PAD = 40;

interface Laid extends TreeNode {
  x: number;
  y: number;
  depth: number;
}

interface Shape {
  pos: Map<string, number>;
  left: number[];
  right: number[];
}

/** Compact tidy-tree layout: each subtree is packed against its left sibling using per-generation contours. */
function layout(nodes: TreeNode[]) {
  const kids = new Map<string, TreeNode[]>();
  for (const n of nodes) if (n.parent) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n]);
  for (const list of kids.values()) list.sort((a, b) => a.born - b.born);
  const depthOf = new Map<string, number>();

  const build = (n: TreeNode, depth: number): Shape => {
    depthOf.set(n.id, depth);
    const ch = kids.get(n.id) ?? [];
    if (!ch.length) return { pos: new Map([[n.id, 0]]), left: [0], right: [0] };
    const accL: number[] = [];
    const accR: number[] = [];
    const placed: { s: Shape; off: number }[] = [];
    for (const c of ch) {
      const sh = build(c, depth + 1);
      let off = 0;
      if (placed.length) {
        off = -Infinity;
        for (let d = 0; d < Math.min(accR.length, sh.left.length); d++) off = Math.max(off, accR[d] - sh.left[d] + 1);
      }
      placed.push({ s: sh, off });
      sh.left.forEach((v, d) => (accL[d] = accL[d] === undefined ? v + off : Math.min(accL[d], v + off)));
      sh.right.forEach((v, d) => (accR[d] = accR[d] === undefined ? v + off : Math.max(accR[d], v + off)));
    }
    const center = (placed[0].off + placed[placed.length - 1].off) / 2;
    const pos = new Map<string, number>([[n.id, 0]]);
    for (const { s: sh, off } of placed) for (const [id, x] of sh.pos) pos.set(id, x + off - center);
    return { pos, left: [0, ...accL.map((v) => v - center)], right: [0, ...accR.map((v) => v - center)] };
  };

  const shape = build(nodes[0], 0);
  const min = Math.min(...shape.pos.values());
  const max = Math.max(...shape.pos.values());
  const laid = new Map<string, Laid>();
  for (const n of nodes) {
    const col = (shape.pos.get(n.id) ?? 0) - min;
    const depth = depthOf.get(n.id) ?? 0;
    laid.set(n.id, { ...n, depth, x: PAD + col * COL, y: PAD + depth * ROW });
  }
  const all = [...laid.values()];
  const width = PAD * 2 + (max - min) * COL + NODE_W;
  const height = PAD * 2 + Math.max(...all.map((n) => n.depth)) * ROW + NODE_H;
  return { all, byId: laid, width, height };
}

const kindStyle: Record<Kind, string> = {
  ancestor: 'border-dashed border-gold/50 bg-black/60',
  ruler: 'border-gold/50 bg-[#1a140c]',
  prince: 'border-dashed border-ivory/25 bg-black/50',
  caliph: 'border-emerald/70 bg-emerald/15',
};

export function DynastyTree() {
  const nodes = useMemo(buildNodes, []);
  const { all, byId, width, height } = useMemo(() => layout(nodes), [nodes]);
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const [selected, setSelected] = useState<string>('osman-i');
  const box = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, k: 0.6 });
  const drag = useRef<{ x: number; y: number; tx: number; ty: number; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; k: number } | null>(null);

  const rootX = byId.get('ertugrul')!.x + NODE_W / 2;
  const fit = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const k = clamp(el.clientWidth / width, el.clientWidth < 640 ? 0.6 : 0.62, 0.9);
    const x = width * k <= el.clientWidth ? (el.clientWidth - width * k) / 2 : el.clientWidth / 2 - rootX * k;
    setT({ k, x, y: 12 });
  }, [width, rootX]);

  useEffect(() => {
    fit();
    const ro = new ResizeObserver(fit);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [fit, view]);

  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const el = box.current;
    if (!el) return;
    const px = cx ?? el.clientWidth / 2;
    const py = cy ?? el.clientHeight / 2;
    setT((p) => {
      const k = clamp(p.k * factor, 0.25, 1.8);
      return { k, x: px - ((px - p.x) / p.k) * k, y: py - ((py - p.y) / p.k) * k };
    });
  }, []);

  const centerOn = useCallback(
    (id: string) => {
      const n = byId.get(id);
      const el = box.current;
      if (!n || !el) return;
      setT((p) => {
        const k = Math.max(p.k, 0.75);
        return { k, x: el.clientWidth / 2 - (n.x + NODE_W / 2) * k, y: el.clientHeight / 2 - (n.y + NODE_H / 2) * k };
      });
    },
    [byId],
  );

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Plain wheel scrolls the page; ctrl/⌘ + wheel (and trackpad pinch) zooms the tree.
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt, view]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), k: t.k };
      drag.current = null;
    } else drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = box.current!.getBoundingClientRect();
      const factor = (pinch.current.k * (d / pinch.current.d)) / t.k;
      zoomAt(factor, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      return;
    }
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 5) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (d.moved) setT((p) => ({ ...p, x: d.tx + dx, y: d.ty + dy }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    setTimeout(() => (drag.current = null), 0);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = 60;
    if (e.key === '+' || e.key === '=') zoomAt(1.2);
    else if (e.key === '-') zoomAt(1 / 1.2);
    else if (e.key === '0') fit();
    else if (e.target === e.currentTarget && e.key.startsWith('Arrow')) {
      e.preventDefault();
      setT((p) => ({ ...p, x: p.x + (e.key === 'ArrowLeft' ? step : e.key === 'ArrowRight' ? -step : 0), y: p.y + (e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0) }));
    }
  };

  const sel = byId.get(selected);
  const parentOf = sel?.parent ? byId.get(sel.parent) : undefined;
  const children = all.filter((n) => n.parent === selected).sort((a, b) => a.x - b.x);
  const select = (id: string) => {
    if (drag.current?.moved) return;
    setSelected(id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border hairline p-1" role="group" aria-label="View">
          {(
            [
              ['tree', 'Family tree', Network],
              ['list', 'List of sultans', List],
            ] as const
          ).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setView(id)} aria-pressed={view === id} className={cn('inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition', view === id ? 'bg-gold text-ink' : 'text-ivory/75 hover:text-ivory')}>
              <Icon className="h-4 w-4" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
        {view === 'tree' && (
          <label className="flex items-center gap-2 text-sm text-ivory/70">
            Jump to
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                centerOn(e.target.value);
              }}
              className="rounded-xl border hairline bg-black/60 px-3 py-2 text-sm text-ivory"
            >
              {all
                .filter((n) => n.kind !== 'prince')
                .sort((a, b) => (a.order ?? (a.kind === 'ancestor' ? 0 : 99)) - (b.order ?? (b.kind === 'ancestor' ? 0 : 99)))
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.order ? `${n.order}. ` : ''}
                    {n.name}
                  </option>
                ))}
            </select>
          </label>
        )}
      </div>

      {view === 'tree' ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_20rem]">
          <div className="relative">
            <div
              ref={box}
              tabIndex={0}
              role="application"
              aria-roledescription="zoomable family tree"
              aria-label="Family tree of the House of Osman. Drag to pan; use the plus and minus keys to zoom, arrow keys to move, 0 to reset."
              onKeyDown={onKey}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative h-[72vh] min-h-[480px] cursor-grab touch-none overflow-hidden rounded-[2rem] border hairline bg-[radial-gradient(80%_60%_at_50%_0%,#2a1d0e,#0a0908)] outline-none select-none active:cursor-grabbing focus-visible:border-gold/60"
            >
              <div className="pattern-girih pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
              <div className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `translate(${t.x}px, ${t.y}px) scale(${t.k})` }}>
                <svg width={width} height={height} className="absolute inset-0" aria-hidden="true">
                  {all
                    .filter((n) => n.parent)
                    .map((n) => {
                      const p = byId.get(n.parent!)!;
                      const x1 = p.x + NODE_W / 2;
                      const y1 = p.y + NODE_H;
                      const x2 = n.x + NODE_W / 2;
                      const y2 = n.y;
                      const my = (y1 + y2) / 2;
                      const onPath = n.id === selected || p.id === selected;
                      return (
                        <path
                          key={n.id}
                          d={`M${x1} ${y1}C${x1} ${my} ${x2} ${my} ${x2} ${y2}`}
                          fill="none"
                          stroke={n.kind === 'prince' ? '#8a8172' : n.kind === 'caliph' ? '#3e8a6e' : '#c9a24a'}
                          strokeOpacity={onPath ? 0.95 : 0.45}
                          strokeWidth={onPath ? 2.5 : 1.5}
                          strokeDasharray={n.kind === 'prince' || n.kind === 'caliph' ? '5 5' : undefined}
                        />
                      );
                    })}
                </svg>
                {all.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => select(n.id)}
                    aria-pressed={n.id === selected}
                    className={cn('absolute flex flex-col justify-center rounded-2xl border px-3 text-left shadow-lg shadow-black/40 transition', kindStyle[n.kind], n.id === selected && 'ring-2 ring-gold ring-offset-2 ring-offset-black')}
                    style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}
                  >
                    <span className="flex items-baseline gap-1.5">
                      {n.order && <span className="font-display text-sm text-gold">{n.order}</span>}
                      <span className={cn('truncate font-display text-[1.05rem] leading-tight', n.kind === 'prince' ? 'text-ivory/70' : 'text-ivory')}>{n.name}</span>
                    </span>
                    <span className="truncate text-[0.68rem] text-ash">{n.sub}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button onClick={() => zoomAt(1.25)} className="grid h-10 w-10 place-items-center rounded-full border hairline bg-black/70 text-ivory hover:border-gold/50" aria-label="Zoom in">
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
              <button onClick={() => zoomAt(1 / 1.25)} className="grid h-10 w-10 place-items-center rounded-full border hairline bg-black/70 text-ivory hover:border-gold/50" aria-label="Zoom out">
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <button onClick={fit} className="grid h-10 w-10 place-items-center rounded-full border hairline bg-black/70 text-ivory hover:border-gold/50" aria-label="Reset view">
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="pointer-events-none absolute left-5 top-4 text-[0.7rem] text-ivory/45">Drag to pan · ctrl/⌘ + scroll or pinch to zoom</p>
          </div>

          <aside className="rounded-[2rem] border hairline bg-white/[0.02] p-6" aria-live="polite">
            {sel && (
              <>
                <p className="label-caps text-gold">{sel.kind === 'ruler' ? `Sultan no. ${sel.order}` : sel.kind === 'prince' ? 'Prince (did not reign)' : sel.kind === 'caliph' ? 'Caliph — not Sultan' : 'Ancestor'}</p>
                <h3 className="mt-2 font-display text-3xl text-ivory">{sel.name}</h3>
                <p className="text-sm text-ash">{sel.sub}</p>
                {sel.note && <p className="mt-4 text-sm leading-relaxed text-ivory/75">{sel.note}</p>}
                <dl className="mt-5 space-y-3 text-sm">
                  {parentOf && (
                    <div>
                      <dt className="label-caps text-ash">Father</dt>
                      <dd>
                        <button onClick={() => setSelected(parentOf.id)} className="text-gold-light underline decoration-gold/40 underline-offset-2">
                          {parentOf.name}
                        </button>
                      </dd>
                    </div>
                  )}
                  {children.length > 0 && (
                    <div>
                      <dt className="label-caps text-ash">Sons shown in the tree</dt>
                      <dd className="mt-1 flex flex-wrap gap-1.5">
                        {children.map((c) => (
                          <button key={c.id} onClick={() => setSelected(c.id)} className="rounded-full border hairline px-2.5 py-1 text-xs text-ivory/80 hover:border-gold/50">
                            {c.name}
                          </button>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
                {sel.href && (
                  <Link href={sel.href} className="mt-6 inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-light">
                    Open profile →
                  </Link>
                )}
              </>
            )}
            <div className="mt-8 space-y-2 border-t hairline pt-5 text-xs text-ivory/60">
              <p className="flex items-center gap-2">
                <span className="h-3 w-5 rounded border border-gold/60 bg-[#1a140c]" /> Reigning sultan (numbered)
              </p>
              <p className="flex items-center gap-2">
                <span className="h-3 w-5 rounded border border-dashed border-ivory/40" /> Prince who did not reign
              </p>
              <p className="flex items-center gap-2">
                <span className="h-3 w-5 rounded border border-emerald/70 bg-emerald/20" /> Caliph only (1922–24)
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rulers.map((r) => {
            const father = r.fatherId ? rulers.find((x) => x.id === r.fatherId) : undefined;
            return (
              <li key={r.id}>
                <Link href={`/sultans/${r.id}/`} className="flex gap-4 rounded-2xl border hairline bg-white/[0.02] p-4 transition hover:border-gold/40">
                  <span className="font-display text-3xl text-gold/60">{r.order}</span>
                  <span>
                    <span className="block font-display text-xl text-ivory">{r.name}</span>
                    <span className="block text-xs text-ash">{reignLabel(r)}</span>
                    <span className="mt-1 block text-xs text-ivory/60">Son of {father ? father.name : r.father}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
