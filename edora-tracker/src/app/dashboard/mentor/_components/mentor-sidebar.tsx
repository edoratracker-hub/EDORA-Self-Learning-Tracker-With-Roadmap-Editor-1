"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavDocuments } from "@/app/dashboard/mentor/_components/nav-documents";
import { NavMain } from "@/app/dashboard/mentor/_components/nav-main";
import { NavSecondary } from "@/app/dashboard/mentor/_components/nav-secondary";
import { NavUser } from "@/app/dashboard/mentor/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { MentorDashboardPaths } from "@/lib/mentor-dashboard-paths";
import { SidebarUtilities } from "./sidebar-utilities";

const data = MentorDashboardPaths;

export function MentorSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarUtilities items={data.utilities} />
        <NavMain items={data.navMain} />
        <NavDocuments items={data.navWorkspace} />
      </SidebarContent>

      <SidebarFooter className="bg-muted rounded-b-xl">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
