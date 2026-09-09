import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { getMessagingSettings } from "@/lib/data/settings";
import { safeQuery } from "@/lib/safe";

/**
 * ISR: cache pages briefly, then refresh from Supabase.
 * Faster than force-dynamic on every request, still keeps catalogue fresh.
 */
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const messaging = await safeQuery(() => getMessagingSettings(), { enabled: true });

  return (
    <>
      <Navbar messagingEnabled={messaging.enabled} />
      <main className="min-h-screen min-w-0 overflow-x-clip">{children}</main>
      <Footer messagingEnabled={messaging.enabled} />
      {messaging.enabled ? <WhatsAppButton /> : null}
    </>
  );
}
