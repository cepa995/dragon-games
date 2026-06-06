import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { NewsletterForm } from './newsletter-form';

export async function NewsletterSignup() {
  const t = await getTranslations('home.newsletter');

  return (
    <section className="relative mx-auto w-full max-w-[1280px] px-4 pb-24 sm:px-6">
      <Reveal>
        <div
          data-theme="dark"
          style={{ colorScheme: 'dark' }}
          className="rounded-hero border-border from-surface-elevated to-background text-foreground relative overflow-hidden border bg-gradient-to-br p-8 text-center sm:p-12"
        >
          <div className="bg-accent/20 pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full blur-3xl" />
          <div className="relative mx-auto flex max-w-lg flex-col items-center gap-3">
            <h2 className="font-display text-3xl sm:text-4xl">{t('title')}</h2>
            <p className="text-muted-foreground">{t('subtitle')}</p>
            <div className="mt-4 flex w-full flex-col items-center gap-2">
              <NewsletterForm />
              <p className="text-muted-foreground text-xs">{t('privacy')}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
