import React from "react";
import { getAllUsers } from "@/app/actions/admin-actions";
import { UserTable } from "../_components/user-table";
import { Users as UsersIcon, ShieldCheck } from "lucide-react";
import { UsersDataTable } from "./_components/users-table";
import { Separator } from "@/components/ui/separator";

export default async function AdminUsersPage() {
  const result = await getAllUsers();

  if (!result.success || !result.data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-destructive">
            {result.error || "Failed to load users"}
          </p>
          <p className="text-muted-foreground">
            Please make sure you have admin permissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UsersIcon className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all users, update roles, and handle account deletions.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
          <ShieldCheck className="h-4 w-4" />
          Admin Access Secure
        </div>
      </div>

      <Separator className="bg-blue-500" />

      <UsersDataTable
        data={result.data.map((user) => ({
          id: user.id,
          user: user.name ?? "Unknown",
          email: user.email,
          role: user.role ?? "student",
          joined: user.createdAt.toLocaleDateString(),
        }))}
      />
    </div>
  );
}
