'use client';

import { useEffect, useRef, useState } from 'react';

/** True once (or while) the element is within `rootMargin` of the viewport. */
export function useInView<T extends Element>(options: { rootMargin?: string; once?: boolean; threshold?: number } = {}) {
  const { rootMargin = '200px', once = true, threshold = 0 } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once, threshold]);

  return [ref, inView] as const;
}
