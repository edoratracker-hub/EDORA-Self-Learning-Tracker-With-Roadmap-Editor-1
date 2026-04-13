import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { getWorkspace } from "@/app/actions/workspace-actions";
import { getStudentProfile } from "@/app/actions/student-profile-actions";
import { getStudentLeaderboard } from "@/app/actions/students/leaderboard-actions";
import { AppSidebar } from "./_components/app-sidebar";
import { SiteHeader } from "@/app/dashboard/students/_components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReminderCheck } from "@/components/dashboard/reminder-check";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "student") {
    redirect("/sign-in");
  }

  const { profile } = await getStudentProfile();
  if (!profile?.initialSetupCompleted) {
    redirect("/initial-setup");
  }

  const { workspace } = await getWorkspace();

  const { data: leaderboardData } = await getStudentLeaderboard();
  const rankIndex = leaderboardData?.findIndex((s) => s.userId === session.user.id);
  const userRank = rankIndex !== undefined && rankIndex !== -1 ? rankIndex + 1 : 0;

  const folders =
    workspace?.folders?.map((f: any) => ({
      id: f.id,
      name: f.name,
    })) ?? [];

  const workspaceId = workspace?.id;

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
      <AppSidebar
        folders={folders}
        workspaceId={workspaceId}
        user={user}
        streak={profile?.streak ?? 0}
        rank={userRank}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader />
        <ReminderCheck />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
