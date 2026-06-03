# Design system

The visual foundation for Dragon Games (SRS §6, FR-23/24/25/26). Dark-first
"tavern at night" with an optional light theme. Implemented with Tailwind CSS v4
+ CSS variables in [`src/app/globals.css`](../src/app/globals.css).

## Theming

- Raw tokens are declared on `:root` (dark) with a `[data-theme='light']`
  override, then mapped to Tailwind utilities via `@theme inline` using `var()`,
  so colors switch at runtime with no rebuild.
- **Dark is the default even with JavaScript disabled** (`:root` carries the dark
  values), satisfying graceful degradation (SRS C-9).
- Theme is controlled by [`next-themes`](https://github.com/pacocoursey/next-themes)
  via the `data-theme` attribute (`ThemeProvider`), `enableSystem=false` so the
  default stays dark until the user toggles (FR-23.1). A pre-paint script
  prevents flash-of-wrong-theme. Toggle: `ThemeToggle`.

## Color tokens

| Token / utility | Purpose |
|---|---|
| `background` | Page background |
| `surface`, `surface-elevated` | Cards / raised panels |
| `foreground`, `muted-foreground` | Text / secondary text |
| `border`, `input`, `ring` | Lines, fields, focus ring |
| `primary` / `accent` (+ `-foreground`) | Brand action color (amber firelight) |
| `destructive`, `success`, `warning` | Feedback states |

Use as Tailwind utilities: `bg-background`, `text-foreground`, `border-border`,
`text-muted-foreground`, `bg-primary text-primary-foreground`, etc.

### Per-TCG accents (SRS §16)

`text-tcg-mtg` (gold) · `text-tcg-pokemon` (yellow) · `text-tcg-yugioh` (purple) ·
`text-tcg-riftbound` (teal) — and the matching `bg-*` / `border-*` utilities.

## Typography (FR-23.2)

- **Display / headings** — Cinzel (`font-display`), a fantasy serif. The
  `latin-ext` subset covers the Serbian Latin specials (č ć š ž đ). `h1–h3` use
  it automatically.
- **Body** — Inter (`font-sans`), full Latin-ext support.
- Both are loaded and self-hosted via `next/font/google`
  ([`src/lib/fonts.ts`](../src/lib/fonts.ts)) — no runtime request to Google
  (GDPR-friendly).

## Spacing & radii

- **Spacing** uses Tailwind's native 4px scale, which already matches the SRS
  scale (4/8/12/16/24/32/48/64/96 = `1/2/3/4/6/8/12/16/24`).
- **Radii** — `rounded-card` (8px), `rounded-hero` (12px), `rounded-full` (pill
  tags). FR-23.4.

## Icons

[`lucide-react`](https://lucide.dev) is the single icon library (FR-23.6).

## Motion & accessibility

`prefers-reduced-motion: reduce` is honored globally in `globals.css` (SRS C-8);
the reusable motion primitives (page transitions, scroll reveal) are documented
with #9.
