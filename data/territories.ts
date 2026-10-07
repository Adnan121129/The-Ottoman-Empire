/**
 * Territorial snapshots of the Ottoman Empire.
 *
 * HOW THIS WORKS
 * The map is built from reusable regions (rough polygons in [lon, lat]).
 * Each region polygon is clipped to Natural Earth coastlines when drawn, so only
 * inland borders are hand-drawn. Each snapshot lists which regions were under
 * direct rule, vassal/autonomous status, or nominal/contested sovereignty.
 *
 * ACCURACY
 * Pre-modern borders were zones rather than lines, and Ottoman authority varied
 * enormously between core provinces, autonomous regencies and tributaries. These
 * outlines are deliberately simplified for teaching and are labelled as such.
 * Principal references: Pitcher, Historical Geography of the Ottoman Empire (1972);
 * Cambridge History of Turkey; Ágoston & Masters, Encyclopedia of the Ottoman Empire.
 */

export type LonLat = [number, number];

export type TerritoryStatus = 'core' | 'vassal' | 'contested' | 'successor';

export interface Region {
  id: string;
  name: string;
  rings: LonLat[][];
}

export interface SnapshotRegion {
  id: string;
  status: TerritoryStatus;
  note?: string;
}

export interface Overlay {
  id: string;
  label: string;
  kind: 'byzantine' | 'occupied';
  rings: LonLat[][];
}

export interface Snapshot {
  year: number;
  label: string;
  title: string;
  caption: string;
  regions: SnapshotRegion[];
  overlays?: Overlay[];
  notes: string[];
}

export const statusLabel: Record<TerritoryStatus, string> = {
  core: 'Direct Ottoman rule',
  vassal: 'Vassal, tributary or autonomous',
  contested: 'Nominal sovereignty / occupied by another power',
  successor: 'Ankara government (Grand National Assembly)',
};

