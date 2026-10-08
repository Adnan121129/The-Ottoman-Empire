import Link from 'next/link';
import { Emblem } from '@/components/ui/Emblem';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 pt-28 text-center">
      <div className="pattern-girih absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <div>
        <Emblem className="mx-auto h-16 w-16 text-gold" />
        <p className="label-caps mt-8 text-gold">404 · Lost in the archives</p>
        <h1 className="display-title mt-4 text-5xl text-ivory sm:text-7xl">This page is not in the record</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ivory/65">Even the imperial chancery misplaced a register now and then. The page you were looking for does not exist — or has moved.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light">
            Return home
          </Link>
          <Link href="/#timeline" className="rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold-light transition hover:border-gold">
            Open the timeline
          </Link>
        </div>
      </div>
    </section>
  );
}
