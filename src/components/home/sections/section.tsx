import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';

export function Section({
  id,
  title,
  subtitle,
  actionHref,
  actionLabel,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
            {subtitle && <p className="text-muted-foreground max-w-2xl">{subtitle}</p>}
          </div>
          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className="group text-accent hover:text-foreground inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors"
            >
              {actionLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </Reveal>
      <Reveal>{children}</Reveal>
    </section>
  );
}
