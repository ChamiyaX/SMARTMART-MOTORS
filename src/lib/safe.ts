/**
 * Run an async data query and return a fallback when the DB is unavailable
 * (missing DATABASE_URL, connection errors, etc.) so build/preview still work.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[safeQuery]", error instanceof Error ? error.message : error);
    }
    return fallback;
  }
}
