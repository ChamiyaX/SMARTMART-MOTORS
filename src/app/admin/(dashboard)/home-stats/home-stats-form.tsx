"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveHomeStats } from "@/lib/actions/home-stats";
import type { HomeStatsContent } from "@/lib/home-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type HomeStatsFormProps = {
  initial: {
    isPublished: boolean;
    content: HomeStatsContent;
  };
};

const inputClass = "border-white/10 bg-white/[0.04] text-white";

export function HomeStatsForm({ initial }: HomeStatsFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    eyebrow: initial.content.eyebrow,
    title: initial.content.title,
    description: initial.content.description,
    items: initial.content.items,
    isPublished: initial.isPublished,
  });

  function updateItem(index: number, field: "label" | "value" | "suffix", value: string) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === "value" ? Number(value) || 0 : value,
            }
          : item
      ),
    }));
  }

  function submit() {
    startTransition(async () => {
      const result = await saveHomeStats(form);
      if (!result.success) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success("Home stats updated");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Section heading
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Eyebrow</Label>
            <Input
              value={form.eyebrow}
              onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
              placeholder="By the numbers"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Proven on the road"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Statistics
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {form.items.map((item, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-4"
            >
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/50">
                Stat {index + 1}
              </p>
              <div className="space-y-1.5">
                <Label>Number</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={item.value}
                    onChange={(e) => updateItem(index, "value", e.target.value)}
                    className={inputClass}
                  />
                  <Input
                    value={item.suffix}
                    onChange={(e) => updateItem(index, "suffix", e.target.value)}
                    placeholder="+"
                    className={`${inputClass} w-20 shrink-0`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(index, "label", e.target.value)}
                  placeholder="Parts in catalog"
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white">Published</p>
            <p className="text-xs text-white/45">Show this section on the home page</p>
          </div>
          <Switch
            checked={form.isPublished}
            onCheckedChange={(checked) =>
              setForm((f) => ({ ...f, isPublished: checked }))
            }
          />
        </div>
      </section>

      <Button disabled={pending} onClick={submit}>
        {pending ? "Saving..." : "Save home stats"}
      </Button>
    </div>
  );
}
