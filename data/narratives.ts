import type { Certainty } from './types';

/* ======================================================================== */
/*  1453 — the siege, step by step                                           */
/* ======================================================================== */

export interface SiegeStep {
  id: string;
  title: string;
  date: string;
  text: string;
  /** Which elements of the schematic city map are emphasised. */
  focus: Array<'rumelihisari' | 'camp' | 'cannon' | 'walls' | 'chain' | 'fleet' | 'overland' | 'breach' | 'city' | 'hagia'>;
  note?: { kind: Certainty; text: string };
}

export const siegeSteps: SiegeStep[] = [
  {
    id: 'preparation',
    title: 'Preparation',
    date: '1452 – March 1453',
    text: 'In 1452 Mehmed II built Rumelihisarı on the Bosphorus in a few months, cutting the city off from the Black Sea. Over the winter he gathered an army and fleet at Edirne and had large bronze cannon cast, including a giant bombard by the founder Urban. In Constantinople, Constantine XI repaired the walls and stretched a great chain across the Golden Horn; some 700 Genoese volunteers under Giovanni Giustiniani Longo arrived to help.',
    focus: ['rumelihisari', 'chain', 'walls'],
    note: { kind: 'confirmed', text: 'The fortress, the cannon of Urban and the arrival of Giustiniani are reported by several eyewitness accounts.' },
  },
  {
    id: 'siege',
    title: 'Siege',
    date: '6 April 1453',
    text: 'The Ottoman army deployed along the four-mile line of the Theodosian land walls, from the Golden Horn to the Sea of Marmara. Mehmed’s tent was pitched opposite the Gate of St Romanus. The defenders — perhaps seven to eight thousand, Greeks and foreigners — had to man fourteen miles of walls.',
    focus: ['camp', 'walls'],
    note: { kind: 'disputed', text: 'Sphrantzes counted fewer than 5,000 Greek defenders and about 2,000 foreigners. Modern estimates of the Ottoman army vary widely; around 50,000–80,000 is often suggested.' },
  },
  {
    id: 'bombardment',
    title: 'Bombardment',
    date: 'April – May 1453',
    text: 'For weeks Ottoman artillery battered the land walls, especially in the Lycus valley (the Mesoteichion). By night the defenders filled the breaches with earth, timber and barrels. Ottoman sappers dug mines beneath the walls; the defenders countermined.',
    focus: ['cannon', 'walls'],
    note: { kind: 'confirmed', text: 'The scale of the bombardment is described in detail by Nicolò Barbaro’s diary.' },
  },
  {
    id: 'naval',
    title: 'Naval manoeuvre',
    date: '20 – 22 April 1453',
    text: 'On 20 April four relief ships fought their way through the Ottoman fleet into the Golden Horn. Two days later, Mehmed had dozens of ships hauled overland on greased rollers over the hills behind Galata and launched into the Golden Horn — bypassing the chain and forcing the defenders to spread themselves even thinner along the sea walls.',
    focus: ['fleet', 'overland', 'chain'],
    note: { kind: 'confirmed', text: 'The overland transport of the ships is recorded by Ottoman, Greek and Italian eyewitnesses, though their counts of ships differ.' },
  },
  {
    id: 'assault',
    title: 'Final assault',
    date: 'Night of 28 – 29 May 1453',
    text: 'After a day of preparation and prayer on both sides, the general assault began in the early hours of 29 May. Waves of irregular troops, then Anatolian regiments and finally the Janissaries attacked the breaches near the Gate of St Romanus. When Giustiniani was badly wounded and carried from the walls, the defence faltered and Ottoman troops broke through.',
    focus: ['breach', 'walls', 'camp'],
    note: { kind: 'tradition', text: 'Doukas’ story that the Ottomans entered through a small postern, the Kerkoporta, left open by accident is not confirmed by other eyewitnesses.' },
  },
  {
    id: 'capture',
    title: 'Capture',
    date: '29 May 1453',
    text: 'Ottoman troops poured into the city. Constantine XI died in the fighting; how exactly is unknown. A period of plunder followed, as was customary for a city taken by storm. That afternoon Mehmed entered the city and went to Hagia Sophia, which was converted into a mosque. Constantinople became the new Ottoman capital.',
    focus: ['city', 'hagia'],
    note: { kind: 'disputed', text: 'Accounts of the duration of the plunder and of the last emperor’s death differ; later legends grew around both.' },
  },
];

/* ======================================================================== */
/*  The Age of Süleyman — cinematic chapters                                 */
/* ======================================================================== */

