"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  saveAnalyticsIds,
  saveCompanySettings,
  saveHoursSettings,
  saveMessagingSettings,
  saveSocialSettings,
} from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SettingsFormProps = {
  company: {
    name: string;
    tagline?: string;
    address?: string;
    phone: string;
    email: string;
    whatsapp: string;
    registration?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  };
  hours: {
    weekdays?: string;
    saturday?: string;
    sunday?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    facebookPixelId?: string;
  };
  messaging: {
    enabled: boolean;
  };
};

export function SettingsForm({
  company,
  social,
  hours,
  analytics,
  messaging,
}: SettingsFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [companyForm, setCompanyForm] = useState(company);
  const [socialForm, setSocialForm] = useState(social);
  const [hoursForm, setHoursForm] = useState(hours);
  const [analyticsForm, setAnalyticsForm] = useState(analytics);
  const [messagingForm, setMessagingForm] = useState(messaging);

  const fieldClass = "border-white/10 bg-white/[0.04]";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <h2 className="mb-1 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Messaging
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          When off, the Contact page form, WhatsApp buttons, and Contact links are hidden
          on the public website.
        </p>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
          <div>
            <Label htmlFor="messaging-enabled" className="text-white">
              Enable messaging
            </Label>
            <p className="text-xs text-muted-foreground">
              Contact form submissions and WhatsApp chat entry points
            </p>
          </div>
          <Switch
            id="messaging-enabled"
            checked={messagingForm.enabled}
            onCheckedChange={(enabled) => setMessagingForm({ enabled })}
          />
        </div>
        <Button
          className="mt-4"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveMessagingSettings(messagingForm);
              if (!result.success) {
                toast.error(result.error);
                return;
              }
              toast.success(
                messagingForm.enabled
                  ? "Messaging enabled on site"
                  : "Messaging disabled on site"
              );
              router.refresh();
            });
          }}
        >
          Save messaging
        </Button>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Company
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["name", "Name"],
              ["tagline", "Tagline"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["whatsapp", "WhatsApp"],
              ["address", "Address"],
              ["registration", "Registration"],
            ] as const
          ).map(([key, label]) => (
            <div
              key={key}
              className={`space-y-1.5 ${key === "address" || key === "tagline" ? "md:col-span-2" : ""}`}
            >
              <Label>{label}</Label>
              <Input
                className={fieldClass}
                value={companyForm[key] || ""}
                onChange={(e) => setCompanyForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <Button
          className="mt-4"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveCompanySettings(companyForm);
              if (!result.success) {
                toast.error(result.error);
                return;
              }
              toast.success("Company settings saved");
              router.refresh();
            });
          }}
        >
          Save company
        </Button>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Business hours
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {(
            [
              ["weekdays", "Weekdays"],
              ["saturday", "Saturday"],
              ["sunday", "Sunday"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                className={fieldClass}
                value={hoursForm[key] || ""}
                onChange={(e) => setHoursForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <Button
          className="mt-4"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveHoursSettings(hoursForm);
              if (!result.success) {
                toast.error(result.error);
                return;
              }
              toast.success("Hours saved");
              router.refresh();
            });
          }}
        >
          Save hours
        </Button>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Social links
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["facebook", "Facebook"],
              ["instagram", "Instagram"],
              ["youtube", "YouTube"],
              ["tiktok", "TikTok"],
              ["linkedin", "LinkedIn"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                className={fieldClass}
                value={socialForm[key] || ""}
                onChange={(e) => setSocialForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <Button
          className="mt-4"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveSocialSettings(socialForm);
              if (!result.success) {
                toast.error(result.error);
                return;
              }
              toast.success("Social links saved");
              router.refresh();
            });
          }}
        >
          Save social
        </Button>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Analytics IDs
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["googleAnalyticsId", "Google Analytics"],
              ["googleTagManagerId", "Google Tag Manager"],
              ["facebookPixelId", "Facebook Pixel"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                className={fieldClass}
                value={analyticsForm[key] || ""}
                onChange={(e) =>
                  setAnalyticsForm((f) => ({ ...f, [key]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
        <Button
          className="mt-4"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveAnalyticsIds(analyticsForm);
              if (!result.success) {
                toast.error(result.error);
                return;
              }
              toast.success("Analytics IDs saved");
              router.refresh();
            });
          }}
        >
          Save analytics
        </Button>
      </section>
    </div>
  );
}
