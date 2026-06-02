import { redirect } from 'next/navigation';

/**
 * Root entry redirects to the default (Serbian) locale. Full locale negotiation
 * arrives with next-intl in M2 (#10); this keeps `/` working in the meantime.
 */
export default function RootPage() {
  redirect('/sr');
}
