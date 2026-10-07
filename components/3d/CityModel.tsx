'use client';

import { Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { buildings } from '@/data/buildings';
import type { Building } from '@/data/types';
import { useSettings } from '@/lib/providers';
import { mulberry32 } from '@/lib/utils';
import { bazaarGeometry, hagiaSophiaGeometry, mosqueGeometry, nonIndexed, palaceGeometry, towerGeometry } from './architecture';

/**
 * Stylized 3D map of Ottoman Istanbul. Coastlines are simplified by hand from
 * modern geography (1 scene unit ≈ 200 m); landmark sizes are exaggerated for
 * legibility. Artistic reconstruction — not a survey.
 */

const LON0 = 28.972;
const LAT0 = 41.02;
const KX = 420; // units per degree of longitude at 41°N (≈ 84 km / 200 m)
const KY = 556; // units per degree of latitude (≈ 111 km / 200 m)

type LL = [number, number];
const toXY = ([lon, lat]: LL): [number, number] => [(lon - LON0) * KX, (lat - LAT0) * KY];
const toScene = (lon: number, lat: number) => new THREE.Vector3((lon - LON0) * KX, 0, -(lat - LAT0) * KY);

// European shore, wrapping round the Golden Horn and up the Bosphorus.
const EUROPE: LL[] = [
  [28.988, 41.0165], [28.979, 41.0175], [28.972, 41.0185], [28.962, 41.0245], [28.95, 41.033], [28.941, 41.042], [28.934, 41.049], [28.933, 41.057],
  [28.942, 41.051], [28.95, 41.0425], [28.963, 41.0345], [28.97, 41.0268], [28.978, 41.0228], [28.984, 41.0262], [28.991, 41.0332], [28.999, 41.0386],
  [29.008, 41.0415], [29.026, 41.0465], [29.035, 41.058], [29.045, 41.075], [29.05, 41.1], [28.84, 41.1], [28.84, 40.972], [28.9, 40.982],
  [28.922, 40.9915], [28.937, 40.998], [28.952, 41.0015], [28.965, 41.0015], [28.977, 41.002], [28.983, 41.0045], [28.988, 41.0105],
];
const ASIA: LL[] = [
  [29.072, 41.1], [29.058, 41.072], [29.048, 41.05], [29.036, 41.0385], [29.023, 41.0305], [29.012, 41.0262], [29.004, 41.0205], [29.008, 41.0115],
  [29.017, 40.9975], [29.022, 40.99], [29.025, 40.978], [29.04, 40.972], [29.16, 40.972], [29.16, 41.1],
];
// Theodosian land walls, Golden Gate (Yedikule) to Blachernae.
const LAND_WALLS: LL[] = [
  [28.9225, 40.9925], [28.922, 41.0], [28.9205, 41.0075], [28.92, 41.0155], [28.9215, 41.0215], [28.926, 41.0265], [28.9335, 41.0302], [28.9375, 41.0352], [28.9405, 41.0398], [28.9415, 41.0425],
];
// Shore of the walled city (Golden Horn then Marmara), used for sea walls and house placement.
const WALLED: LL[] = [
  ...LAND_WALLS,
  [28.95, 41.0335], [28.962, 41.025], [28.972, 41.019], [28.979, 41.018], [28.9875, 41.0165], [28.988, 41.0105], [28.983, 41.005], [28.977, 41.0025], [28.965, 41.002], [28.952, 41.002], [28.937, 40.9985],
];
const DISTRICTS: { ring: LL[]; from: number }[] = [
  { ring: WALLED, from: 0 },
  { ring: [[28.962, 41.0335], [28.97, 41.0272], [28.978, 41.0232], [28.986, 41.0275], [28.982, 41.036], [28.97, 41.038]], from: 0 }, // Galata
  { ring: [[29.006, 41.0215], [29.013, 41.027], [29.024, 41.0315], [29.03, 41.025], [29.02, 41.015], [29.01, 41.013]], from: 1453 }, // Üsküdar
  { ring: [[28.982, 41.036], [28.986, 41.0285], [28.993, 41.0345], [29.005, 41.042], [28.995, 41.05], [28.98, 41.045]], from: 1800 }, // Pera & Beşiktaş
  { ring: [[29.019, 40.9995], [29.024, 40.991], [29.04, 40.988], [29.04, 41.0]], from: 1800 }, // Kadıköy
];
const LABELS: { text: string; at: LL; kind: 'water' | 'land' }[] = [
  { text: 'Golden Horn', at: [28.958, 41.0345], kind: 'water' },
  { text: 'Bosphorus', at: [29.012, 41.035], kind: 'water' },
  { text: 'Sea of Marmara', at: [28.965, 40.992], kind: 'water' },
  { text: 'Galata · Pera', at: [28.978, 41.033], kind: 'land' },
  { text: 'Üsküdar', at: [29.03, 41.02], kind: 'land' },
  { text: 'Land walls', at: [28.914, 41.022], kind: 'land' },
];

function inside(p: LL, ring: LL[]) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function landGeometry(ring: LL[]) {
  const shape = new THREE.Shape(ring.map((p) => new THREE.Vector2(...toXY(p))));
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.6, bevelEnabled: true, bevelSize: 0.25, bevelThickness: 0.2, bevelSegments: 2, curveSegments: 4 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -0.8, 0);
  return g;
}

