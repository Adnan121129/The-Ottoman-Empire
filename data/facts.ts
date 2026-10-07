import type { Fact } from './types';

/** “Did you know?” discoveries scattered through the site (and the hidden archive). */
export const facts: Fact[] = [
  { id: 'leonardo', text: 'Around 1502 Leonardo da Vinci offered Sultan Bayezid II a design for a single-span bridge over the Golden Horn. A draft letter survives in the Topkapı archives and a sketch in Leonardo’s notebooks. It was never built.', kind: 'confirmed', sources: ['babinger-leonardo'] },
  { id: 'cervantes', text: 'Miguel de Cervantes, author of Don Quixote, was wounded at the Battle of Lepanto in 1571 and later spent five years as a captive in Ottoman Algiers.', kind: 'confirmed', sources: ['hess-frontier', 'brit-lepanto'] },
  { id: 'belgrade-mohacs', text: 'Süleyman captured Belgrade on 29 August 1521 and won at Mohács on 29 August 1526 — the same calendar day, five years apart.', kind: 'confirmed', sources: ['agoston-last'] },
  { id: 'selim3-composer', text: 'Sultan Selim III was a serious composer of Ottoman classical music; his works are still performed today.', kind: 'confirmed', sources: ['feldman-music'] },
  { id: 'ships-overland', text: 'On 22 April 1453 the Ottomans dragged dozens of ships overland behind Galata into the Golden Horn, bypassing the great chain that closed the harbour.', kind: 'confirmed', sources: ['barbaro', 'runciman-1453'] },
  { id: 'piri-map', text: 'Piri Reis’s world map of 1513 says it drew on about twenty sources, including a map used by Christopher Columbus. Claims that it shows Antarctica are rejected by historians.', kind: 'confirmed', sources: ['mcintosh-piri'] },
  { id: 'tulip-era', text: 'Nobody in the 1720s called their time the “Tulip Era”. The name was coined almost two centuries later.', kind: 'interpretation', sources: ['erimtan-tulip'] },
  { id: 'caliphate-1517', text: 'The famous story that the last Abbasid caliph handed the caliphate to Selim I in Cairo in 1517 appears only in sources written more than 250 years later.', kind: 'tradition', sources: ['hassan-caliphate'] },
  { id: 'sultan-women', text: 'The phrase “Sultanate of Women” was coined in 1916 by the historian Ahmed Refik — not by contemporaries of Kösem or Hürrem.', kind: 'interpretation', sources: ['peirce-harem'] },
  { id: 'coffee', text: 'Istanbul’s first coffee-houses are reported to have opened in the 1550s. Within a century, sultans had tried — and failed — to close them.', kind: 'confirmed', sources: ['hattox-coffee'] },
  { id: 'kanuni', text: 'Süleyman wrote poetry under the pen name Muhibbî, “the affectionate one”.', kind: 'confirmed', sources: ['cht-2'] },
  { id: 'hezarfen', text: 'Evliya Çelebi tells of Hezarfen Ahmed Çelebi gliding from the Galata Tower across the Bosphorus with artificial wings. No other source mentions it — historians treat it as legend.', kind: 'tradition', sources: ['dankoff-evliya'] },
  { id: 'abdulmecid-ireland', text: 'During the Irish famine of 1847 Sultan Abdülmecid donated £1,000. The popular tale that he secretly sent grain ships to Drogheda is not documented.', kind: 'tradition', sources: ['kinealy-charity'] },
  { id: 'galata-genoese', text: 'The Galata Tower is older than Ottoman Istanbul: the Genoese built it in 1348, a century before the conquest.', kind: 'confirmed', sources: ['mansel-constantinople'] },
  { id: 'murad5-93', text: 'Murad V reigned for just 93 days in 1876 — then lived 28 more years confined in the Çırağan Palace.', kind: 'confirmed', sources: ['hanioglu-brief'] },
  { id: 'caliph-painter', text: 'The last Ottoman caliph, Abdülmecid II, was an accomplished painter whose works hang in the Istanbul Museum of Painting and Sculpture.', kind: 'confirmed', sources: ['hassan-caliphate'] },
  { id: 'two-dates', text: 'The Sultanate was abolished on 1 November 1922; the Caliphate survived for another sixteen months, until 3 March 1924.', kind: 'confirmed', sources: ['tbmm-1922', 'tbmm-1924'] },
  { id: 'sahn', text: 'The eight madrasas around Mehmed II’s mosque — the Sahn-ı Seman — were the top of the Ottoman academic ladder for nearly a century.', kind: 'confirmed', sources: ['inalcik-classical'] },
  { id: 'jews-1492', text: 'After 1492 Salonica became one of the largest Jewish cities in the world; Ladino was spoken in its streets for over four centuries.', kind: 'confirmed', sources: ['mazower-salonica'] },
];
