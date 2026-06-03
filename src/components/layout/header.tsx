'use client';

import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Link } from '@/i18n/navigation';
import { NAV_ITEMS } from './nav-config';

/**
 * Sticky site header (SRS FR-25.2): logo, primary nav, search/cart/account
 * actions, theme toggle and language switcher. Gains a blurred background after
 * 80px of scroll; collapses to a hamburger menu below `md`.
 */
export function Header() {
  const t = useTranslations('nav');
  const tActions = useTranslations('actions');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        scrolled
          ? 'border-border bg-background/80 border-b backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-foreground text-xl font-bold tracking-wide">
          Dragon Games
        </Link>

        {/* Desktop navigation */}
        <nav aria-label={t('catalog')} className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/search"
            aria-label={t('search')}
            className="text-foreground/80 hover:bg-surface-elevated hover:text-foreground hidden size-9 items-center justify-center rounded-full transition-colors sm:inline-flex"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/cart"
            aria-label={t('cart')}
            className="text-foreground/80 hover:bg-surface-elevated hover:text-foreground hidden size-9 items-center justify-center rounded-full transition-colors sm:inline-flex"
          >
            <ShoppingCart className="size-5" />
          </Link>
          <Link
            href="/account"
            aria-label={t('account')}
            className="text-foreground/80 hover:bg-surface-elevated hover:text-foreground hidden size-9 items-center justify-center rounded-full transition-colors sm:inline-flex"
          >
            <User className="size-5" />
          </Link>

          <ThemeToggle label={tActions('toggleTheme')} />
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? tActions('closeMenu') : tActions('openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
            className="text-foreground/80 hover:bg-surface-elevated hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label={t('catalog')}
          className="border-border bg-background border-b px-4 pb-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-card text-foreground hover:bg-surface-elevated block px-3 py-2 text-base font-medium"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-3 px-3">
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
