import { PageTransition } from '@/components/motion/page-transition';

/**
 * A `template` is re-instantiated on every navigation (unlike `layout`), so the
 * page enter transition plays on each route change (SRS FR-24.1).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
