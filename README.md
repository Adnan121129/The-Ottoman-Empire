# The Ottoman Empire · 1299 — 1922

**Rise. Expansion. Glory. Transformation. Decline. Legacy.**

An immersive, cinematic and historically responsible interactive website about the Ottoman Empire. It runs from Osman I's beylik to the abolition of the Sultanate on **1 November 1922**. The end of the Caliphate on **3 March 1924** is treated as a separate event.

It is a fully static site with no backend. All content lives in typed TypeScript data files, and every major section cites its sources. Throughout, the site separates **confirmed fact** from **tradition or legend**, **interpretation** and **scholarly debate**.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Editing content](#editing-content)
  - [Add a historical figure](#add-a-historical-figure)
  - [Add an event](#add-an-event)
  - [Other content](#other-content)
- [Replacing images, videos and 3D assets](#replacing-images-videos-and-3d-assets)
- [Historical method](#historical-method)
- [Accessibility and performance](#accessibility-and-performance)
- [Credits and licences](#credits-and-licences)

---

## Features

**Home journey** (`/`)
- **Hero:** a 3D Constantinople skyline at dusk with cursor parallax, built in Three.js. Low-power devices, browsers without WebGL and reduced-motion users get a pre-rendered looping video or its poster instead.
- **Timeline:** horizontal and grouped by era, pinned with GSAP on desktop and vertical on mobile. Each milestone opens a detail panel.
- **Storytelling:** a scroll-driven map of the empire through time.
- **On This Day:** drawn from 124 dated events.
- **1453 — The Fall of Constantinople:** an interactive siege reconstruction in six steps (preparation, siege, bombardment, naval, assault, capture).
- **The Age of Süleyman**.
- **The Ottoman Time Machine:** pick any year from 1299 to 1922 and see the ruler, capital, territory, wars, events and key people.
- **Rise → Peak → Transformation → Decline → End**.
- **The Final Years**, ending on *1 November 1922 — The Sultanate is abolished*.
- **Legacy finale.**

**Pages**

| Route | What it contains |
|---|---|
| `/sultans/`, `/sultans/[id]/` | Gallery of all 36 sultans and a full profile for each |
| `/figures/`, `/figures/[id]/` | 40 figures: commanders, scholars, artists, statesmen and women of power. Includes Atatürk, clearly framed as founder of the *Republic*, a new state |
| `/battles/` | Battle explorer: 41 battles and sieges with schematic campaign maps and movement arrows |
| `/map/` | Interactive empire map for 13 snapshot years: zoom and pan, cities, battles, trade routes, rivers, city panels. Also *Where Were They?* |
| `/architecture/` | *The World They Built*: building gallery; Sinan's three mosques in 3D with an exploded view and floor plans; a 3D map of Istanbul in four periods |
| `/empire/` | Army and 3D armoury; navy with a 3D galley and hotspots; government; the rise-to-end explorer; Tanzimat and reform |
| `/culture/` | Society, arts, literature, science, education, music, cuisine, women; İznik palette |
| `/final-years/` | 1908–1922; War of Independence; Mehmed VI; the abolition; Abdülmecid II, Caliph only, 1922–1924 |
| `/dynasty/` | *The House of Osman*: zoomable family tree with profile links |
| `/compare/` | Sultan comparison. It deliberately gives no "best sultan" score |
| `/glossary/` | 57 terms |
| `/sources/` | Methodology, certainty labels, full bibliography, credits |

**Tools**
- Fuzzy site search (Fuse.js), opened with ⌘K, Ctrl+K or `/`.
- Generative ambient audio (Web Audio API, no recorded music) with a mute control.
- Settings for motion, 3D quality and sound.
- Educational easter eggs: try typing a year such as `1453` anywhere on the site.

## Tech stack

- **Framework:** Next.js 16 (App Router, `output: 'export'`), React 19, TypeScript.
- **Styling:** Tailwind CSS v4.
- **3D:** Three.js with React Three Fiber and drei. All models are procedural.
- **Animation:** Motion (`motion/react`) and GSAP ScrollTrigger.
- **Icons:** Lucide.
- **Maps:** d3-geo projections over Natural Earth coastlines, pre-projected at build time.
- **Search:** Fuse.js.

## Getting started

Requires **Node.js 20.9 or later**.

```bash
npm install
npm run dev            # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build. Static export to `out/` |
| `npm start` | Serve `out/` locally (`npx serve`) |
| `npm run typecheck` | TypeScript check |
| `npm run validate:data` | Check every cross-reference in the data: source, place, battle, building and ruler IDs, plus duplicates |
| `npm run generate:map` | Rebuild `data/generated/basemap.ts` from Natural Earth |
| `npm run capture:hero` | Re-render the hero fallback video (see below) |

## Deployment

`npm run build` writes a fully static site to **`out/`**. Set the public URL so canonical links, the sitemap and Open Graph tags are correct:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

- **Vercel:** import the repository. The Next.js preset works as is. Add `NEXT_PUBLIC_SITE_URL` under Environment Variables.
- **Netlify:** build command `npm run build`, publish directory `out`.
- **Cloudflare Pages:** framework preset *None*, build command `npm run build`, output directory `out`. Set `NODE_VERSION=20` or later.
- **Any static host** (S3, GitHub Pages, nginx): upload `out/`. URLs use trailing slashes (`/sultans/`), so each page is a folder with an `index.html`. Point the host's 404 page at `out/404.html`.

## Project structure

```
app/                     Routes (App Router); sitemap, robots and manifest are generated at build
components/
  3d/                    HeroScene, Viewer3D (lazy loader), MosqueModel, ShipModel, ArmoryModel, CityModel
  architecture/          BuildingGallery, BuildingIllustration, SinanStudio, IstanbulCity
  battles/               BattleCard, BattleExplorer
  compare/               ComparisonChart
  dynasty/               DynastyTree
  empire/                ArmySection, NavySection, TransformationExplorer, ReformExplorer
  figures/ rulers/       FigureCard, FigureProfile, SultanCard, SultanProfile, galleries
  layout/                SiteHeader, SiteFooter, SearchPanel, EasterEggs
  maps/                  MapCanvas, HistoricalMap, LocationsMap, WhereWereThey
  sections/              Home-page chapters (Hero, Siege1453, TimeMachine, FinalYears, …)
  timeline/              Timeline, TimelineDetail
  ui/                    Certainty labels, SourcesList, Portrait, Drawer (event modal), headings
data/                    All historical content (typed; see below)
  rulers/                The 36 sultans, split by period
  generated/basemap.ts   Pre-projected coastlines (generated)
lib/                     Settings and UI providers, ambient audio engine, geo helpers, search index
scripts/                 Map generation, data validation, hero video capture
public/                  Icons, Open Graph image, hero video and captions
```

## Editing content

All content is in `data/*.ts`, typed by `data/types.ts`. TypeScript tells you which fields are required. After any change, run:

```bash
npm run validate:data && npm run typecheck
```

### Add a historical figure

Add an object to the right array: `data/figures.ts`, `data/statesmen.ts` or `data/women.ts`. The profile page `/figures/<id>/`, the search entry and the sitemap entry are generated automatically. Here is the shape, abridged from the existing entry for Mihrimah Sultan (give a new figure its own unique `id`):

```ts
{
  id: 'mihrimah',                       // URL slug, unique
  name: 'Mihrimah Sultan',
  group: 'women',                       // 'figures' | 'statesmen' | 'women'
  category: 'princess',                 // see FigureCategory in data/types.ts
  role: 'Daughter of Süleyman I; patron of architecture',
  lifespan: 'c. 1522 – 1578',
  activeFrom: 1539,
  activeTo: 1578,
  summary: 'One or two sentences.',
  biography: ['Paragraph one.', 'Paragraph two.'],
  historicalRole: '…',
  accomplishments: ['…'],
  significance: '…',
  assessment: { certainty: 'high', traditions: false, debate: false },
  notes: [
    { kind: 'confirmed', text: '…' },
    { kind: 'tradition', text: 'Label legends explicitly.' },
  ],
  portrait: { headwear: 'crown-veil', palette: 'crimson' },  // procedural reconstruction
  relatedRulerIds: ['suleiman-i'],
  buildingIds: ['mihrimah-uskudar'],
  sources: ['peirce-harem', 'necipoglu-sinan'],   // IDs from data/sources.ts
}
```

### Add an event

Add an object to `data/events.ts`. Events with a `month` and `day` feed *On This Day* automatically. All events feed search and the Time Machine.

```ts
{ id: 'gulhane', year: 1839, month: 11, day: 3, dateLabel: '3 November 1839',
  title: 'Edict of Gülhane', description: 'Opens the Tanzimat reforms.',
  category: 'reform', importance: 3, rulerId: 'abdulmejid-i', certainty: 'confirmed',
  sources: ['gulhane', 'davison-reform'] }
```

Use `certainty: 'tradition' | 'interpretation' | 'disputed'` and a `note` whenever the evidence is not secure.

### Other content

| What | File | Notes |
|---|---|---|
| Sultans | `data/rulers/*.ts` | Profiles at `/sultans/<id>/` |
| Timeline milestones | `data/timeline.ts` | Shown on the horizontal timeline |
| Battles | `data/battles.ts` | `movements` are lon/lat polylines that become arrows; `view` is the map bounding box |
| Places | `data/places.ts` | `coords: [lon, lat]` |
| Buildings | `data/buildings.ts` | Add `istanbul: { lon, lat, model }` to place a building in the 3D city |
| Map territories | `data/territories.ts` | Regions are approximate lon/lat polygons. Each snapshot assigns a status per region |
| Glossary | `data/glossary.ts` | Anchors at `/glossary/#<id>` |
| Sources | `data/sources.ts` | Cite them by ID anywhere with a `sources` array |
| Narrative chapters | `data/narratives.ts` | Siege steps, Süleyman chapters, phases, factors, reforms, final years, army, navy, culture |

## Replacing images, videos and 3D assets

**Portraits and building images.** Every portrait and building illustration is a procedural *artistic reconstruction*. To use a real image, put the file in `public/images/` and add an `image` field to the ruler, figure or building:

```ts
image: {
  src: '/images/mahmud-ii.jpg',
  alt: 'Portrait of Mahmud II in a fez and frock coat, c. 1830s',
  credit: 'Topkapı Palace Museum',
  license: 'Public domain',
  kind: 'public-domain-artwork',   // or 'photograph' | 'artistic-reconstruction'
}
```

The image then replaces the procedural portrait or silhouette everywhere, with its credit line. Use only public-domain or properly licensed works, and record the licence.

**Hero video.** The fallback loop lives in `public/videos/`:
- `hero.webm` and `hero.mp4`: about 10 seconds, 1280×720, seamless loop.
- `hero-poster.jpg`: the still shown with reduced motion.
- `hero.en.vtt`: captions.

To replace it, drop in files with the same names. To regenerate it from the 3D scene, run `npm i -D playwright && npx playwright install chromium`. Then start `npm run dev` and run `npm run capture:hero`, which needs `ffmpeg`. If you change what the scene shows, update the captions too.

**3D models.** Models are generated in code, so there are no files to replace. Each one is a lazily loaded component:

| Component | Model |
|---|---|
| `components/3d/MosqueModel.tsx` | Sinan's mosques |
| `components/3d/ShipModel.tsx` | Galley |
| `components/3d/ArmoryModel.tsx` | Arms |
| `components/3d/CityModel.tsx` | Istanbul |
| `components/3d/HeroScene.tsx` | Hero skyline |

To use a glTF model instead:
1. Put it in `public/models/`.
2. Create a component that loads it with drei's `useGLTF('/models/name.glb')`.
3. Point the matching loader in `components/3d/Viewer3D.tsx` (for example `loadShip`) at the new component.

`Viewer3D` handles lazy loading, pausing off-screen and the opt-in on low quality.

**Audio.** Ambience is synthesized in `lib/audio.ts`. If you add recordings, use only licensed or public-domain material, and credit it on `/sources/`.

## Historical method

- **Nothing is invented.** No quotation, date, battle, title, relationship or achievement is invented. Attributed sayings and legends are labelled *tradition*, or omitted.
- **Certainty labels.** Labels (`components/ui/Certainty.tsx`) distinguish confirmed fact, tradition, interpretation and dispute. Profiles also carry an *assessment* that flags where traditions and debates exist.
- **Balance.** The empire is shown as neither purely heroic nor purely villainous. Violence, slavery and the Armenian Genocide are described plainly, with sources.
- **1922 and 1924 are kept separate.** The Sultanate was abolished on 1 November 1922 and Mehmed VI went into exile. Abdülmecid II was Caliph only, never Sultan, until the Caliphate was abolished on 3 March 1924. The Republic of Turkey, proclaimed on 29 October 1923, is presented as a new state.
- **Reconstructions are labelled.** Maps, battle diagrams, portraits and 3D scenes are approximations and are marked as reconstructions.

## Accessibility and performance

- **Keyboard and screen readers:**
  - Keyboard access throughout, with skip link and visible focus.
  - Dialogs trap focus.
  - The map and family tree can be zoomed and panned from the keyboard.
  - The family tree has a list view; the sultan comparison has a table view.
- **Reduced motion.** The site follows `prefers-reduced-motion` and also has a manual setting. Animations are disabled and the hero shows a still poster.
- **Selective 3D:**
  - WebGL loads only when a viewer nears the viewport, and pauses when it leaves.
  - Low-quality mode, chosen automatically on low-power phones or when WebGL is missing, uses the video or posters and asks before loading 3D.
- **Size and SEO:**
  - No third-party requests at runtime: fonts are downloaded at build time and self-hosted by `next/font`.
  - Static HTML for every page, with metadata, Open Graph image, sitemap, robots and a web manifest.

## Credits and licences

- **Coastlines:** Natural Earth (public domain) via the `world-atlas` package.
- **Fonts:** Cormorant Garamond, Manrope and Amiri (SIL Open Font License).
- **Procedural assets:** all portraits, illustrations, 3D models, the hero video and the ambient audio were generated for this project.
- **Bibliography:** the full list is on the `/sources/` page and in `data/sources.ts`.
