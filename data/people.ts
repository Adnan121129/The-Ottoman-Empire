import type { Figure } from './types';
import { figures } from './figures';
import { statesmen } from './statesmen';
import { women } from './women';

/** Every non-sultan profile on the site. */
export const allFigures: Figure[] = [...figures, ...statesmen, ...women];

export const figureById: Record<string, Figure> = Object.fromEntries(allFigures.map((f) => [f.id, f]));

export function getFigure(id: string | undefined): Figure | undefined {
  return id ? figureById[id] : undefined;
}

export const categoryLabel: Record<Figure['category'], string> = {
  founder: 'Founder',
  statesman: 'Statesman',
  admiral: 'Admiral',
  architect: 'Architect',
  scholar: 'Scholar',
  commander: 'Commander',
  consort: 'Consort',
  valide: 'Valide Sultan',
  princess: 'Princess',
  reformer: 'Reformer',
  revolutionary: 'Political leader',
  artist: 'Artist & writer',
  caliph: 'Caliph',
};

export { figures, statesmen, women };
