import type { Certainty } from './types';
import { rulers, reignLabel, trendLabel } from './rulers';
import { eras } from './eras';

export interface TimelineEntry {
  id: string;
  kind: 'ruler' | 'event';
  year: number;
  yearLabel: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  achievements: string[];
  conflicts: string[];
  territorial: string;
  href: string;
  eraId: string;
  featured?: boolean;
  turningPoint?: string;
  rulerId?: string;
  certainty?: Certainty;
}

/** Milestones shown between the rulers on the timeline. */
const milestones: TimelineEntry[] = [
  { id: 'm-ertugrul', kind: 'event', year: 1280, yearLabel: 'c. 1280', title: 'Ertuğrul Gazi', subtitle: 'Father of Osman', description: 'Known almost entirely from later tradition, Ertuğrul led the community around Söğüt from which the Ottoman principality emerged.', status: 'A Turkmen community on the Byzantine frontier', achievements: ['Leader of the group around Söğüt (tradition)'], conflicts: ['Frontier raiding (tradition)'], territorial: 'Söğüt area', href: '/figures/ertugrul/', eraId: 'origins', certainty: 'tradition' },
  { id: 'm-1299', kind: 'event', year: 1299, yearLabel: 'c. 1299', title: 'The traditional founding', subtitle: 'A conventional date', description: 'Later chroniclers dated the independence of Osman’s principality to around 1299. There was no single founding moment.', status: 'Frontier beylik', achievements: ['Independent principality emerges'], conflicts: ['Raids on Byzantine Bithynia'], territorial: 'Principality around Söğüt', href: '/sultans/osman-i/', eraId: 'origins', certainty: 'tradition' },
  { id: 'm-interregnum', kind: 'event', year: 1402, yearLabel: '1402 – 1413', title: 'The Interregnum', subtitle: 'Civil war among Bayezid’s sons', description: 'After Ankara, Süleyman, İsa, Musa and Mehmed fought for the throne. Mehmed I reunited the state in 1413 after defeating Musa at Çamurlu.', status: 'Fractured; Anatolian principalities restored by Timur', achievements: ['The state survives and reunites'], conflicts: ['Civil war (1402–1413)'], territorial: 'Anatolian conquests of Bayezid I lost', href: '/battles/#ankara', eraId: 'interregnum', featured: true, turningPoint: 'Near-collapse', certainty: 'confirmed' },
  { id: 'm-1453', kind: 'event', year: 1453, yearLabel: '29 May 1453', title: 'Fall of Constantinople', subtitle: 'End of the Byzantine Empire', description: 'After a 53-day siege Mehmed II took the city, which became the Ottoman capital.', status: 'Empire with a new imperial capital', achievements: ['Constantinople becomes the capital'], conflicts: ['Siege of Constantinople'], territorial: 'Constantinople and the Straits', href: '/#constantinople-1453', eraId: 'imperial', featured: true, turningPoint: 'Imperial capital', certainty: 'confirmed' },
  { id: 'm-1517', kind: 'event', year: 1517, yearLabel: '1517', title: 'Cairo and the Holy Cities', subtitle: 'End of the Mamluk Sultanate', description: 'Selim I’s conquest of Egypt made the Ottomans rulers of the Arab heartlands and protectors of Mecca and Medina.', status: 'Doubled in size', achievements: ['Syria, Egypt and the Hejaz'], conflicts: ['Marj Dabiq, Ridaniya'], territorial: 'Major expansion', href: '/battles/#ridaniya', eraId: 'eastern', certainty: 'confirmed' },
  { id: 'm-1529', kind: 'event', year: 1529, yearLabel: '1529', title: 'First siege of Vienna', subtitle: 'The limit in Central Europe', description: 'Süleyman’s siege of the Habsburg capital failed; Hungary remained the battleground.', status: 'At the height of power', achievements: [], conflicts: ['Habsburg wars'], territorial: 'Hungary contested', href: '/battles/#vienna-1529', eraId: 'golden', certainty: 'confirmed' },
  { id: 'm-1571', kind: 'event', year: 1571, yearLabel: '1571', title: 'Cyprus and Lepanto', subtitle: 'Victory on land, defeat at sea', description: 'The Ottomans conquered Cyprus but lost their fleet at Lepanto — and rebuilt it within about a year.', status: 'Greatest extent', achievements: ['Cyprus conquered'], conflicts: ['Battle of Lepanto'], territorial: 'Cyprus gained', href: '/battles/#lepanto', eraId: 'transformation', certainty: 'confirmed' },
  { id: 'm-1683', kind: 'event', year: 1683, yearLabel: '1683', title: 'Second siege of Vienna', subtitle: 'The turning of the tide', description: 'The defeat outside Vienna opened a sixteen-year war that cost Hungary.', status: 'Major defeat', achievements: [], conflicts: ['Great Turkish War'], territorial: 'Losses begin in Central Europe', href: '/battles/#vienna-1683', eraId: 'transformation', featured: true, turningPoint: 'Turning point', certainty: 'confirmed' },
  { id: 'm-1699', kind: 'event', year: 1699, yearLabel: '1699', title: 'Treaty of Karlowitz', subtitle: 'First major permanent losses', description: 'Hungary, Transylvania, Podolia and the Morea were ceded in a multilateral peace.', status: 'Contraction in Europe', achievements: [], conflicts: [], territorial: 'Major losses', href: '/sultans/mustafa-ii/', eraId: 'late', certainty: 'confirmed' },
  { id: 'm-1774', kind: 'event', year: 1774, yearLabel: '1774', title: 'Küçük Kaynarca', subtitle: 'The Eastern Question begins', description: 'Defeat by Russia made the Crimea independent and opened the Black Sea to Russian ships.', status: 'Retreat before Russia', achievements: [], conflicts: ['Russo-Ottoman War 1768–74'], territorial: 'Crimea lost', href: '/sultans/abdulhamid-i/', eraId: 'late', certainty: 'confirmed' },
  { id: 'm-1826', kind: 'event', year: 1826, yearLabel: '1826', title: 'End of the Janissaries', subtitle: 'The Auspicious Incident', description: 'Mahmud II destroyed the Janissary corps and began building a modern army and state.', status: 'Centralizing reform', achievements: ['New army'], conflicts: ['Greek War of Independence'], territorial: 'Greece soon lost', href: '/sultans/mahmud-ii/', eraId: 'reform', featured: true, turningPoint: 'Reform', certainty: 'confirmed' },
  { id: 'm-1839', kind: 'event', year: 1839, yearLabel: '1839', title: 'The Tanzimat begins', subtitle: 'Edict of Gülhane', description: 'Security of life and property, regular taxation and equality before the law were promised to all subjects.', status: 'Reform era', achievements: ['Edict of Gülhane'], conflicts: ['Egyptian crisis'], territorial: 'Stable', href: '/empire/#tanzimat', eraId: 'reform', certainty: 'confirmed' },
  { id: 'm-1876', kind: 'event', year: 1876, yearLabel: '1876', title: 'The first constitution', subtitle: 'Kanun-ı Esasi', description: 'An elected parliament met in 1877, before Abdülhamid II suspended it in 1878.', status: 'Constitutional experiment', achievements: ['Constitution and parliament'], conflicts: ['Balkan crisis'], territorial: 'Severe losses in 1878', href: '/empire/#tanzimat', eraId: 'final', certainty: 'confirmed' },
  { id: 'm-1908', kind: 'event', year: 1908, yearLabel: '1908', title: 'Young Turk Revolution', subtitle: 'The constitution restored', description: 'Army officers forced the restoration of constitutional government.', status: 'Second Constitutional Era', achievements: ['Constitution restored'], conflicts: [], territorial: 'Bosnia annexed by Austria-Hungary; Bulgaria fully independent', href: '/final-years/', eraId: 'final', certainty: 'confirmed' },
  { id: 'm-1914', kind: 'event', year: 1914, yearLabel: '1914 – 1918', title: 'The First World War', subtitle: 'Gallipoli, Kut — and catastrophe', description: 'Four years of war brought victories at Gallipoli and Kut, defeats on every other front, famine, and the Armenian Genocide.', status: 'Total war', achievements: ['Gallipoli and Kut'], conflicts: ['First World War'], territorial: 'Arab provinces lost', href: '/final-years/', eraId: 'final', featured: true, turningPoint: 'Collapse', certainty: 'confirmed' },
  { id: 'm-1922', kind: 'event', year: 1922, yearLabel: '1 November 1922', title: 'The Sultanate is abolished', subtitle: 'End of the Ottoman monarchy', description: 'The Grand National Assembly in Ankara abolished the Sultanate. Mehmed VI went into exile on 17 November.', status: 'Sultanate abolished', achievements: [], conflicts: ['Turkish War of Independence'], territorial: 'Successor state in Anatolia', href: '/final-years/', eraId: 'final', featured: true, turningPoint: 'The end', certainty: 'confirmed' },
  { id: 'm-1924', kind: 'event', year: 1924, yearLabel: '3 March 1924', title: 'The Caliphate is abolished', subtitle: 'Abdülmecid II, Caliph 1922–1924', description: 'The last Ottoman caliph — never a sultan — was deposed and the dynasty exiled.', status: 'Republic of Turkey (from 1923)', achievements: [], conflicts: [], territorial: '—', href: '/figures/abdulmejid-ii/', eraId: 'coda', featured: true, certainty: 'confirmed' },
];

function rulerEntry(r: (typeof rulers)[number]): TimelineEntry {
  return {
    id: `r-${r.id}`,
    kind: 'ruler',
    year: r.reigns[0].start,
    yearLabel: reignLabel(r),
    title: r.name,
    subtitle: r.epithet ?? `${r.title} · ${r.order}${ordinalSuffix(r.order)} ruler`,
    description: r.summary,
    status: r.empireStatus,
    achievements: r.achievements.slice(0, 4),
    conflicts: r.wars.slice(0, 4),
    territorial: `${trendLabel[r.territorialChange.trend]} — ${r.territorialChange.summary}`,
    href: `/sultans/${r.id}/`,
    eraId: r.eraId,
    featured: r.featured,
    turningPoint: r.turningPoint,
    rulerId: r.id,
  };
}

export function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export const timelineEntries: TimelineEntry[] = [...rulers.map(rulerEntry), ...milestones].sort((a, b) => a.year - b.year || (a.kind === 'event' ? 1 : -1));

export const timelineByEra = eras.map((era) => ({
  era,
  entries: timelineEntries.filter((e) => e.eraId === era.id),
}));
