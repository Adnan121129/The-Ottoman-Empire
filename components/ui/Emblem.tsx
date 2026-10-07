import { cn } from '@/lib/utils';

/**
 * Stylized eight-pointed star emblem — an Islamic geometric motif used as the
 * site's mark. It is not a reproduction of any historical Ottoman seal or tughra.
 */
export function Emblem({ className, title = 'Site emblem' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('h-8 w-8', className)} role="img" aria-label={title}>
      <defs>
        <linearGradient id="emblem-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc9a" />
          <stop offset="0.5" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#8a6a28" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="none" stroke="url(#emblem-gold)" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="26.5" fill="none" stroke="url(#emblem-gold)" strokeWidth="0.5" opacity="0.6" />
      <rect x="15" y="15" width="34" height="34" fill="none" stroke="url(#emblem-gold)" strokeWidth="1.6" />
      <rect x="15" y="15" width="34" height="34" fill="none" stroke="url(#emblem-gold)" strokeWidth="1.6" transform="rotate(45 32 32)" />
      <circle cx="32" cy="32" r="7" fill="#6b1624" stroke="url(#emblem-gold)" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="2.2" fill="url(#emblem-gold)" />
    </svg>
  );
}
