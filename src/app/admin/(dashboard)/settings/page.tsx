import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "./settings-form";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { SITE_CONFIG } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let company = {
    name: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    address: SITE_CONFIG.address,
    phone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    whatsapp: SITE_CONFIG.whatsapp,
    registration: "",
  };
  let social = {
    facebook: SITE_CONFIG.social.facebook,
    instagram: SITE_CONFIG.social.instagram,
    youtube: SITE_CONFIG.social.youtube,
    tiktok: "",
    linkedin: "",
  };
  let hours = {
    weekdays: "Mon–Fri 8:30 AM – 6:00 PM",
    saturday: "Sat 8:30 AM – 2:00 PM",
    sunday: "Closed",
  };
  let analytics = {
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
  };
  let dbError: string | null = null;

  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: ["company", "social", "hours", "analytics"] },
      },
    });
    for (const setting of settings) {
      if (!setting.value || typeof setting.value !== "object") continue;
      const value = setting.value as Record<string, string>;
      if (setting.key === "company") company = { ...company, ...value };
      if (setting.key === "social") social = { ...social, ...value };
      if (setting.key === "hours") hours = { ...hours, ...value };
      if (setting.key === "analytics") analytics = { ...analytics, ...value };
    }
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Company profile, hours, social channels, and analytics IDs."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <SettingsForm
        company={company}
        social={social}
        hours={hours}
        analytics={analytics}
      />
    </div>
  );
}
