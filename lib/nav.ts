export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#timeline', label: 'Timeline' },
  { href: '/sultans/', label: 'Sultans' },
  { href: '/figures/', label: 'Figures' },
  { href: '/battles/', label: 'Battles' },
  { href: '/map/', label: 'Map' },
  { href: '/culture/', label: 'Culture' },
  { href: '/architecture/', label: 'Architecture' },
  { href: '/empire/', label: 'Empire' },
  { href: '/final-years/', label: 'Final Years' },
  { href: '/sources/', label: 'Sources' },
] as const;

export const exploreItems = [
  { href: '/#time-machine', label: 'Ottoman Time Machine', note: 'Pick any year' },
  { href: '/#constantinople-1453', label: '1453 — The Fall of Constantinople', note: 'Interactive siege' },
  { href: '/#suleyman', label: 'The Age of Süleyman', note: 'Golden Age' },
  { href: '/dynasty/', label: 'The House of Osman', note: 'Family tree' },
  { href: '/compare/', label: 'Compare the Sultans', note: 'Data explorer' },
  { href: '/map/#where', label: 'Where Were They?', note: 'Historical geography' },
  { href: '/architecture/#istanbul', label: 'Constantinople / Istanbul', note: '3D city' },
  { href: '/glossary/', label: 'Ottoman Glossary', note: 'Terms explained' },
] as const;
