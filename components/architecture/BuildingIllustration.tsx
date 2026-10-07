import type { Building } from '@/data/types';
import { cn } from '@/lib/utils';

/**
 * Stylized elevation silhouettes of the buildings in the gallery, drawn in SVG.
 * They indicate overall form (domes, minarets, arches) only — artistic
 * reconstructions, not measured drawings.
 */

const GROUND = 220;

function Minaret({ x, h, balconies = 2, w = 7 }: { x: number; h: number; balconies?: number; w?: number }) {
  const top = GROUND - h;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h} />
      {Array.from({ length: balconies }).map((_, i) => (
        <rect key={i} x={x - w / 2 - 3} y={top + 26 + i * 22} width={w + 6} height={3.5} />
      ))}
      <path d={`M${x - w / 2 - 0.5} ${top}L${x} ${top - h * 0.17}L${x + w / 2 + 0.5} ${top}Z`} />
    </g>
  );
}

function Dome({ cx, r, base, squash = 1 }: { cx: number; r: number; base: number; squash?: number }) {
  return (
    <g>
      <path d={`M${cx - r} ${base}A${r} ${r * squash} 0 0 1 ${cx + r} ${base}Z`} />
      <rect x={cx - 1.2} y={base - r * squash - 12} width={2.4} height={12} />
    </g>
  );
}

function Mosque({ dome = 46, body = 150, minarets = [] as { x: number; h: number; b?: number }[], semis = true, cascade = 2, turrets = 4, hagia = false }) {
  const bodyTop = GROUND - 62;
  const cx = 200;
  return (
    <g>
      <rect x={cx - body / 2} y={bodyTop} width={body} height={62} />
      {Array.from({ length: Math.floor(body / 18) }).map((_, i) => (
        <path key={i} d={`M${cx - body / 2 + 9 + i * 18} ${GROUND - 14}v-16a4 4 0 0 1 8 0v16z`} fill="#ffd28a" opacity={0.16} />
      ))}
      {cascade > 0 &&
        Array.from({ length: cascade }).flatMap((_, i) => {
          const off = body / 2 - 14 - i * 22;
          return [<Dome key={`l${i}`} cx={cx - off} r={11} base={bodyTop} />, <Dome key={`r${i}`} cx={cx + off} r={11} base={bodyTop} />];
        })}
      {semis && (
        <>
          <path d={`M${cx - dome * 1.75} ${bodyTop}A${dome * 0.9} ${dome * 0.62} 0 0 1 ${cx - dome * 0.2} ${bodyTop}Z`} />
          <path d={`M${cx + dome * 0.2} ${bodyTop}A${dome * 0.9} ${dome * 0.62} 0 0 1 ${cx + dome * 1.75} ${bodyTop}Z`} />
        </>
      )}
      <rect x={cx - dome * 1.04} y={bodyTop - 16} width={dome * 2.08} height={16} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={cx - dome * 0.9 + (i * dome * 1.8) / 8 - 2} y={bodyTop - 12} width={4} height={8} rx={2} fill="#ffd28a" opacity={0.22} />
      ))}
      {Array.from({ length: turrets }).map((_, i) => {
        const x = cx - dome * 1.1 + (i * dome * 2.2) / Math.max(1, turrets - 1);
        return <rect key={i} x={x - 3} y={bodyTop - 26} width={6} height={26} />;
      })}
      <Dome cx={cx} r={dome} base={bodyTop - 16} squash={hagia ? 0.55 : 1} />
      {hagia && (
        <>
          <rect x={cx - body / 2 - 8} y={GROUND - 86} width={16} height={86} />
          <rect x={cx + body / 2 - 8} y={GROUND - 86} width={16} height={86} />
        </>
      )}
      {minarets.map((m) => (
        <Minaret key={m.x} x={m.x} h={m.h} balconies={m.b ?? 2} />
      ))}
    </g>
  );
}

