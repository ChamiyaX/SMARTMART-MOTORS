import { createClient } from "@supabase/supabase-js";

import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Service-role Supabase client. Bypasses RLS — use only on the server
 * for trusted admin operations. Never expose this client to the browser.
 */
export function createAdminClient() {
  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase credentials. Set SUPABASE_SERVICE_ROLE_KEY on Vercel (Supabase → Project Settings → API → service_role)."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
