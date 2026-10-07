import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  kicker,
  title,
  intro,
  align = 'left',
  className,
  as: Tag = 'h2',
  tone = 'dark',
  id,
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  tone?: 'dark' | 'light';
  id?: string;
}) {
  return (
    <header className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {kicker && <p className={cn('label-caps mb-4', tone === 'dark' ? 'text-gold' : 'text-gold-dark')}>{kicker}</p>}
      <Tag id={id} className={cn('display-title text-balance text-4xl sm:text-5xl lg:text-6xl', tone === 'dark' ? 'text-ivory' : 'text-sepia')}>
        {title}
      </Tag>
      {intro && <div className={cn('mt-5 text-pretty text-lg leading-relaxed', tone === 'dark' ? 'text-ivory/70' : 'text-sepia/80')}>{intro}</div>}
    </header>
  );
}
