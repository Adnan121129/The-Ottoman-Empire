'use client';

import { Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

/**
 * Stylized 16th-century Mediterranean war galley (kadırga), artistic
 * reconstruction based on general descriptions of the type — not a specific ship.
 */

const L = 16; // length
const B = 2.6; // beam

function hullGeometry() {
  return new ParametricGeometry(
    (u: number, v: number, target: THREE.Vector3) => {
      const x = (u - 0.5) * L;
      const taper = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u * 0.98 + 0.01))), 0.55);
      const angle = Math.PI * v;
      const z = Math.cos(angle) * (B / 2) * taper;
      const depth = 0.9 * taper + 0.05;
      const y = -Math.sin(angle) * depth + 0.25 * Math.pow(Math.abs(u - 0.5) * 2, 3);
      target.set(x, y, z);
    },
    48,
    12,
  );
}

function Oars({ count, side, phase }: { count: number; side: 1 | -1; phase: React.RefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const t = phase.current ?? 0;
    for (let i = 0; i < count; i++) {
      const x = -L * 0.32 + (i / (count - 1)) * L * 0.62;
      const sweep = Math.sin(t) * 0.35;
      dummy.position.set(x, 0.55, side * (B / 2 + 0.2));
      dummy.rotation.set(side * (0.35 + Math.cos(t) * 0.12), sweep, side * 0.0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.06, 0.06, 4.2]} />
      <meshStandardMaterial color="#5a3a22" roughness={0.9} />
    </instancedMesh>
  );
}

function sailGeometry() {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 5.6, 2.2, 0, 0.8, 4.6, 0], 3));
  g.computeVertexNormals();
  return g;
}

const HOTSPOTS = [
  { id: 'ram', pos: [L * 0.56, 0.9, 0] as [number, number, number], label: 'Spur / ram' },
  { id: 'gun', pos: [L * 0.38, 1.1, 0] as [number, number, number], label: 'Bow guns' },
  { id: 'sails', pos: [1.5, 5.2, 0] as [number, number, number], label: 'Lateen sails' },
  { id: 'oars', pos: [-1.5, 0.7, B / 2 + 2] as [number, number, number], label: 'Oars & rowers' },
  { id: 'stern', pos: [-L * 0.42, 2.2, 0] as [number, number, number], label: 'Stern castle & lantern' },
];

