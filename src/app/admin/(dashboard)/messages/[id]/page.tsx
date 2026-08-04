import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "../message-actions";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { markMessageRead } from "@/lib/actions/messages";

export const dynamic = "force-dynamic";

type MessageDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MessageDetailPage({ params }: MessageDetailPageProps) {
  const { id } = await params;
  let message = null;
  let dbError: string | null = null;

  try {
    message = await prisma.message.findUnique({
      where: { id },
      include: { product: { select: { id: true, name: true, slug: true } } },
    });
    if (message?.status === "NEW") {
      await markMessageRead(id);
      message = { ...message, status: "READ" as const };
    }
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  if (!dbError && !message) notFound();

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/messages"
          className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" /> Back to inbox
        </Link>
      </div>
      <PageHeader
        title={message?.subject || "Message"}
        description="Inquiry detail and status controls"
        actions={
          message ? <MessageActions id={message.id} status={message.status} /> : undefined
        }
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      {message && (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
              {message.message}
            </p>
          </div>
          <aside className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                From
              </p>
              <p className="mt-1 text-sm text-white">{message.name}</p>
              <p className="text-xs text-white/45">{message.email}</p>
              {message.phone && <p className="text-xs text-white/45">{message.phone}</p>}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                Status
              </p>
              <Badge variant="outline" className="mt-1 border-primary/30 text-primary">
                {message.status}
              </Badge>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                Received
              </p>
              <p className="mt-1 text-xs text-white/60">
                {format(message.createdAt, "PPpp")}
              </p>
            </div>
            {message.product && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                  Product
                </p>
                <Link
                  href={`/admin/products/${message.product.id}/edit`}
                  className="mt-1 block text-sm text-primary hover:underline"
                >
                  {message.product.name}
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
