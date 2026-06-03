import { NextResponse, type NextRequest } from 'next/server';
import { CORRELATION_HEADER, generateCorrelationId } from '@/lib/correlation';

/**
 * Assigns a correlation id to every request and echoes it on the response so it
 * can be tied to structured logs and error reports (NFR-7.1). Locale routing
 * (M2 / #10) and auth gating (M3 / #12) extend this middleware later.
 */
export function middleware(request: NextRequest) {
  const correlationId = request.headers.get(CORRELATION_HEADER) ?? generateCorrelationId();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CORRELATION_HEADER, correlationId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(CORRELATION_HEADER, correlationId);
  return response;
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
