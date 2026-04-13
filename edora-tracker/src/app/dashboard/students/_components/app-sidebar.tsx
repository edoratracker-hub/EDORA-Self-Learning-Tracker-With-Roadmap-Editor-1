"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavDocuments } from "@/app/dashboard/students/_components/nav-documents";
import { NavMain } from "@/app/dashboard/students/_components/nav-main";
import { NavUser } from "@/app/dashboard/students/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { StudentDashboardPaths } from "@/lib/student-dashboard-paths";
import { SidebarUtilities } from "./sidebar-utilities";

import { FlameIcon, TrophyIcon } from "lucide-react";
import { StreakAndLeaderboardSheet } from "./streak-leader-sheet";

const data = StudentDashboardPaths;

// Data will be passed from the parent layout
// const ACTIVE_STREAK = 12; // days
// const LEADERBOARD_RANK = 4; // current position

export function AppSidebar({
  folders,
  workspaceId,
  user,
  streak = 0,
  rank = 0,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  folders?: { id: string; name: string }[];
  workspaceId?: string;
  user: { name: string; email: string; avatar: string };
  streak?: number;
  rank?: number;
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

            <StreakAndLeaderboardSheet>
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors hover:bg-accent"
              >
                <span className="flex items-center gap-1">
                  <FlameIcon className="!size-4 text-orange-500" />
                  <span className="text-xs font-semibold tabular-nums">
                    {streak}
                  </span>
                </span>

                <span className="h-3 w-px bg-border" />

                <span className="flex items-center gap-1">
                  <TrophyIcon className="!size-4 text-yellow-500" />
                  <span className="text-xs font-semibold tabular-nums">
                    #{rank}
                  </span>
                </span>
              </button>
            </StreakAndLeaderboardSheet>
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
