/**
 * A stylized four-fold tile motif — tulips, carnations and saz leaves in the
 * spirit of İznik ware. Decorative and illustrative only.
 */
export function IznikTile({ colors, className, label }: { colors: { ground: string; main: string; accent: string; leaf: string }; className?: string; label?: string }) {
  const petal = 'M0 -8 C10 -22 10 -40 0 -54 C-10 -40 -10 -22 0 -8Z';
  const tulip = 'M0 0 C-9 -10 -10 -24 -4 -34 L0 -26 L4 -34 C10 -24 9 -10 0 0Z';
  const leaf = 'M0 0 C14 -18 34 -24 56 -20 C40 -10 22 -2 0 0Z';
  return (
    <svg viewBox="-100 -100 200 200" className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <rect x="-100" y="-100" width="200" height="200" fill={colors.ground} />
      <rect x="-94" y="-94" width="188" height="188" fill="none" stroke={colors.main} strokeWidth="3" />
      {[0, 90, 180, 270].map((r) => (
        <g key={r} transform={`rotate(${r})`}>
          <g transform="translate(0 -18)">
            <path d={tulip} transform="translate(0 -40) scale(1.2)" fill={colors.accent} />
            <path d="M0 -8 V-40" stroke={colors.leaf} strokeWidth="2.5" />
          </g>
          <path d={leaf} transform="rotate(-20) translate(14 -14)" fill={colors.leaf} />
          <g transform="translate(-70 -70) rotate(45)">
            <circle r="12" fill={colors.main} />
            <circle r="5" fill={colors.ground} />
          </g>
          <path d={petal} transform="rotate(45) scale(0.6) translate(0 -70)" fill={colors.main} opacity="0.85" />
        </g>
      ))}
      <circle r="18" fill={colors.main} />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={petal} transform={`rotate(${i * 45}) scale(0.32)`} fill={colors.accent} />
      ))}
      <circle r="6" fill={colors.ground} />
    </svg>
  );
}
