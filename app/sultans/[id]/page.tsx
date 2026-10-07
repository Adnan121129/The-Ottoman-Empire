import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRuler, reignLabel, rulers } from '@/data/rulers';
import { SultanProfile } from '@/components/rulers/SultanProfile';

export const dynamicParams = false;

export function generateStaticParams() {
  return rulers.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const r = getRuler(id);
  if (!r) return {};
  return {
    title: `${r.name}${r.epithet ? ` — ${r.epithet.split('·')[0].trim()}` : ''} (${reignLabel(r)})`,
    description: r.summary,
    alternates: { canonical: `/sultans/${r.id}/` },
    openGraph: { title: `${r.name} · Ottoman Sultan`, description: r.summary },
  };
}

export default async function SultanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ruler = getRuler(id);
  if (!ruler) notFound();
  return <SultanProfile ruler={ruler} />;
}
