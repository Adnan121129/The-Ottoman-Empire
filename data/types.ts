/**
 * Shared content types for every historical dataset on the site.
 *
 * Content lives in /data as plain TypeScript so it is type-checked, tree-shaken
 * and statically rendered. To add a ruler, battle, place or person you only
 * append an object to the relevant array — no component changes are needed.
 */

/** How a statement should be read. Shown with a coloured badge everywhere. */
export type Certainty =
  | 'confirmed' // supported by contemporary documents / broad scholarly consensus
  | 'tradition' // later chronicle tradition, legend or popular belief
  | 'interpretation' // a historian's reading or a widely used framework
  | 'disputed'; // sources or scholars disagree

export interface CertaintyNote {
  kind: Certainty;
  text: string;
}

/** The three-line accuracy summary shown on every profile. */
export interface Assessment {
  certainty: 'high' | 'moderate' | 'low';
  traditions: boolean;
  debate: boolean;
}

export type SourceType = 'book' | 'primary' | 'reference' | 'web' | 'institution' | 'data' | 'document';

export interface Source {
  id: string;
  type: SourceType;
  author?: string;
  title: string;
  publisher?: string;
  year?: string;
  url?: string;
  note?: string;
}

export type Headwear =
  | 'early-turban'
  | 'kavuk'
  | 'grand-turban'
  | 'plumed-turban'
  | 'fez'
  | 'kalpak'
  | 'veil'
  | 'crown-veil'
  | 'turban-small'
  | 'cap';

export type Beard = 'full' | 'long' | 'short' | 'mustache' | 'pointed' | 'none';

export type Palette = 'gold' | 'crimson' | 'emerald' | 'ivory' | 'night' | 'bronze';

/** Parameters for the procedural "Artistic Reconstruction" portrait. */
export interface PortraitSpec {
  headwear: Headwear;
  beard: Beard;
  palette?: Palette;
  facing?: 'left' | 'right';
}

/** Optional real image (e.g. a public-domain painting or photograph). */
export interface MediaImage {
  src: string;
  alt: string;
  credit: string;
  license: string;
  kind: 'public-domain-artwork' | 'photograph' | 'artistic-reconstruction';
  note?: string;
}

export interface Reign {
  start: number;
  end: number;
  label: string;
}

export interface LocationLink {
  placeId: string;
  year?: string;
  text: string;
}

export type TerritorialTrend =
  | 'founding'
  | 'major-expansion'
  | 'expansion'
  | 'stable'
  | 'mixed'
  | 'losses'
  | 'major-losses'
  | 'dissolution';

export interface Ruler {
  id: string;
  order: number;
  name: string;
  epithet?: string;
  turkishName: string;
  ottomanName?: string;
  title: string;
  born?: string;
  died?: string;
  reigns: Reign[];
  reignStart: number;
  reignEnd: number;
  father?: string;
  fatherId?: string;
  mother?: string;
  predecessorId?: string;
  successorId?: string;
  eraId: string;
  featured: boolean;
  /** Short label for rulers whose reign is a historical turning point. */
  turningPoint?: string;
  summary: string;
  biography: string[];
  achievements: string[];
  wars: string[];
  battleIds: string[];
  reforms: string[];
  architecture: string[];
  buildingIds: string[];
  keyEvents: { year: number; text: string }[];
  historicalContext: string;
  legacy: string;
  empireStatus: string;
  territorialChange: { trend: TerritorialTrend; summary: string };
  fate: string;
  assessment: Assessment;
  notes: CertaintyNote[];
  portrait: PortraitSpec;
  image?: MediaImage;
  locations?: LocationLink[];
  sources: string[];
}

export type FigureGroup = 'figures' | 'statesmen' | 'women';

export type FigureCategory =
  | 'founder'
  | 'statesman'
  | 'admiral'
  | 'architect'
  | 'scholar'
  | 'commander'
  | 'consort'
  | 'valide'
  | 'princess'
  | 'reformer'
  | 'revolutionary'
  | 'artist'
  | 'caliph';

