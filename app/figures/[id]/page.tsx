import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allFigures, getFigure } from '@/data/people';
import { FigureProfile } from '@/components/figures/FigureProfile';

export const dynamicParams = false;

export function generateStaticParams() {
  return allFigures.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const f = getFigure(id);
  if (!f) return {};
  return { title: `${f.name} — ${f.role}`, description: f.summary, alternates: { canonical: `/figures/${f.id}/` } };
}

export default async function FigurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const figure = getFigure(id);
  if (!figure) notFound();
  return <FigureProfile figure={figure} />;
}
