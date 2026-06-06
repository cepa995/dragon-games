'use client';

import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

/** Floating button that returns to the top once the page is scrolled. */
export function ScrollToTop() {
  const t = useTranslations('actions');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t('backToTop')}
      className={`bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:outline-ring fixed right-5 bottom-5 z-40 flex size-11 items-center justify-center rounded-full shadow-lg shadow-black/40 transition-all duration-300 focus-visible:outline-2 sm:right-6 sm:bottom-6 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