export interface Figure {
  id: string;
  name: string;
  altNames?: string[];
  group: FigureGroup;
  category: FigureCategory;
  role: string;
  lifespan: string;
  activeFrom: number;
  activeTo: number;
  featured?: boolean;
  summary: string;
  biography: string[];
  historicalRole: string;
  accomplishments: string[];
  politicalInfluence?: string;
  military?: string[];
  cultural?: string[];
  controversies?: string[];
  significance: string;
  assessment: Assessment;
  notes: CertaintyNote[];
  portrait: PortraitSpec;
  image?: MediaImage;
  relatedRulerIds?: string[];
  buildingIds?: string[];
  battleIds?: string[];
  locations?: LocationLink[];
  sources: string[];
}

export type BattleResult = 'ottoman-victory' | 'ottoman-defeat' | 'inconclusive' | 'mixed';
export type BattleKind = 'battle' | 'siege' | 'naval' | 'campaign';

export interface Movement {
  side: 'ottoman' | 'opponent';
  label: string;
  path: [number, number][];
}

export interface Battle {
  id: string;
  name: string;
  altName?: string;
  date: string;
  year: number;
  endYear?: number;
  kind: BattleKind;
  location: string;
  coords: [number, number];
  ottomanCommanders: string[];
  opponents: string;
  opponentCommanders: string[];
  objective: string;
  outcome: string;
  result: BattleResult;
  summary: string;
  consequences: string[];
  rulerId?: string;
  eraId: string;
  featured?: boolean;
  /** [lonMin, latMin, lonMax, latMax] for the campaign mini-map. */
  view: [number, number, number, number];
  movements: Movement[];
  assessment: Assessment;
  notes: CertaintyNote[];
  sources: string[];
}

export interface War {
  id: string;
  name: string;
  start: number;
  end: number;
  opponents: string;
  outcome: string;
  battleIds?: string[];
}

export type EventCategory =
  | 'political'
  | 'military'
  | 'cultural'
  | 'diplomatic'
  | 'reform'
  | 'dynastic'
  | 'religious'
  | 'economic';

export interface HistoricalEvent {
  id: string;
  year: number;
  month?: number;
  day?: number;
  /** Human-readable date, e.g. "29 May 1453" or "c. 1299". */
  dateLabel: string;
  title: string;
  description: string;
  category: EventCategory;
  importance: 1 | 2 | 3;
  rulerId?: string;
  placeId?: string;
  battleId?: string;
  certainty?: Certainty;
  note?: string;
  sources?: string[];
}

export type PlaceType = 'capital' | 'city' | 'holy-city' | 'port' | 'fortress' | 'battlefield' | 'region';

export interface Place {
  id: string;
  name: string;
  altNames?: string[];
  modern: string;
  coords: [number, number];
  type: PlaceType;
  importance: 1 | 2 | 3;
  ottomanPeriod?: string;
  description: string;
  roles: string[];
  landmarks?: string[];
  events?: { year: string; text: string }[];
  sources?: string[];
}

export type BuildingType =
  | 'mosque'
  | 'palace'
  | 'bridge'
  | 'bazaar'
  | 'madrasa'
  | 'hamam'
  | 'caravanserai'
  | 'fortress'
  | 'complex'
  | 'tower';

export interface Building {
  id: string;
  name: string;
  altName?: string;
  placeId: string;
  type: BuildingType;
  built: string;
  startYear: number;
  endYear: number;
  architect?: string;
  patron?: string;
  summary: string;
  description: string[];
  features: string[];
  facts?: { label: string; value: string }[];
  significance: string;
  unesco?: string;
  /** Position in the stylized Istanbul city scene (if any). */
  istanbul?: { lon: number; lat: number; model: 'mosque' | 'hagia-sophia' | 'palace' | 'tower' | 'bazaar' | 'fortress' | 'mosque-small' };
  notes?: CertaintyNote[];
  sources: string[];
  accent?: Palette;
}

export interface Era {
  id: string;
  name: string;
  start: number;
  end: number;
  range: string;
  tagline: string;
  summary: string;
  status: string;
  tone: 'dawn' | 'rise' | 'shadow' | 'gold' | 'imperial' | 'amber' | 'dusk' | 'night';
}

export interface GlossaryTerm {
  id: string;
  term: string;
  turkish?: string;
  definition: string;
  context: string;
  related?: string[];
}

export interface Fact {
  id: string;
  text: string;
  kind: Certainty;
  sources: string[];
}
