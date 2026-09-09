/** Supabase project ref from pooler or direct Postgres URLs. */
export function getSupabaseProjectRef(): string | null {
  for (const url of [process.env.DIRECT_URL, process.env.DATABASE_URL]) {
    if (!url) continue;

    const directMatch = url.match(/db\.([a-z0-9]+)\.supabase\.co/i);
    if (directMatch?.[1]) return directMatch[1];

    const poolerMatch = url.match(/postgres\.([a-z0-9]+):/i);
    if (poolerMatch?.[1]) return poolerMatch[1];
  }

  return null;
}

/** Public Supabase URL — explicit env wins, otherwise derived from DATABASE_URL. */
export function getSupabaseUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const ref = getSupabaseProjectRef();
  return ref ? `https://${ref}.supabase.co` : null;
}

export function getSupabaseServiceRoleKey(): string | null {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_KEY?.trim() ||
    null
  );
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}