export const regions: Region[] = [
  // ------------------------------------------------------------- Anatolia
  { id: 'bithynia', name: 'Bithynia — Söğüt, Bilecik, Yenişehir', rings: [[[29.3, 40.1], [29.4, 40.38], [30.0, 40.48], [30.65, 40.22], [30.85, 39.8], [30.3, 39.58], [29.6, 39.82]]] },
  { id: 'west-anatolia', name: 'Western Anatolia — Bursa, İznik, Manisa, Aydın, Antalya', rings: [[[26.2, 39.95], [26.6, 40.38], [29.0, 40.98], [29.08, 41.1], [29.15, 41.25], [29.2, 41.5], [31.6, 41.6], [32.2, 40.6], [31.9, 39.5], [31.5, 38.4], [31.7, 37.4], [32.0, 36.3], [30.5, 35.9], [29.0, 36.3], [28.4, 36.55], [27.4, 36.6], [27.1, 37.3], [26.6, 37.9], [26.2, 38.3], [26.4, 38.8], [26.6, 39.15], [26.0, 39.5]]] },
  { id: 'central-north', name: 'North-central Anatolia — Ankara, Amasya, Tokat, Samsun', rings: [[[32.2, 40.6], [33.6, 40.75], [35.0, 41.1], [35.6, 41.7], [36.0, 41.9], [37.8, 41.35], [37.8, 40.6], [37.3, 40.2], [36.5, 40.1], [35.6, 39.5], [34.2, 39.2], [33.0, 39.3], [31.9, 39.5]]] },
  { id: 'kastamonu', name: 'Kastamonu and Sinop', rings: [[[31.6, 41.6], [31.6, 41.95], [33.0, 42.25], [35.2, 42.3], [36.0, 41.9], [35.6, 41.7], [35.0, 41.1], [33.6, 40.75], [32.2, 40.6]]] },
  { id: 'karaman', name: 'Karaman — Konya, Kayseri, Alanya', rings: [[[31.9, 39.5], [33.0, 39.3], [34.2, 39.2], [35.6, 39.5], [36.2, 38.8], [35.8, 37.8], [34.6, 37.3], [34.4, 36.5], [34.4, 36.2], [32.0, 36.3], [31.7, 37.4], [31.5, 38.4]]] },
  { id: 'sivas', name: 'Sivas', rings: [[[35.6, 39.5], [36.5, 40.1], [37.3, 40.2], [37.8, 40.6], [38.6, 40.3], [38.9, 39.4], [38.3, 38.8], [36.6, 38.7], [36.2, 38.8]]] },
  { id: 'trebizond', name: 'Trebizond (Trabzon) coast', rings: [[[37.8, 40.6], [37.8, 41.6], [41.4, 41.75], [41.6, 41.2], [40.5, 40.7], [39.5, 40.5], [38.6, 40.3]]] },
  { id: 'east-anatolia', name: 'Eastern Anatolia — Erzurum, Diyarbakır, Van', rings: [[[38.6, 40.3], [39.5, 40.5], [40.5, 40.7], [41.6, 41.2], [42.0, 40.3], [43.0, 40.0], [43.7, 40.4], [44.4, 39.6], [44.2, 38.4], [44.4, 37.8], [44.8, 37.15], [44.3, 37.3], [42.5, 37.3], [41.3, 37.1], [41.0, 37.05], [40.0, 36.9], [38.0, 36.85], [38.4, 37.6], [38.6, 38.3], [38.3, 38.8], [38.9, 39.4]]] },
  { id: 'cilicia', name: 'Cilicia and Dulkadir — Adana, Maraş, Antep', rings: [[[36.2, 38.8], [36.6, 38.7], [38.3, 38.8], [38.6, 38.3], [38.4, 37.6], [38.0, 36.85], [36.6, 36.85], [36.1, 36.65], [35.6, 36.3], [34.4, 36.2], [34.4, 36.5], [34.6, 37.3], [35.8, 37.8]]] },
  { id: 'kars', name: 'Kars, Ardahan and Batum', rings: [[[41.6, 41.2], [41.4, 41.75], [42.6, 41.6], [43.5, 41.2], [43.7, 40.4], [43.0, 40.0], [42.0, 40.3]]] },
  { id: 'kars-ardahan', name: 'Kars and Ardahan', rings: [[[41.6, 41.2], [41.55, 41.5], [42.6, 41.55], [43.5, 41.2], [43.7, 40.4], [43.0, 40.0], [42.0, 40.3]]] },

  // ------------------------------------------------------------- Balkans
  { id: 'thrace', name: 'Eastern Thrace — Edirne, Gallipoli', rings: [[[26.2, 39.95], [25.8, 40.3], [26.0, 40.75], [26.3, 41.25], [26.3, 41.8], [26.6, 42.0], [27.6, 42.0], [28.05, 41.98], [28.4, 42.1], [29.25, 41.45], [29.15, 41.25], [29.08, 41.1], [29.0, 40.98], [26.6, 40.38]]] },
  { id: 'bulgaria', name: 'Bulgaria', rings: [[[22.6, 44.2], [22.93, 44.0], [23.6, 43.8], [24.6, 43.7], [25.4, 43.62], [26.0, 43.88], [26.6, 44.08], [27.3, 44.12], [28.0, 43.95], [28.7, 43.75], [28.9, 43.4], [28.3, 42.1], [28.05, 41.98], [27.6, 42.0], [26.6, 42.0], [26.3, 41.8], [25.5, 41.4], [24.0, 41.5], [23.0, 41.4], [22.4, 42.2], [22.4, 43.0]]] },
  { id: 'dobruja', name: 'Dobruja', rings: [[[27.3, 44.12], [27.85, 44.6], [27.97, 45.27], [28.1, 45.45], [28.6, 45.3], [29.8, 45.2], [29.8, 44.6], [28.9, 43.9], [28.7, 43.75], [28.0, 43.95]]] },
  { id: 'macedonia', name: 'Macedonia and Western Thrace — Thessaloniki, Skopje', rings: [[[26.3, 41.25], [26.3, 41.8], [25.5, 41.4], [24.0, 41.5], [23.0, 41.4], [22.4, 42.2], [21.9, 42.35], [21.3, 42.2], [20.6, 42.1], [20.5, 41.2], [20.9, 40.5], [21.1, 40.05], [22.6, 40.05], [23.2, 40.0], [24.4, 39.9], [25.6, 40.45], [26.0, 40.75]]] },
  { id: 'thessaly', name: 'Thessaly', rings: [[[21.0, 39.1], [21.1, 40.05], [22.6, 40.05], [23.2, 40.0], [23.45, 39.5], [23.3, 39.05], [22.95, 39.1], [22.4, 39.05]]] },
  { id: 'central-greece', name: 'Central Greece and Attica — Athens, Euboea', rings: [[[20.7, 38.85], [21.0, 39.1], [22.4, 39.05], [22.95, 39.1], [23.3, 39.05], [24.6, 38.75], [24.6, 38.0], [24.1, 37.6], [23.4, 37.9], [23.0, 37.95], [22.9, 38.1], [21.8, 38.38], [21.2, 38.3], [20.65, 38.6]]] },
  { id: 'morea', name: 'The Morea (Peloponnese)', rings: [[[21.0, 38.32], [21.8, 38.33], [22.9, 38.05], [23.25, 37.95], [23.6, 37.35], [23.3, 36.3], [22.4, 36.3], [21.5, 36.6], [21.0, 37.5]]] },
  { id: 'albania', name: 'Albania and Epirus', rings: [[[19.4, 42.6], [20.0, 42.6], [20.6, 42.1], [20.5, 41.2], [20.9, 40.5], [21.1, 40.05], [21.0, 39.1], [20.7, 38.85], [20.6, 39.0], [20.35, 39.3], [20.15, 39.6], [19.9, 39.95], [19.3, 40.5], [19.3, 41.4], [19.2, 41.9], [19.4, 42.3]]] },
  { id: 'serbia', name: 'Serbia — Smederevo, Niš', rings: [[[19.3, 44.3], [20.2, 44.45], [21.0, 44.62], [22.0, 44.6], [22.5, 44.67], [22.66, 44.6], [22.6, 44.2], [22.4, 43.0], [22.4, 42.5], [21.9, 42.35], [21.8, 42.6], [21.5, 43.0], [20.8, 43.3], [20.2, 43.45], [19.4, 43.4], [19.5, 43.9]]] },
  { id: 'kosovo-sanjak', name: 'Kosovo and the Sanjak of Novi Pazar', rings: [[[18.9, 43.3], [19.4, 43.4], [20.2, 43.45], [20.8, 43.3], [21.5, 43.0], [21.8, 42.6], [21.9, 42.35], [21.3, 42.2], [20.6, 42.1], [20.0, 42.6], [19.4, 42.6], [19.0, 42.9]]] },
  { id: 'bosnia', name: 'Bosnia and Herzegovina', rings: [[[15.8, 44.8], [16.2, 45.25], [17.5, 45.15], [19.1, 45.0], [19.4, 44.3], [19.5, 43.9], [19.4, 43.4], [18.9, 43.3], [18.7, 42.6], [18.0, 42.75], [17.6, 43.0], [17.0, 43.5], [16.3, 44.0], [15.9, 44.4]]] },
  { id: 'belgrade', name: 'Belgrade and Syrmia', rings: [[[19.0, 44.95], [19.3, 45.25], [20.3, 45.3], [21.0, 44.95], [21.0, 44.62], [20.2, 44.45], [19.3, 44.3], [19.1, 45.0]]] },
  { id: 'hungary', name: 'Ottoman Hungary — Buda, Pécs, Eger', rings: [[[16.9, 46.4], [17.4, 46.8], [18.4, 47.2], [18.75, 47.8], [19.6, 47.95], [20.4, 48.0], [21.3, 47.6], [21.3, 46.5], [20.3, 46.15], [19.1, 45.85], [18.0, 45.75], [17.2, 45.95]]] },
  { id: 'banat', name: 'Banat of Temeşvar', rings: [[[20.3, 46.15], [21.3, 46.5], [22.4, 45.9], [22.6, 45.3], [22.5, 44.67], [22.0, 44.6], [21.0, 44.62], [21.0, 44.95], [20.3, 45.3], [20.1, 45.6]]] },
  { id: 'slavonia', name: 'Slavonia', rings: [[[16.4, 45.45], [16.8, 45.95], [17.2, 45.95], [18.0, 45.75], [19.1, 45.85], [19.4, 45.25], [19.0, 44.95], [17.5, 45.15], [16.2, 45.25]]] },
  { id: 'budjak', name: 'Budjak — Akkerman, Kilia, Bender', rings: [[[28.2, 45.45], [28.6, 45.3], [29.8, 45.2], [30.3, 45.9], [30.4, 46.3], [29.6, 46.8], [28.6, 46.6], [28.2, 46.0]]] },
  { id: 'wallachia', name: 'Wallachia', rings: [[[22.5, 44.67], [22.66, 44.6], [22.93, 44.0], [23.6, 43.8], [24.6, 43.7], [25.4, 43.62], [26.0, 43.88], [26.6, 44.08], [27.3, 44.12], [27.85, 44.6], [27.97, 45.27], [27.4, 45.6], [26.6, 45.8], [26.0, 45.6], [25.3, 45.5], [24.0, 45.45], [23.0, 45.35], [22.5, 44.9]]] },
  { id: 'moldavia', name: 'Moldavia', rings: [[[25.2, 47.7], [25.8, 48.0], [26.6, 48.3], [27.8, 48.4], [28.7, 48.1], [29.5, 47.6], [29.6, 46.8], [28.6, 46.6], [28.2, 46.0], [28.2, 45.45], [28.1, 45.45], [27.97, 45.27], [27.4, 45.6], [26.6, 45.8], [26.4, 46.0], [25.8, 46.5]]] },
  { id: 'transylvania', name: 'Transylvania', rings: [[[21.5, 46.6], [21.6, 47.3], [22.3, 47.8], [22.9, 47.9], [24.0, 48.0], [25.2, 47.7], [25.8, 46.5], [26.4, 46.0], [26.6, 45.8], [26.0, 45.6], [25.3, 45.5], [24.0, 45.45], [23.0, 45.35], [22.6, 45.3], [22.4, 45.9], [21.3, 46.5]]] },
  { id: 'crimea', name: 'Crimean Khanate', rings: [[[30.4, 46.6], [31.0, 47.6], [33.0, 47.9], [35.5, 47.7], [37.5, 47.3], [39.2, 47.2], [39.5, 46.2], [38.5, 45.3], [37.5, 44.9], [36.0, 44.3], [33.0, 44.3], [32.4, 45.4], [31.5, 46.4]]] },

  // ------------------------------------------------------------- islands
  { id: 'crete', name: 'Crete', rings: [[[23.4, 35.2], [23.5, 35.75], [26.4, 35.4], [26.35, 34.9], [24.5, 34.8]]] },
  { id: 'cyprus', name: 'Cyprus', rings: [[[32.1, 35.0], [32.3, 35.5], [34.7, 35.8], [34.2, 35.2], [33.0, 34.5]]] },
  { id: 'rhodes', name: 'Rhodes and the Dodecanese', rings: [[[27.65, 35.85], [27.65, 36.5], [28.35, 36.5], [28.35, 35.85]], [[26.9, 36.68], [26.9, 36.95], [27.4, 36.95], [27.4, 36.68]]] },
  { id: 'north-aegean', name: 'Northern Aegean islands — Lesbos, Chios, Lemnos, Samos', rings: [[[25.8, 38.95], [25.8, 39.45], [26.62, 39.45], [26.62, 38.95]], [[25.8, 38.13], [25.8, 38.62], [26.2, 38.62], [26.2, 38.13]], [[24.95, 39.75], [24.95, 40.05], [25.45, 40.05], [25.45, 39.75]], [[26.55, 37.62], [26.55, 37.82], [27.08, 37.82], [27.08, 37.62]], [[25.95, 37.5], [25.95, 37.7], [26.4, 37.7], [26.4, 37.5]]] },
  { id: 'cyclades', name: 'The Cyclades', rings: [[[24.2, 36.35], [24.2, 37.7], [26.1, 37.7], [26.1, 36.35]]] },

  // ------------------------------------------------------------- Middle East
  { id: 'syria', name: 'Syria and Lebanon — Aleppo, Damascus, Beirut', rings: [[[36.1, 36.65], [36.6, 36.85], [38.0, 36.85], [40.0, 36.9], [41.0, 37.05], [41.3, 37.1], [41.2, 36.5], [41.2, 34.6], [40.5, 33.3], [38.8, 33.0], [36.5, 32.7], [35.6, 33.25], [35.1, 33.1], [34.9, 33.2], [35.4, 34.6], [35.6, 35.6], [35.6, 36.3]]] },
  { id: 'palestine', name: 'Palestine and Transjordan — Jerusalem', rings: [[[34.2, 31.3], [34.9, 29.5], [36.0, 29.6], [38.0, 30.5], [38.8, 33.0], [36.5, 32.7], [35.6, 33.25], [35.1, 33.1], [34.9, 33.2], [34.3, 31.6]]] },
  { id: 'egypt', name: 'Egypt', rings: [[[25.0, 31.9], [32.0, 31.6], [34.25, 31.35], [34.9, 29.5], [34.4, 28.0], [35.5, 24.0], [37.0, 22.0], [31.3, 22.0], [25.0, 22.0]]] },
  { id: 'hejaz', name: 'The Hejaz — Mecca, Medina, Jeddah', rings: [[[34.95, 29.4], [36.2, 29.3], [37.5, 28.5], [39.5, 26.5], [40.5, 24.5], [41.0, 22.5], [41.8, 20.5], [42.2, 19.2], [41.2, 19.0], [40.0, 20.3], [38.6, 21.5], [37.6, 24.0], [36.0, 26.0], [34.9, 28.0]]] },
  { id: 'yemen', name: 'Yemen', rings: [[[42.6, 17.5], [44.0, 17.5], [45.0, 16.5], [45.5, 15.0], [45.2, 13.5], [44.0, 12.6], [43.3, 12.6], [42.6, 14.5], [42.4, 16.0]]] },
  { id: 'iraq', name: 'Iraq — Baghdad and Basra', rings: [[[41.2, 34.6], [43.5, 34.4], [45.6, 34.5], [45.8, 33.6], [46.6, 32.9], [47.6, 32.0], [48.0, 31.0], [48.6, 30.2], [48.4, 29.4], [47.1, 29.0], [46.5, 29.1], [44.7, 29.2], [42.0, 31.2], [40.3, 32.3], [40.5, 33.3]]] },
  { id: 'mosul', name: 'Mosul and Shahrizor', rings: [[[41.2, 36.5], [41.3, 37.1], [42.5, 37.3], [44.3, 37.3], [44.8, 37.15], [45.5, 36.0], [46.1, 35.2], [45.6, 34.5], [43.5, 34.4], [41.2, 34.6]]] },
  { id: 'al-hasa', name: 'Al-Hasa (eastern Arabia)', rings: [[[47.6, 28.5], [48.9, 27.6], [50.3, 26.3], [51.7, 26.2], [51.7, 24.5], [50.0, 24.5], [49.0, 24.5], [47.5, 25.5], [47.0, 27.0]]] },
  { id: 'caucasus', name: 'Georgia, Shirvan and Azerbaijan (Tabriz)', rings: [[[41.4, 41.75], [41.5, 42.6], [42.0, 43.2], [44.5, 43.2], [46.5, 42.5], [48.5, 41.9], [49.8, 40.8], [49.5, 39.5], [48.2, 38.4], [47.8, 37.4], [46.5, 37.0], [44.8, 37.15], [44.4, 37.8], [44.2, 38.4], [44.4, 39.6], [43.7, 40.4], [43.5, 41.2], [42.6, 41.6]]] },

  // ------------------------------------------------------------- North Africa
  { id: 'algiers', name: 'Regency of Algiers', rings: [[[-2.0, 35.2], [-1.8, 34.0], [0.0, 33.3], [3.0, 33.0], [6.0, 33.0], [8.3, 33.5], [8.4, 35.5], [8.6, 37.2], [3.0, 37.3], [-1.0, 36.0]]] },
  { id: 'tunis', name: 'Tunis', rings: [[[8.4, 35.5], [8.6, 37.2], [11.2, 37.5], [11.6, 35.5], [11.6, 33.2], [10.2, 32.4], [9.0, 32.3], [8.3, 33.5]]] },
  { id: 'tripoli', name: 'Tripolitania and Cyrenaica', rings: [[[11.6, 33.2], [11.6, 30.5], [15.0, 29.0], [19.0, 28.5], [23.0, 29.0], [25.0, 30.0], [25.0, 32.0], [23.0, 33.3], [20.0, 33.0], [15.0, 32.6], [13.0, 33.2]]] },
];

