import React from "react";
import { MentorSidebar } from "@/app/dashboard/mentor/_components/mentor-sidebar";
import { SiteHeader } from "@/app/dashboard/mentor/_components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProfileStatus } from "@/app/actions/mentor-profile-actions";
import { ReminderCheck } from "@/components/dashboard/reminder-check";

const MentorLayout = async ({ children }: { children: React.ReactNode }) => {
  // Check session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "mentor") {
    redirect("/sign-in");
  }

  // Verification gate — only verified mentors can access the dashboard
  let status;
  try {
    status = await getProfileStatus(session.user.id);
  } catch (e) {
    console.error("Failed to fetch profile status", e);
    status = {
      is_verified: false,
      verification_status: "pending",
      professional_questions_completed: false,
      profile_completed: false,
      initial_setup_completed: false,
    };
  }

  // 0. If initial setup not completed
  if (!status.initial_setup_completed) {
    redirect("/initial-setup");
  }

  // 1. If not verified
  if (!status.is_verified) {
    // a. If they have explicitly submitted for verification -> Pending Page
    if (status.verification_status === "submitted") {
      redirect("/mentor-pending");
    }
    // b. If they were rejected -> Pending Page (shows rejection)
    if (status.verification_status === "rejected") {
      redirect("/mentor-pending");
    }

    // c. Otherwise (pending/not submitted) -> Onboarding to complete/submit
    redirect("/mentor-onboarding");
  }
  const user = {
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.image ?? "",
  };

  // Verified mentor — render dashboard
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <MentorSidebar variant="inset" user={user} />
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
};

export default MentorLayout;