export interface Chapter {
  id: string;
  kicker: string;
  title: string;
  years: string;
  text: string;
  link?: { href: string; label: string };
}

export const suleimanChapters: Chapter[] = [
  { id: 'accession', kicker: 'Accession', title: 'A new sultan, 1520', years: '1520', text: 'Süleyman, about twenty-six, inherited a treasury filled by his father’s conquests and an empire that now stretched from the Danube to the Nile.' },
  { id: 'fortresses', kicker: 'Military expansion', title: 'Belgrade and Rhodes', years: '1521 – 1522', text: 'Within two years he took the two fortresses that had defeated Mehmed II: Belgrade, the key to Hungary, and Rhodes, base of the Knights of St John.', link: { href: '/battles/#rhodes-1522', label: 'Siege of Rhodes' } },
  { id: 'europe', kicker: 'Central European campaigns', title: 'Mohács, Vienna and Buda', years: '1526 – 1541', text: 'At Mohács in 1526 the Hungarian kingdom collapsed. The siege of Vienna in 1529 failed, but in 1541 Buda became the capital of an Ottoman province. Rivalry with the Habsburgs would dominate the century.', link: { href: '/battles/#mohacs', label: 'Battle of Mohács' } },
  { id: 'east', kicker: 'Eastern campaigns', title: 'Baghdad and the Safavid frontier', years: '1534 – 1555', text: 'Süleyman entered Baghdad in 1534 and fought the Safavids in three campaigns, ending with the Peace of Amasya (1555).' },
  { id: 'sea', kicker: 'Mediterranean naval dominance', title: 'Barbarossa and Preveza', years: '1533 – 1565', text: 'Under Hayreddin Barbarossa the fleet defeated the Holy League at Preveza (1538). Ottoman power reached Algiers and Tripoli; ships fought the Portuguese in the Red Sea and Indian Ocean. The siege of Malta (1565) marked the limit.', link: { href: '/empire/#navy', label: 'The Ottoman Navy' } },
  { id: 'law', kicker: 'Law and administration', title: 'Kanun and sharia', years: '1520s – 1560s', text: 'Provincial law codes were systematized, and the jurist Ebussuud Efendi reconciled sultanic law with Islamic law on land, taxation and criminal justice. The learned hierarchy of judges and professors was formalized.' },
  { id: 'architecture', kicker: 'Architecture', title: 'The city of Sinan', years: '1538 – 1566', text: 'As chief architect, Sinan reshaped Istanbul with the Şehzade (1548) and the Süleymaniye (1557), and built mosques, bridges and aqueducts throughout the empire.', link: { href: '/architecture/', label: 'The World They Built' } },
  { id: 'letters', kicker: 'Literature', title: 'Poets and painters', years: '16th century', text: 'Bâkî became the court’s great lyric poet; Fuzûlî wrote in Baghdad. Süleyman himself wrote poetry as Muhibbî. The palace painting workshop produced illustrated histories of the reign.' },
  { id: 'diplomacy', kicker: 'Diplomacy', title: 'Alliance with France', years: '1525 – 1544', text: 'Süleyman allied with Francis I of France against Charles V. In 1543–44 an Ottoman fleet wintered at Toulon. Venice, Poland, the Habsburgs and Iran all kept envoys at his court.', link: { href: '/figures/barbarossa/', label: 'Hayreddin Barbarossa' } },
  { id: 'palace', kicker: 'Palace culture', title: 'Hürrem and the new palace politics', years: '1530s – 1561', text: 'His marriage to Hürrem, the rise and fall of İbrahim Pasha, and the executions of Princes Mustafa (1553) and Bayezid (1561) reshaped the dynasty. Royal women and favourites became central political actors.', link: { href: '/figures/hurrem/', label: 'Hürrem Sultan' } },
  { id: 'end', kicker: 'The last campaign', title: 'Szigetvár, 1566', years: '1566', text: 'At over seventy, Süleyman led a final campaign into Hungary and died in his tent during the siege of Szigetvár. His Grand Vizier hid his death from the army until his son could be informed.' },
];

/* ======================================================================== */
/*  Rise → Peak → Transformation → Decline → End                             */
/* ======================================================================== */

export interface Phase {
  id: string;
  name: string;
  years: string;
  text: string;
  caveat: string;
}

