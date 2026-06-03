import { Cinzel, Inter } from 'next/font/google';

/**
 * Display font — Cinzel (fantasy serif) for headings, evoking the TCG/tavern
 * identity. The `latin-ext` subset covers the Serbian Latin specials
 * (č ć š ž đ, all within U+0100–02BA), so headings render correctly in Serbian.
 */
export const fontDisplay = Cinzel({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-cinzel',
  display: 'swap',
});

/** Body font — Inter, neutral and highly legible, full Latin-ext support. */
export const fontSans = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

/** Combined font CSS-variable classes to attach to <html>. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;
