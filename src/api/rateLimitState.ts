import { RateLimitInfo } from './types/github';

type RateLimitListener = (info: RateLimitInfo | null) => void;

let currentRateLimit: RateLimitInfo | null = null;
const listeners = new Set<RateLimitListener>();

/**
 * Update the global rate limit state and notify listeners
 */
export function updateRateLimitFromHeaders(headers: Headers): RateLimitInfo | null {
  const limitHeader = headers.get('x-ratelimit-limit');
  const remainingHeader = headers.get('x-ratelimit-remaining');
  const resetHeader = headers.get('x-ratelimit-reset');
  const usedHeader = headers.get('x-ratelimit-used');

  if (!limitHeader || !remainingHeader || !resetHeader) {
    return currentRateLimit;
  }

  const limit = parseInt(limitHeader, 10);
  const remaining = parseInt(remainingHeader, 10);
  const resetSeconds = parseInt(resetHeader, 10);
  const used = usedHeader ? parseInt(usedHeader, 10) : limit - remaining;

  const info: RateLimitInfo = {
    limit,
    remaining,
    reset: new Date(resetSeconds * 1000),
    used,
  };

  currentRateLimit = info;
  listeners.forEach((listener) => listener(info));
  return info;
}

export function getCurrentRateLimit(): RateLimitInfo | null {
  return currentRateLimit;
}

export function subscribeToRateLimit(listener: RateLimitListener): () => void {
  listeners.add(listener);
  // Initial call with current state
  listener(currentRateLimit);
  return () => {
    listeners.delete(listener);
  };
}