export const phases: Phase[] = [
  { id: 'rise', name: 'Rise', years: 'c. 1299 – 1453', text: 'A frontier principality grows into a Balkan–Anatolian sultanate through conquest, alliances, absorption of Byzantine and Turkmen elites, and new institutions.', caveat: 'Expansion was not continuous: the defeat at Ankara (1402) almost destroyed the state.' },
  { id: 'peak', name: 'Peak', years: '1453 – 1566', text: 'Constantinople, the Arab lands, Hungary and naval power make the Ottomans a world empire with a classical court culture.', caveat: 'Contemporaries also experienced fiscal strain, rebellion and brutal succession struggles.' },
  { id: 'transformation', name: 'Transformation', years: '1566 – 1774', text: 'Government shifts from the campaigning sultan to palace, viziers, households and Janissaries; tax farming and provincial elites grow. The empire still wins wars (Crete, Podolia, the Pruth).', caveat: 'Historians since the 1980s reject describing this simply as “decline”.' },
  { id: 'decline', name: 'Contraction & reform', years: '1774 – 1908', text: 'Military defeats by Russia, nationalist revolts and European economic penetration bring territorial losses — alongside sweeping reforms that create a modern state.', caveat: 'Reform and loss went together; the late empire was in many ways more centralized and effective than ever.' },
  { id: 'end', name: 'End', years: '1908 – 1922', text: 'Constitutional revolution, the Balkan Wars, the First World War and Allied occupation end the empire. Successor states — including the Republic of Turkey — emerge.', caveat: 'The end came through catastrophic war, not inevitable long-term decay.' },
];

export interface Factor {
  id: string;
  name: string;
  kind: 'external' | 'internal' | 'economic' | 'ideas';
  phases: string[];
  text: string;
}

export const factors: Factor[] = [
  { id: 'trade', name: 'Changing global trade patterns', kind: 'economic', phases: ['transformation', 'decline'], text: 'Portuguese and later Dutch and English sea routes to Asia diverted part of the spice trade, though the Red Sea and Levant trade remained substantial into the seventeenth century. Atlantic economies grew faster.' },
  { id: 'military', name: 'European military modernization', kind: 'external', phases: ['transformation', 'decline'], text: 'Massive standing armies, new fortifications and drill gave Habsburg and Russian forces advantages by the late seventeenth and eighteenth centuries; Ottoman reformers responded from the 1730s onward.' },
  { id: 'politics', name: 'Internal political struggles', kind: 'internal', phases: ['transformation', 'end'], text: 'Factions of viziers, royal women, Janissaries and ulema competed for power; sultans were deposed or killed in 1622, 1648, 1687, 1703, 1730, 1807–08 and 1876.' },
  { id: 'admin', name: 'Administrative challenges', kind: 'internal', phases: ['transformation', 'decline'], text: 'The timar system gave way to tax farming; provincial notables (ayan) and autonomous governors gained power, culminating in Muhammad Ali’s Egypt.' },
  { id: 'nationalism', name: 'Nationalist movements', kind: 'ideas', phases: ['decline', 'end'], text: 'From the Serbian (1804) and Greek (1821) revolts onwards, nationalism reshaped the Balkans and later the Arab, Armenian and Turkish worlds.' },
  { id: 'economy', name: 'Economic pressures', kind: 'economic', phases: ['transformation', 'decline', 'end'], text: 'Inflation in the late sixteenth century, currency debasement, the cost of war, the 1838 free-trade treaty, foreign loans and the default of 1875 constrained the state.' },
  { id: 'diplomacy', name: 'Diplomatic pressures', kind: 'external', phases: ['decline', 'end'], text: 'The “Eastern Question”: Russia, Britain, France and Austria competed over Ottoman territory and claimed protection over Christian subjects.' },
  { id: 'industry', name: 'Industrialization', kind: 'economic', phases: ['decline', 'end'], text: 'Factory-made European goods competed with Ottoman crafts; railways and mines were often built with foreign capital.' },
  { id: 'reform', name: 'Reform movements', kind: 'ideas', phases: ['decline'], text: 'Selim III, Mahmud II and the Tanzimat built new armies, schools, laws and ministries — strengthening the state while unsettling old balances.' },
  { id: 'tanzimat', name: 'Tanzimat', kind: 'ideas', phases: ['decline'], text: 'The 1839 and 1856 edicts promised legal equality and modern administration, reshaping relations between the state and its religious communities.' },
  { id: 'constitution', name: 'Constitutional movements', kind: 'ideas', phases: ['decline', 'end'], text: 'The Young Ottomans and later the Young Turks pursued constitutional government, achieved in 1876 and again in 1908.' },
  { id: 'balkan', name: 'Balkan nationalism', kind: 'external', phases: ['decline', 'end'], text: 'Independent Greece, Serbia, Romania, Montenegro and Bulgaria expanded at Ottoman expense, culminating in the Balkan Wars of 1912–13.' },
  { id: 'russia', name: 'Russo-Ottoman wars', kind: 'external', phases: ['transformation', 'decline', 'end'], text: 'A dozen wars between 1568 and 1918 cost the Crimea, the northern Black Sea coast, Bessarabia and parts of the Caucasus.' },
  { id: 'ww1', name: 'World War I', kind: 'external', phases: ['end'], text: 'Four years of war on many fronts, mass death, famine, genocide and Allied occupation brought the empire to an end.' },
];

