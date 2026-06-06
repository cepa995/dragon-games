import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';

/**
 * Welcome / manifesto — a calm, centered typographic beat between the hero and
 * the games section. No localized glow or imagery, so it blends into the shared
 * canvas rather than reading as a separate box.
 */
export async function WelcomeBand() {
  const t = await getTranslations('home.welcome');
  const badges = t.raw('badges') as string[];

  return (
    <section className="relative">
      {/* Club photo backdrop — blurred, low-opacity, edges faded so it blends
          into the shared canvas rather than reading as a box. Replace
          public/images/home/welcome-bg.jpg with a real club interior photo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/home/welcome-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="scale-110 [mask-image:radial-gradient(ellipse_88%_82%_at_center,#000_6%,transparent_92%)] object-cover opacity-[0.2] blur-[3px]"
        />
        <div className="from-background via-background/55 to-background absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <Reveal>
          <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
            {t('eyebrow')}
          </p>
          <h2
            className="font-display mx-auto mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl"
            style={{
              backgroundImage:
                'linear-gradient(180deg, var(--color-foreground) 45%, color-mix(in oklch, var(--color-accent) 80%, var(--color-foreground)))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {t('title')}
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg leading-relaxed">
            {t('body')}
          </p>
          <ul className="mt-7 flex flex-wrap justify-center gap-2">
            {badges.map((b) => (
              <li
                key={b}
                className="border-border bg-surface/40 text-muted-foreground rounded-full border px-3.5 py-1.5 text-xs font-medium"
              >
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="text-accent hover:text-foreground group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          >
            {t('cta')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
