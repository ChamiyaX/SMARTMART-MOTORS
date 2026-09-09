import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

/**
 * ISR: cache pages briefly, then refresh from Supabase.
 * Faster than force-dynamic on every request, still keeps catalogue fresh.
 */
export const revalidate = 60;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
