import type { LonLat } from './territories';

/** Simplified major rivers (hand-traced, schematic). */
export const rivers: { id: string; name: string; path: LonLat[] }[] = [
  { id: 'danube', name: 'Danube', path: [[8.5, 48.0], [10.0, 48.5], [12.1, 49.0], [13.5, 48.55], [14.3, 48.3], [16.37, 48.2], [17.1, 48.1], [18.0, 47.75], [18.9, 47.8], [19.05, 47.5], [18.9, 46.5], [18.8, 45.9], [19.3, 45.25], [20.45, 44.82], [21.4, 44.75], [22.5, 44.65], [22.93, 44.0], [24.0, 43.75], [25.0, 43.65], [25.97, 43.85], [27.26, 44.12], [27.9, 44.6], [27.97, 45.27], [28.1, 45.45], [28.85, 45.3], [29.65, 45.2]] },
  { id: 'nile', name: 'Nile', path: [[32.5, 15.6], [33.6, 17.7], [32.7, 19.4], [31.0, 21.0], [31.4, 21.9], [32.7, 22.5], [32.9, 24.1], [32.7, 25.7], [32.0, 26.2], [31.18, 27.18], [30.8, 28.0], [31.25, 29.0], [31.24, 30.05], [30.9, 30.6], [30.4, 31.4]] },
  { id: 'euphrates', name: 'Euphrates', path: [[41.0, 39.7], [39.5, 39.0], [38.8, 38.7], [38.3, 37.8], [37.95, 37.03], [38.4, 36.4], [39.0, 35.95], [40.14, 35.33], [40.9, 34.45], [42.0, 34.1], [43.4, 33.4], [44.3, 32.5], [45.0, 31.8], [46.26, 31.05], [47.43, 31.0], [48.2, 30.5], [48.6, 29.95]] },
  { id: 'tigris', name: 'Tigris', path: [[39.6, 38.5], [40.23, 37.91], [41.5, 37.4], [42.18, 37.32], [43.13, 36.34], [43.6, 35.5], [43.87, 34.2], [44.36, 33.31], [45.0, 32.8], [45.82, 32.5], [47.15, 31.84], [47.43, 31.0]] },
];

/** Major trade and pilgrimage routes (schematic). */
export const tradeRoutes: { id: string; name: string; kind: 'land' | 'sea' | 'pilgrimage'; path: LonLat[] }[] = [
  { id: 'silk', name: 'Silk route: Tabriz – Erzurum – Bursa', kind: 'land', path: [[46.29, 38.08], [44.0, 39.4], [41.27, 39.9], [39.5, 39.75], [36.55, 40.31], [32.86, 39.93], [29.06, 40.19]] },
  { id: 'aleppo', name: 'Caravan route: Baghdad – Aleppo – Mediterranean', kind: 'land', path: [[44.37, 33.31], [42.0, 34.1], [40.14, 35.33], [38.0, 36.0], [37.16, 36.2], [36.17, 36.58]] },
  { id: 'via-militaris', name: 'Imperial road: Istanbul – Edirne – Belgrade – Buda', kind: 'land', path: [[28.97, 41.01], [26.56, 41.68], [24.75, 42.15], [23.32, 42.7], [21.9, 43.32], [20.46, 44.82], [19.04, 47.5]] },
  { id: 'hajj-damascus', name: 'Pilgrimage route: Damascus – Medina – Mecca', kind: 'pilgrimage', path: [[36.29, 33.51], [35.73, 30.19], [36.57, 28.38], [37.9, 26.6], [39.61, 24.47], [39.83, 21.42]] },
  { id: 'hajj-cairo', name: 'Pilgrimage route: Cairo – Aqaba – Mecca', kind: 'pilgrimage', path: [[31.24, 30.04], [32.55, 29.97], [34.0, 29.6], [35.0, 29.53], [36.6, 27.0], [38.06, 24.09], [39.17, 21.49], [39.83, 21.42]] },
  { id: 'red-sea', name: 'Red Sea spice route: Aden – Jeddah – Suez', kind: 'sea', path: [[45.03, 12.8], [43.3, 13.4], [41.5, 16.5], [39.17, 21.49], [37.0, 25.0], [34.0, 27.5], [32.55, 29.97]] },
  { id: 'levant-sea', name: 'Sea lane: Alexandria – Rhodes – Istanbul', kind: 'sea', path: [[29.92, 31.2], [28.6, 34.5], [28.22, 36.43], [26.7, 37.6], [26.0, 39.0], [26.3, 40.1], [28.97, 41.01]] },
  { id: 'black-sea', name: 'Black Sea lane: Istanbul – Kaffa', kind: 'sea', path: [[28.97, 41.01], [29.4, 41.6], [32.0, 43.2], [35.38, 45.03]] },
];

export const seaLabels: { name: string; at: LonLat; size?: number }[] = [
  { name: 'Mediterranean Sea', at: [19.5, 34.4], size: 1.2 },
  { name: 'Black Sea', at: [34.2, 43.4], size: 1.1 },
  { name: 'Aegean', at: [25.1, 38.6], size: 0.75 },
  { name: 'Adriatic', at: [16.0, 42.6], size: 0.75 },
  { name: 'Red Sea', at: [38.6, 19.6], size: 0.9 },
  { name: 'Persian Gulf', at: [51.0, 27.6], size: 0.85 },
  { name: 'Caspian Sea', at: [50.6, 42.3], size: 0.85 },
];
