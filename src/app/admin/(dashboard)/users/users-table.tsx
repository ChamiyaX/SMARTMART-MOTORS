"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Role } from "@prisma/client";

import { updateUserRole, deleteUser } from "@/lib/actions/users";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const roles: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"];

const roleColors: Record<Role, string> = {
  SUPER_ADMIN: "border-primary/40 text-primary",
  ADMIN: "border-orange-400/40 text-orange-300",
  EDITOR: "border-sky-400/40 text-sky-300",
  USER: "border-white/15 text-white/45",
};

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date | string;
};

export function UsersTable({
  users,
  currentUserId,
  currentRole,
}: {
  users: UserRow[];
  currentUserId: string;
  currentRole: Role;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-white/50">User</TableHead>
            <TableHead className="text-white/50">Role</TableHead>
            <TableHead className="text-white/50">Joined</TableHead>
            <TableHead className="text-right text-white/50">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-white/5">
              <TableCell>
                <p className="text-white">{user.name || "—"}</p>
                <p className="text-xs text-white/40">{user.email}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={roleColors[user.role]}>
                    {user.role.replace("_", " ")}
                  </Badge>
                  {user.id !== currentUserId && (
                    <select
                      disabled={pending}
                      value={user.role}
                      className="h-8 rounded border border-white/10 bg-[#111] px-2 text-xs text-white"
                      onChange={(e) => {
                        const role = e.target.value as Role;
                        startTransition(async () => {
                          const result = await updateUserRole(user.id, role);
                          if (!result.success) {
                            toast.error(result.error || "Update failed");
                            return;
                          }
                          toast.success("Role updated");
                          router.refresh();
                        });
                      }}
                    >
                      {roles
                        .filter(
                          (r) => currentRole === "SUPER_ADMIN" || r !== "SUPER_ADMIN"
                        )
                        .map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-xs text-white/40">
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {currentRole === "SUPER_ADMIN" && user.id !== currentUserId && (
                  <ConfirmDelete
                    title="Delete user?"
                    description={`Permanently remove ${user.email}.`}
                    onConfirm={async () => {
                      const result = await deleteUser(user.id);
                      router.refresh();
                      return result;
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <p className="py-12 text-center text-sm text-white/40">No users found</p>
      )}
    </div>
  );
}
