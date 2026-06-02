'use client';

import { useReportWebVitals } from 'next/web-vitals';

/**
 * Reports Core Web Vitals (LCP/CLS/INP, …) from real sessions. The performance
 * budget + RUM pipeline is finalised in M9 (#41); for now metrics are surfaced
 * to the console in development and left ready to forward to an analytics sink.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[web-vitals] ${metric.name}: ${Math.round(metric.value)}`);
    }
    // M9 (#41) wires this to the production RUM/analytics endpoint.
  });

  return null;
}
