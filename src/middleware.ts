import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { CORRELATION_HEADER, generateCorrelationId } from '@/lib/correlation';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Composes locale routing (next-intl) with correlation-id propagation (NFR-7.1).
 * Every response — including `/api/*`, which next-intl skips — carries an
 * `x-request-id`. Locale gating/redirects apply only to page routes.
 */
export function middleware(request: NextRequest) {
  const correlationId = request.headers.get(CORRELATION_HEADER) ?? generateCorrelationId();
  const { pathname } = request.nextUrl;

  // API and other non-page routes: correlation only, no locale handling.
  const isPageRoute = !pathname.startsWith('/api');

  let response: NextResponse;
  if (isPageRoute) {
    response = intlMiddleware(request);
  } else {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(CORRELATION_HEADER, correlationId);
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  response.headers.set(CORRELATION_HEADER, correlationId);
  return response;
}

export const config = {
  // Everything except Next internals and static assets (so `/api` is covered).
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
