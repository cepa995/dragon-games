import { CheckCircle2, XCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';

/** Centered success/failure card for one-off result pages (confirm, unsubscribe). */
export function ResultMessage({
  ok,
  title,
  body,
  backLabel,
}: {
  ok: boolean;
  title: string;
  body: string;
  backLabel: string;
}) {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-20 text-center"
    >
      <span className={ok ? 'text-success' : 'text-muted-foreground'}>
        {ok ? <CheckCircle2 className="size-12" /> : <XCircle className="size-12" />}
      </span>
      <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
      <p className="text-muted-foreground">{body}</p>
      <Link
        href="/"
        className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
      >
        {backLabel}
      </Link>
    </main>
  );
}
