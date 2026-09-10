import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "./settings-form";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { DEFAULT_BUSINESS_HOURS } from "@/lib/business-hours";
import { getBusinessHours } from "@/lib/data/settings";
import { SITE_CONFIG } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

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
  let hours = { ...DEFAULT_BUSINESS_HOURS };
  let analytics = {
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
  };
  const messaging = { enabled: true, whatsapp: SITE_CONFIG.whatsapp };
  let dbError: string | null = null;

  try {
    const [settings, businessHours] = await Promise.all([
      prisma.setting.findMany({
        where: {
          key: { in: ["company", "social", "analytics", "messaging"] },
        },
      }),
      safeQuery(() => getBusinessHours(), DEFAULT_BUSINESS_HOURS),
    ]);
    hours = businessHours;
    for (const setting of settings) {
      if (!setting.value || typeof setting.value !== "object") continue;
      const value = setting.value as Record<string, unknown>;
      if (setting.key === "company")
        company = { ...company, ...(value as typeof company) };
      if (setting.key === "social") social = { ...social, ...(value as typeof social) };
      if (setting.key === "analytics") {
        analytics = { ...analytics, ...(value as typeof analytics) };
      }
      if (setting.key === "messaging") {
        messaging.enabled = value.enabled !== false;
      }
    }
    messaging.whatsapp = company.whatsapp;
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
        messaging={messaging}
      />
    </div>
  );
}
