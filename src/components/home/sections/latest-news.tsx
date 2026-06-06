import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { SmartImage } from '@/components/ui/smart-image';
import { Link } from '@/i18n/navigation';
import { formatDate } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { Section } from './section';

function excerpt(text: string | null, max = 160): string {
  if (!text) return '';
  const plain = text.replace(/<[^>]+>/g, '').trim();
  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}

export async function LatestNews({ locale }: { locale: string }) {
  const t = await getTranslations('home.news');

  const posts = await prisma.newsPost.findMany({
    where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  if (posts.length === 0) return null;

  const localized = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    cover: post.coverImage,
    publishedAt: post.publishedAt,
    title: locale === 'en' && post.titleEn ? post.titleEn : post.titleSr,
    body: locale === 'en' && post.bodyEn ? post.bodyEn : post.bodySr,
  }));

  const [featured, ...rest] = localized;

  return (
    <Section
      title={t('title')}
      subtitle={t('subtitle')}
      actionHref="/news"
      actionLabel={t('viewAll')}
    >
      <div className="space-y-6">
        {featured && (
          <Link
            href={`/news/${featured.slug}`}
            className="group rounded-hero border-border bg-surface hover:border-accent/40 grid overflow-hidden border transition-all duration-300 hover:-translate-y-1 md:grid-cols-2"
          >
            <div className="bg-muted relative aspect-[16/10] overflow-hidden md:aspect-auto">
              <SmartImage
                src={featured.cover}
                alt={featured.title}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
              {featured.publishedAt && (
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  {formatDate(featured.publishedAt, locale)}
                </p>
              )}
              <h3 className="font-display text-2xl leading-snug sm:text-3xl">{featured.title}</h3>
              <p className="text-muted-foreground line-clamp-3">{excerpt(featured.body)}</p>
              <span className="text-accent inline-flex items-center gap-1.5 text-sm font-semibold">
                {t('readMore')}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group rounded-hero border-border bg-surface hover:border-accent/40 flex gap-4 overflow-hidden border p-4 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="rounded-card bg-muted relative aspect-square w-28 shrink-0 overflow-hidden">
                  <SmartImage
                    src={post.cover}
                    alt={post.title}
                    sizes="112px"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 space-y-1 py-1">
                  {post.publishedAt && (
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                      {formatDate(post.publishedAt, locale)}
                    </p>
                  )}
                  <h3 className="font-display line-clamp-2 text-base leading-snug">{post.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {excerpt(post.body, 90)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
