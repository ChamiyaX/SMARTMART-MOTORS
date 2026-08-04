import { DeveloperCreditBar } from "@/components/layout/developer-credit-bar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

/** Always fetch fresh catalogue data at request time (needed on Vercel + Supabase). */
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-14">{children}</main>
      <Footer />
      <WhatsAppButton />
      <DeveloperCreditBar />
    </>
  );
}
