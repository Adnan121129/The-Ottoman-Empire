import type { Era } from './types';

/**
 * Historical eras used by the timeline, the Time Machine and section theming.
 * Era boundaries are conventions for navigation, not hard historical breaks.
 */
export const eras: Era[] = [
  {
    id: 'origins',
    name: 'Origins',
    start: 1280,
    end: 1324,
    range: 'c. 1280 – c. 1324',
    tagline: 'A frontier principality on the edge of Byzantium',
    summary:
      'In the late thirteenth century, after the collapse of Seljuk authority in Anatolia, a small Turkmen principality led by Osman emerged in Bithynia, on the frontier with the Byzantine Empire. Almost everything about these decades is known from chronicles written more than a century later, so the founding story mixes documented fact with dynastic tradition.',
    status: 'Frontier principality (beylik) in north-western Anatolia',
    tone: 'dawn',
  },
  {
    id: 'foundation',
    name: 'Foundation & Expansion',
    start: 1324,
    end: 1402,
    range: '1324 – 1402',
    tagline: 'From Bursa to the Danube',
    summary:
      'Under Orhan, Murad I and Bayezid I the principality took Bursa, crossed into Europe at Gallipoli and expanded rapidly through the Balkans and Anatolia. Institutions that would define the state — a salaried standing army, the timar land-grant system and a palace-centred administration — took shape in this period.',
    status: 'Rapidly expanding sultanate spanning Anatolia and the Balkans',
    tone: 'rise',
  },
  {
    id: 'interregnum',
    name: 'Interregnum',
    start: 1402,
    end: 1413,
    range: '1402 – 1413',
    tagline: 'Defeat at Ankara and a war between brothers',
    summary:
      'Timur’s victory at Ankara in 1402 shattered the young empire. Bayezid I died in captivity and his sons fought an eleven-year civil war. That the state survived at all — and reunited under Mehmed I — is one of the striking facts of Ottoman history.',
    status: 'Fractured: civil war among Bayezid’s sons; Timurid overlordship in Anatolia',
    tone: 'shadow',
  },
  {
    id: 'restoration',
    name: 'Restoration',
    start: 1413,
    end: 1451,
    range: '1413 – 1451',
    tagline: 'Rebuilding the state',
    summary:
      'Mehmed I and Murad II restored central authority, reabsorbed Anatolian principalities and defeated major crusading coalitions at Varna (1444) and Kosovo (1448). Edirne flourished as the dynasty’s principal seat.',
    status: 'Reunified and recovering; renewed Balkan expansion',
    tone: 'rise',
  },
  {
    id: 'imperial',
    name: 'Imperial Transformation',
    start: 1451,
    end: 1512,
    range: '1451 – 1512',
    tagline: 'Constantinople becomes Kostantiniyye',
    summary:
      'Mehmed II’s conquest of Constantinople in 1453 turned a regional sultanate into an empire with universal claims. A new capital, a new palace and new law codes followed. Bayezid II consolidated these gains, built up the navy and weathered a dynastic crisis.',
    status: 'Imperial power governing from a new capital at Constantinople',
    tone: 'imperial',
  },
  {
    id: 'eastern',
    name: 'Eastern Expansion',
    start: 1512,
    end: 1520,
    range: '1512 – 1520',
    tagline: 'Chaldiran, Cairo and the Holy Cities',
    summary:
      'In eight years Selim I defeated the Safavids at Chaldiran and destroyed the Mamluk Sultanate, bringing Syria, Egypt and the protectorship of Mecca and Medina under Ottoman rule. The empire’s centre of gravity, revenues and religious identity changed profoundly.',
    status: 'Roughly doubled in size; ruler of the Arab heartlands and protector of the Holy Cities',
    tone: 'amber',
  },
  {
    id: 'golden',
    name: 'Golden Age',
    start: 1520,
    end: 1566,
    range: '1520 – 1566',
    tagline: 'The age of Süleyman',
    summary:
      'Süleyman’s 46-year reign brought Hungary, Iraq and much of North Africa under Ottoman control, made the fleet dominant in the eastern Mediterranean, and saw an extraordinary flowering of law, architecture and letters. “Golden Age” is a later label; contemporaries also experienced the period as one of costly wars and dynastic tragedy.',
    status: 'At or near its greatest extent; one of the great powers of the world',
    tone: 'gold',
  },
  {
    id: 'transformation',
    name: 'Transformation',
    start: 1566,
    end: 1695,
    range: '1566 – 1695',
    tagline: 'New politics, new pressures',
    summary:
      'Sultans increasingly ruled from the palace while viziers, royal women, the Janissaries and the religious establishment competed for influence. Historians once called this “decline”; most now describe a transformation in which the empire adapted to inflation, new military technology and a changing world economy — and remained a formidable power, conquering Crete and besieging Vienna in 1683.',
    status: 'Large and resilient; institutions and politics transforming',
    tone: 'imperial',
  },
  {
    id: 'late',
    name: 'Late Empire · Contest & Adaptation',
    start: 1695,
    end: 1789,
    range: '1695 – 1789',
    tagline: 'Karlowitz, the Tulip period and Küçük Kaynarca',
    summary:
      'The Treaty of Karlowitz (1699) marked the first major permanent territorial losses in Europe. The eighteenth century mixed defeat and recovery: victories against Russia (1711) and Austria (1739), a vibrant urban culture in Istanbul, the first Ottoman Turkish printing press — and the severe defeat of 1768–74 that cost the Crimea.',
    status: 'Territorial pressure from Habsburgs and Russia; commercial and cultural vitality',
    tone: 'amber',
  },
  {
    id: 'reform',
    name: 'Late Empire · The Age of Reform',
    start: 1789,
    end: 1876,
    range: '1789 – 1876',
    tagline: 'Nizam-ı Cedid, the end of the Janissaries and the Tanzimat',
    summary:
      'Selim III, Mahmud II and the Tanzimat statesmen rebuilt the army, the bureaucracy, schools and law along new lines while facing nationalist uprisings, an over-mighty governor in Egypt and the ambitions of the European powers. Reform and loss happened at the same time.',
    status: 'Centralizing reform under heavy external pressure',
    tone: 'dusk',
  },
  {
    id: 'final',
    name: 'Late Empire · Constitution, War & Collapse',
    start: 1876,
    end: 1922,
    range: '1876 – 1922',
    tagline: 'From the first parliament to the last sultan',
    summary:
      'The first constitution (1876) was soon suspended by Abdülhamid II, whose long reign combined modernization with autocracy and atrocity. The Young Turk Revolution of 1908 restored the constitution, but the Balkan Wars, the First World War — including the Armenian Genocide — and Allied occupation ended the empire. The Ankara government abolished the Sultanate on 1 November 1922.',
    status: 'Constitutional experiments, shrinking borders, world war and collapse',
    tone: 'night',
  },
  {
    id: 'coda',
    name: 'Coda · The Last Caliph',
    start: 1922,
    end: 1924,
    range: '1922 – 1924',
    tagline: 'A caliph without a sultanate',
    summary:
      'For sixteen months Abdülmecid II served as Caliph only, elected by the Grand National Assembly in Ankara. The Republic of Turkey was proclaimed on 29 October 1923, and on 3 March 1924 the Caliphate was abolished and the dynasty sent into exile.',
    status: 'Sultanate abolished; Republic of Turkey proclaimed (1923); Caliphate abolished (1924)',
    tone: 'night',
  },
];

export const eraById: Record<string, Era> = Object.fromEntries(eras.map((e) => [e.id, e]));

export function eraForYear(year: number): Era {
  return eras.find((e) => year >= e.start && year < e.end) ?? (year < eras[0].start ? eras[0] : eras[eras.length - 1]);
}

/** Era tone → accent colours used for theming sections. */
export const eraTones: Record<Era['tone'], { from: string; to: string; accent: string }> = {
  dawn: { from: '#1a1410', to: '#3a2614', accent: '#e8b874' },
  rise: { from: '#13110e', to: '#2b2416', accent: '#d9b562' },
  shadow: { from: '#0d0c0c', to: '#231a1a', accent: '#b8794f' },
  gold: { from: '#181208', to: '#3d2c0c', accent: '#f0cf78' },
  imperial: { from: '#140c0e', to: '#3a1119', accent: '#e2bd6b' },
  amber: { from: '#16100a', to: '#3b2410', accent: '#e9a957' },
  dusk: { from: '#100d12', to: '#2a1d2a', accent: '#cfa06a' },
  night: { from: '#08080a', to: '#1a1013', accent: '#b0485a' },
};
