import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { buildWhatsAppLink, SITE_CONFIG } from "@/lib/constants";
import { getCompanySettings, getMessagingSettings, getSocialSettings } from "@/lib/data/settings";
import { safeQuery } from "@/lib/safe";

/**
 * ISR: cache pages briefly, then refresh from Supabase.
 * Faster than force-dynamic on every request, still keeps catalogue fresh.
 */
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [messaging, social, company] = await Promise.all([
    safeQuery(() => getMessagingSettings(), { enabled: true }),
    safeQuery(() => getSocialSettings(), {}),
    safeQuery(() => getCompanySettings(), {
      name: SITE_CONFIG.name,
      phone: SITE_CONFIG.phone,
      email: SITE_CONFIG.email,
      whatsapp: SITE_CONFIG.whatsapp,
    }),
  ]);

  const whatsappLink = buildWhatsAppLink(company.whatsapp);

  return (
    <>
      <Navbar
        messagingEnabled={messaging.enabled}
        phone={company.phone}
        whatsappLink={whatsappLink}
      />
      <main className="min-h-screen min-w-0 overflow-x-clip">{children}</main>
      <Footer messagingEnabled={messaging.enabled} social={social} />
      {messaging.enabled ? <WhatsAppButton href={whatsappLink} /> : null}
    </>
  );
}
