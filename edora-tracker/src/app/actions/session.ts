"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";
import { recruiterOrganization } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function checkAndRedirectSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { hasSession: false };
    }

    const userRole = session.user.role;

    // If user is a recruiter, check organization status and verification
    if (userRole === "recruiter") {
      const existingOrg = await db.query.recruiterOrganization.findFirst({
        where: eq(recruiterOrganization.userId, session.user.id),
      });

      if (!existingOrg) {
        // No organization - redirect to landing page to set up
        redirect("/recruiter-landing-page");
      } else if (!existingOrg.verified) {
        // Organization exists but not verified - redirect to completed page
        redirect("/recruiter-organization-completed");
      } else {
        // Organization exists and verified - redirect to dashboard
        redirect("/dashboard/recruiter");
      }
    } else if (userRole === "student") {
      redirect("/dashboard/students/home");
    } else if (userRole === "admin") {
      redirect("/dashboard/admin");
    } else if (userRole === "mentor") {
      redirect("/dashboard/mentor/home");
    } else if (userRole === "professional") {
      redirect("/dashboard/professionals/home");
    } else {
      // No role assigned yet — send to role selection
      redirect("/choose-role");
    }
  } catch (error: any) {
    // If redirect was called, the error will be a NEXT_REDIRECT error
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    // For other errors, return no session
    return { hasSession: false };
  }
}

export async function getActiveSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return { session };
  } catch (error) {
    return { session: null };
  }
}
