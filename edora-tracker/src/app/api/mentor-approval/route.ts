import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { mentorProfile, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  sendMentorApprovalNotification,
} from "@/app/lib/email";
import { transporter } from "@/app/lib/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const action = searchParams.get("action"); // "approve" or "reject"

  if (!token || !id || !action) {
    return new NextResponse(renderHtml("Invalid Request", "Missing required parameters.", "error"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    // Find the mentor profile by token and id
    const profile = await db.query.mentorProfile.findFirst({
      where: eq(mentorProfile.id, id),
    });

    if (!profile) {
      return new NextResponse(renderHtml("Not Found", "Mentor profile not found.", "error"), {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    if (profile.verificationToken !== token) {
      return new NextResponse(renderHtml("Invalid Token", "This verification link is invalid or has expired.", "error"), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    if (profile.isVerified) {
      return new NextResponse(renderHtml("Already Processed", "This mentor application has already been processed.", "warning"), {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Find the mentor's user record to get their email
    const mentorUser = await db.query.user.findFirst({
      where: eq(user.id, profile.userId),
    });

    const mentorEmail = profile.email || mentorUser?.email || "";
    const mentorName = profile.fullName || mentorUser?.name || "Mentor";

    if (action === "approve") {
      // Approve the mentor
      await db
        .update(mentorProfile)
        .set({
          isVerified: true,
          verificationStatus: "verified",
          verifiedAt: new Date(),
          verificationToken: null, // invalidate token
          updatedAt: new Date(),
        })
        .where(eq(mentorProfile.id, id));

      // Send approval notification to mentor
      await sendMentorApprovalNotification(mentorEmail, mentorName);

      return new NextResponse(
        renderHtml(
          "✅ Mentor Approved",
          `${mentorName} has been approved as a mentor. They will receive an email with a link to their dashboard.`,
          "success"
        ),
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    } else if (action === "reject") {
      // Reject the mentor
      await db
        .update(mentorProfile)
        .set({
          isVerified: false,
          verificationStatus: "rejected",
          verificationToken: null, // invalidate token
          updatedAt: new Date(),
        })
        .where(eq(mentorProfile.id, id));

      // Send rejection email to mentor
      await sendMentorRejectionEmail(mentorEmail, mentorName);

      return new NextResponse(
        renderHtml(
          "❌ Application Rejected",
          `${mentorName}'s mentor application has been rejected. They will receive an email with this decision.`,
          "rejected"
        ),
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    } else {
      return new NextResponse(renderHtml("Invalid Action", "Action must be 'approve' or 'reject'.", "error"), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }
  } catch (error) {
    console.error("Error processing mentor approval:", error);
    return new NextResponse(renderHtml("Server Error", "An error occurred. Please try again.", "error"), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}

async function sendMentorRejectionEmail(mentorEmail: string, mentorName: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
    to: mentorEmail,
    subject: "Update on Your Mentor Application",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%); padding: 40px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Application Update</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 15px;">Regarding your mentor application</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">Hi ${mentorName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">
            Thank you for your interest in becoming a mentor on Edora. After reviewing your application, we are unable to approve it at this time.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">
            You are welcome to update your profile and reapply in the future. If you have any questions, please contact our support team.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/sign-in"
               style="display: inline-block; background: #374151; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Back to Edora
            </a>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Edora Tracker — Empowering mentors and students</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

function renderHtml(title: string, message: string, type: "success" | "rejected" | "error" | "warning") {
  const colors = {
    success: { bg: "#059669", icon: "✅" },
    rejected: { bg: "#dc2626", icon: "❌" },
    error: { bg: "#7c3aed", icon: "⚠️" },
    warning: { bg: "#d97706", icon: "ℹ️" },
  };
  const { bg, icon } = colors[type];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Edora Admin</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 16px; max-width: 480px; width: 100%; padding: 48px 40px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .icon { font-size: 56px; margin-bottom: 20px; }
    .badge { display: inline-block; background: ${bg}20; color: ${bg}; border: 1px solid ${bg}50; border-radius: 999px; font-size: 12px; font-weight: 600; padding: 4px 14px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
    h1 { color: #f9fafb; font-size: 22px; font-weight: 700; margin-bottom: 12px; }
    p { color: #9ca3af; font-size: 14px; line-height: 1.8; margin-bottom: 28px; }
    a { display: inline-block; background: ${bg}; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; }
    a:hover { opacity: 0.9; }
    .footer { margin-top: 32px; font-size: 11px; color: #4b5563; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <div class="badge">Admin Action</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/admin/home">Back to Admin Dashboard</a>
    <div class="footer">Edora Tracker — Admin Panel</div>
  </div>
</body>
</html>`;
}
