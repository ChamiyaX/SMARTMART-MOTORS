/**
 * Run an async data query and return a fallback when the DB is unavailable
 * (missing DATABASE_URL, connection errors, etc.) so build/preview still work.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Visible in Vercel Runtime Logs — helps diagnose live empty catalogues
    console.error("[safeQuery] database query failed:", message);
    return fallback;
  }
}
