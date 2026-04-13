import { db } from "@/drizzle/db";
import { mentorProfile, user } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sendMentorApprovalNotification } from "@/app/lib/email";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get("token");
        const mentorId = searchParams.get("id");

        if (!token || !mentorId) {
            return NextResponse.json(
                { error: "Token and Mentor ID are required" },
                { status: 400 }
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
                `
                <!DOCTYPE html>
                <html>
                <head><title>Verification Failed</title>
                <style>
                    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fef2f2; }
                    .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                    .icon { width: 80px; height: 80px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
                    .x-mark { color: white; font-size: 48px; font-weight: bold; }
                    h1 { color: #1a202c; }
                    p { color: #4a5568; line-height: 1.6; }
                </style>
                </head>
                <body>
                    <div class="container">
                        <div class="icon"><div class="x-mark">✕</div></div>
                        <h1>Verification Failed</h1>
                        <p>Invalid or expired verification link. The mentor may have already been verified.</p>
                    </div>
                </body>
                </html>
                `,
                { status: 400, headers: { "Content-Type": "text/html" } }
            );
        }

        // Update mentor profile to verified
        await db
            .update(mentorProfile)
            .set({
                isVerified: true,
                verificationStatus: "verified",
                verifiedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(mentorProfile.id, mentorId));

        // Get mentor's user record for email
        const mentorUser = await db.query.user.findFirst({
            where: eq(user.id, mentor.userId),
        });

        // Send approval notification email to mentor
        if (mentorUser?.email) {
            try {
                await sendMentorApprovalNotification(
                    mentorUser.email,
                    mentor.fullName
                );
            } catch (emailError) {
                console.error("Error sending approval notification:", emailError);
                // Don't fail the verification if email fails
            }
        }

        return new NextResponse(
            `
            <!DOCTYPE html>
            <html>
            <head><title>Mentor Verified</title>
            <style>
                body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); }
                .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
                .icon { width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
                .checkmark { color: white; font-size: 48px; font-weight: bold; }
                h1 { color: #1a202c; margin-bottom: 0.5rem; }
                p { color: #4a5568; line-height: 1.6; }
                .name { color: #059669; font-weight: 600; }
            </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon"><div class="checkmark">✓</div></div>
                    <h1>Mentor Verified! 🎉</h1>
                    <p>
                        <span class="name">${mentor.fullName}</span> has been successfully verified as a mentor.<br>
                        They can now access the full mentor dashboard and start mentoring students.
                    </p>
                    <p style="font-size: 14px; color: #9ca3af; margin-top: 1.5rem;">An approval notification email has been sent to the mentor.</p>
                </div>
            </body>
            </html>
            `,
            { status: 200, headers: { "Content-Type": "text/html" } }
        );
    } catch (error) {
        console.error("Error verifying mentor:", error);
        return NextResponse.json(
            { error: "Failed to verify mentor" },
            { status: 500 }
        );
    }
}
