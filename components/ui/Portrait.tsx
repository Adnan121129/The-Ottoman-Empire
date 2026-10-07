import type { Headwear, Beard, Palette, PortraitSpec, MediaImage } from '@/data/types';
import { cn, hashString } from '@/lib/utils';

/**
 * Procedural “Artistic Reconstruction” portrait.
 *
 * A stylized silhouette in a gold-framed medallion. Headwear and beard follow the
 * conventions of each period (early wrapped turbans, the tall kavuk, the great
 * ceremonial turban with aigrette, the fez after 1829). It is deliberately NOT a
 * likeness. Provide `image` on a ruler/figure to show an authentic public-domain
 * portrait instead.
 */

const palettes: Record<Palette, { bg0: string; bg1: string; accent: string; robe: string }> = {
  gold: { bg0: '#3b2a0e', bg1: '#120c06', accent: '#e8cd86', robe: '#5a1420' },
  crimson: { bg0: '#4a0f1a', bg1: '#12070a', accent: '#e2bd6b', robe: '#2a1810' },
  emerald: { bg0: '#123d33', bg1: '#06110e', accent: '#d9c27a', robe: '#4a1018' },
  ivory: { bg0: '#4b4232', bg1: '#141110', accent: '#f4ecda', robe: '#1e2a3a' },
  night: { bg0: '#26202a', bg1: '#08070a', accent: '#c9a24a', robe: '#3a1016' },
  bronze: { bg0: '#4a3020', bg1: '#120c08', accent: '#e0b070', robe: '#2f3a22' },
};

const headwearOffset: Record<Headwear, string | undefined> = {
  'early-turban': 'translate(0 12)',
  'turban-small': 'translate(0 10)',
  kavuk: 'translate(0 12)',
  'grand-turban': 'translate(0 14)',
  'plumed-turban': 'translate(0 14)',
  cap: 'translate(0 8)',
  fez: 'translate(0 4)',
  kalpak: 'translate(0 4)',
  veil: undefined,
  'crown-veil': undefined,
};

const BUST =
  'M84 178C74 160 66 138 70 112C72 86 88 70 106 70C122 70 130 82 130 96L131 101C134 108 139 114 140 118C138 121 134 122 131 123C133 127 132 130 130 132C132 135 131 138 129 140C129 147 125 152 118 154C116 160 114 168 116 178C140 182 166 192 176 212L182 250L18 250L24 212C34 192 62 182 84 178Z';

