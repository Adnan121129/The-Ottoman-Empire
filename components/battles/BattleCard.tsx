import type { Battle } from '@/data/types';
import { kindLabel, resultLabel } from '@/data/battles';
import { cn } from '@/lib/utils';

export const resultTone: Record<Battle['result'], string> = {
  'ottoman-victory': 'bg-gold-light',
  'ottoman-defeat': 'bg-[#f07a8a]',
  inconclusive: 'bg-ash',
  mixed: 'bg-sky-300',
};

export function BattleCard({ battle, active, onSelect }: { battle: Battle; active?: boolean; onSelect?: () => void }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className={cn('flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition', active ? 'border-gold/60 bg-gold/10' : 'hairline bg-white/[0.02] hover:border-gold/30')}
    >
      <span className="w-12 shrink-0 font-display text-xl text-gold-light">{battle.year}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-ivory">{battle.name}</span>
        <span className="block truncate text-xs text-ash">
          {kindLabel[battle.kind]} · {battle.location}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5 text-[0.6rem] text-ash" title={resultLabel[battle.result]}>
        <span className={cn('h-2 w-2 rounded-full', resultTone[battle.result])} aria-hidden="true" />
        <span className="hidden sm:inline">{resultLabel[battle.result]}</span>
      </span>
    </button>
  );
}
