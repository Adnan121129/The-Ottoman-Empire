'use client';

import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural models of typical Ottoman arms, built from general descriptions of
 * museum pieces. Artistic reconstructions: no single surviving object is copied.
 */

export type ArmoryItem = 'kilij' | 'yatagan' | 'kalkan' | 'cannon';

const steel = { color: '#d5d8dd', metalness: 0.9, roughness: 0.25 } as const;
const gilt = { color: '#c9a24a', metalness: 0.9, roughness: 0.3 } as const;
const bronze = { color: '#a8743a', metalness: 0.85, roughness: 0.35 } as const;

/** A flat blade outline: the spine follows `curve(t)`, width tapers to the point. */
function bladeGeometry(length: number, width: (t: number) => number, curve: (t: number) => number, thickness = 0.035) {
  const n = 40;
  const upper: THREE.Vector2[] = [];
  const lower: THREE.Vector2[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = t * length;
    const c = curve(t);
    const w = width(t);
    upper.push(new THREE.Vector2(x, c));
    lower.push(new THREE.Vector2(x, c - w));
  }
  const shape = new THREE.Shape([...upper, ...lower.reverse()]);
  const g = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 1 });
  g.translate(0, 0, -thickness / 2);
  return g;
}

function Kilij() {
  // Curved sabre with the widened, back-edged tip section (yelman) typical of Ottoman kılıç.
  const blade = useMemo(
    () =>
      bladeGeometry(
        3.0,
        (t) => (t < 0.68 ? 0.16 - t * 0.02 : t < 0.72 ? 0.15 + (t - 0.68) * 1.2 : Math.max(0.0, 0.2 * (1 - (t - 0.72) / 0.28))),
        (t) => -Math.pow(t, 2) * 0.55,
      ),
    [],
  );
  return (
    <group position={[-1.2, 0.9, 0]} rotation-z={0.25}>
      <mesh geometry={blade}>
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* Crossguard (balçak) with langets */}
      <mesh position={[-0.02, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.62, 0.08]} />
        <meshStandardMaterial {...gilt} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-0.02, -0.08 + s * 0.31, 0]}>
          <sphereGeometry args={[0.06, 12, 10]} />
          <meshStandardMaterial {...gilt} />
        </mesh>
      ))}
      {/* Grip and angled pommel */}
      <mesh position={[-0.42, -0.05, 0]} rotation-z={Math.PI / 2 - 0.08}>
        <cylinderGeometry args={[0.055, 0.065, 0.75, 12]} />
        <meshStandardMaterial color="#2a1a12" roughness={0.6} />
      </mesh>
      <mesh position={[-0.86, -0.12, 0]} rotation-z={-0.6}>
        <capsuleGeometry args={[0.07, 0.14, 6, 12]} />
        <meshStandardMaterial {...gilt} />
      </mesh>
    </group>
  );
}

function Yatagan() {
  // Forward-curving single-edged blade, no crossguard, "eared" grip.
  const blade = useMemo(
    () =>
      bladeGeometry(
        2.4,
        (t) => 0.13 * (1 - Math.pow(t, 3)) + 0.012,
        (t) => Math.sin(t * Math.PI * 0.85) * 0.22 - t * 0.08,
      ),
    [],
  );
  return (
    <group position={[-0.9, 0.95, 0]} rotation-z={0.15}>
      <mesh geometry={blade}>
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[-0.05, -0.06, 0]}>
        <boxGeometry args={[0.12, 0.2, 0.09]} />
        <meshStandardMaterial {...gilt} />
      </mesh>
      <mesh position={[-0.42, -0.08, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.06, 0.06, 0.6, 12]} />
        <meshStandardMaterial color="#e9dfc8" roughness={0.55} />
      </mesh>
      {/* The two "ears" of the pommel */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-0.76, -0.08 + s * 0.08, 0]} rotation-z={s * 0.7} scale={[0.1, 0.16, 0.05]}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color="#e9dfc8" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function spiralTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#d8c69a';
  ctx.fillRect(0, 0, 512, 512);
  ctx.translate(256, 256);
  // Spiral cane body wrapped in coloured thread, as on surviving wicker kalkan shields.
  for (let r = 10; r < 256; r += 7) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = r % 2 ? '#c8b383' : '#b49a68';
    ctx.stroke();
  }
  const colors = ['#8e1b2e', '#c9a24a', '#2a4b6a', '#8e1b2e'];
  for (let i = 0; i < 48; i++) {
    ctx.save();
    ctx.rotate((i / 48) * Math.PI * 2);
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(60, -3);
    ctx.quadraticCurveTo(160, -20, 250, -10);
    ctx.lineTo(250, 4);
    ctx.quadraticCurveTo(160, -6, 60, 3);
    ctx.fill();
    ctx.restore();
  }
  for (const [r, col, w] of [
    [70, '#c9a24a', 10],
    [190, '#8e1b2e', 14],
    [248, '#2a1a12', 12],
  ] as const) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.lineWidth = w;
    ctx.strokeStyle = col;
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function Kalkan() {
  const tex = useMemo(() => spiralTexture(), []);
  const face = useMemo(() => {
    const g = new THREE.SphereGeometry(2.2, 64, 16, 0, Math.PI * 2, 0, 0.55);
    // Planar UVs so the spiral texture is centred on the boss.
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const max = 2.2 * Math.sin(0.55);
    for (let i = 0; i < pos.count; i++) uv.setXY(i, 0.5 + pos.getX(i) / (2 * max), 0.5 + pos.getZ(i) / (2 * max));
    return g;
  }, []);
  return (
    <group position={[0, 1.15, 0]} rotation-x={Math.PI / 2 - 0.25}>
      <mesh geometry={face} position={[0, -1.85, 0]}>
        <meshStandardMaterial map={tex} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.32, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <torusGeometry args={[0.32, 0.04, 8, 32]} />
        <meshStandardMaterial {...gilt} />
      </mesh>
    </group>
  );
}

