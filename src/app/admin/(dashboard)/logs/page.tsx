import { format } from "date-fns";

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

export default async function LogsPage() {
  let logs: Array<{
    id: string;
    action: string;
    entity: string | null;
    entityId: string | null;
    createdAt: Date;
    user: { name: string | null; email: string } | null;
  }> = [];
  let dbError: string | null = null;

  try {
    logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader
        title="Audit logs"
        description="Security and change history across the admin console."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <DataTable
        title="Recent activity"
        description={`${logs.length} entries`}
        empty={logs.length === 0}
        emptyMessage={dbError || "No audit events recorded yet"}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50">When</TableHead>
              <TableHead className="text-white/50">User</TableHead>
              <TableHead className="text-white/50">Action</TableHead>
              <TableHead className="text-white/50">Entity</TableHead>
              <TableHead className="text-white/50">ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="border-white/5">
                <TableCell className="whitespace-nowrap text-xs text-white/45">
                  {format(log.createdAt, "PP p")}
                </TableCell>
                <TableCell className="text-sm text-white/70">
                  {log.user?.name || log.user?.email || "System"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/60">{log.entity || "—"}</TableCell>
                <TableCell className="max-w-[140px] truncate font-mono text-[11px] text-white/35">
                  {log.entityId || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
