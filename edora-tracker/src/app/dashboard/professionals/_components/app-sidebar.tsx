"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavDocuments } from "@/app/dashboard/professionals/_components/nav-documents";
import { NavMain } from "@/app/dashboard/professionals/_components/nav-main";
import { NavUser } from "@/app/dashboard/professionals/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardPaths } from "@/lib/dashboard-paths";
import { SidebarUtilities } from "./sidebar-utilities";

const data = DashboardPaths;

export function AppSidebar({
  folders,
  workspaceId,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  folders?: { id: string; name: string }[];
  workspaceId?: string;
  user: { name: string; email: string; avatar: string };
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-muted rounded-t-xl">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 bg-muted">
              <IconInnerShadowTop className="!size-5" />
              <span className="text-base font-semibold">EDORA</span>
            </SidebarMenuButton>
            <span className="text-muted-foreground text-xs mr-4">Free</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarUtilities items={data.utilities} />
        <NavMain items={data.navMain} />
        <NavDocuments
          items={data.navWorkspace}
        />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter className="bg-muted rounded-b-xl">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
