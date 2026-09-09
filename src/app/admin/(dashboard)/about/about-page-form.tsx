"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { saveAboutPage } from "@/lib/actions/about-page";
import type { AboutContent } from "@/lib/about-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type AboutPageFormProps = {
  initial: {
    title: string;
    seoTitle: string;
    seoDescription: string;
    isPublished: boolean;
    content: AboutContent;
  };
};

const inputClass = "border-white/10 bg-white/[0.04] text-white";

export function AboutPageForm({ initial }: AboutPageFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: initial.title,
    headline: initial.content.headline,
    body: initial.content.body,
    mission: initial.content.mission,
    story: initial.content.story,
    imageUrl: initial.content.imageUrl,
    values: initial.content.values,
    seoTitle: initial.seoTitle,
    seoDescription: initial.seoDescription,
    isPublished: initial.isPublished,
  });

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "smartmart-motors/about");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((current) => ({ ...current, imageUrl: data.url as string }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function updateValue(index: number, field: "title" | "text", value: string) {
    setForm((current) => ({
      ...current,
      values: current.values.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function submit() {
    startTransition(async () => {
      const result = await saveAboutPage(form);
      if (!result.success) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success("About page updated");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Hero section
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Page title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Headline</Label>
            <Input
              value={form.headline}
              onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Intro description</Label>
            <Textarea
              rows={3}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Hero image</Label>
            <div className="flex gap-2">
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://... or /api/files/..."
                className={inputClass}
              />
              <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-3 text-xs text-primary hover:bg-primary/20">
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Story
        </h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Mission statement</Label>
            <Textarea
              rows={4}
              value={form.mission}
              onChange={(e) => setForm((f) => ({ ...f, mission: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Secondary paragraph</Label>
            <Textarea
              rows={4}
              value={form.story}
              onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Values (3 cards)
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {form.values.map((value, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-white/40">
                Card {index + 1}
              </p>
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={value.title}
                  onChange={(e) => updateValue(index, "title", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={value.text}
                  onChange={(e) => updateValue(index, "text", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          SEO & visibility
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>SEO title</Label>
            <Input
              value={form.seoTitle}
              onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>SEO description</Label>
            <Textarea
              rows={3}
              value={form.seoDescription}
              onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 md:col-span-2">
            <Label>Published on website</Label>
            <Switch
              checked={form.isPublished}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, isPublished: checked }))
              }
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={submit} disabled={pending || uploading}>
          {pending ? "Saving..." : "Save about page"}
        </Button>
      </div>
    </div>
  );
}