function Galley({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const ship = useRef<THREE.Group>(null);
  const phase = useRef(0);
  const hull = useMemo(() => hullGeometry(), []);
  const sail = useMemo(() => sailGeometry(), []);
  useFrame((_, dt) => {
    phase.current += dt * 1.6;
    if (ship.current) {
      ship.current.position.y = Math.sin(phase.current * 0.5) * 0.06;
      ship.current.rotation.z = Math.sin(phase.current * 0.4) * 0.015;
      ship.current.rotation.x = Math.sin(phase.current * 0.33) * 0.02;
    }
  });
  const wood = <meshStandardMaterial color="#6b4528" roughness={0.85} />;
  return (
    <group ref={ship}>
      <mesh geometry={hull} rotation-x={Math.PI} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#3a2416" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Deck & gangway (corsia) */}
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[L * 0.86, 0.08, B * 0.92]} />
        {wood}
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[L * 0.7, 0.14, 0.45]} />
        <meshStandardMaterial color="#8a6040" roughness={0.8} />
      </mesh>
      {/* Outrigger frames (apostis) holding the oars */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[0, 0.55, s * (B / 2 + 0.15)]}>
          <boxGeometry args={[L * 0.68, 0.1, 0.12]} />
          {wood}
        </mesh>
      ))}
      <Oars count={24} side={1} phase={phase} />
      <Oars count={24} side={-1} phase={phase} />
      {/* Bow platform with guns */}
      <mesh position={[L * 0.38, 0.75, 0]}>
        <boxGeometry args={[1.6, 0.3, B * 0.8]} />
        {wood}
      </mesh>
      {[-0.5, 0, 0.5].map((z, i) => (
        <mesh key={z} position={[L * 0.42, 0.98, z]} rotation-z={-Math.PI / 2}>
          <cylinderGeometry args={[i === 1 ? 0.13 : 0.08, i === 1 ? 0.16 : 0.1, i === 1 ? 1.5 : 1.1, 12]} />
          <meshStandardMaterial color="#b0843a" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
      {/* Spur */}
      <mesh position={[L * 0.56, 0.75, 0]} rotation-z={-Math.PI / 2 - 0.12}>
        <coneGeometry args={[0.12, 2.4, 10]} />
        {wood}
      </mesh>
      {/* Stern castle with awning */}
      <mesh position={[-L * 0.4, 0.95, 0]}>
        <boxGeometry args={[2.0, 0.6, B * 0.85]} />
        <meshStandardMaterial color="#5a2a1a" roughness={0.8} />
      </mesh>
      <mesh position={[-L * 0.4, 1.35, 0]} rotation-x={Math.PI / 2} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[B * 0.42, B * 0.42, 2.0, 16, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#a31d33" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-L * 0.5, 2.1, 0]}>
        <sphereGeometry args={[0.16, 12, 10]} />
        <meshStandardMaterial color="#ffcf70" emissive="#ffb030" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[-L * 0.5, 1.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
        {wood}
      </mesh>
      {/* Masts, yards and lateen sails */}
      {[
        { x: 2.2, h: 5.4, s: 1 },
        { x: -2.4, h: 4.2, s: 0.78 },
      ].map((m) => (
        <group key={m.x} position={[m.x, 0.5, 0]}>
          <mesh position={[0, m.h / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.1, m.h, 8]} />
            {wood}
          </mesh>
          <group position={[0, m.h * 0.95, 0]} rotation-z={0.42} scale={m.s}>
            <mesh rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.04, 0.05, 7.4, 6]} />
              {wood}
            </mesh>
            <mesh geometry={sail} position={[-3.4, -3.9, 0.02]} rotation-z={-0.42}>
              <meshStandardMaterial color="#ece2cc" roughness={0.95} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      ))}
      {/* Pennant */}
      <mesh position={[2.6, 6.2, 0]}>
        <planeGeometry args={[1, 0.3]} />
        <meshStandardMaterial color="#a31d33" side={THREE.DoubleSide} />
      </mesh>
      {HOTSPOTS.map((h) => (
        <Html key={h.id} position={h.pos} center distanceFactor={14} zIndexRange={[10, 0]}>
          <button
            onClick={() => onSelect(h.id)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-[12px] font-semibold shadow-lg transition ${selected === h.id ? 'border-gold bg-gold text-[#0a0908]' : 'border-gold/50 bg-black/75 text-[#e8cd86] hover:bg-black'}`}
            aria-pressed={selected === h.id}
          >
            ◉ {h.label}
          </button>
        </Html>
      ))}
    </group>
  );
}

function Sea() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const shader = useMemo(
    () => ({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `uniform float uTime; varying float vH; void main(){ vec3 p = position; p.z += sin(p.x*0.6+uTime)*0.08 + cos(p.y*0.8+uTime*1.3)*0.06; vH = p.z; gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
      fragmentShader: `varying float vH; void main(){ vec3 c = mix(vec3(0.03,0.07,0.1), vec3(0.12,0.22,0.28), vH*4.0+0.4); gl_FragColor = vec4(c,1.0); }`,
    }),
    [],
  );
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]}>
      <planeGeometry args={[80, 80, 80, 80]} />
      <shaderMaterial ref={mat} args={[shader]} />
    </mesh>
  );
}

export default function ShipModel({ active, quality, selected, onSelect }: { active: boolean; quality: 'high' | 'medium' | 'low'; selected: string; onSelect: (id: string) => void }) {
  return (
    <Canvas camera={{ position: [12, 7, 14], fov: 40 }} dpr={quality === 'high' ? [1, 1.75] : 1} frameloop={active ? 'always' : 'never'} gl={{ antialias: quality !== 'low' }}>
      <color attach="background" args={['#0b1014']} />
      <fog attach="fog" args={['#0b1014', 25, 60]} />
      <hemisphereLight args={['#ffe0b0', '#0a1418', 0.8]} />
      <directionalLight position={[10, 14, 6]} intensity={1.8} color="#ffd59a" />
      <Galley selected={selected} onSelect={onSelect} />
      <Sea />
      <OrbitControls enablePan={false} minDistance={9} maxDistance={32} maxPolarAngle={Math.PI / 2.15} target={[0, 1.6, 0]} autoRotate autoRotateSpeed={0.35} />
    </Canvas>
  );
}
