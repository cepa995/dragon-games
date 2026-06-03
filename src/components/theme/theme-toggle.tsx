'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { getNextTheme } from '@/lib/theme';

/**
 * Dark/light theme toggle. Renders a stable icon during SSR and until mounted to
 * avoid hydration mismatch (the resolved theme is only known on the client). The
 * `label` is passed localized from the header (i18n wired in #10).
 */
export function ThemeToggle({ label = 'Toggle theme' }: { label?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = resolvedTheme ?? theme;
  const showMoon = mounted && current === 'light';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(getNextTheme(current))}
      className="text-foreground/80 hover:bg-surface-elevated hover:text-foreground focus-visible:outline-ring inline-flex size-9 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
    >
      {showMoon ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </button>
  );
}
