'use client';

import { ArrowRight, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Link } from '@/i18n/navigation';
import { NAV_ITEMS } from './nav-config';

/**
 * Sticky site header (SRS FR-25.2): logo, primary nav, search/cart/account
 * actions, theme toggle and language switcher. Gains a blurred background after
 * 80px of scroll; below `md` it collapses to a full-screen overlay menu.
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

  // Lock body scroll + allow Escape to close while the overlay is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const iconAction =
    'text-foreground/80 hover:bg-surface-elevated hover:text-foreground flex size-10 items-center justify-center rounded-full transition-colors';

  return (
    <header
      data-theme="dark"
      style={{ colorScheme: 'dark' }}
      className="text-foreground sticky top-0 z-50 w-full"
    >
      {/* Blur/background lives on this inner bar (not the <header>) so the header
          has no backdrop-filter — otherwise it would become the containing block
          for the fixed full-screen menu and collapse it. */}
      <div
        className={`backdrop-blur-md transition-colors duration-200 ${
          menuOpen
            ? 'border-border bg-background border-b'
            : scrolled
              ? 'border-border bg-background/85 border-b'
              : 'bg-background/55 border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Dragon Games" className="flex items-center">
            <Image
              src="/images/dragon_games_logo.png"
              alt="Dragon Games"
              width={1254}
              height={1254}
              priority
              className="h-11 w-11 transition-transform hover:scale-105"
            />
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
              className={`hidden sm:flex ${iconAction}`}
            >
              <Search className="size-5" />
            </Link>
            <Link href="/cart" aria-label={t('cart')} className={`hidden sm:flex ${iconAction}`}>
              <ShoppingCart className="size-5" />
            </Link>
            <Link
              href="/account"
              aria-label={t('account')}
              className={`hidden sm:flex ${iconAction}`}
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
              className={`md:hidden ${iconAction}`}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen mobile menu (fills the screen below the sticky header) */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="bg-background fixed inset-x-0 top-16 bottom-0 z-40 flex animate-[menu-in_0.2s_ease-out] flex-col md:hidden"
        >
          <nav aria-label={t('catalog')} className="flex flex-1 flex-col justify-center px-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-border/60 hover:text-accent group flex items-center justify-between border-b py-4 last:border-b-0"
              >
                <span className="font-display text-3xl">{t(item.key)}</span>
                <ArrowRight className="text-muted-foreground group-hover:text-accent size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </nav>

          <div className="border-border flex shrink-0 items-center gap-2 border-t px-6 py-6">
            <Link
              href="/search"
              aria-label={t('search')}
              onClick={() => setMenuOpen(false)}
              className={iconAction}
            >
              <Search className="size-5" />
            </Link>
            <Link
              href="/cart"
              aria-label={t('cart')}
              onClick={() => setMenuOpen(false)}
              className={iconAction}
            >
              <ShoppingCart className="size-5" />
            </Link>
            <Link
              href="/account"
              aria-label={t('account')}
              onClick={() => setMenuOpen(false)}
              className={iconAction}
            >
              <User className="size-5" />
            </Link>
            <div className="ml-auto">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
