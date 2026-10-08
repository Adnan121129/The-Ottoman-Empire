'use client';

import { motion } from 'motion/react';
import { ArrowDown, Compass } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useSettings } from '@/lib/providers';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false });

const TAGLINE = ['Rise.', 'Expansion.', 'Glory.', 'Transformation.', 'Decline.', 'Legacy.'];

export function scrollToId(id: string, reduced: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  el.focus?.({ preventScroll: true });
}

export function Hero() {
  const { quality, reducedMotion } = useSettings();
  const [ref, inView] = useInView<HTMLElement>({ once: false, rootMargin: '0px' });
  const [ready, setReady] = useState(false);
  const [capture, setCapture] = useState(false);

  useEffect(() => {
    setCapture(new URLSearchParams(window.location.search).has('capture'));
    // Mount WebGL after first paint so the headline renders immediately.
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => setReady(true)) : window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(id as number);
  }, []);

  const use3D = ready && (quality !== 'low' || capture);
  // Low-power devices, no WebGL or reduced motion: a pre-rendered loop of the same scene (or its still poster).
  const useVideo = ready && !use3D && !capture;
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView && !reducedMotion) v.play().catch(() => {});
    else v.pause();
  }, [inView, reducedMotion, useVideo]);
  const ease = [0.22, 1, 0.36, 1] as const;
  const d = (n: number) => (reducedMotion ? 0 : n);

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative isolate h-[100svh] min-h-[640px] overflow-hidden">
      {/* Painted dusk fallback — always present, visible until (or instead of) WebGL */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(120%_70%_at_45%_78%,#f0a25a_0%,#a2482f_22%,#4a1a26_48%,#120b10_78%)]" aria-hidden="true" />
      <svg className="absolute inset-x-0 bottom-[22%] -z-10 h-[34%] w-full text-[#1d1210]" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="currentColor"
          d="M0 260 L0 210 L60 205 L70 150 L76 150 L80 210 L180 200 Q230 130 280 200 L300 200 L306 120 L312 120 L318 200 L420 196 Q470 110 540 190 L548 190 L552 80 L558 80 L562 190 L600 190 Q640 120 690 186 L700 186 L705 96 L711 96 L716 186 L800 190 Q860 105 930 188 L940 188 L944 70 L950 70 L955 188 L1010 192 L1020 130 L1028 130 L1034 192 L1120 196 Q1170 150 1220 198 L1440 205 L1440 300 L0 300 Z"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[24%] bg-gradient-to-b from-[#2a1420] to-ink" aria-hidden="true" />

      {useVideo && (
        <motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(1.6) }}>
          <video
            ref={video}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay={!reducedMotion}
            preload={reducedMotion ? 'none' : 'auto'}
            poster="/videos/hero-poster.jpg"
            aria-label="Looping artistic reconstruction of Constantinople’s skyline at dusk"
          >
            <source src="/videos/hero.webm" type="video/webm" />
            <source src="/videos/hero.mp4" type="video/mp4" />
            <track kind="captions" src="/videos/hero.en.vtt" srcLang="en" label="English" default />
          </video>
        </motion.div>
      )}

      {use3D && (
        <motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(2.2) }}>
          <HeroScene quality={capture ? 'high' : quality} active={inView} />
        </motion.div>
      )}

      {!capture && (
        <>
          <div className="vignette pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/50 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-center px-4 pb-16 sm:px-8">
            <motion.p className="label-caps text-gold-light/90" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: d(1), delay: d(0.3), ease }}>
              An interactive history in six centuries
            </motion.p>
            <h1 id="hero-title" className="mt-6 font-display font-medium leading-[0.86] tracking-[0.06em] text-ivory">
              <motion.span className="block text-[13vw] sm:text-[9.5vw] xl:text-[8.6rem]" initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: d(1.6), delay: d(0.4), ease }}>
                THE OTTOMAN
              </motion.span>
              <motion.span className="block text-[13vw] sm:text-[9.5vw] xl:text-[8.6rem]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: d(1.6), delay: d(0.65), ease }}>
                <span className="text-gold-gradient">EMPIRE</span>
              </motion.span>
            </h1>
            <motion.div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(1.2), delay: d(1.1) }}>
              <p className="font-display text-3xl tracking-[0.35em] text-gold-light sm:text-4xl">1299 — 1922</p>
              <p className="font-display text-xl italic text-ivory/85 sm:text-2xl">Six Centuries That Changed the World</p>
            </motion.div>
            <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm tracking-[0.2em] text-ivory/60 uppercase" aria-label={TAGLINE.join(' ')}>
              {TAGLINE.map((w, i) => (
                <motion.span key={w} aria-hidden="true" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: d(0.8), delay: d(1.4 + i * 0.12) }}>
                  {w}
                </motion.span>
              ))}
            </p>
            <motion.div className="mt-10 flex flex-col gap-3 sm:flex-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: d(1), delay: d(2.1), ease }}>
              <button
                onClick={() => scrollToId('timeline', reducedMotion)}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-bold tracking-[0.22em] text-ink uppercase shadow-[0_0_40px_rgba(201,162,74,0.35)] transition hover:bg-gold-light"
              >
                Begin the journey
                <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" aria-hidden="true" />
              </button>
              <Link href="/map/" className="inline-flex items-center justify-center gap-3 rounded-full border border-ivory/25 bg-black/25 px-8 py-4 text-sm font-semibold tracking-[0.22em] text-ivory uppercase backdrop-blur transition hover:border-gold/60 hover:text-gold-light">
                <Compass className="h-4 w-4" aria-hidden="true" />
                Explore the empire
              </Link>
            </motion.div>
          </div>

          <div className="absolute inset-x-0 bottom-6 mx-auto flex max-w-[1500px] items-end justify-between gap-6 px-4 text-[0.65rem] text-ivory/45 sm:px-8">
            <p className="max-w-xs">
              <span className="label-caps text-gold/80">Artistic reconstruction</span>
              <br />A stylized view of Constantinople at dusk — evocative, not to scale.
            </p>
            <button onClick={() => scrollToId('prologue', reducedMotion)} className="hidden flex-col items-center gap-2 text-ivory/60 hover:text-gold-light sm:flex" aria-label="Scroll to begin">
              <span className="label-caps">Scroll</span>
              <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