/* ======================================================================== */
/*  Tanzimat and reform                                                      */
/* ======================================================================== */

export interface ReformArea {
  id: string;
  name: string;
  summary: string;
  milestones: { year: string; text: string }[];
}

export const reformAreas: ReformArea[] = [
  {
    id: 'military',
    name: 'Military',
    summary: 'From the Janissaries to a conscript army trained on European lines.',
    milestones: [
      { year: '1793', text: 'Selim III’s Nizam-ı Cedid infantry' },
      { year: '1826', text: 'Janissaries abolished; new Asakir-i Mansure army' },
      { year: '1834', text: 'Military Academy (Mekteb-i Harbiye)' },
      { year: '1843', text: 'Regular conscription and reserve system' },
      { year: '1880s', text: 'German military advisers, including Colmar von der Goltz' },
    ],
  },
  {
    id: 'government',
    name: 'Government',
    summary: 'From household government to ministries, councils and a constitution.',
    milestones: [
      { year: '1836–38', text: 'Ministries replace the old offices of state' },
      { year: '1839', text: 'Edict of Gülhane' },
      { year: '1868', text: 'Council of State (Şura-yı Devlet)' },
      { year: '1876', text: 'Constitution and parliament' },
      { year: '1908', text: 'Constitution restored (Second Constitutional Era)' },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    summary: 'New state schools alongside the madrasas, from primary to university level.',
    milestones: [
      { year: '1773–1795', text: 'Naval and military engineering schools' },
      { year: '1827', text: 'Imperial medical school' },
      { year: '1847', text: 'First state secondary schools (rüşdiye) open' },
      { year: '1868', text: 'Galatasaray imperial lycée' },
      { year: '1869', text: 'Public Education Regulation' },
      { year: '1900', text: 'Darülfünun (Istanbul University) reopened' },
    ],
  },
  {
    id: 'law',
    name: 'Law',
    summary: 'Codified laws and new courts alongside Islamic law.',
    milestones: [
      { year: '1840', text: 'Penal code' },
      { year: '1850', text: 'Commercial code' },
      { year: '1856', text: 'Reform Edict: equality of all subjects' },
      { year: '1858', text: 'Land Code and revised Penal Code' },
      { year: '1869–76', text: 'Mecelle — codified civil law based on Hanafi jurisprudence' },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    summary: 'Telegraph, railways, steamships and modern city services.',
    milestones: [
      { year: '1834', text: 'Imperial postal service' },
      { year: '1855', text: 'First telegraph lines (Crimean War)' },
      { year: '1856', text: 'First railway concessions (İzmir–Aydın)' },
      { year: '1888', text: 'Railway link from Istanbul to Europe' },
      { year: '1900–1908', text: 'Hejaz Railway, Damascus to Medina' },
    ],
  },
  {
    id: 'administration',
    name: 'Administration',
    summary: 'Centralized provinces, censuses, registers and salaried officials.',
    milestones: [
      { year: '1831', text: 'First census; timars abolished' },
      { year: '1831', text: 'Takvim-i Vekayi official gazette' },
      { year: '1840s', text: 'Salaried tax collection experiments' },
      { year: '1864', text: 'Vilayet (Provincial) Law' },
      { year: '1881', text: 'Ottoman Public Debt Administration' },
    ],
  },
];

export const constitutionalEras = [
  { id: 'first', name: 'First Constitutional Era', years: '1876 – 1878', text: 'Abdülhamid II promulgated the constitution on 23 December 1876. An elected Chamber of Deputies, including Muslims, Christians and Jews, met in 1877–78 before being prorogued during the war with Russia. The constitution was never formally abolished.' },
  { id: 'second', name: 'Second Constitutional Era', years: '1908 – 1920', text: 'The Young Turk Revolution restored the constitution in July 1908. Elections, a free press and political parties followed — then the CUP coup of 1913, single-party wartime rule, and the dissolution of the last Ottoman parliament under Allied occupation in 1920.' },
];

/* ======================================================================== */
/*  The final years, 1908 – 1922                                             */
/* ======================================================================== */

export interface Moment {
  year: string;
  date?: string;
  title: string;
  text: string;
  tone?: 'grave' | 'war' | 'politics' | 'end';
}

export const finalYears: Moment[] = [
  { year: '1908', date: 'July', title: 'Young Turk Revolution', text: 'Army officers in Macedonia force Abdülhamid II to restore the constitution. Celebrations unite Muslims, Christians and Jews — briefly.', tone: 'politics' },
  { year: '1909', date: 'April', title: 'Counter-revolution and deposition', text: 'After the failed 31 March uprising, parliament deposes Abdülhamid II. Mehmed V becomes a constitutional sultan.', tone: 'politics' },
  { year: '1911–12', title: 'War with Italy', text: 'Italy invades Libya and the Dodecanese. Ottoman officers, including Enver and Mustafa Kemal, organize resistance.', tone: 'war' },
  { year: '1912–13', title: 'The Balkan Wars', text: 'The Balkan League conquers almost all Ottoman territory in Europe. Hundreds of thousands of Muslim refugees flee. The CUP seizes power in January 1913; Edirne is recovered in July.', tone: 'war' },
  { year: '1914', date: 'October–November', title: 'Entry into the First World War', text: 'Aligned with Germany, the Ottoman fleet bombards Russian ports. The empire is at war with Russia, Britain and France.', tone: 'war' },
  { year: '1915', title: 'Gallipoli', text: 'Ottoman forces defeat the Allied attempt to force the Dardanelles and land on the peninsula — at enormous cost to both sides.', tone: 'war' },
  { year: '1915–16', title: 'The Armenian Genocide', text: 'The CUP government organizes the deportation and mass killing of the Ottoman Armenians. Estimates of Armenian deaths range from about 600,000 to 1.5 million. Assyrian and Greek Orthodox communities also suffer mass violence. Most historians and genocide scholars recognize these events as genocide; the Republic of Turkey officially rejects the term.', tone: 'grave' },
  { year: '1915–18', title: 'Famine and the home front', text: 'Blockade, requisitioning and locusts cause famine in Mount Lebanon and Syria; disease and hunger devastate soldiers and civilians across the empire.', tone: 'grave' },
  { year: '1916', title: 'Kut and the Arab Revolt', text: 'A British army surrenders at Kut in April. In June, Sharif Hussein of Mecca launches the Arab Revolt with British support.', tone: 'war' },
  { year: '1917', title: 'Baghdad and Jerusalem fall', text: 'British forces take Baghdad in March and Jerusalem in December.', tone: 'war' },
  { year: '1918', date: '30 October', title: 'Armistice of Mudros', text: 'After defeats in Palestine and Syria, the Ottoman government signs the armistice. CUP leaders flee abroad.', tone: 'end' },
  { year: '1918–20', title: 'Occupation of Istanbul', text: 'Allied fleets anchor off the capital in November 1918; formal occupation follows in March 1920. Greek troops land at İzmir in May 1919.', tone: 'politics' },
  { year: '1919–22', title: 'The Turkish War of Independence', text: 'From Anatolia, a nationalist movement led by Mustafa Kemal builds an army and a parliament in Ankara (1920), rejects the Treaty of Sèvres and defeats Greek, Armenian and French forces.', tone: 'war' },
  { year: '1922', date: '1 November', title: 'Abolition of the Sultanate', text: 'The Grand National Assembly abolishes the Ottoman Sultanate. On 17 November Mehmed VI leaves Istanbul on a British warship.', tone: 'end' },
];

/* ======================================================================== */
/*  The army                                                                 */
/* ======================================================================== */

export interface Unit {
  id: string;
  name: string;
  turkish?: string;
  era: string;
  summary: string;
  details: string[];
  equipment: string[];
  note?: { kind: Certainty; text: string };
}

export const armyUnits: Unit[] = [
  {
    id: 'janissaries',
    name: 'Janissaries',
    turkish: 'Yeniçeri Ocağı',
    era: 'c. 1370s – 1826',
    summary: 'The sultan’s salaried standing infantry — one of the first permanent standing armies in Europe since Rome.',
    details: [
      'Recruited first from prisoners of war and then through the devshirme, Janissaries lived in barracks, trained continuously and were paid quarterly. Their corps was organized in ortas (companies) symbolized by the cooking pot (kazan).',
      'By the sixteenth century they used matchlock muskets in volley fire. Later, as numbers swelled and members took up trades, the corps became a political force able to depose sultans. Mahmud II destroyed it in 1826.',
    ],
    equipment: ['Matchlock musket (tüfek)', 'Yatağan short sword', 'Composite bow (early period)', 'White felt cap (börk) with a long rear flap'],
  },
  {
    id: 'sipahis',
    name: 'Sipahis',
    turkish: 'Tımarlı and Kapıkulu Sipahileri',
    era: '14th – 19th centuries',
    summary: 'Cavalry: provincial timar-holders who formed the bulk of the classical army, and the salaried household cavalry of the sultan.',
    details: [
      'A timariot sipahi collected assigned revenues from villages and served on campaign each summer with armoured retainers according to his income. The household cavalry regiments guarded the sultan in battle.',
    ],
    equipment: ['Lance', 'Sabre (kılıç)', 'Mace and composite bow', 'Mail armour and helmet', 'Round shield (kalkan)'],
  },
  {
    id: 'akinci',
    name: 'Akıncı raiders',
    turkish: 'Akıncılar',
    era: '14th – late 16th centuries',
    summary: 'Light cavalry raiders who devastated frontier lands ahead of the main army, led by hereditary frontier families such as the Mihaloğulları and Evrenosoğulları.',
    details: ['Unpaid, they lived from plunder. Their role declined as the frontiers stabilized.'],
    equipment: ['Composite bow', 'Sabre', 'Light lance'],
  },
  {
    id: 'artillery',
    name: 'Artillery',
    turkish: 'Topçu Ocağı',
    era: '15th – 20th centuries',
    summary: 'A professional corps of gunners and gun-founders centred on the imperial foundry at Tophane in Istanbul.',
    details: [
      'Ottoman siege artillery was among the most powerful of the fifteenth and sixteenth centuries. Field guns behind chained wagons (the tabur) were decisive at Chaldiran and Mohács. Gábor Ágoston has shown that the Ottomans largely kept pace with European gun-founding into the seventeenth century.',
    ],
    equipment: ['Large bronze bombards', 'Field guns (darbzen)', 'Mortars (havan)', 'Gun-carriage corps (top arabacıları)'],
    note: { kind: 'interpretation', text: 'The old idea that the Ottomans fell behind in firearms technology early is challenged by research on Ottoman arsenals and foundries.' },
  },
  {
    id: 'navy',
    name: 'Navy & the Kapudan Pasha',
    turkish: 'Donanma-yı Hümayun',
    era: '15th – 20th centuries',
    summary: 'The imperial fleet, commanded by the Kapudan Pasha (grand admiral) and built at the arsenals of Gallipoli and the Golden Horn.',
    details: ['Galley fleets dominated the sixteenth century; sailing ships of the line from the late seventeenth; steam ironclads in the nineteenth.'],
    equipment: ['War galleys (kadırga)', 'Large galleys (mavna, baştarda)', 'Galleons and ships of the line (kalyon)', 'Steam ironclads'],
  },
  {
    id: 'logistics',
    name: 'Logistics',
    era: 'Classical period',
    summary: 'The empire’s ability to move and feed large armies over long distances was one of its greatest strengths.',
    details: [
      'Roads with staging posts (menzil), state granaries, purchase of supplies at fixed prices, and river transport on the Danube supplied campaigns. The campaign season — roughly April to October — and the distance from Istanbul limited how far armies could strike, which helps explain failures at Vienna.',
    ],
    equipment: ['Camel and wagon trains', 'Danube river flotillas', 'Staging posts (menzilhane)'],
    note: { kind: 'interpretation', text: 'Rhoads Murphey stresses logistics and the campaign season as keys to Ottoman warfare.' },
  },
  {
    id: 'technology',
    name: 'Military technology',
    era: '15th – 20th centuries',
    summary: 'Gunpowder weapons, mining and countermining, and later rifles, machine guns and telegraph networks.',
    details: ['The Ottomans adopted firearms early, then imported and manufactured modern rifles (Mauser) and artillery (Krupp) in the late nineteenth century.'],
    equipment: ['Matchlocks and flintlocks', 'Mining and siege engineering', 'Mauser rifles and Krupp guns (late period)'],
  },
  {
    id: 'fortifications',
    name: 'Fortifications',
    era: '15th – 20th centuries',
    summary: 'A chain of frontier fortresses on the Danube, in Hungary and on the Straits.',
    details: ['Fortresses such as Rumelihisarı, Kilitbahir, Belgrade, Buda and Vidin anchored Ottoman control. In 1914–15 the Dardanelles forts and minefields stopped the Allied fleet.'],
    equipment: ['Rumelihisarı and Anadoluhisarı', 'Kilitbahir on the Dardanelles', 'Danube fortresses'],
  },
];

export const shipHotspots = [
  { id: 'ram', label: 'Spur / ram', text: 'A beak-like spur at the bow, used to break enemy oars and as a boarding bridge rather than to hole hulls.' },
  { id: 'gun', label: 'Centreline bow gun', text: 'A heavy gun firing forward over the bow, flanked by lighter pieces. Galleys aimed by pointing the whole ship.' },
  { id: 'sails', label: 'Lateen sails', text: 'Triangular sails used when the wind allowed; in battle galleys relied on oars.' },
  { id: 'oars', label: 'Oars and rowers', text: 'Rowing benches with several rowers per oar. Crews included free paid oarsmen, levied men and slaves or convicts.' },
  { id: 'stern', label: 'Stern castle', text: 'The raised command area, where the captain and officers stood under an awning; flagships carried lanterns (fener) as marks of rank.' },
];

/* ======================================================================== */
/*  Culture, society and knowledge                                           */
/* ======================================================================== */

export interface CultureTopic {
  id: string;
  title: string;
  kicker: string;
  text: string;
  points: string[];
  sources: string[];
}

export const cultureTopics: CultureTopic[] = [
  { id: 'society', kicker: 'Society', title: 'Many peoples, many faiths', text: 'Muslims, Orthodox Christians, Armenians, Jews and others lived under Ottoman rule, with communal institutions for religion and family law. Coexistence was real — and so were legal hierarchy, taxation differences and episodes of violence.', points: ['Religious communities (millets) with their own leaders', 'Guilds organized crafts and trades', 'Waqf endowments funded public services', 'Coffee-houses became centres of sociability from the 1550s'], sources: ['goffman-europe', 'inalcik-quataert', 'hattox-coffee'] },
  { id: 'arts', kicker: 'Arts', title: 'Calligraphy, tiles and illumination', text: 'Calligraphy was the most prestigious art. Court workshops produced illuminated manuscripts and miniature paintings; İznik potters created celebrated tiles; textile and carpet weaving flourished.', points: ['Calligraphers such as Şeyh Hamdullah', 'İznik ceramics at their height c. 1550–1600', 'Illustrated histories (şehname) of the dynasty', 'Marbled paper (ebru)'], sources: ['met-collection', 'necipoglu-sinan'] },
  { id: 'literature', kicker: 'Literature', title: 'Poetry of the court and the people', text: 'Divan poetry, written in a refined Ottoman Turkish rich in Persian and Arabic, coexisted with folk poetry and storytelling. Prose works ranged from chronicles to travel accounts and advice literature.', points: ['Poets Fuzûlî, Bâkî and Nef’î', 'Evliya Çelebi’s Book of Travels', 'Kâtib Çelebi’s encyclopaedic works', 'Late-Ottoman novels and journalism'], sources: ['dankoff-evliya', 'agoston-masters'] },
  { id: 'science', kicker: 'Science', title: 'Observation, medicine and maps', text: 'Ottoman scholars worked in astronomy, mathematics, medicine and geography. Hospitals were part of royal foundations, and cartographers such as Piri Reis combined Islamic and European knowledge.', points: ['Taqi al-Din’s observatory (1577–80)', 'Piri Reis’s world map (1513) and Book of the Sea', 'Hospitals of Bayezid II (Edirne) and the Süleymaniye', 'Smallpox inoculation observed in Istanbul and described by Lady Mary Wortley Montagu (1717)'], sources: ['sayili-observatory', 'mcintosh-piri'] },
  { id: 'education', kicker: 'Education', title: 'From madrasa to university', text: 'Mosque schools taught basic literacy; madrasas trained scholars, judges and teachers; the palace school trained administrators. From the eighteenth century technical schools, and in the nineteenth a state school system, were added.', points: ['Sahn-ı Seman and Süleymaniye madrasas', 'Enderun palace school', 'Engineering schools (1773, 1795)', 'Darülfünun (university), 1900'], sources: ['inalcik-classical', 'findley-turkey'] },
  { id: 'music', kicker: 'Music', title: 'Makam, mehter and the court', text: 'Ottoman court music developed an elaborate system of melodic modes (makam) and rhythmic cycles (usul). The mehter military band inspired European “Turkish” music by Mozart and others.', points: ['Composers including Sultan Selim III', 'Instruments: ney, tanbur, kanun, kemençe', 'Mevlevi ceremonial music', 'The mehter band'], sources: ['feldman-music'] },
  { id: 'cuisine', kicker: 'Cuisine', title: 'The palace kitchens', text: 'The Topkapı kitchens fed thousands daily. Ottoman cuisine combined Central Asian, Persian, Arab, Byzantine and Balkan traditions and shaped cooking from the Balkans to North Africa.', points: ['Pilafs, kebabs and stuffed vegetables (dolma)', 'Baklava and helva', 'Coffee culture', 'Sherbets cooled with mountain snow'], sources: ['isin-cuisine', 'hattox-coffee'] },
  { id: 'women', kicker: 'Women', title: 'Power, property and patronage', text: 'Royal women wielded political power and founded great charitable complexes. Ordinary women owned property, went to court and endowed waqfs — within a society that was nonetheless patriarchal.', points: ['Valide Sultans as heads of the imperial household', 'Women’s property rights in Islamic law', 'Late-Ottoman women writers and activists'], sources: ['peirce-harem', 'thys-turhan'] },
];

/* ======================================================================== */
/*  Legacy                                                                   */
/* ======================================================================== */

export interface LegacyItem {
  id: string;
  title: string;
  text: string;
}

export const legacy: LegacyItem[] = [
  { id: 'turkey', title: 'Turkey', text: 'The Republic of Turkey inherited the late-Ottoman army, bureaucracy, laws and elites — and defined itself in contrast to the empire. Debates about the Ottoman past remain central to Turkish politics and culture.' },
  { id: 'balkans', title: 'The Balkans', text: 'Five centuries of Ottoman rule left mosques, bridges, bazaars, Muslim communities and shared vocabulary — and national histories that often remember the period as foreign domination.' },
  { id: 'middle-east', title: 'The Middle East', text: 'Ottoman provincial boundaries, legal codes, land registers and urban institutions shaped the states created after 1918 from Iraq to Israel and Palestine.' },
  { id: 'north-africa', title: 'North Africa', text: 'Algeria, Tunisia and Libya bear the imprint of the Ottoman regencies in their cities, elites and architecture.' },
  { id: 'architecture', title: 'Architecture', text: 'From Sarajevo to Cairo, Ottoman mosques, domes and pencil minarets mark the skyline; Sinan’s works are studied worldwide.' },
  { id: 'cuisine', title: 'Cuisine', text: 'Coffee, baklava, dolma, börek, kebab and yogurt-based dishes link kitchens from Bosnia to Iraq.' },
  { id: 'language', title: 'Language', text: 'Turkish words live on in Balkan and Arabic languages; modern Turkish replaced the Arabic script with the Latin alphabet in 1928.' },
  { id: 'art', title: 'Art', text: 'İznik tiles, calligraphy, carpets and miniature painting influenced European taste, while Orientalist painting created lasting myths about the harem and the “Turk”.' },
  { id: 'diplomacy', title: 'Diplomacy', text: 'The capitulations, resident embassies and the “Eastern Question” shaped modern international law and great-power diplomacy.' },
  { id: 'law', title: 'Law', text: 'The Mecelle civil code remained in force in parts of the Middle East long after 1918; Ottoman land law influenced property regimes across the region.' },
  { id: 'urban', title: 'Urban culture', text: 'Coffee-houses, public baths, fountains, covered markets and neighbourhood mosques defined urban life in hundreds of cities.' },
];

/* ======================================================================== */
/*  Istanbul city layers                                                     */
/* ======================================================================== */

export const cityEras = [
  { year: 1453, label: '1453', caption: 'The newly conquered city: Hagia Sophia converted, the Genoese Galata Tower across the Golden Horn.' },
  { year: 1560, label: '1560', caption: 'Süleyman’s capital: Topkapı, the Grand Bazaar and the new Süleymaniye on the third hill.' },
  { year: 1620, label: '1620', caption: 'The Sultan Ahmed Mosque now faces Hagia Sophia; the classical skyline is complete.' },
  { year: 1870, label: '1870', caption: 'The court has moved to Dolmabahçe on the Bosphorus; steamships and the Tanzimat transform the city.' },
];