export const regionById: Record<string, Region> = Object.fromEntries(regions.map((r) => [r.id, r]));

const ANATOLIA = ['west-anatolia', 'central-north', 'kastamonu', 'karaman', 'sivas', 'trebizond', 'east-anatolia', 'cilicia'];
const core = (ids: string[]): SnapshotRegion[] => ids.map((id) => ({ id, status: 'core' }));
const vassal = (ids: string[]): SnapshotRegion[] => ids.map((id) => ({ id, status: 'vassal' }));

const constantinopleByzantine: Overlay = {
  id: 'byzantine-constantinople',
  label: 'Byzantine Constantinople',
  kind: 'byzantine',
  rings: [[[28.45, 41.05], [28.5, 41.3], [29.15, 41.3], [29.08, 41.1], [29.0, 40.98], [28.6, 40.95]]],
};

export const snapshots: Snapshot[] = [
  {
    year: 1300,
    label: '1300',
    title: 'c. 1300 · Osman’s principality',
    caption: 'A small frontier principality around Söğüt in Bithynia, one of many Turkmen beyliks that emerged from the collapse of Seljuk Anatolia.',
    regions: core(['bithynia']),
    notes: ['The extent of the earliest principality is not known precisely; this outline is indicative.'],
  },
  {
    year: 1400,
    label: '1400',
    title: 'c. 1400 · On the eve of Ankara',
    caption: 'Bayezid I ruled from the Danube to the Euphrates, surrounding Byzantine Constantinople. Within two years Timur would undo his Anatolian conquests.',
    regions: [
      ...core(['west-anatolia', 'central-north', 'kastamonu', 'karaman', 'sivas', 'thrace', 'bulgaria', 'macedonia', 'thessaly']),
      { id: 'dobruja', status: 'contested', note: 'Contested with Wallachia' },
      ...vassal(['serbia', 'kosovo-sanjak', 'central-greece']),
      { id: 'albania', status: 'vassal', note: 'Partly under Ottoman control; local lords tributary' },
      { id: 'wallachia', status: 'contested', note: 'Tribute paid intermittently by Mircea the Elder' },
    ],
    overlays: [constantinopleByzantine],
    notes: ['Constantinople remained Byzantine (shown separately).', 'Thessaloniki was in Ottoman hands from 1387 to 1403.'],
  },
  {
    year: 1453,
    label: '1453',
    title: '1453 · After the conquest',
    caption: 'With Constantinople taken in May 1453, the Ottoman lands in Europe and Asia were joined. Karaman, Kastamonu–Sinop and Trebizond were still independent.',
    regions: [
      ...core(['west-anatolia', 'central-north', 'sivas', 'thrace', 'bulgaria', 'dobruja', 'macedonia', 'thessaly']),
      ...vassal(['central-greece', 'serbia', 'kosovo-sanjak', 'morea', 'wallachia']),
      { id: 'albania', status: 'contested', note: 'Resistance led by Skanderbeg' },
    ],
    notes: ['The map shows the situation at the end of 1453.', 'Serbia, the Byzantine Morea and Wallachia were tributary vassals.'],
  },
  {
    year: 1500,
    label: '1500',
    title: '1500 · Masters of the Balkans and the Black Sea',
    caption: 'Mehmed II and Bayezid II had absorbed Serbia, Bosnia, Greece, Trebizond and Karaman; the Crimean Khanate and the Danubian principalities were vassals.',
    regions: [
      ...core(['west-anatolia', 'central-north', 'kastamonu', 'karaman', 'sivas', 'trebizond', 'thrace', 'bulgaria', 'dobruja', 'macedonia', 'thessaly', 'central-greece', 'morea', 'albania', 'serbia', 'kosovo-sanjak', 'bosnia', 'budjak', 'north-aegean']),
      ...vassal(['wallachia', 'moldavia', 'crimea']),
    ],
    notes: ['Venice still held several Greek ports and islands.', 'Belgrade remained Hungarian until 1521.'],
  },
  {
    year: 1520,
    label: '1520',
    title: '1520 · After Selim I',
    caption: 'Selim I’s conquests added eastern Anatolia, Syria, Palestine and Egypt; the Sharif of Mecca recognized Ottoman overlordship and Algiers came under Ottoman sovereignty.',
    regions: [
      ...core([...ANATOLIA, 'thrace', 'bulgaria', 'dobruja', 'macedonia', 'thessaly', 'central-greece', 'morea', 'albania', 'serbia', 'kosovo-sanjak', 'bosnia', 'budjak', 'north-aegean', 'syria', 'palestine', 'egypt']),
      ...vassal(['wallachia', 'moldavia', 'crimea', 'hejaz']),
      { id: 'algiers', status: 'vassal', note: 'Hayreddin Barbarossa accepts Ottoman sovereignty (1519); control limited to the coast' },
    ],
    notes: ['Van and parts of the eastern frontier were secured only later.'],
  },
  {
    year: 1566,
    label: '1566',
    title: '1566 · The death of Süleyman',
    caption: 'Hungary, Iraq, the Red Sea coast and Libya had been added. The empire spanned three continents, from Algiers to Baghdad and from Buda to Aden.',
    regions: [
      ...core([...ANATOLIA, 'thrace', 'bulgaria', 'dobruja', 'macedonia', 'thessaly', 'central-greece', 'morea', 'albania', 'serbia', 'kosovo-sanjak', 'bosnia', 'belgrade', 'hungary', 'banat', 'slavonia', 'budjak', 'north-aegean', 'rhodes', 'syria', 'palestine', 'egypt', 'iraq', 'mosul', 'al-hasa', 'yemen', 'algiers', 'tripoli']),
      ...vassal(['wallachia', 'moldavia', 'transylvania', 'crimea', 'hejaz']),
    ],
    notes: ['Ottoman control in Yemen and al-Hasa was often contested by local powers.', 'Tunis was not yet Ottoman (taken definitively in 1574).'],
  },
  {
    year: 1600,
    label: '1600',
    title: '1600 · The eastern high-water mark',
    caption: 'Cyprus (1571) and Tunis (1574) had been added, and the war of 1578–90 brought Georgia, Shirvan and Tabriz briefly under Ottoman rule.',
    regions: [
      ...core([...ANATOLIA, 'kars', 'thrace', 'bulgaria', 'dobruja', 'macedonia', 'thessaly', 'central-greece', 'morea', 'albania', 'serbia', 'kosovo-sanjak', 'bosnia', 'belgrade', 'hungary', 'banat', 'slavonia', 'budjak', 'north-aegean', 'cyclades', 'rhodes', 'cyprus', 'syria', 'palestine', 'egypt', 'iraq', 'mosul', 'al-hasa', 'yemen', 'algiers', 'tunis', 'tripoli', 'caucasus']),
      ...vassal(['wallachia', 'moldavia', 'transylvania', 'crimea', 'hejaz']),
    ],
    notes: ['The Caucasus and Azerbaijan were lost to Shah Abbas I in 1603–1612.', 'The Long Turkish War (1593–1606) was still being fought in Hungary.'],
  },
  {
    year: 1700,
    label: '1700',
    title: '1700 · After Karlowitz',
    caption: 'Crete had been conquered (1669), but the Treaty of Karlowitz (1699) ceded Hungary, Transylvania, Podolia and the Morea. North Africa’s regencies were largely autonomous.',
    regions: [
      ...core([...ANATOLIA, 'kars', 'thrace', 'bulgaria', 'dobruja', 'macedonia', 'thessaly', 'central-greece', 'albania', 'serbia', 'kosovo-sanjak', 'bosnia', 'belgrade', 'banat', 'budjak', 'north-aegean', 'cyclades', 'rhodes', 'crete', 'cyprus', 'syria', 'palestine', 'egypt', 'iraq', 'mosul']),
      ...vassal(['wallachia', 'moldavia', 'crimea', 'hejaz', 'algiers', 'tunis', 'tripoli']),
    ],
    notes: ['The Morea was Venetian from 1699 to 1715.', 'Yemen had been lost in 1635 and al-Hasa around 1670.'],
  },
  {
    year: 1800,
    label: '1800',
    title: '1800 · Reform and the age of the notables',
    caption: 'Russia had annexed the Crimea (1783) and the French occupied Egypt (1798–1801). Provincial notables and autonomous governors exercised great power.',
    regions: [
      ...core([...ANATOLIA, 'kars', 'thrace', 'bulgaria', 'dobruja', 'macedonia', 'thessaly', 'central-greece', 'morea', 'albania', 'serbia', 'kosovo-sanjak', 'bosnia', 'belgrade', 'budjak', 'north-aegean', 'cyclades', 'rhodes', 'crete', 'cyprus', 'syria', 'palestine', 'iraq', 'mosul']),
      ...vassal(['wallachia', 'moldavia', 'hejaz', 'algiers', 'tunis', 'tripoli']),
      { id: 'egypt', status: 'contested', note: 'French occupation, 1798–1801' },
    ],
    notes: ['Iraq was governed by autonomous Mamluk pashas.', 'Wahhabi forces would take Mecca in 1803.'],
  },
  {
    year: 1878,
    label: '1878',
    title: '1878 · After the Congress of Berlin',
    caption: 'Serbia, Montenegro and Romania became independent; Bulgaria autonomous; Bosnia was occupied by Austria-Hungary and Cyprus administered by Britain. Kars, Ardahan and Batum went to Russia.',
    regions: [
      ...core(['west-anatolia', 'central-north', 'kastamonu', 'karaman', 'sivas', 'trebizond', 'east-anatolia', 'cilicia', 'thrace', 'macedonia', 'thessaly', 'albania', 'kosovo-sanjak', 'crete', 'rhodes', 'north-aegean', 'syria', 'palestine', 'iraq', 'mosul', 'al-hasa', 'hejaz', 'yemen', 'tripoli']),
      { id: 'bulgaria', status: 'vassal', note: 'Autonomous Principality of Bulgaria and autonomous Eastern Rumelia' },
      { id: 'egypt', status: 'vassal', note: 'Autonomous Khedivate (British occupation from 1882)' },
      { id: 'tunis', status: 'vassal', note: 'Autonomous beylik (French protectorate from 1881)' },
      { id: 'bosnia', status: 'contested', note: 'Occupied by Austria-Hungary; annexed 1908' },
      { id: 'cyprus', status: 'contested', note: 'British administration; formally Ottoman until 1914' },
    ],
    notes: ['Thessaly was ceded to Greece in 1881.', 'Algeria had been French since 1830; Greece independent since 1830.'],
  },
  {
    year: 1914,
    label: '1914',
    title: '1914 · Entering the First World War',
    caption: 'The Italo-Ottoman War (1911–12) and the Balkan Wars (1912–13) had stripped away Libya and almost all European territory. The empire was now centred on Anatolia and the Arab provinces.',
    regions: [
      ...core([...ANATOLIA, 'thrace', 'syria', 'palestine', 'iraq', 'mosul', 'hejaz']),
      { id: 'yemen', status: 'vassal', note: 'Autonomy of the Imam under the Treaty of Da’an (1911)' },
      { id: 'egypt', status: 'contested', note: 'Nominally Ottoman under British occupation; British protectorate declared December 1914' },
      { id: 'cyprus', status: 'contested', note: 'Annexed by Britain, November 1914' },
    ],
    notes: ['Al-Hasa was taken by Ibn Saud in 1913.', 'The Dodecanese were occupied by Italy in 1912; Crete united with Greece in 1913.'],
  },
  {
    year: 1918,
    label: '1918',
    title: '1918 · The Armistice of Mudros',
    caption: 'On 30 October 1918 the Ottoman government signed the armistice. The Arab provinces had been lost; Kars, Ardahan and Batum had been recovered from Russia earlier in the year.',
    regions: [...core([...ANATOLIA, 'kars', 'thrace']), { id: 'mosul', status: 'contested', note: 'Occupied by British forces days after the armistice' }],
    notes: ['The Ottoman garrison of Medina held out until January 1919.', 'Allied warships anchored off Istanbul on 13 November 1918.'],
  },
  {
    year: 1922,
    label: '1922',
    title: '1922 · The end of the Sultanate',
    caption: 'After the nationalist victory, the Grand National Assembly in Ankara abolished the Sultanate on 1 November 1922. The territory shown is that controlled by the Ankara government, which became the Republic of Turkey in 1923.',
    regions: [...ANATOLIA, 'kars-ardahan', 'thrace'].map((id) => ({ id, status: 'successor' as const })),
    overlays: [
      {
        id: 'allied-straits',
        label: 'Istanbul and the Straits under Allied occupation (until 1923)',
        kind: 'occupied',
        rings: [[[26.0, 40.0], [26.4, 40.6], [27.6, 41.05], [28.4, 41.3], [29.3, 41.3], [29.45, 41.0], [29.2, 40.8], [27.4, 40.3], [26.5, 39.95]]],
      },
    ],
    notes: ['The Ottoman government in Istanbul had little effective authority by 1922.', 'The Caliphate continued under Abdülmecid II until 3 March 1924.'],
  },
];

export function snapshotForYear(year: number): Snapshot {
  let found = snapshots[0];
  for (const s of snapshots) if (s.year <= year) found = s;
  return found;
}