function Shape({ b }: { b: Building }) {
  switch (b.id) {
    case 'hagia-sophia':
      return <Mosque dome={56} body={190} semis cascade={1} turrets={0} hagia minarets={[{ x: 70, h: 150, b: 1 }, { x: 330, h: 150, b: 1 }, { x: 46, h: 165, b: 2 }, { x: 354, h: 165, b: 2 }]} />;
    case 'suleymaniye':
      return <Mosque dome={50} body={190} cascade={3} minarets={[{ x: 66, h: 180, b: 3 }, { x: 334, h: 180, b: 3 }, { x: 30, h: 140, b: 2 }, { x: 370, h: 140, b: 2 }]} />;
    case 'selimiye':
      return <Mosque dome={60} body={170} semis={false} cascade={1} turrets={8} minarets={[{ x: 78, h: 205, b: 3 }, { x: 322, h: 205, b: 3 }, { x: 108, h: 205, b: 3 }, { x: 292, h: 205, b: 3 }]} />;
    case 'sehzade':
      return <Mosque dome={44} body={160} cascade={2} minarets={[{ x: 82, h: 160, b: 2 }, { x: 318, h: 160, b: 2 }]} />;
    case 'blue-mosque':
      return <Mosque dome={48} body={180} cascade={3} minarets={[{ x: 60, h: 175, b: 3 }, { x: 340, h: 175, b: 3 }, { x: 34, h: 160, b: 3 }, { x: 366, h: 160, b: 3 }, { x: 12, h: 140, b: 2 }, { x: 388, h: 140, b: 2 }]} />;
    case 'fatih-mosque':
    case 'yeni-cami':
    case 'mihrimah-uskudar':
      return <Mosque dome={42} body={150} cascade={2} minarets={[{ x: 86, h: 155, b: b.id === 'yeni-cami' ? 3 : 2 }, { x: 314, h: 155, b: b.id === 'yeni-cami' ? 3 : 2 }]} />;
    case 'green-mosque':
      return (
        <g>
          <rect x={90} y={GROUND - 70} width={220} height={70} />
          <Dome cx={150} r={34} base={GROUND - 70} />
          <Dome cx={250} r={34} base={GROUND - 70} />
          <rect x={178} y={GROUND - 54} width={44} height={54} fill="#0b0907" opacity={0.6} />
        </g>
      );
    case 'topkapi':
      return (
        <g>
          <rect x={30} y={GROUND - 40} width={340} height={40} />
          {[70, 110, 150, 250, 290].map((x) => (
            <Dome key={x} cx={x} r={13} base={GROUND - 40} />
          ))}
          {[320, 335, 350].map((x) => (
            <rect key={x} x={x - 4} y={GROUND - 66} width={8} height={26} />
          ))}
          <rect x={192} y={GROUND - 130} width={22} height={90} />
          <path d={`M188 ${GROUND - 130}L203 ${GROUND - 168}L218 ${GROUND - 130}Z`} />
        </g>
      );
    case 'dolmabahce':
      return (
        <g>
          <rect x={20} y={GROUND - 54} width={360} height={54} />
          <rect x={150} y={GROUND - 80} width={100} height={80} />
          <Dome cx={200} r={26} base={GROUND - 80} squash={0.7} />
          {Array.from({ length: 22 }).map((_, i) => (
            <rect key={i} x={28 + i * 16} y={GROUND - 44} width={7} height={18} fill="#0b0907" opacity={0.55} />
          ))}
        </g>
      );
    case 'grand-bazaar':
      return (
        <g>
          <rect x={30} y={GROUND - 46} width={340} height={46} />
          {Array.from({ length: 10 }).map((_, i) => (
            <Dome key={i} cx={47 + i * 34} r={15} base={GROUND - 46} />
          ))}
          <path d={`M180 ${GROUND}V${GROUND - 30}a20 20 0 0 1 40 0V${GROUND}Z`} fill="#0b0907" opacity={0.6} />
        </g>
      );
    case 'rumelihisari':
      return (
        <g>
          <path d={`M10 ${GROUND}L10 ${GROUND - 40}L120 ${GROUND - 70}L280 ${GROUND - 100}L390 ${GROUND - 130}L390 ${GROUND}Z`} />
          {[
            [60, 70, 26],
            [210, 120, 30],
            [340, 140, 26],
          ].map(([x, h, r]) => (
            <g key={x}>
              <rect x={x - r} y={GROUND - h - 40} width={r * 2} height={h + 40} />
              <path d={`M${x - r - 4} ${GROUND - h - 40}L${x} ${GROUND - h - 90}L${x + r + 4} ${GROUND - h - 40}Z`} />
            </g>
          ))}
        </g>
      );
    case 'fountain-ahmed-iii':
      return (
        <g>
          <rect x={130} y={GROUND - 90} width={140} height={90} />
          <path d={`M110 ${GROUND - 90}L290 ${GROUND - 90}L270 ${GROUND - 104}L130 ${GROUND - 104}Z`} />
          {[150, 200, 250].map((x) => (
            <Dome key={x} cx={x} r={x === 200 ? 22 : 14} base={GROUND - 104} />
          ))}
          <path d={`M180 ${GROUND - 12}V${GROUND - 52}a20 20 0 0 1 40 0V${GROUND - 12}Z`} fill="#0b0907" opacity={0.55} />
        </g>
      );
    case 'hurrem-hamam':
      return (
        <g>
          <rect x={40} y={GROUND - 56} width={320} height={56} />
          <Dome cx={120} r={42} base={GROUND - 56} />
          <Dome cx={280} r={42} base={GROUND - 56} />
          {[180, 220].map((x) => (
            <Dome key={x} cx={x} r={12} base={GROUND - 56} />
          ))}
        </g>
      );
    case 'rustem-pasha-han':
      return (
        <g>
          <rect x={40} y={GROUND - 92} width={320} height={92} />
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={i} fill="#0b0907" opacity={0.55}>
              <path d={`M${58 + i * 34} ${GROUND - 50}v-20a10 10 0 0 1 20 0v20z`} />
              <path d={`M${58 + i * 34} ${GROUND - 4}v-26a10 10 0 0 1 20 0v26z`} />
            </g>
          ))}
          {[100, 200, 300].map((x) => (
            <rect key={x} x={x - 4} y={GROUND - 112} width={8} height={20} />
          ))}
        </g>
      );
    case 'mostar-bridge':
      return (
        <g>
          <path d={`M0 ${GROUND}L0 ${GROUND - 110}L60 ${GROUND - 112}Q200 ${GROUND - 210} 340 ${GROUND - 112}L400 ${GROUND - 110}L400 ${GROUND}L330 ${GROUND}Q200 ${GROUND - 170} 70 ${GROUND}Z`} />
          <rect x={20} y={GROUND - 150} width={40} height={40} />
          <rect x={340} y={GROUND - 160} width={44} height={50} />
        </g>
      );
    case 'visegrad-bridge': {
      const n = 11;
      const span = 380 / n;
      let d = `M10 ${GROUND - 70}L390 ${GROUND - 70}L390 ${GROUND}`;
      for (let i = n - 1; i >= 0; i--) {
        const x0 = 10 + i * span;
        d += `L${x0 + span - 4} ${GROUND}L${x0 + span - 4} ${GROUND - 18}A${span / 2 - 4} ${span / 2 - 4} 0 0 0 ${x0 + 4} ${GROUND - 18}L${x0 + 4} ${GROUND}`;
      }
      d += `L10 ${GROUND}Z`;
      return <path d={d} />;
    }
    case 'galata-tower':
      return (
        <g>
          <rect x={172} y={GROUND - 150} width={56} height={150} />
          <rect x={164} y={GROUND - 168} width={72} height={18} />
          <path d={`M164 ${GROUND - 168}L200 ${GROUND - 225}L236 ${GROUND - 168}Z`} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={190} y={GROUND - 130 + i * 30} width={6} height={12} fill="#0b0907" opacity={0.6} />
          ))}
        </g>
      );
    default:
      return <Mosque />;
  }
}

