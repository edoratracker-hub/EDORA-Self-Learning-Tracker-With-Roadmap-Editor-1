import { auth } from "@/app/lib/auth";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getStudentProfile } from "@/app/actions/student-profile-actions";
import { getMentorProfile } from "@/app/actions/mentor-profile-actions";
import { getProfessionalProfile } from "@/app/actions/professional-profile-actions";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return redirect("/sign-in");
    }

    // Always get the latest user data from DB to be sure about the role
    const dbUser = await db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, session.user.id)
    });

    const currentRole = dbUser?.role || session.user.role;

    // If user has no role in DB but one was passed in URL, update it
    if (!currentRole && role) {
        await db.update(user)
            .set({ role: role as any })
            .where(eq(user.id, session.user.id));
    }

    const userRole = currentRole || role;

    if (!userRole) {
        return redirect("/choose-role");
    }

    // Redirect based on role
    if (userRole === "recruiter") {
        // For recruiters, check if they have an organization
        const existingOrg = await db.query.recruiterOrganization.findFirst({
            where: (org, { eq }) => eq(org.userId, session.user.id)
        });

        if (!existingOrg) {
            return redirect("/recruiter-landing-page");
        }
        return redirect("/dashboard/recruiter");
    }

    if (userRole === "student") {
        const { profile } = await getStudentProfile();
        if (!profile?.initialSetupCompleted) {
            return redirect("/initial-setup");
        }
        return redirect("/dashboard/students/home");
    }

    if (userRole === "mentor") {
        const { profile } = await getMentorProfile();
        if (!profile?.initialSetupCompleted) {
            return redirect("/initial-setup");
        }
        return redirect("/dashboard/mentor/home");
    }

    if (userRole === "professional") {
        const { profile } = await getProfessionalProfile();
        if (!profile?.initialSetupCompleted) {
            return redirect("/initial-setup");
        }
        return redirect("/dashboard/professionals/home");
    }

    if (userRole === "admin") {
        return redirect("/dashboard/admin");
    }

    return redirect("/");
}
