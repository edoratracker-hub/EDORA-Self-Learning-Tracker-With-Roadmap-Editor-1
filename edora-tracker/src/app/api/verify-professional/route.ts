import { db } from "@/drizzle/db";
import { professionalProfile, user } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sendProfessionalApprovalNotification } from "@/app/lib/email";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get("token");
        const profId = searchParams.get("id");

        if (!token || !profId) {
            return NextResponse.json(
                { error: "Token and Professional ID are required" },
                { status: 400 }
            );
        }

        // Find the professional profile with matching token
        const prof = await db.query.professionalProfile.findFirst({
            where: and(
                eq(professionalProfile.id, profId),
                eq(professionalProfile.verificationToken, token)
            ),
        });

        if (!prof) {
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
                        <p>Invalid or expired verification link. The professional may have already been verified.</p>
                    </div>
                </body>
                </html>
                `,
                { status: 400, headers: { "Content-Type": "text/html" } }
            );
        }

        // Update profile to verified
        await db
            .update(professionalProfile)
            .set({
                isVerified: true,
                verificationStatus: "verified",
                verifiedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(professionalProfile.id, profId));

        // Get user record for email
        const profUser = await db.query.user.findFirst({
            where: eq(user.id, prof.userId),
        });

        // Send approval notification email
        if (profUser?.email) {
            try {
                await sendProfessionalApprovalNotification(
                    profUser.email,
                    prof.fullName
                );
            } catch (emailError) {
                console.error("Error sending approval notification:", emailError);
            }
        }

        return new NextResponse(
            `
            <!DOCTYPE html>
            <html>
            <head><title>Professional Verified</title>
            <style>
                body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%); }
                .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
                .icon { width: 80px; height: 80px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
                .checkmark { color: white; font-size: 48px; font-weight: bold; }
                h1 { color: #1a202c; margin-bottom: 0.5rem; }
                p { color: #4a5568; line-height: 1.6; }
                .name { color: #1d4ed8; font-weight: 600; }
            </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon"><div class="checkmark">✓</div></div>
                    <h1>Professional Verified! 💼</h1>
                    <p>
                        <span class="name">${prof.fullName}</span> has been successfully verified as an Industry Professional.<br>
                        They can now access the specialized professional dashboard.
                    </p>
                    <p style="font-size: 14px; color: #94a3b8; margin-top: 1.5rem;">An approval notification email has been sent to the professional.</p>
                </div>
            </body>
            </html>
            `,
            { status: 200, headers: { "Content-Type": "text/html" } }
        );
    } catch (error) {
        console.error("Error verifying professional:", error);
        return NextResponse.json(
            { error: "Failed to verify professional" },
            { status: 500 }
        );
    }
}
