"use client";

import { useState } from "react";
import { Role } from "@prisma/client";
import { updateUserRole, deleteUser } from "@/lib/actions/users";
import { Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserBasic = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
};

export function UsersClient({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserBasic[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState<UserBasic[]>(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (id: string, newRole: Role) => {
    setLoading(id);
    try {
      const res = await updateUserRole({ id, role: newRole });
      if (res.success && res.data) {
        setUsers(users.map((u) => (u.id === id ? { ...u, role: res.data.role } : u)));
      } else {
        alert(res.error || "Failed to update role");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(id);
    try {
      const res = await deleteUser(id);
      if (res.success) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert(res.error || "Failed to delete user");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-muted)]/10 text-[var(--color-muted)]">
            <tr>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[var(--color-muted)]/5 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-[var(--color-foreground)]">
                    {user.name || "Unnamed"}
                  </div>
                  <div className="text-[var(--color-muted)]">{user.email}</div>
                </td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    disabled={user.id === currentUserId || loading === user.id}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  >
                    {Object.values(Role).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-[var(--color-muted)]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={user.id === currentUserId || loading === user.id}
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--color-muted)]">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