const skies: Record<string, [string, string]> = {
  gold: ['#4a2f12', '#c98f3a'],
  emerald: ['#0f2a24', '#4f8a72'],
  crimson: ['#3a0d14', '#b4492f'],
  ivory: ['#2b2418', '#b9a06e'],
  night: ['#0b1320', '#3d5a7a'],
  bronze: ['#2e1c10', '#a86a3a'],
};

export function BuildingIllustration({ b, className, caption = true, decorative = false }: { b: Building; className?: string; caption?: boolean; decorative?: boolean }) {
  const [top, bottom] = skies[b.accent ?? 'gold'] ?? skies.gold;
  const id = `sky-${b.id}`;
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <svg viewBox="0 0 400 260" className="h-full w-full" preserveAspectRatio="xMidYMax slice" {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': `Stylized silhouette of ${b.name}` })}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={top} />
            <stop offset="1" stopColor={bottom} />
          </linearGradient>
        </defs>
        <rect width="400" height="260" fill={`url(#${id})`} />
        <circle cx="318" cy="70" r="26" fill="#ffe2a8" opacity="0.35" />
        <g fill="#140f0a">
          <Shape b={b} />
          <rect x="0" y={GROUND} width="400" height="40" />
        </g>
      </svg>
      {caption && <span aria-hidden={decorative} className="absolute bottom-2 right-3 text-[0.55rem] uppercase tracking-[0.2em] text-ivory/45">Artistic reconstruction</span>}
    </div>
  );
}
