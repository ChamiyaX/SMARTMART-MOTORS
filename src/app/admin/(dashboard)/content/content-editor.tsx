"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { savePageContent } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type PageRecord = {
  page: string;
  title: string;
  content: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
} | null;

export function ContentEditor({ home }: { home: PageRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: home?.title || "Home",
    content: home?.content
      ? JSON.stringify(home.content, null, 2)
      : JSON.stringify(
          {
            heroHeadline: "Best Electric Tricycle for Your Needs",
            heroSubcopy: "Best Electric Tricycle for Your Needs",
          },
          null,
          2
        ),
    seoTitle: home?.seoTitle || "",
    seoDescription: home?.seoDescription || "",
    isPublished: home?.isPublished ?? true,
  });

  function save() {
    startTransition(async () => {
      const result = await savePageContent({
        page: "home",
        title: form.title,
        content: form.content,
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
        isPublished: form.isPublished,
      });
      if (!result.success) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success("Home content saved");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-white/45">
        Edit the home page hero JSON. For the About page, use{" "}
        <span className="text-primary">About Page</span> in the sidebar.
      </p>
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="border-white/10 bg-white/[0.04]"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Content JSON</Label>
        <Textarea
          rows={14}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="border-white/10 bg-white/[0.04] font-mono text-xs"
        />
      </div>
      <div className="space-y-1.5">
        <Label>SEO title</Label>
        <Input
          value={form.seoTitle}
          onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
          className="border-white/10 bg-white/[0.04]"
        />
      </div>
      <div className="space-y-1.5">
        <Label>SEO description</Label>
        <Textarea
          rows={3}
          value={form.seoDescription}
          onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
          className="border-white/10 bg-white/[0.04]"
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
        <Label>Published</Label>
        <Switch
          checked={form.isPublished}
          onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
        />
      </div>
      <Button onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save home content"}
      </Button>
    </div>
  );
}
