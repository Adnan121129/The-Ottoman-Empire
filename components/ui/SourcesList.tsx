import { BookMarked, ExternalLink } from 'lucide-react';
import { getSources } from '@/data/sources';
import type { Source } from '@/data/types';
import { cn } from '@/lib/utils';

const typeLabel: Record<Source['type'], string> = {
  book: 'Scholarship',
  primary: 'Primary source',
  reference: 'Reference',
  web: 'Web',
  institution: 'Institution',
  data: 'Data',
  document: 'Document',
};

export function SourceCitation({ s }: { s: Source }) {
  return (
    <span>
      {s.author && <span className="text-ivory/85">{s.author}, </span>}
      <cite className="not-italic text-ivory">{s.type === 'book' || s.type === 'primary' ? <em>{s.title}</em> : s.title}</cite>
      {s.publisher && <span className="text-ivory/60">. {s.publisher}</span>}
      {s.year && <span className="text-ivory/60">, {s.year}</span>}
      <span className="text-ivory/60">.</span>
      {s.url && (
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="ml-1.5 inline-flex items-center gap-1 text-gold-light underline decoration-gold/40 underline-offset-2 hover:decoration-gold">
          link <ExternalLink className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </span>
  );
}

/** The “Sources & References” block attached to every major section. */
export function SourcesList({ ids, title = 'Sources & references', className, defaultOpen = false }: { ids: string[]; title?: string; className?: string; defaultOpen?: boolean }) {
  const list = getSources(ids);
  if (!list.length) return null;
  return (
    <details className={cn('group rounded-2xl border hairline bg-white/[0.02]', className)} open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2.5">
          <BookMarked className="h-4 w-4 text-gold" aria-hidden="true" />
          <span className="label-caps text-gold-light">{title}</span>
          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[0.65rem] text-gold-light">{list.length}</span>
        </span>
        <span className="text-xs text-ash transition group-open:rotate-180" aria-hidden="true">▾</span>
      </summary>
      <ol className="space-y-2.5 border-t hairline px-5 py-4 text-sm leading-relaxed">
        {list.map((s) => (
          <li key={s.id} className="flex gap-3">
            <span className="mt-0.5 w-24 shrink-0 text-[0.65rem] uppercase tracking-wider text-ash">{typeLabel[s.type]}</span>
            <SourceCitation s={s} />
          </li>
        ))}
      </ol>
    </details>
  );
}
