import type { MetadataRoute } from 'next';
import { rulers } from '@/data/rulers';
import { allFigures } from '@/data/people';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const PAGES = ['', 'sultans', 'figures', 'battles', 'map', 'culture', 'architecture', 'empire', 'final-years', 'dynasty', 'compare', 'glossary', 'sources'];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}/${p ? `${p}/` : ''}`, changeFrequency: 'monthly' as const, priority: p ? 0.8 : 1 })),
    ...rulers.map((r) => ({ url: `${SITE_URL}/sultans/${r.id}/`, changeFrequency: 'yearly' as const, priority: 0.6 })),
    ...allFigures.map((f) => ({ url: `${SITE_URL}/figures/${f.id}/`, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ];
}
