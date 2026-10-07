'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Quality } from '@/lib/providers';
import { mulberry32 } from '@/lib/utils';
import { GLSL_NOISE, hagiaSophiaGeometry, mosqueGeometry, nonIndexed, palaceGeometry, towerGeometry } from './architecture';

/**
 * Artistic reconstruction: a stylized view across the water towards the
 * historic peninsula of Constantinople at dusk. Not to scale; positions are
 * evocative, not topographically exact.
 */

const SUN = new THREE.Vector3(34, 7, -120);
const FOG = new THREE.Color('#7a3f2c');

/** In capture mode (used to pre-render the fallback video) time is driven externally. */
function sceneTime(clock: THREE.Clock) {
  const w = typeof window !== 'undefined' ? (window as unknown as { __CAPTURE_T?: number }).__CAPTURE_T : undefined;
  return w ?? clock.getElapsedTime();
}

function Sky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { uSun: { value: SUN.clone().normalize() } },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main(){ vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz); gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uSun; varying vec3 vDir;
          void main(){
            float h = vDir.y;
            vec3 zenith = vec3(0.05, 0.04, 0.08);
            vec3 mid = vec3(0.30, 0.10, 0.14);
            vec3 horizon = vec3(0.98, 0.50, 0.22);
            vec3 col = mix(horizon, mid, smoothstep(-0.02, 0.2, h));
            col = mix(col, zenith, smoothstep(0.16, 0.65, h));
            float s = max(dot(normalize(vDir), uSun), 0.0);
            col += vec3(1.0, 0.55, 0.25) * pow(s, 6.0) * 0.55;
            col += vec3(1.0, 0.8, 0.5) * pow(s, 60.0) * 0.9;
            col += vec3(1.0, 0.78, 0.48) * smoothstep(0.9993, 0.9998, s) * 1.4;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  );
  return (
    <mesh material={mat} renderOrder={-10}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}

function Clouds({ quality }: { quality: Quality }) {
  const layers = useMemo(
    () =>
      [
        { y: 22, z: -150, w: 420, h: 60, a: '#ff9a55', b: '#4a1a2a', o: 0.75, seed: 1.3, speed: 0.006 },
        { y: 36, z: -170, w: 520, h: 80, a: '#c86046', b: '#2a1424', o: 0.6, seed: 7.1, speed: 0.004 },
        { y: 12, z: -130, w: 360, h: 34, a: '#ffb070', b: '#6a2a2a', o: 0.5, seed: 3.7, speed: 0.008 },
      ].slice(0, quality === 'low' ? 1 : 3),
    [quality],
  );
  const mats = useMemo(
    () =>
      layers.map(
        (l) =>
          new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            fog: false,
            uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color(l.a) }, uB: { value: new THREE.Color(l.b) }, uO: { value: l.o }, uSeed: { value: l.seed }, uSpeed: { value: l.speed } },
            vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: /* glsl */ `
              uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform float uO; uniform float uSeed; uniform float uSpeed;
              varying vec2 vUv;
              ${GLSL_NOISE}
              void main(){
                vec2 p = vUv * vec2(7.0, 1.6) + vec2(uTime * uSpeed + uSeed, uSeed * 0.3);
                float n = fbm(p);
                float band = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
                float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
                float a = smoothstep(0.42, 0.78, n) * band * edge * uO;
                vec3 col = mix(uA, uB, clamp(vUv.y * 1.2 + (n - 0.5) * 0.6, 0.0, 1.0));
                gl_FragColor = vec4(col, a);
              }
            `,
          }),
      ),
    [layers],
  );
  useFrame(({ clock }) => mats.forEach((m) => (m.uniforms.uTime.value = sceneTime(clock))));
  return (
    <>
      {layers.map((l, i) => (
        <mesh key={i} position={[0, l.y, l.z]} material={mats[i]} renderOrder={-5}>
          <planeGeometry args={[l.w, l.h]} />
        </mesh>
      ))}
    </>
  );
}

