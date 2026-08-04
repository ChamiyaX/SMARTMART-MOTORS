/**
 * Run an async data query and return a fallback when the DB is unavailable.
 * Retries once — helps with cold-start pooler timeouts on Vercel.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (firstError) {
    try {
      await new Promise((r) => setTimeout(r, 250));
      return await fn();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[safeQuery] database query failed:", message);
      if (firstError instanceof Error && firstError.message !== message) {
        console.error("[safeQuery] first attempt:", firstError.message);
      }
      return fallback;
    }
  }
}
