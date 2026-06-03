import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tBrand = await getTranslations('brand');

  // Placeholder home — replaced by the real informational home in M4 (#16).
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <p className="text-accent text-sm font-medium tracking-widest uppercase">{tBrand('name')}</p>
      <h1 className="text-4xl sm:text-5xl">{t('tagline')}</h1>
      <p className="text-muted-foreground max-w-prose">{t('subtitle')}</p>
    </main>
  );
}
