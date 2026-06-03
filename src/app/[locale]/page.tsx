import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Stagger, StaggerItem } from '@/components/motion/reveal';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tBrand = await getTranslations('brand');

  // Placeholder home — replaced by the real informational home in M4 (#16).
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center"
    >
      <Stagger className="flex flex-col items-center gap-4">
        <StaggerItem>
          <p className="text-accent text-sm font-medium tracking-widest uppercase">
            {tBrand('name')}
          </p>
        </StaggerItem>
        <StaggerItem>
          <h1 className="text-4xl sm:text-5xl">{t('tagline')}</h1>
        </StaggerItem>
        <StaggerItem>
          <p className="text-muted-foreground max-w-prose">{t('subtitle')}</p>
        </StaggerItem>
      </Stagger>
    </main>
  );
}
