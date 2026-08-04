import { PageHeader } from "@/components/admin/page-header";
import { UsersTable } from "./users-table";
import { DB_CONNECT_MESSAGE, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await requireAdmin(["SUPER_ADMIN", "ADMIN"]);
  let users: Array<{
    id: string;
    name: string | null;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "USER";
    createdAt: Date;
  }> = [];
  let dbError: string | null = null;

  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader title="Users" description="Manage admin access and role assignments." />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <UsersTable
        users={users}
        currentUserId={session.user.id}
        currentRole={session.user.role}
      />
    </div>
  );
}
