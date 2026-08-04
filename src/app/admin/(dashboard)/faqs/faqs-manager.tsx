"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import type { Faq } from "@prisma/client";

import { createFaq, updateFaq, deleteFaq } from "@/lib/actions/faqs";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FaqsManager({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
    sortOrder: 0,
    isActive: true,
  });

  function openCreate() {
    setEditing(null);
    setForm({
      question: "",
      answer: "",
      category: "",
      sortOrder: 0,
      isActive: true,
    });
    setOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      sortOrder: faq.sortOrder,
      isActive: faq.isActive,
    });
    setOpen(true);
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        ...form,
        category: form.category || null,
      };
      const result = editing
        ? await updateFaq({ ...payload, id: editing.id })
        : await createFaq(payload);
      if (!result.success) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success(editing ? "FAQ updated" : "FAQ created");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-[#111] text-white">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Question</Label>
                <Input
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Answer</Label>
                <Textarea
                  rows={5}
                  value={form.answer}
                  onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
                <Label>Active</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                />
              </div>
              <Button onClick={submit} disabled={pending} className="w-full">
                {pending ? "Saving..." : "Save FAQ"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50">Question</TableHead>
              <TableHead className="text-white/50">Category</TableHead>
              <TableHead className="text-white/50">Status</TableHead>
              <TableHead className="text-right text-white/50">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id} className="border-white/5">
                <TableCell className="max-w-md text-white">{faq.question}</TableCell>
                <TableCell className="text-white/45">{faq.category || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      faq.isActive
                        ? "border-primary/30 text-primary"
                        : "border-white/15 text-white/40"
                    }
                  >
                    {faq.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                      <Pencil className="h-4 w-4 text-white/50" />
                    </Button>
                    <ConfirmDelete
                      onConfirm={async () => {
                        const result = await deleteFaq(faq.id);
                        router.refresh();
                        return result;
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {faqs.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">No FAQs yet</p>
        )}
      </div>
    </>
  );
}