function HeadwearShape({ type, accent }: { type: Headwear; accent: string }) {
  const stroke = { stroke: accent, strokeWidth: 1.1, strokeOpacity: 0.75, fill: 'none' } as const;
  switch (type) {
    case 'early-turban':
      return (
        <g>
          <ellipse cx="100" cy="70" rx="35" ry="20" fill="#3b332a" stroke={accent} strokeOpacity="0.8" />
          <path d="M68 74C86 62 116 60 133 70M70 66C88 56 114 55 130 62M74 80C92 72 112 72 128 78" {...stroke} />
          <ellipse cx="100" cy="52" rx="10" ry="6" fill="#3a1218" stroke={accent} strokeOpacity="0.7" />
        </g>
      );
    case 'turban-small':
      return (
        <g>
          <ellipse cx="100" cy="72" rx="32" ry="16" fill="#3b332a" stroke={accent} strokeOpacity="0.8" />
          <path d="M70 74C88 64 114 63 130 71M74 80C92 73 112 73 127 78" {...stroke} />
        </g>
      );
    case 'kavuk':
      return (
        <g>
          <path d="M84 70C82 46 88 24 100 20C112 24 118 46 116 70Z" fill="#5a1420" stroke={accent} strokeOpacity="0.8" />
          <ellipse cx="100" cy="70" rx="40" ry="20" fill="#3b332a" stroke={accent} strokeOpacity="0.85" />
          <path d="M62 70C80 56 120 54 138 68M64 78C84 66 118 64 136 76M70 62C88 50 114 50 132 60" {...stroke} />
        </g>
      );
    case 'grand-turban':
    case 'plumed-turban':
      return (
        <g>
          <path d="M54 76C48 50 64 24 100 22C136 24 152 50 146 76C130 86 70 86 54 76Z" fill="#3b332a" stroke={accent} strokeOpacity="0.85" />
          <path d="M58 64C78 44 122 42 142 62M56 52C80 34 120 32 144 50M60 74C82 60 120 58 142 72M76 30C90 40 110 40 124 30" {...stroke} />
          <ellipse cx="100" cy="26" rx="14" ry="6" fill="#5a1420" stroke={accent} strokeOpacity="0.7" />
          {type === 'plumed-turban' && (
            <g>
              <path d="M124 54C126 36 132 18 146 4C140 22 136 38 132 56Z" fill={accent} fillOpacity="0.25" stroke={accent} strokeOpacity="0.9" />
              <path d="M128 52C132 36 138 22 150 12" {...stroke} />
              <circle cx="126" cy="58" r="5" fill="#a31d33" stroke={accent} />
              <circle cx="126" cy="58" r="2" fill={accent} />
            </g>
          )}
        </g>
      );
    case 'fez':
      return (
        <g>
          <path d="M69 82L76 42C88 38 112 38 124 42L131 82C112 86 88 86 69 82Z" fill="#a31d33" stroke={accent} strokeOpacity="0.7" />
          <ellipse cx="100" cy="42" rx="24" ry="4" fill="#7a1424" stroke={accent} strokeOpacity="0.6" />
          <path d="M100 41C92 44 82 52 76 66" stroke="#111" strokeWidth="2.2" fill="none" />
          <path d="M76 66l-3 10M76 66l1 10M76 66l4 9" stroke="#111" strokeWidth="1.2" />
        </g>
      );
    case 'kalpak':
      return (
        <g>
          <path d="M70 84L72 46C84 38 116 38 128 46L130 84C112 88 88 88 70 84Z" fill="#1d1813" stroke={accent} strokeOpacity="0.7" />
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={i} d={`M${74 + i * 4} ${48 + (i % 2) * 2}l-1 ${30 + (i % 3) * 3}`} stroke={accent} strokeOpacity="0.18" />
          ))}
        </g>
      );
    case 'cap':
      return <path d="M72 80C72 58 86 48 100 48C114 48 128 58 128 80Z" fill="#2a221b" stroke={accent} strokeOpacity="0.7" />;
    case 'veil':
    case 'crown-veil':
      return (
        <g>
          <path d="M60 250C52 200 54 150 60 112C64 76 80 52 104 50C124 50 138 62 140 84C132 76 120 72 108 74C92 78 84 96 84 120C84 150 90 178 98 196C86 214 76 232 72 250Z" fill="#2c2620" stroke={accent} strokeOpacity="0.8" />
          <path d="M66 140C70 170 78 200 88 226M72 108C72 90 84 66 104 62" stroke={accent} strokeOpacity="0.35" fill="none" />
          {type === 'crown-veil' && (
            <g>
              <path d="M80 60L84 40L92 52L100 34L108 52L116 40L120 60C108 56 92 56 80 60Z" fill={accent} fillOpacity="0.3" stroke={accent} />
              <circle cx="100" cy="46" r="2.6" fill="#a31d33" />
              <circle cx="88" cy="50" r="1.8" fill="#1d5a49" />
              <circle cx="112" cy="50" r="1.8" fill="#1d5a49" />
            </g>
          )}
        </g>
      );
  }
}

function BeardShape({ type, accent }: { type: Beard; accent: string }) {
  const style = { fill: '#2a221b', stroke: accent, strokeOpacity: 0.3, strokeWidth: 0.8 } as const;
  switch (type) {
    case 'full':
      return <path d="M106 118C114 126 124 128 132 134C134 146 132 160 122 166C110 170 98 160 92 146C96 132 100 124 106 118Z" {...style} />;
    case 'long':
      return <path d="M106 118C114 126 124 128 132 134C134 152 132 176 120 190C108 194 96 172 92 150C95 134 100 124 106 118Z" {...style} />;
    case 'short':
      return <path d="M110 124C118 130 126 132 132 136C132 146 128 156 120 158C112 158 104 150 102 140C104 132 106 128 110 124Z" {...style} />;
    case 'pointed':
      return <path d="M110 124C118 130 126 132 132 136C134 150 130 166 126 178C118 168 106 152 102 140C104 132 106 128 110 124Z" {...style} />;
    case 'mustache':
      return <path d="M122 124C127 122 132 123 136 127C131 126.5 126 128 121 128C117 129 115 127 116 125.5C118 124.5 120 124.3 122 124Z" {...style} />;
    default:
      return null;
  }
}