function wallGeometry(line: LL[], height: number, towerEvery: number) {
  const parts: THREE.BufferGeometry[] = [];
  let acc = 0;
  for (let i = 0; i < line.length - 1; i++) {
    const a = toScene(...line[i]);
    const b = toScene(...line[i + 1]);
    const len = a.distanceTo(b);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const seg = new THREE.BoxGeometry(len, height, 0.12);
    seg.rotateY(-Math.atan2(b.z - a.z, b.x - a.x));
    seg.translate(mid.x, height / 2, mid.z);
    parts.push(seg);
    if (towerEvery) {
      for (let d = (towerEvery - (acc % towerEvery)) % towerEvery; d < len; d += towerEvery) {
        const p = a.clone().lerp(b, d / len);
        const t = new THREE.BoxGeometry(0.22, height * 1.5, 0.22);
        t.translate(p.x, (height * 1.5) / 2, p.z);
        parts.push(t);
      }
    }
    acc += len;
  }
  return mergeGeometries(parts.map(nonIndexed));
}

const QIBLA_ROT = -2.64; // courtyards face north-north-west, prayer halls toward Mecca

function landmarkGeometry(b: Building, year: number): { stone: THREE.BufferGeometry; gold?: THREE.BufferGeometry; scale: number; rot: number } {
  switch (b.istanbul!.model) {
    case 'hagia-sophia': {
      // Minarets were added after 1453; shown approximately: none in 1453, two by the mid-16th century, four after Sinan’s additions.
      const g = hagiaSophiaGeometry(year <= 1453 ? 0 : year < 1570 ? 2 : 4);
      return { ...g, scale: 0.34, rot: -0.2 };
    }
    case 'mosque': {
      const spec = b.id === 'blue-mosque' ? { width: 4.2, semi: 4 as const, minarets: 6, minaretH: 5.6, balconies: 3 } : { width: 4.4, semi: 2 as const, minarets: 4, minaretH: 5.6, balconies: 3 };
      return { ...mosqueGeometry(spec), scale: 0.36, rot: QIBLA_ROT };
    }
    case 'mosque-small':
      return { ...mosqueGeometry({ width: 3.2, semi: b.id === 'sehzade' ? 4 : 2, minarets: 2, minaretH: 4, balconies: 2 }), scale: 0.34, rot: QIBLA_ROT };
    case 'palace':
      return b.id === 'dolmabahce' ? { stone: palaceGeometry(11, false), scale: 0.3, rot: -0.55 } : { stone: palaceGeometry(8), scale: 0.32, rot: 0.75 };
    case 'bazaar':
      return { stone: bazaarGeometry(5, 4), scale: 0.32, rot: 0.3 };
    case 'tower':
      return { stone: towerGeometry(6, 0.6), scale: 0.3, rot: 0 };
    default:
      return { stone: towerGeometry(3, 1), scale: 0.3, rot: 0 };
  }
}

