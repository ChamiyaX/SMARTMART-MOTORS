import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  let messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    createdAt: Date;
    product: { name: string } | null;
  }> = [];
  let dbError: string | null = null;

  try {
    messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { product: { select: { name: true } } },
    });
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Customer inquiries and contact form submissions."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <DataTable
        title="Inbox"
        description={`${messages.length} messages`}
        empty={messages.length === 0}
        emptyMessage={dbError || "Inbox is empty"}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50">From</TableHead>
              <TableHead className="text-white/50">Subject</TableHead>
              <TableHead className="text-white/50">Product</TableHead>
              <TableHead className="text-white/50">Status</TableHead>
              <TableHead className="text-white/50">Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id} className="border-white/5">
                <TableCell>
                  <Link href={`/admin/messages/${msg.id}`} className="hover:text-primary">
                    <p className="text-white">{msg.name}</p>
                    <p className="text-xs text-white/40">{msg.email}</p>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/messages/${msg.id}`}
                    className="text-white/80 hover:text-primary"
                  >
                    {msg.subject}
                  </Link>
                </TableCell>
                <TableCell className="text-white/45">
                  {msg.product?.name || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      msg.status === "NEW"
                        ? "border-primary/40 text-primary"
                        : "border-white/15 text-white/50"
                    }
                  >
                    {msg.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-white/40">
                  {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
