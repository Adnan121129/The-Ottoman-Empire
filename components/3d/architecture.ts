import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Procedural, stylized Ottoman architecture.
 * These are artistic simplifications for atmosphere and explanation — not
 * measured reconstructions. Units are arbitrary; a classical mosque is ~6 units wide.
 */

type G = THREE.BufferGeometry;

function place(g: G, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, ry = 0): G {
  const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(sx, sy, sz));
  g.applyMatrix4(m);
  return g;
}

export const dome = (r: number, seg = 20) => new THREE.SphereGeometry(r, seg, Math.max(6, seg / 2), 0, Math.PI * 2, 0, Math.PI / 2);
export const halfDome = (r: number, seg = 16) => new THREE.SphereGeometry(r, seg, Math.max(5, seg / 2), 0, Math.PI, 0, Math.PI / 2);
const cyl = (rt: number, rb: number, h: number, seg = 12) => new THREE.CylinderGeometry(rt, rb, h, seg);
const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
const cone = (r: number, h: number, seg = 12) => new THREE.ConeGeometry(r, h, seg);

/** A pencil minaret with `balconies` şerefe rings. */
export function minaret(height: number, balconies: number, r = 0.13): G[] {
  const parts: G[] = [];
  parts.push(place(box(r * 3.2, 0.5, r * 3.2), 0, 0.25, 0));
  parts.push(place(cyl(r, r * 1.15, height, 10), 0, height / 2 + 0.5, 0));
  for (let i = 0; i < balconies; i++) {
    const y = 0.5 + height * (0.55 + (0.35 * i) / Math.max(1, balconies - 1 || 1));
    parts.push(place(cyl(r * 1.9, r * 1.6, 0.09, 12), 0, y, 0));
  }
  parts.push(place(cone(r * 1.12, height * 0.16, 10), 0, height + 0.5 + height * 0.08, 0));
  return parts;
}

export interface MosqueSpec {
  width?: number;
  domeR?: number;
  semi?: 0 | 2 | 4;
  minarets?: number;
  minaretH?: number;
  balconies?: number;
  octagon?: boolean;
  /** 'classic': minarets where hall meets courtyard; 'corners': at the four corners of the prayer hall (Selimiye). */
  minaretLayout?: 'classic' | 'corners';
}

/** Classical imperial mosque: base, drum, central dome, semi-domes, corner domes and minarets. */
export function mosqueParts(spec: MosqueSpec = {}): { body: G[]; dome: G[]; semi: G[]; drum: G[]; minarets: G[]; gold: G[] } {
  const w = spec.width ?? 4;
  const r = spec.domeR ?? w * 0.32;
  const baseH = w * 0.38;
  const body: G[] = [place(box(w, baseH, w), 0, baseH / 2, 0)];
  // Courtyard (avlu) in front
  body.push(place(box(w * 0.9, baseH * 0.45, w * 0.8), 0, baseH * 0.225, w * 0.85));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) body.push(place(dome(w * 0.11, 10), sx * w * 0.38, baseH, sz * w * 0.38));
  const drum: G[] = [place(spec.octagon ? cyl(r * 1.02, r * 1.08, w * 0.12, 8) : cyl(r * 1.0, r * 1.04, w * 0.12, 20), 0, baseH + w * 0.06, 0)];
  // Weight turrets around the drum
  const turretCount = spec.octagon ? 8 : 4;
  for (let i = 0; i < turretCount; i++) {
    const a = (i / turretCount) * Math.PI * 2 + Math.PI / turretCount;
    drum.push(place(cyl(w * 0.05, w * 0.06, w * 0.2, 8), Math.cos(a) * r * 1.1, baseH + w * 0.1, Math.sin(a) * r * 1.1));
  }
  const domeY = baseH + w * 0.12;
  const domeG = [place(dome(r, 28), 0, domeY, 0)];
  const semi: G[] = [];
  const semiR = r * 0.72;
  if (spec.semi === 2 || spec.semi === 4) {
    semi.push(place(halfDome(semiR), 0, baseH, r * 0.98, 1, 1, 1, Math.PI / 2));
    semi.push(place(halfDome(semiR), 0, baseH, -r * 0.98, 1, 1, 1, -Math.PI / 2));
  }
  if (spec.semi === 4) {
    semi.push(place(halfDome(semiR), r * 0.98, baseH, 0, 1, 1, 1, Math.PI));
    semi.push(place(halfDome(semiR), -r * 0.98, baseH, 0, 1, 1, 1, 0));
  }
  const gold = [place(cyl(0.02 * w, 0.02 * w, w * 0.2, 6), 0, domeY + r + w * 0.08, 0), place(new THREE.SphereGeometry(w * 0.03, 8, 6), 0, domeY + r + w * 0.02, 0)];
  const minaretsG: G[] = [];
  const n = spec.minarets ?? 4;
  const mh = spec.minaretH ?? w * 1.25;
  const positions: [number, number][] =
    spec.minaretLayout === 'corners'
      ? [[-1, -1], [1, -1], [-1, 1], [1, 1]]
      : n === 6
        ? [[-1, -1], [1, -1], [-1, 0.95], [1, 0.95], [-1, 1.75], [1, 1.75]]
        : n === 4
          ? [[-1, 0.95], [1, 0.95], [-1, 1.75], [1, 1.75]]
          : n === 2
            ? [[-1, 0.95], [1, 0.95]]
            : [[1, 0.95]];
  for (const [px, pz] of positions.slice(0, n)) {
    const tall = pz < 1.5 ? mh : mh * 0.82;
    for (const g of minaret(tall, spec.balconies ?? 3, w * 0.035)) minaretsG.push(place(g, px * w * 0.56, 0, pz * w * 0.52));
  }
  return { body, dome: domeG, semi, drum, minarets: minaretsG, gold };
}

