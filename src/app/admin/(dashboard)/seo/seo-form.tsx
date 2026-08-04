"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveSeoSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SeoForm = {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  ogImage: string;
  siteName: string;
};

export function SeoForm({ initial }: { initial: SeoForm }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(initial);

  return (
    <div className="max-w-2xl space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="space-y-1.5">
        <Label>Site name</Label>
        <Input
          value={form.siteName}
          onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))}
          className="border-white/10 bg-white/[0.04]"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Default meta title</Label>
        <Input
          value={form.defaultMetaTitle}
          onChange={(e) => setForm((f) => ({ ...f, defaultMetaTitle: e.target.value }))}
          className="border-white/10 bg-white/[0.04]"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Default meta description</Label>
        <Textarea
          rows={4}
          value={form.defaultMetaDescription}
          onChange={(e) =>
            setForm((f) => ({ ...f, defaultMetaDescription: e.target.value }))
          }
          className="border-white/10 bg-white/[0.04]"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Default OG image URL</Label>
        <Input
          value={form.ogImage}
          onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))}
          placeholder="https://res.cloudinary.com/..."
          className="border-white/10 bg-white/[0.04]"
        />
      </div>
      <Button
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await saveSeoSettings(form);
            if (!result.success) {
              toast.error(result.error || "Save failed");
              return;
            }
            toast.success("SEO settings saved");
            router.refresh();
          });
        }}
      >
        {pending ? "Saving..." : "Save SEO settings"}
      </Button>
    </div>
  );
}
