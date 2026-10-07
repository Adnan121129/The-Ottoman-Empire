/**
 * Validates cross-references between datasets (sources, places, battles,
 * buildings, rulers, eras, regions). Run with: npm run validate:data
 */
import { rulers, rulerById } from '../data/rulers';
import { allFigures, figureById } from '../data/people';
import { battles, battleById } from '../data/battles';
import { events } from '../data/events';
import { places, placeById } from '../data/places';
import { buildings, buildingById } from '../data/buildings';
import { sourceById } from '../data/sources';
import { eraById } from '../data/eras';
import { regionById, snapshots } from '../data/territories';
import { facts } from '../data/facts';
import { glossary } from '../data/glossary';
import { wars } from '../data/wars';
import { cultureTopics } from '../data/narratives';
import { timelineEntries } from '../data/timeline';

const errors: string[] = [];
const check = (cond: unknown, msg: string) => {
  if (!cond) errors.push(msg);
};
const unique = (ids: string[], label: string) => {
  const seen = new Set<string>();
  for (const id of ids) {
    check(!seen.has(id), `Duplicate ${label} id: ${id}`);
    seen.add(id);
  }
};

unique(rulers.map((r) => r.id), 'ruler');
unique(allFigures.map((f) => f.id), 'figure');
unique(battles.map((b) => b.id), 'battle');
unique(events.map((e) => e.id), 'event');
unique(places.map((p) => p.id), 'place');
unique(buildings.map((b) => b.id), 'building');
unique(glossary.map((g) => g.id), 'glossary');
unique([...rulers.map((r) => r.id), ...allFigures.map((f) => f.id)], 'person (ruler/figure overlap)');

const src = (ids: string[] | undefined, where: string) => (ids ?? []).forEach((s) => check(sourceById[s], `${where}: unknown source "${s}"`));

for (const r of rulers) {
  src(r.sources, `ruler ${r.id}`);
  check(eraById[r.eraId], `ruler ${r.id}: unknown era ${r.eraId}`);
  r.battleIds.forEach((b) => check(battleById[b], `ruler ${r.id}: unknown battle ${b}`));
  r.buildingIds.forEach((b) => check(buildingById[b], `ruler ${r.id}: unknown building ${b}`));
  r.locations?.forEach((l) => check(placeById[l.placeId], `ruler ${r.id}: unknown place ${l.placeId}`));
  if (r.fatherId) check(rulerById[r.fatherId], `ruler ${r.id}: unknown father ${r.fatherId}`);
  if (r.predecessorId) check(rulerById[r.predecessorId], `ruler ${r.id}: unknown predecessor`);
  if (r.successorId) check(rulerById[r.successorId], `ruler ${r.id}: unknown successor`);
  check(r.sources.length > 0, `ruler ${r.id}: no sources`);
}
for (const f of allFigures) {
  src(f.sources, `figure ${f.id}`);
  f.relatedRulerIds?.forEach((id) => check(rulerById[id], `figure ${f.id}: unknown ruler ${id}`));
  f.battleIds?.forEach((id) => check(battleById[id], `figure ${f.id}: unknown battle ${id}`));
  f.buildingIds?.forEach((id) => check(buildingById[id], `figure ${f.id}: unknown building ${id}`));
  f.locations?.forEach((l) => check(placeById[l.placeId], `figure ${f.id}: unknown place ${l.placeId}`));
  check(f.sources.length > 0, `figure ${f.id}: no sources`);
}
for (const b of battles) {
  src(b.sources, `battle ${b.id}`);
  check(eraById[b.eraId], `battle ${b.id}: unknown era`);
  if (b.rulerId) check(rulerById[b.rulerId], `battle ${b.id}: unknown ruler ${b.rulerId}`);
  check(b.movements.every((m) => m.path.length >= 2), `battle ${b.id}: movement with < 2 points`);
}
for (const e of events) {
  src(e.sources, `event ${e.id}`);
  if (e.rulerId) check(rulerById[e.rulerId], `event ${e.id}: unknown ruler ${e.rulerId}`);
  if (e.placeId) check(placeById[e.placeId], `event ${e.id}: unknown place ${e.placeId}`);
  if (e.battleId) check(battleById[e.battleId], `event ${e.id}: unknown battle ${e.battleId}`);
  if (e.month) check(e.month >= 1 && e.month <= 12 && e.day && e.day >= 1 && e.day <= 31, `event ${e.id}: bad date`);
}
for (const p of places) src(p.sources, `place ${p.id}`);
for (const b of buildings) {
  src(b.sources, `building ${b.id}`);
  check(placeById[b.placeId], `building ${b.id}: unknown place ${b.placeId}`);
}
for (const f of facts) src(f.sources, `fact ${f.id}`);
for (const c of cultureTopics) src(c.sources, `culture ${c.id}`);
for (const w of wars) w.battleIds?.forEach((id) => check(battleById[id], `war ${w.id}: unknown battle ${id}`));
for (const s of snapshots) {
  s.regions.forEach((r) => check(regionById[r.id], `snapshot ${s.year}: unknown region ${r.id}`));
}
for (const g of glossary) g.related?.forEach((id) => check(glossary.some((x) => x.id === id), `glossary ${g.id}: unknown related ${id}`));
for (const t of timelineEntries) check(eraById[t.eraId], `timeline ${t.id}: unknown era`);
check(rulers.length === 36, `Expected 36 rulers, found ${rulers.length}`);
check(figureById['abdulmejid-ii'], 'Abdülmecid II profile missing');

if (errors.length) {
  console.error(`✖ ${errors.length} data error(s):\n` + errors.map((e) => '  • ' + e).join('\n'));
  process.exit(1);
}
console.log(`✔ Data valid: ${rulers.length} rulers, ${allFigures.length} figures, ${battles.length} battles, ${events.length} events, ${places.length} places, ${buildings.length} buildings, ${glossary.length} glossary terms, ${snapshots.length} map snapshots.`);
