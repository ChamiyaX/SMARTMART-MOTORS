/**
 * Run an async data query and return a fallback when the DB is unavailable.
 * Retries once on connection-style failures (cold pooler starts).
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (firstError) {
    const firstMessage =
      firstError instanceof Error ? firstError.message : String(firstError);
    const retryable = /connect|timeout|pool|ECONN|PrismaClient/i.test(firstMessage);

    if (retryable) {
      try {
        await new Promise((r) => setTimeout(r, 120));
        return await fn();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[safeQuery] database query failed:", message);
        return fallback;
      }
    }

    console.error("[safeQuery] database query failed:", firstMessage);
    return fallback;
  }
}
