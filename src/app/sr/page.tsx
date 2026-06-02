import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Početna',
};

/**
 * Serbian (default-locale) placeholder home. Replaced by the real informational
 * home page in M4 (#16). Present so the foundation renders a real route.
 */
export default function HomePageSr() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium tracking-widest text-[var(--color-accent)] uppercase">
        Dragon Games
      </p>
      <h1 className="text-4xl font-bold sm:text-5xl">TCG i board games klub od 1994.</h1>
      <p className="max-w-prose text-[var(--color-muted)]">
        Nova web platforma je u izradi. Temelji aplikacije (M1) su postavljeni — katalog, turniri i
        nalozi stižu uskoro.
      </p>
    </main>
  );
}
