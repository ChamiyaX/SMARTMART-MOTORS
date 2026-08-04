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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PageRecord = {
  page: string;
  title: string;
  content: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
} | null;

export function ContentEditor({ home, about }: { home: PageRecord; about: PageRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState("home");
  const [forms, setForms] = useState({
    home: {
      title: home?.title || "Home",
      content: home?.content
        ? JSON.stringify(home.content, null, 2)
        : JSON.stringify(
            {
              heroHeadline: "Premium Automotive Spare Parts",
              heroSubcopy: "Imported quality for Sri Lankan workshops",
            },
            null,
            2
          ),
      seoTitle: home?.seoTitle || "",
      seoDescription: home?.seoDescription || "",
      isPublished: home?.isPublished ?? true,
    },
    about: {
      title: about?.title || "About",
      content: about?.content
        ? JSON.stringify(about.content, null, 2)
        : JSON.stringify(
            {
              story: "SmartMart Motors supplies premium imported spare parts.",
            },
            null,
            2
          ),
      seoTitle: about?.seoTitle || "",
      seoDescription: about?.seoDescription || "",
      isPublished: about?.isPublished ?? true,
    },
  });

  const current = forms[active as "home" | "about"];

  function save() {
    startTransition(async () => {
      const result = await savePageContent({
        page: active,
        title: current.title,
        content: current.content,
        seoTitle: current.seoTitle || null,
        seoDescription: current.seoDescription || null,
        isPublished: current.isPublished,
      });
      if (!result.success) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success(`${active} content saved`);
      router.refresh();
    });
  }

  return (
    <Tabs value={active} onValueChange={setActive}>
      <TabsList className="mb-4 bg-white/5">
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>
      {(["home", "about"] as const).map((key) => (
        <TabsContent key={key} value={key} className="space-y-4">
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={forms[key].title}
                onChange={(e) =>
                  setForms((f) => ({
                    ...f,
                    [key]: { ...f[key], title: e.target.value },
                  }))
                }
                className="border-white/10 bg-white/[0.04]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content JSON</Label>
              <Textarea
                rows={14}
                value={forms[key].content}
                onChange={(e) =>
                  setForms((f) => ({
                    ...f,
                    [key]: { ...f[key], content: e.target.value },
                  }))
                }
                className="border-white/10 bg-white/[0.04] font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label>SEO title</Label>
              <Input
                value={forms[key].seoTitle}
                onChange={(e) =>
                  setForms((f) => ({
                    ...f,
                    [key]: { ...f[key], seoTitle: e.target.value },
                  }))
                }
                className="border-white/10 bg-white/[0.04]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>SEO description</Label>
              <Textarea
                rows={3}
                value={forms[key].seoDescription}
                onChange={(e) =>
                  setForms((f) => ({
                    ...f,
                    [key]: { ...f[key], seoDescription: e.target.value },
                  }))
                }
                className="border-white/10 bg-white/[0.04]"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
              <Label>Published</Label>
              <Switch
                checked={forms[key].isPublished}
                onCheckedChange={(v) =>
                  setForms((f) => ({
                    ...f,
                    [key]: { ...f[key], isPublished: v },
                  }))
                }
              />
            </div>
            <Button onClick={save} disabled={pending || active !== key}>
              {pending ? "Saving..." : `Save ${key}`}
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
