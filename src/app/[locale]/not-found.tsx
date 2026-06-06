import { Compass, Home } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

/**
 * Branded 404 for in-locale routes (e.g. an unknown guide). Rendered inside the
 * locale layout, so it keeps the header, footer and theme.
 */
export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <main
      id="main-content"
      className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6 overflow-hidden px-6 py-24 text-center"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 size-[clamp(280px,40vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--color-accent) 24%, transparent), transparent 65%)',
        }}
      />

      <p className="text-accent relative text-xs font-semibold tracking-[0.3em] uppercase">
        {t('code')}
      </p>

      <p
        className="font-display relative text-8xl leading-none sm:text-9xl"
        style={{
          backgroundImage:
            'linear-gradient(180deg, var(--color-foreground) 30%, color-mix(in oklch, var(--color-accent) 85%, var(--color-foreground)))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        404
      </p>

      <div className="relative space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl">{t('title')}</h1>
        <p className="text-muted-foreground mx-auto max-w-md">{t('description')}</p>
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <Home className="size-4" />
          {t('home')}
        </Link>
        <Link
          href="/guides"
          className="border-border hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <Compass className="size-4" />
          {t('guides')}
        </Link>
      </div>
    </main>
  );
}