function Houses({ year, count, avoid }: { year: number; count: number; avoid: THREE.Vector3[] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const roof = useRef<THREE.InstancedMesh>(null);
  const placed = useMemo(() => {
    const rnd = mulberry32(1453);
    const zones = DISTRICTS.filter((d) => year >= d.from);
    const out: { x: number; z: number; w: number; d: number; h: number; r: number; c: number }[] = [];
    let guard = 0;
    while (out.length < count && guard++ < count * 40) {
      const zone = zones[Math.floor(rnd() * zones.length)];
      const lons = zone.ring.map((p) => p[0]);
      const lats = zone.ring.map((p) => p[1]);
      const p: LL = [Math.min(...lons) + rnd() * (Math.max(...lons) - Math.min(...lons)), Math.min(...lats) + rnd() * (Math.max(...lats) - Math.min(...lats))];
      if (!inside(p, zone.ring)) continue;
      const v = toScene(...p);
      if (avoid.some((a) => a.distanceToSquared(v) < 2.6)) continue;
      out.push({ x: v.x, z: v.z, w: 0.18 + rnd() * 0.22, d: 0.18 + rnd() * 0.2, h: 0.14 + rnd() * 0.22, r: rnd() * Math.PI, c: rnd() });
    }
    return out;
  }, [year, count, avoid]);

  useEffect(() => {
    const m = mesh.current;
    const rf = roof.current;
    if (!m || !rf) return;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    placed.forEach((h, i) => {
      o.position.set(h.x, h.h / 2, h.z);
      o.rotation.set(0, h.r, 0);
      o.scale.set(h.w, h.h, h.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, col.set(h.c < 0.55 ? '#b49a78' : h.c < 0.85 ? '#d8c8a8' : '#8a6a4a'));
      o.position.set(h.x, h.h + 0.05, h.z);
      o.scale.set(h.w * 1.05, 0.1, h.d * 1.05);
      o.updateMatrix();
      rf.setMatrixAt(i, o.matrix);
    });
    m.count = rf.count = placed.length;
    m.instanceMatrix.needsUpdate = rf.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [placed]);

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={roof} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8c3b26" roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

function Landmark({ b, year, selected, onSelect }: { b: Building; year: number; selected: boolean; onSelect: (id: string) => void }) {
  const geo = useMemo(() => landmarkGeometry(b, year), [b, year]);
  const pos = useMemo(() => toScene(b.istanbul!.lon, b.istanbul!.lat), [b]);
  const unfinished = b.endYear > year && b.type === 'mosque' && b.istanbul!.model !== 'hagia-sophia';
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = selected ? 1.12 : 1;
    const s = ref.current.scale.x + (target - ref.current.scale.x) * Math.min(1, dt * 6);
    ref.current.scale.setScalar(s);
  });
  return (
    <group position={pos}>
      <group ref={ref}>
        <group
          scale={[geo.scale, unfinished ? geo.scale * 0.55 : geo.scale, geo.scale]}
          rotation-y={geo.rot}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(b.id);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <mesh geometry={geo.stone}>
            <meshStandardMaterial color={selected ? '#f1e2bd' : '#d9cdb3'} roughness={0.8} transparent={unfinished} opacity={unfinished ? 0.55 : 1} emissive={selected ? '#5a3a10' : '#000000'} />
          </mesh>
          {geo.gold && !unfinished && (
            <mesh geometry={geo.gold}>
              <meshStandardMaterial color="#d6ad55" metalness={0.9} roughness={0.3} />
            </mesh>
          )}
        </group>
      </group>
      <Html position={[0, 2.6, 0]} center distanceFactor={26} zIndexRange={[20, 0]}>
        <button
          onClick={() => onSelect(b.id)}
          aria-pressed={selected}
          className={`whitespace-nowrap rounded-full border px-3 py-1 text-[13px] font-semibold shadow-lg transition ${selected ? 'border-gold bg-gold text-[#0a0908]' : 'border-gold/40 bg-black/70 text-[#ecd9a6] hover:bg-black'}`}
        >
          {b.name.replace(/ Mosque$/, '')}
          {unfinished ? ' (building)' : ''}
        </button>
      </Html>
    </group>
  );
}

const HOME_TARGET = new THREE.Vector3(1, 0, 1);
const HOME_POS = new THREE.Vector3(10, 26, 30);

function FlyTo({ focus, instant }: { focus: THREE.Vector3 | null; instant: boolean }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const anim = useRef<{ t: number; fromP: THREE.Vector3; toP: THREE.Vector3; fromT: THREE.Vector3; toT: THREE.Vector3 } | null>(null);
  const key = focus ? `${focus.x.toFixed(2)},${focus.z.toFixed(2)}` : 'home';
  useEffect(() => {
    if (!controls) return;
    const toT = focus ? focus.clone() : HOME_TARGET.clone();
    let toP: THREE.Vector3;
    if (focus) {
      const dir = camera.position.clone().sub(controls.target).setY(0).normalize();
      toP = toT.clone().add(dir.multiplyScalar(9)).setY(7);
    } else toP = HOME_POS.clone();
    anim.current = { t: instant ? 1 : 0, fromP: camera.position.clone(), toP, fromT: controls.target.clone(), toT };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, controls]);
  useFrame((_, dt) => {
    const a = anim.current;
    if (!a || !controls) return;
    a.t = Math.min(1, a.t + dt / 1.4);
    const k = 1 - Math.pow(1 - a.t, 3);
    camera.position.lerpVectors(a.fromP, a.toP, k);
    controls.target.lerpVectors(a.fromT, a.toT, k);
    controls.update();
    if (a.t >= 1) anim.current = null;
  });
  return null;
}

function Scene({ eraYear, selectedId, onSelect, quality, reducedMotion }: { eraYear: number; selectedId: string | null; onSelect: (id: string | null) => void; quality: 'high' | 'medium' | 'low'; reducedMotion: boolean }) {
  const europe = useMemo(() => landGeometry(EUROPE), []);
  const asia = useMemo(() => landGeometry(ASIA), []);
  const walls = useMemo(() => wallGeometry(LAND_WALLS, 0.34, 0.9), []);
  const seaWalls = useMemo(() => wallGeometry(WALLED.slice(LAND_WALLS.length - 1).concat([WALLED[0]]), 0.16, 0), []);
  const visible = useMemo(() => buildings.filter((b) => b.istanbul && b.startYear <= eraYear), [eraYear]);
  const avoid = useMemo(() => visible.map((b) => toScene(b.istanbul!.lon, b.istanbul!.lat)), [visible]);
  const sel = visible.find((b) => b.id === selectedId);
  const focus = sel ? toScene(sel.istanbul!.lon, sel.istanbul!.lat) : null;
  const houseCount = quality === 'high' ? 1600 : quality === 'medium' ? 900 : 450;

  return (
    <>
      <color attach="background" args={['#0f1518']} />
      <fog attach="fog" args={['#0f1518', 40, 95]} />
      <hemisphereLight args={['#ffe6c0', '#14222a', 0.9]} />
      <directionalLight position={[-20, 30, 12]} intensity={1.7} color="#ffd8a0" />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.12, 0]} onClick={() => onSelect(null)}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#1b3a44" roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh geometry={europe}>
        <meshStandardMaterial color="#4f4232" roughness={0.95} />
      </mesh>
      <mesh geometry={asia}>
        <meshStandardMaterial color="#4a3f30" roughness={0.95} />
      </mesh>
      <mesh geometry={walls}>
        <meshStandardMaterial color="#b9a888" roughness={0.9} />
      </mesh>
      <mesh geometry={seaWalls}>
        <meshStandardMaterial color="#a8987a" roughness={0.9} />
      </mesh>
      <Houses year={eraYear} count={houseCount} avoid={avoid} />
      {visible.map((b) => (
        <Landmark key={b.id} b={b} year={eraYear} selected={b.id === selectedId} onSelect={onSelect} />
      ))}
      {LABELS.map((l) => {
        const p = toScene(...l.at);
        return (
          <Html key={l.text} position={[p.x, 0.4, p.z]} center distanceFactor={30} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
            <span className={`whitespace-nowrap font-display text-[15px] tracking-wide ${l.kind === 'water' ? 'italic text-[#9cc3cc]/80' : 'uppercase text-[#e8d6a8]/60'}`}>{l.text}</span>
          </Html>
        );
      })}
      <OrbitControls makeDefault enablePan maxPolarAngle={Math.PI / 2.3} minDistance={5} maxDistance={70} target={HOME_TARGET.toArray()} />
      <FlyTo focus={focus} instant={reducedMotion} />
    </>
  );
}

export default function CityModel({
  active,
  quality,
  eraYear,
  selectedId,
  onSelect,
}: {
  active: boolean;
  quality: 'high' | 'medium' | 'low';
  eraYear: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { reducedMotion } = useSettings();
  return (
    <Canvas camera={{ position: HOME_POS.toArray(), fov: 42 }} dpr={quality === 'high' ? [1, 1.75] : 1} frameloop={active ? 'always' : 'never'} gl={{ antialias: quality !== 'low' }}>
      <Scene eraYear={eraYear} selectedId={selectedId} onSelect={onSelect} quality={quality} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
