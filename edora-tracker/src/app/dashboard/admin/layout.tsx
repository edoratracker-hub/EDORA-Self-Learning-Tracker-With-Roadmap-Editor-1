import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminSidebarHeader } from "./_components/admin-sidebar-header";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/sign-in");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.image ?? "",
  };
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" user={user} />
      <SidebarInset>
        <AdminSidebarHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