function Wheel({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.62, z]} rotation-x={Math.PI / 2}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.58, 0.07, 8, 32]} />
        <meshStandardMaterial color="#4a3020" roughness={0.85} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} rotation-y={(i / 10) * Math.PI}>
          <boxGeometry args={[1.1, 0.06, 0.06]} />
          <meshStandardMaterial color="#5a3a24" roughness={0.85} />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
        <meshStandardMaterial color="#2c2c2c" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Cannon() {
  const barrel = useMemo(() => {
    // Profile of a cast bronze field gun: cascabel, reinforcing rings, muzzle swell.
    const pts: [number, number][] = [
      [0, -1.75], [0.12, -1.75], [0.14, -1.68], [0.08, -1.62], [0.22, -1.55], [0.34, -1.5], [0.36, -1.35], [0.4, -1.3], [0.4, -1.2], [0.34, -1.15],
      [0.33, -0.4], [0.37, -0.36], [0.37, -0.28], [0.31, -0.24], [0.28, 0.9], [0.32, 0.95], [0.32, 1.02], [0.26, 1.06], [0.25, 1.5], [0.3, 1.62], [0.33, 1.75],
      [0.13, 1.75], [0.13, 1.4],
    ];
    const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 32);
    g.rotateZ(-Math.PI / 2);
    return g;
  }, []);
  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={barrel} position={[0.1, 1.38, 0]} rotation-z={0.06}>
        <meshStandardMaterial {...bronze} />
      </mesh>
      {/* Trunnions */}
      <mesh position={[0.05, 1.33, 0]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.1, 0.1, 0.95, 12]} />
        <meshStandardMaterial {...bronze} />
      </mesh>
      {/* Carriage cheeks, trail and axle */}
      {[-0.36, 0.36].map((z) => (
        <mesh key={z} position={[-0.75, 0.82, z]} rotation-z={0.28}>
          <boxGeometry args={[2.6, 0.42, 0.12]} />
          <meshStandardMaterial color="#5d3d26" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0.05, 0.62, 0]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 10]} />
        <meshStandardMaterial color="#2c2c2c" metalness={0.6} roughness={0.5} />
      </mesh>
      <Wheel x={0.05} z={0.72} />
      <Wheel x={0.05} z={-0.72} />
    </group>
  );
}

function Display({ item }: { item: ArmoryItem }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.25;
  });
  return (
    <group ref={g}>
      {item === 'kilij' && <Kilij />}
      {item === 'yatagan' && <Yatagan />}
      {item === 'kalkan' && <Kalkan />}
      {item === 'cannon' && <Cannon />}
    </group>
  );
}

export default function ArmoryModel({ active, quality, item }: { active: boolean; quality: 'high' | 'medium' | 'low'; item: ArmoryItem }) {
  return (
    <Canvas camera={{ position: [0, 1.8, 4.6], fov: 38 }} dpr={quality === 'high' ? [1, 1.75] : 1} frameloop={active ? 'always' : 'never'} gl={{ antialias: quality !== 'low' }}>
      <color attach="background" args={['#0d0b09']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 7, 4]} intensity={2.2} color="#ffe2b0" />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#8fb0ff" />
      {/* Studio reflections generated locally (no HDR download) so metal reads as metal. */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} color="#ffe6c4" position={[0, 5, -4]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#c9d8ff" position={[-5, 2, 3]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={2} color="#ffd59a" position={[4, 3, 4]} scale={2} />
      </Environment>
      <Display item={item} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
        <circleGeometry args={[2.2, 64]} />
        <meshStandardMaterial color="#1a1511" roughness={0.9} />
      </mesh>
      {quality !== 'low' && <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={8} blur={2.4} far={3} />}
      <OrbitControls enablePan={false} minDistance={3} maxDistance={9} maxPolarAngle={Math.PI / 2.05} target={[0, 1, 0]} />
    </Canvas>
  );
}
