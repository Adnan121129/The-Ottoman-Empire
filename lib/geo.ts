import { geoConicConformal } from 'd3-geo';
import { PROJECTION, MAP_WIDTH, MAP_HEIGHT } from '@/data/generated/basemap';
import type { LonLat } from '@/data/territories';

/**
 * The single projection shared by every map on the site. Its parameters are
 * generated together with the land geometry by scripts/build-land.mjs, so
 * projected points line up exactly with the coastline.
 */
const projection = geoConicConformal()
  .parallels(PROJECTION.parallels)
  .rotate(PROJECTION.rotate)
  .scale(PROJECTION.scale)
  .translate(PROJECTION.translate);

export { MAP_WIDTH, MAP_HEIGHT };

export function project(p: LonLat): [number, number] {
  const r = projection(p);
  // Rounded so server- and client-rendered SVG attributes match exactly.
  return r ? [Math.round(r[0] * 100) / 100, Math.round(r[1] * 100) / 100] : [0, 0];
}

const f = (n: number) => n.toFixed(1);

function signedArea(pts: [number, number][]) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

/**
 * Planar SVG path for polygon rings. Rings are normalised to the same winding
 * so overlapping rings never cancel out under the non-zero fill rule.
 */
export function ringsToPath(rings: LonLat[][]): string {
  return rings
    .map((ring) => {
      let pts = ring.map(project);
      if (signedArea(pts) < 0) pts = pts.slice().reverse();
      return 'M' + pts.map(([x, y]) => `${f(x)},${f(y)}`).join('L') + 'Z';
    })
    .join('');
}

/** Smooth open curve through points (Catmull–Rom converted to cubic Béziers). */
export function smoothLine(points: LonLat[], tension = 0.5): string {
  const pts = points.map(project);
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M${f(pts[0][0])},${f(pts[0][1])}L${f(pts[1][0])},${f(pts[1][1])}`;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = tension / 3;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += `C${f(c1[0])},${f(c1[1])},${f(c2[0])},${f(c2[1])},${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

/** Angle (degrees) of the final segment — used to orient arrowheads. */
export function endAngle(points: LonLat[]): number {
  const a = project(points[points.length - 2]);
  const b = project(points[points.length - 1]);
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
}

/** Projected bounding box → SVG viewBox with padding and a target aspect ratio. */
export function viewBoxFor(bounds: [number, number, number, number], aspect = 4 / 3, pad = 0.06): [number, number, number, number] {
  const [lon0, lat0, lon1, lat1] = bounds;
  const corners: LonLat[] = [[lon0, lat0], [lon1, lat0], [lon0, lat1], [lon1, lat1], [(lon0 + lon1) / 2, lat1], [(lon0 + lon1) / 2, lat0]];
  const pts = corners.map(project);
  let x0 = Math.min(...pts.map((p) => p[0]));
  let x1 = Math.max(...pts.map((p) => p[0]));
  let y0 = Math.min(...pts.map((p) => p[1]));
  let y1 = Math.max(...pts.map((p) => p[1]));
  let w = x1 - x0;
  let h = y1 - y0;
  x0 -= w * pad;
  y0 -= h * pad;
  w *= 1 + pad * 2;
  h *= 1 + pad * 2;
  if (w / h > aspect) {
    const nh = w / aspect;
    y0 -= (nh - h) / 2;
    h = nh;
  } else {
    const nw = h * aspect;
    x0 -= (nw - w) / 2;
    w = nw;
  }
  x1 = x0 + w;
  y1 = y0 + h;
  return [x0, y0, w, h];
}
