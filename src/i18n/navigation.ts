import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation APIs. Use these (`Link`, `useRouter`, `usePathname`,
 * `redirect`) instead of the next/navigation equivalents so locale prefixes are
 * handled automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