export function Portrait({
  spec,
  name,
  image,
  className,
  showLabel = true,
  size = 'md',
}: {
  spec: PortraitSpec;
  name: string;
  image?: MediaImage;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const p = palettes[spec.palette ?? 'gold'];
  const id = `p${hashString(name).toString(36)}`;
  const facing = spec.facing ?? (hashString(name) % 2 === 0 ? 'right' : 'left');

  if (image) {
    return (
      <figure className={cn('relative overflow-hidden rounded-[1.4rem] border hairline bg-coal', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-[0.65rem] text-ivory/70">
          {image.credit} · {image.license}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={cn('relative overflow-hidden rounded-[1.4rem] border hairline', className)}>
      <svg viewBox="0 0 200 250" className="block h-full w-full" role="img" aria-label={`Artistic reconstruction: stylized silhouette of ${name}. Not a historical likeness.`}>
        <defs>
          <radialGradient id={`${id}-bg`} cx="0.5" cy="0.35" r="0.85">
            <stop offset="0" stopColor={p.bg0} />
            <stop offset="1" stopColor={p.bg1} />
          </radialGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={p.accent} stopOpacity="0.05" />
            <stop offset="0.8" stopColor={p.accent} stopOpacity="0.55" />
            <stop offset="1" stopColor={p.accent} stopOpacity="0.9" />
          </linearGradient>
          <pattern id={`${id}-star`} width="28" height="28" patternUnits="userSpaceOnUse">
            <g fill="none" stroke={p.accent} strokeOpacity="0.07" strokeWidth="0.6">
              <rect x="7" y="7" width="14" height="14" />
              <rect x="7" y="7" width="14" height="14" transform="rotate(45 14 14)" />
            </g>
          </pattern>
        </defs>
        <rect width="200" height="250" fill={`url(#${id}-bg)`} />
        <rect width="200" height="250" fill={`url(#${id}-star)`} />
        {/* Ogee arch frame */}
        <path d="M22 250V96C22 52 62 26 100 12C138 26 178 52 178 96V250" fill="none" stroke={p.accent} strokeOpacity="0.35" strokeWidth="1" />
        <path d="M30 250V100C30 60 66 36 100 22C134 36 170 60 170 100V250" fill="none" stroke={p.accent} strokeOpacity="0.15" strokeWidth="0.6" />
        <g transform={facing === 'left' ? 'translate(200 0) scale(-1 1)' : undefined}>
          <path d={BUST} fill="#15110d" />
          <path d={BUST} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1.4" />
          {/* Robe: kaftan or late-period coat */}
          <path d="M18 250L24 212C34 192 62 182 84 178C96 190 108 192 116 178C140 182 166 192 176 212L182 250Z" fill={p.robe} fillOpacity="0.85" />
          {spec.headwear === 'fez' || spec.headwear === 'kalpak' ? (
            <g stroke={p.accent} strokeOpacity="0.6" fill="none">
              <path d="M84 178L92 200L100 190L108 200L116 178" />
              <path d="M100 200V250" strokeOpacity="0.4" />
              {[212, 226, 240].map((y) => (
                <circle key={y} cx="100" cy={y} r="1.6" fill={p.accent} fillOpacity="0.7" />
              ))}
              <path d="M140 194C152 196 164 202 170 210" strokeOpacity="0.7" strokeWidth="2" />
            </g>
          ) : (
            <g stroke={p.accent} strokeOpacity="0.55" fill="none">
              <path d="M86 180C94 204 98 226 100 250M114 180C106 204 102 226 100 250" />
              <path d="M84 178C70 196 56 214 50 250M116 178C130 196 144 214 150 250" strokeOpacity="0.3" strokeWidth="5" />
            </g>
          )}
          <BeardShape type={spec.beard} accent={p.accent} />
          <path d="M114 99C118 97 122 97 125 99" stroke={p.accent} strokeOpacity="0.5" fill="none" />
          <g transform={headwearOffset[spec.headwear]}>
            <HeadwearShape type={spec.headwear} accent={p.accent} />
          </g>
        </g>
        <rect x="0.5" y="0.5" width="199" height="249" fill="none" stroke={p.accent} strokeOpacity="0.2" />
      </svg>
      {showLabel && (
        <figcaption className={cn('absolute left-3 top-3 rounded-full border border-gold/30 bg-black/55 px-2.5 py-1 font-sans font-semibold uppercase tracking-[0.18em] text-gold-light backdrop-blur', size === 'sm' ? 'text-[0.5rem]' : 'text-[0.58rem]')}>
          Artistic reconstruction
        </figcaption>
      )}
    </figure>
  );
}
