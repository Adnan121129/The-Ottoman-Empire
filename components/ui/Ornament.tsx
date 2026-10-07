import { cn } from '@/lib/utils';

/** Gold hairline divider with a central star — the site's section ornament. */
export function Ornament({ className, tone = 'gold' }: { className?: string; tone?: 'gold' | 'sepia' }) {
  const c = tone === 'gold' ? '#c9a24a' : '#8a6a28';
  return (
    <div className={cn('flex items-center gap-4', className)} aria-hidden="true">
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${c})` }} />
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={c} strokeWidth="1.2">
        <rect x="6" y="6" width="12" height="12" />
        <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
      </svg>
      <span className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${c})` }} />
    </div>
  );
}
