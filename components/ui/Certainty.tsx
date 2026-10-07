import { BookOpenCheck, Feather, Lightbulb, Scale } from 'lucide-react';
import type { Assessment, Certainty, CertaintyNote } from '@/data/types';
import { cn } from '@/lib/utils';

export const certaintyMeta: Record<Certainty, { label: string; short: string; className: string; icon: typeof Scale; description: string }> = {
  confirmed: {
    label: 'Confirmed historical fact',
    short: 'Confirmed',
    className: 'border-jade/40 bg-emerald/25 text-[#9fe0c6]',
    icon: BookOpenCheck,
    description: 'Supported by contemporary documents or broad scholarly consensus.',
  },
  tradition: {
    label: 'Traditional account / legend',
    short: 'Tradition',
    className: 'border-gold/40 bg-gold-dark/20 text-gold-light',
    icon: Feather,
    description: 'Found in later chronicles, legends or popular memory; not securely documented.',
  },
  interpretation: {
    label: 'Interpretation',
    short: 'Interpretation',
    className: 'border-sky-300/30 bg-sky-900/25 text-sky-200',
    icon: Lightbulb,
    description: 'A historian’s reading or an analytical framework rather than a fact.',
  },
  disputed: {
    label: 'Disputed / scholarly debate',
    short: 'Disputed',
    className: 'border-ember/40 bg-wine/30 text-[#f3a4ae]',
    icon: Scale,
    description: 'Sources or scholars disagree.',
  },
};

export function CertaintyBadge({ kind, className, long = false }: { kind: Certainty; className?: string; long?: boolean }) {
  const m = certaintyMeta[kind];
  const Icon = m.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold tracking-wide uppercase', m.className, className)} title={m.description}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {long ? m.label : m.short}
    </span>
  );
}

const certaintyLevel = { high: 'High', moderate: 'Moderate', low: 'Low' } as const;

/** The three-line accuracy summary requested for every profile. */
export function AssessmentPanel({ assessment, className }: { assessment: Assessment; className?: string }) {
  const rows = [
    { label: 'Historical certainty', value: certaintyLevel[assessment.certainty], tone: assessment.certainty === 'high' ? 'text-[#9fe0c6]' : assessment.certainty === 'moderate' ? 'text-gold-light' : 'text-[#f3a4ae]' },
    { label: 'Traditional account', value: assessment.traditions ? 'Present' : 'None significant', tone: assessment.traditions ? 'text-gold-light' : 'text-ivory/70' },
    { label: 'Scholarly debate', value: assessment.debate ? 'Yes' : 'Limited', tone: assessment.debate ? 'text-[#f3a4ae]' : 'text-ivory/70' },
  ];
  return (
    <dl className={cn('grid gap-px overflow-hidden rounded-2xl border hairline bg-gold/10 sm:grid-cols-3', className)}>
      {rows.map((r) => (
        <div key={r.label} className="bg-charcoal/95 px-4 py-3">
          <dt className="label-caps text-ash">{r.label}</dt>
          <dd className={cn('mt-1 font-display text-xl', r.tone)}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function NotesList({ notes, className }: { notes: CertaintyNote[]; className?: string }) {
  if (!notes.length) return null;
  return (
    <ul className={cn('space-y-3', className)}>
      {notes.map((n, i) => (
        <li key={i} className="flex flex-col gap-1.5 rounded-xl border hairline bg-white/[0.02] p-3 sm:flex-row sm:items-start sm:gap-3">
          <CertaintyBadge kind={n.kind} className="shrink-0 self-start" />
          <p className="text-sm leading-relaxed text-ivory/80">{n.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function CertaintyLegend({ className }: { className?: string }) {
  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {(Object.keys(certaintyMeta) as Certainty[]).map((k) => (
        <li key={k} className="rounded-2xl border hairline bg-white/[0.02] p-4">
          <CertaintyBadge kind={k} long />
          <p className="mt-2 text-sm text-ivory/70">{certaintyMeta[k].description}</p>
        </li>
      ))}
    </ul>
  );
}
