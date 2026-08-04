type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  /** Max requests within the window */
  limit?: number;
  /** Window length in milliseconds */
  windowMs?: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
};

const store = new Map<string, RateLimitEntry>();

const DEFAULT_LIMIT = 20;
const DEFAULT_WINDOW_MS = 60_000;

function pruneExpired(now: number) {
  if (store.size < 500) return;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

/**
 * Simple in-memory rate limiter.
 * Suitable for single-instance deployments. Use Redis for multi-instance production.
 */
export function rateLimit(key: string, options: RateLimitOptions = {}): RateLimitResult {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();

  pruneExpired(now);

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return {
      success: true,
      remaining: limit - 1,
      resetAt: entry.resetAt,
      limit,
    };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
      limit,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    success: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    limit,
  };
}

export function resetRateLimit(key?: string) {
  if (key) {
    store.delete(key);
    return;
  }
  store.clear();
}
