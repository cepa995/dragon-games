import { getTranslations } from 'next-intl/server';
import { SmartImage } from '@/components/ui/smart-image';
import { Link } from '@/i18n/navigation';
import { formatDate } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { Section } from './section';

function excerpt(text: string | null, max = 130): string {
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

  return (
    <Section
      title={t('title')}
      subtitle={t('subtitle')}
      actionHref="/news"
      actionLabel={t('viewAll')}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => {
          const title = locale === 'en' && post.titleEn ? post.titleEn : post.titleSr;
          const body = locale === 'en' && post.bodyEn ? post.bodyEn : post.bodySr;
          return (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group rounded-hero border-border bg-surface overflow-hidden border transition-transform hover:-translate-y-1"
            >
              <div className="bg-muted relative aspect-[16/9] overflow-hidden">
                <SmartImage
                  src={post.coverImage}
                  alt={title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-5">
                {post.publishedAt && (
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    {formatDate(post.publishedAt, locale)}
                  </p>
                )}
                <h3 className="font-display text-lg leading-snug">{title}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">{excerpt(body)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
