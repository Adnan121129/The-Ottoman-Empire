'use client';

import { Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mosqueParts, nonIndexed, type MosqueSpec } from './architecture';

export type MosquePreset = 'suleymaniye' | 'selimiye' | 'sehzade';

export const MOSQUE_PRESETS: Record<MosquePreset, { label: string; spec: MosqueSpec }> = {
  sehzade: { label: 'Şehzade (1543–48)', spec: { width: 4, semi: 4, minarets: 2, minaretH: 4.6, balconies: 2 } },
  suleymaniye: { label: 'Süleymaniye (1550–57)', spec: { width: 4.4, semi: 2, minarets: 4, minaretH: 5.6, balconies: 3 } },
  selimiye: { label: 'Selimiye (1568–75)', spec: { width: 4.4, domeR: 1.6, semi: 0, minarets: 4, minaretH: 7.2, balconies: 3, octagon: true, minaretLayout: 'corners' } },
};

const merge = (gs: THREE.BufferGeometry[]) => (gs.length ? mergeGeometries(gs.map(nonIndexed)) : null);

function Mosque({ preset, explode, labels }: { preset: MosquePreset; explode: number; labels: boolean }) {
  const parts = useMemo(() => {
    const p = mosqueParts(MOSQUE_PRESETS[preset].spec);
    return { body: merge(p.body)!, drum: merge(p.drum)!, semi: merge(p.semi), dome: merge(p.dome)!, minarets: merge(p.minarets)!, gold: merge(p.gold)! };
  }, [preset]);
  const g = useRef<Record<string, THREE.Object3D | null>>({});
  const e = useRef(explode);
  useFrame(() => {
    e.current += (explode - e.current) * 0.08;
    const k = e.current;
    if (g.current.drum) g.current.drum.position.y = k * 1.4;
    if (g.current.semi) g.current.semi.position.y = k * 2.3;
    if (g.current.dome) g.current.dome.position.y = k * 3.6;
    if (g.current.gold) g.current.gold.position.y = k * 3.6;
    if (g.current.minarets) g.current.minarets.scale.set(1 + k * 0.35, 1, 1 + k * 0.35);
  });
  const stone = <meshStandardMaterial color="#d9cdb3" roughness={0.85} />;
  const lead = <meshStandardMaterial color="#7b838c" roughness={0.45} metalness={0.55} />;
  const show = labels && explode > 0.35;
  const w = MOSQUE_PRESETS[preset].spec.width ?? 4;
  const label = (text: string, y: number, x = w * 0.75) =>
    show && (
      <Html position={[x, y, 0]} center distanceFactor={9} zIndexRange={[10, 0]}>
        <span className="whitespace-nowrap rounded-full border border-gold/40 bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-gold-light">{text}</span>
      </Html>
    );
  return (
    <group position={[0, 0, -w * 0.25]}>
      <mesh geometry={parts.body} castShadow receiveShadow ref={(o) => void (g.current.body = o)}>
        {stone}
      </mesh>
      <mesh geometry={parts.drum} ref={(o) => void (g.current.drum = o)}>
        {stone}
      </mesh>
      {parts.semi && (
        <mesh geometry={parts.semi} ref={(o) => void (g.current.semi = o)}>
          {lead}
        </mesh>
      )}
      <mesh geometry={parts.dome} ref={(o) => void (g.current.dome = o)}>
        {lead}
      </mesh>
      <mesh geometry={parts.gold} ref={(o) => void (g.current.gold = o)}>
        <meshStandardMaterial color="#d6a64e" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh geometry={parts.minarets} ref={(o) => void (g.current.minarets = o)}>
        {stone}
      </mesh>
      {label('Prayer hall walls & buttresses', w * 0.25)}
      {label(MOSQUE_PRESETS[preset].spec.octagon ? 'Drum on eight piers (octagon)' : 'Drum with weight turrets', w * 0.45 + explode * 1.4)}
      {parts.semi && label('Semi-domes', w * 0.5 + explode * 2.3, -w * 0.75)}
      {label('Central dome (lead-covered)', w * 0.75 + explode * 3.6)}
      {label('Minarets with balconies (şerefe)', w * 1.1, w * 0.9)}
    </group>
  );
}

export default function MosqueModel({ active, quality, preset, explode, labels = true }: { active: boolean; quality: 'high' | 'medium' | 'low'; preset: MosquePreset; explode: number; labels?: boolean }) {
  return (
    <Canvas camera={{ position: [9, 6, 11], fov: 38 }} dpr={quality === 'high' ? [1, 1.75] : 1} frameloop={active ? 'always' : 'never'} gl={{ antialias: quality !== 'low' }}>
      <color attach="background" args={['#0f0c09']} />
      <fog attach="fog" args={['#0f0c09', 22, 46]} />
      <hemisphereLight args={['#ffe2b8', '#2a1d14', 0.75]} />
      <directionalLight position={[8, 12, 6]} intensity={1.9} color="#ffd9a3" />
      <directionalLight position={[-6, 4, -8]} intensity={0.35} color="#8aa0d0" />
      <Mosque preset={preset} explode={explode} labels={labels} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial color="#1e1812" roughness={1} />
      </mesh>
      <OrbitControls enablePan={false} minDistance={7} maxDistance={24} maxPolarAngle={Math.PI / 2.1} autoRotate autoRotateSpeed={0.5} target={[0, 2, 0]} />
    </Canvas>
  );
}
