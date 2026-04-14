import { db } from "@/drizzle/db";
import { mentorProfile, user } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sendMentorApprovalNotification, transporter } from "@/app/lib/email";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get("token");
        const mentorId = searchParams.get("id");
        const action = searchParams.get("action") || "approve"; // default to approve for backwards compat

        if (!token || !mentorId) {
            return new NextResponse(
                renderHtml("error", "Invalid Request", "Token and Mentor ID are required."),
                { status: 400, headers: { "Content-Type": "text/html" } }
            );
        }

        // Find the mentor profile with matching token
        const mentor = await db.query.mentorProfile.findFirst({
            where: and(
                eq(mentorProfile.id, mentorId),
                eq(mentorProfile.verificationToken, token)
            ),
        });

        if (!mentor) {
            return new NextResponse(
                renderHtml("error", "Verification Failed", "Invalid or expired verification link. The mentor may have already been processed."),
                { status: 400, headers: { "Content-Type": "text/html" } }
            );
        }

        if (mentor.isVerified || mentor.verificationStatus === "verified" || mentor.verificationStatus === "rejected") {
            return new NextResponse(
                renderHtml("warning", "Already Processed", `This mentor application has already been ${mentor.verificationStatus}.`),
                { status: 200, headers: { "Content-Type": "text/html" } }
            );
        }

        // Get mentor's user record for email
        const mentorUser = await db.query.user.findFirst({
            where: eq(user.id, mentor.userId),
        });

        const mentorEmail = mentor.email || mentorUser?.email || "";
        const mentorName = mentor.fullName;

        if (action === "reject") {
            // Reject the mentor
            await db
                .update(mentorProfile)
                .set({
                    isVerified: false,
                    verificationStatus: "rejected",
                    verificationToken: null, // invalidate to prevent reuse
                    updatedAt: new Date(),
                })
                .where(eq(mentorProfile.id, mentorId));

            // Send rejection email to mentor
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
                    to: mentorEmail,
                    subject: "Update on Your Mentor Application — Edora",
                    html: `
                        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                            <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px; text-align: center;">
                                <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
                                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Application Update</h1>
                                <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px;">Regarding your mentor application on Edora</p>
                            </div>
                            <div style="padding: 32px;">
                                <p style="color: #374151; font-size: 15px; line-height: 1.7;">Hi ${mentorName},</p>
                                <p style="color: #374151; font-size: 15px; line-height: 1.7;">
                                    Thank you for your interest in becoming a mentor on Edora. After carefully reviewing your application, we are unable to approve it at this time.
                                </p>
                                <p style="color: #374151; font-size: 15px; line-height: 1.7;">
                                    You are welcome to update your profile and reapply in the future. If you have questions, please contact our support team.
                                </p>
                                <div style="text-align: center; margin: 32px 0;">
                                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}"
                                       style="display: inline-block; background: #374151; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                                        Back to Edora
                                    </a>
                                </div>
                            </div>
                            <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="color: #9ca3af; font-size: 12px; margin: 0;">Edora Tracker — Empowering mentors and students</p>
                            </div>
                        </div>
                    `,
                });
            } catch (emailError) {
                console.error("Error sending rejection notification:", emailError);
            }

            return new NextResponse(
                renderHtml("rejected", `❌ Application Rejected`, `${mentorName}'s mentor application has been rejected. They will receive an email with this decision.`),
                { status: 200, headers: { "Content-Type": "text/html" } }
            );
        }

        // Default: APPROVE
        await db
            .update(mentorProfile)
            .set({
                isVerified: true,
                verificationStatus: "verified",
                verifiedAt: new Date(),
                verificationToken: null, // invalidate to prevent reuse
                updatedAt: new Date(),
            })
            .where(eq(mentorProfile.id, mentorId));

        // Send approval notification email to mentor
        if (mentorEmail) {
            try {
                await sendMentorApprovalNotification(mentorEmail, mentorName);
            } catch (emailError) {
                console.error("Error sending approval notification:", emailError);
                // Don't fail the verification if email fails
            }
        }

        return new NextResponse(
            renderHtml("success", "✅ Mentor Approved! 🎉", `<span style="color:#059669;font-weight:600;">${mentorName}</span> has been successfully verified as a mentor.<br>They have been notified via email and can now access the full mentor dashboard.`),
            { status: 200, headers: { "Content-Type": "text/html" } }
        );

    } catch (error) {
        console.error("Error verifying mentor:", error);
        return new NextResponse(
            renderHtml("error", "Server Error", "An unexpected error occurred. Please try again."),
            { status: 500, headers: { "Content-Type": "text/html" } }
        );
    }
}

function renderHtml(type: "success" | "rejected" | "error" | "warning", title: string, message: string) {
    const configs = {
        success:  { bg: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)", iconBg: "#10b981", icon: "✓",  bodyBg: "linear-gradient(135deg, #059669 0%, #10b981 100%)" },
        rejected: { bg: "#fef2f2", iconBg: "#ef4444", icon: "✕", bodyBg: "#fef2f2" },
        error:    { bg: "#fef2f2", iconBg: "#ef4444", icon: "✕", bodyBg: "#fef2f2" },
        warning:  { bg: "#fffbeb", iconBg: "#f59e0b", icon: "!", bodyBg: "#fffbeb" },
    };
    const c = configs[type];

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>${title} — Edora Admin</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: ${c.bodyBg}; }
        .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 520px; width: 100%; margin: 24px; }
        .icon { width: 80px; height: 80px; background: ${c.iconBg}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 48px; font-weight: bold; color: white; line-height: 1; }
        h1 { color: #1a202c; margin-bottom: 0.75rem; font-size: 24px; }
        p { color: #4a5568; line-height: 1.7; font-size: 15px; }
        .footer { margin-top: 2rem; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">${c.icon}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <div class="footer">Edora Tracker — Admin Panel</div>
    </div>
</body>
</html>`;
}