export function mosqueGeometry(spec: MosqueSpec = {}): { stone: G; gold: G } {
  const p = mosqueParts(spec);
  return { stone: mergeGeometries([...p.body, ...p.drum, ...p.dome, ...p.semi, ...p.minarets].map(nonIndexed)), gold: mergeGeometries(p.gold.map(nonIndexed)) };
}

/** Hagia Sophia: broad, low dome with buttresses and four minarets of different eras. */
export function hagiaSophiaGeometry(): { stone: G; gold: G } {
  const parts: G[] = [];
  parts.push(place(box(5.4, 2.0, 4.4), 0, 1.0, 0));
  parts.push(place(box(5.8, 1.1, 5.2), 0, 0.55, 0));
  for (const s of [-1, 1]) parts.push(place(box(0.7, 2.6, 1.2), s * 2.4, 1.3, 0));
  parts.push(place(cyl(1.55, 1.6, 0.35, 40), 0, 2.15, 0));
  parts.push(place(dome(1.6, 32), 0, 2.3, 0, 1, 0.62, 1));
  parts.push(place(halfDome(1.15), 0, 2.0, 1.45, 1, 0.7, 1, Math.PI / 2));
  parts.push(place(halfDome(1.15), 0, 2.0, -1.45, 1, 0.7, 1, -Math.PI / 2));
  const heights = [4.4, 4.7, 4.9, 4.9];
  [[-2.9, -2.4], [2.9, -2.4], [-2.9, 2.4], [2.9, 2.4]].forEach(([x, z], i) => minaret(heights[i], i < 2 ? 1 : 2, 0.13).forEach((g) => parts.push(place(g, x, 0, z))));
  const gold = [place(cyl(0.035, 0.035, 0.35, 6), 0, 3.45, 0)];
  return { stone: mergeGeometries(parts.map(nonIndexed)), gold: mergeGeometries(gold.map(nonIndexed)) };
}

export function towerGeometry(height = 6, r = 0.65): G {
  const parts = [place(cyl(r * 0.92, r, height, 18), 0, height / 2, 0), place(cyl(r * 1.12, r * 1.12, 0.35, 18), 0, height * 0.86, 0), place(cone(r * 1.15, height * 0.32, 18), 0, height + height * 0.16, 0)];
  return mergeGeometries(parts.map(nonIndexed));
}

/** Low palace ranges with a tower — stylized Topkapı/Dolmabahçe. */
export function palaceGeometry(len = 8, withTower = true): G {
  const parts: G[] = [];
  for (let i = 0; i < 4; i++) parts.push(place(box(len * (0.35 + 0.15 * (i % 2)), 0.9 + (i % 3) * 0.25, 1.6), (i - 1.5) * len * 0.26, 0.5 + (i % 3) * 0.12, (i % 2) * 1.2 - 0.6));
  for (let i = 0; i < 5; i++) parts.push(place(dome(0.35, 10), (i - 2) * len * 0.18, 1.25, -0.2));
  if (withTower) {
    parts.push(place(box(0.7, 3.2, 0.7), len * 0.08, 1.6, 0.4));
    parts.push(place(cone(0.55, 1.2, 4), len * 0.08, 3.8, 0.4, 1, 1, 1, Math.PI / 4));
  }
  return mergeGeometries(parts.map(nonIndexed));
}

/** Grid of small domes — stylized covered bazaar. */
export function bazaarGeometry(cols = 5, rows = 4): G {
  const parts: G[] = [place(box(cols * 0.9, 0.7, rows * 0.9), 0, 0.35, 0)];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) parts.push(place(dome(0.36, 10), (i - (cols - 1) / 2) * 0.9, 0.7, (j - (rows - 1) / 2) * 0.9));
  return mergeGeometries(parts.map(nonIndexed));
}

export function nonIndexed(g: G): G {
  const ng = g.index ? g.toNonIndexed() : g;
  // Keep only attributes shared by every primitive so they can be merged.
  for (const key of Object.keys(ng.attributes)) if (!['position', 'normal'].includes(key)) ng.deleteAttribute(key);
  return ng;
}

/** Shared noise helpers for shaders. */
export const GLSL_NOISE = /* glsl */ `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`;