function Water() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        fog: false,
        uniforms: { uTime: { value: 0 }, uSun: { value: SUN }, uFog: { value: FOG } },
        vertexShader: /* glsl */ `
          varying vec3 vWorld;
          void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform vec3 uSun; uniform vec3 uFog;
          varying vec3 vWorld;
          ${GLSL_NOISE}
          void main(){
            vec3 view = normalize(cameraPosition - vWorld);
            float dist = length(cameraPosition.xz - vWorld.xz);
            vec2 p = vWorld.xz * vec2(0.22, 0.9);
            float n1 = fbm(p + vec2(uTime * 0.04, uTime * 0.11));
            float n2 = fbm(p * 2.7 - vec2(uTime * 0.07, uTime * 0.05));
            vec3 nrm = normalize(vec3((n1 - 0.5) * 0.5, 1.0, (n2 - 0.5) * 0.9));
            vec3 refl = reflect(-view, nrm);
            vec3 sunDir = normalize(uSun - vWorld);
            float d = max(dot(refl, sunDir), 0.0);
            float spec = pow(d, 90.0) * 2.2 + pow(d, 14.0) * 0.28;
            float fres = pow(1.0 - max(view.y, 0.0), 4.0);
            vec3 deep = vec3(0.025, 0.03, 0.05);
            vec3 skyRef = vec3(0.55, 0.22, 0.15);
            vec3 col = mix(deep, skyRef, fres * 0.75);
            col += vec3(1.0, 0.68, 0.38) * spec;
            col = mix(col, uFog, smoothstep(30.0, 140.0, dist) * 0.85);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  );
  useFrame(({ clock }) => (mat.uniforms.uTime.value = sceneTime(clock)));
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -40]} material={mat}>
      <planeGeometry args={[400, 220, 1, 1]} />
    </mesh>
  );
}

/** The skyline: terrain, mosques, palace, Galata Tower and the city fabric. */
function Skyline({ quality }: { quality: Quality }) {
  const { stone, gold, terrain, windows } = useMemo(() => {
    const rand = mulberry32(1453);
    const stoneParts: THREE.BufferGeometry[] = [];
    const goldParts: THREE.BufferGeometry[] = [];
    const put = (geo: { stone: THREE.BufferGeometry; gold?: THREE.BufferGeometry }, x: number, y: number, z: number, s: number, ry = 0) => {
      const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(s, s, s));
      stoneParts.push(geo.stone.clone().applyMatrix4(m));
      if (geo.gold) goldParts.push(geo.gold.clone().applyMatrix4(m));
    };
    // Hills of the historic peninsula (seen across the water)
    const hills: THREE.BufferGeometry[] = [];
    const hill = (x: number, z: number, sx: number, sy: number, sz: number) => {
      const g = new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(x, -0.2, z), new THREE.Quaternion(), new THREE.Vector3(sx, sy, sz)));
      hills.push(nonIndexed(g));
    };
    hill(-12, -62, 30, 4.2, 10);
    hill(10, -64, 34, 3.2, 10);
    hill(30, -60, 18, 2.2, 8);
    hill(-40, -56, 18, 3.0, 9);
    hill(0, -80, 80, 6, 14);

    const sule = mosqueGeometry({ width: 4.6, semi: 2, minarets: 4, minaretH: 6.2, balconies: 3 });
    const blue = mosqueGeometry({ width: 4.2, semi: 4, minarets: 6, minaretH: 5.6, balconies: 3 });
    const generic = mosqueGeometry({ width: 3.4, semi: 2, minarets: 2, minaretH: 4.4, balconies: 2 });
    const small = mosqueGeometry({ width: 2.4, semi: 0, minarets: 1, minaretH: 3.4, balconies: 1 });
    const hagia = hagiaSophiaGeometry();

    put(sule, -12, 3.6, -62, 1.25, 0.3);
    put(hagia, 7, 2.4, -58, 1.15, -0.2);
    put(blue, 15, 2.0, -61, 1.05, 0.1);
    put(generic, -24, 2.6, -66, 1.0, 0.5);
    put(generic, -2, 2.8, -68, 0.9, -0.4);
    put(small, -6, 1.2, -55, 1, 0.2);
    put(small, 23, 1.4, -57, 0.9, -0.3);
    put(small, -32, 2.2, -60, 0.9, 0.1);
    put({ stone: palaceGeometry(9) }, 28, 1.8, -58, 1.1, -0.1);
    put({ stone: towerGeometry(6.5, 0.7) }, -34, 0, -40, 1.0);

    // City fabric: hundreds of small houses on the slopes
    const houses: THREE.BufferGeometry[] = [];
    const windowParts: THREE.BufferGeometry[] = [];
    const count = quality === 'low' ? 140 : 320;
    for (let i = 0; i < count; i++) {
      const x = -46 + rand() * 82;
      const z = -50 - rand() * 18;
      const w = 0.8 + rand() * 1.4;
      const h = 0.7 + rand() * 1.3;
      const yBase = Math.max(0, 3.4 * Math.exp(-Math.pow((x + 12) / 22, 2)) * (1 - (z + 50) / -30) + 2.2 * Math.exp(-Math.pow((x - 10) / 24, 2)));
      const g = new THREE.BoxGeometry(w, h, 0.9 + rand());
      g.translate(x, yBase + h / 2, z);
      houses.push(nonIndexed(g));
      if (rand() < 0.55) {
        const wg = new THREE.PlaneGeometry(0.16, 0.2);
        wg.translate(x + (rand() - 0.5) * w * 0.6, yBase + h * (0.3 + rand() * 0.4), z + 0.5 + 0.46);
        windowParts.push(nonIndexed(wg));
      }
    }
    // Foreground Galata shore (left) houses
    for (let i = 0; i < (quality === 'low' ? 40 : 90); i++) {
      const x = -48 + rand() * 20;
      const z = -34 - rand() * 12;
      const h = 0.8 + rand() * 1.6;
      const g = new THREE.BoxGeometry(0.9 + rand(), h, 1 + rand());
      g.translate(x, h / 2 + (x + 48) * 0.05, z);
      houses.push(nonIndexed(g));
      if (rand() < 0.6) {
        const wg = new THREE.PlaneGeometry(0.18, 0.22);
        wg.translate(x + (rand() - 0.5) * 0.4, h * 0.6 + (x + 48) * 0.05, z + 0.9);
        windowParts.push(nonIndexed(wg));
      }
    }
    return {
      stone: mergeGeometries([...stoneParts.map(nonIndexed), ...houses]),
      gold: mergeGeometries(goldParts.map(nonIndexed)),
      terrain: mergeGeometries(hills),
      windows: windowParts.length ? mergeGeometries(windowParts) : null,
    };
  }, [quality]);

  const winMat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (winMat.current) winMat.current.opacity = 0.75 + Math.sin(sceneTime(clock) * 0.8) * 0.08;
  });

  return (
    <group>
      <mesh geometry={terrain}>
        <meshStandardMaterial color="#1c1210" roughness={1} />
      </mesh>
      <mesh geometry={stone}>
        <meshStandardMaterial color="#2b1d18" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh geometry={gold}>
        <meshStandardMaterial color="#d6a64e" emissive="#6b4a1a" emissiveIntensity={0.8} metalness={0.8} roughness={0.35} />
      </mesh>
      {windows && (
        <mesh geometry={windows}>
          <meshBasicMaterial ref={winMat} color="#ffb85c" transparent opacity={0.8} fog />
        </mesh>
      )}
    </group>
  );
}

/** Crimson pennants on a fortress wall in the middle distance. */
function Banners() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          uniform float uTime; varying vec2 vUv;
          void main(){
            vUv = uv;
            vec3 p = position;
            float t = uv.x;
            p.z += sin(t * 6.0 - uTime * 4.0) * 0.18 * t;
            p.y += sin(t * 4.0 - uTime * 3.0) * 0.06 * t;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          void main(){
            if (vUv.y < 0.5 - 0.5 * vUv.x * 0.9 || vUv.y > 0.5 + 0.5 * (1.0 - vUv.x * 0.9)) discard;
            vec3 c = mix(vec3(0.45, 0.06, 0.1), vec3(0.72, 0.12, 0.18), vUv.y);
            gl_FragColor = vec4(c * 0.85, 1.0);
          }
        `,
      }),
    [],
  );
  useFrame(({ clock }) => (mat.uniforms.uTime.value = sceneTime(clock)));
  const poles = [33.5, 36, 38.5];
  return (
    <group position={[0, 0, -44]}>
      <mesh position={[36, 0.8, 0]}>
        <boxGeometry args={[9, 1.6, 1.2]} />
        <meshStandardMaterial color="#24181a" roughness={1} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[31.9 + i * 1.02, 1.85, 0]}>
          <boxGeometry args={[0.55, 0.5, 1.2]} />
          <meshStandardMaterial color="#24181a" roughness={1} />
        </mesh>
      ))}
      {poles.map((x) => (
        <group key={x} position={[x, 2.1, 0.2]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 2.4, 6]} />
            <meshStandardMaterial color="#120c0a" />
          </mesh>
          <mesh position={[0.75, 2.05, 0]} material={mat}>
            <planeGeometry args={[1.5, 0.7, 16, 4]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Boats({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ x: -30 + i * 19, z: -14 - i * 7, speed: 0.25 + i * 0.07, scale: 1 - i * 0.12 })), [count]);
  useFrame(({ clock }) => {
    const t = sceneTime(clock);
    group.current?.children.forEach((b, i) => {
      const s = seeds[i];
      b.position.x = ((s.x + t * s.speed + 60) % 120) - 60;
      b.position.y = Math.sin(t * 1.3 + i) * 0.05;
      b.rotation.z = Math.sin(t * 1.1 + i) * 0.03;
    });
  });
  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]} scale={s.scale}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[3, 0.3, 0.7]} />
            <meshStandardMaterial color="#0d0908" />
          </mesh>
          <mesh position={[1.6, 0.35, 0]} rotation-z={0.5}>
            <boxGeometry args={[0.6, 0.12, 0.5]} />
            <meshStandardMaterial color="#0d0908" />
          </mesh>
          <mesh position={[-0.3, 0.55, 0]}>
            <boxGeometry args={[0.9, 0.5, 0.55]} />
            <meshStandardMaterial color="#120c0a" />
          </mesh>
          <mesh position={[-0.3, 0.7, 0.29]}>
            <planeGeometry args={[0.18, 0.14]} />
            <meshBasicMaterial color="#ffb85c" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Birds({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0, -0.05, 0.1, 0, 0, -0.1, 0.5, 0, 0, 0, -0.05, 0.1, 0, 0, -0.1], 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    const t = sceneTime(clock);
    group.current?.children.forEach((b, i) => {
      const a = t * 0.08 + i * 0.9;
      b.position.set(Math.sin(a) * (10 + i), 9 + Math.sin(a * 2 + i) * 1.2 + i * 0.4, -28 + Math.cos(a) * 6);
      b.rotation.y = -a;
      b.scale.y = 0.5 + Math.abs(Math.sin(t * 6 + i)) * 0.9;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial color="#120a0a" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Embers({ count }: { count: number }) {
  const { geo, mat } = useMemo(() => {
    const rand = mulberry32(29);
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -40 + rand() * 80;
      pos[i * 3 + 1] = rand() * 14;
      pos[i * 3 + 2] = -40 + rand() * 50;
      off[i] = rand() * 100;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aOff', new THREE.BufferAttribute(off, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixel: { value: 1 } },
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uPixel; attribute float aOff; varying float vA;
        void main(){
          vec3 p = position;
          p.y = mod(p.y + uTime * 0.35 + aOff, 16.0);
          p.x += sin(uTime * 0.3 + aOff) * 0.8;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (2.2 + mod(aOff, 2.0)) * uPixel * (18.0 / -mv.z);
          vA = smoothstep(0.0, 2.0, p.y) * smoothstep(16.0, 10.0, p.y);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * vA * 0.7;
          gl_FragColor = vec4(1.0, 0.72, 0.38, a);
        }
      `,
    });
    return { geo: g, mat: m };
  }, [count]);
  const { gl } = useThree();
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = sceneTime(clock);
    mat.uniforms.uPixel.value = gl.getPixelRatio();
  });
  return <points geometry={geo} material={mat} />;
}

function CameraRig({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 4.2, -60), []);
  useFrame(({ clock }) => {
    const t = sceneTime(clock);
    const p = pointer.current ?? { x: 0, y: 0 };
    const tx = p.x * 2.4 + Math.sin(t * 0.05) * 0.8;
    const ty = 3.2 + p.y * 0.9;
    const tz = 16 - Math.min(t * 0.06, 2.5);
    camera.position.x += (tx - camera.position.x) * 0.035;
    camera.position.y += (ty - camera.position.y) * 0.035;
    camera.position.z += (tz - camera.position.z) * 0.02;
    camera.lookAt(target);
  });
  return null;
}

export default function HeroScene({ quality, active }: { quality: Quality; active: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -((e.clientY / window.innerHeight) * 2 - 1) };
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);

  const embers = quality === 'high' ? 700 : quality === 'medium' ? 320 : 0;
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance', preserveDrawingBuffer: false }}
      camera={{ position: [0, 3.2, 16], fov: 38, near: 0.5, far: 900 }}
      frameloop={active ? 'always' : 'never'}
      onCreated={({ scene, gl }) => {
        scene.fog = new THREE.Fog(FOG, 40, 150);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden="true"
    >
      <hemisphereLight args={['#ffb27a', '#1a0f12', 0.55]} />
      <directionalLight position={SUN.toArray()} intensity={1.6} color="#ffad6a" />
      <directionalLight position={[20, 10, 30]} intensity={0.15} color="#6a5aa0" />
      <Sky />
      <Clouds quality={quality} />
      <Water />
      <Skyline quality={quality} />
      <Banners />
      <Boats count={quality === 'low' ? 2 : 4} />
      {quality !== 'low' && <Birds count={7} />}
      {embers > 0 && <Embers count={embers} />}
      <CameraRig pointer={pointer} />
    </Canvas>
  );
}
