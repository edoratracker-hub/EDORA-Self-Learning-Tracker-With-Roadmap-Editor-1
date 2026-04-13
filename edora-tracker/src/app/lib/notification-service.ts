"use server";

import { db } from "@/drizzle/db";
import { message, user, notifications } from "@/drizzle/schema";
import { nanoid } from "nanoid";
import { transporter } from "@/app/lib/email";
import { eq } from "drizzle-orm";

/**
 * Sends a system message to a user's inbox (legacy message table)
 */
export async function sendSystemInboxMessage(userId: string, content: string) {
  try {
    let systemSender = await db.query.user.findFirst({
        where: eq(user.role, 'admin')
    });
    if (!systemSender) {
        systemSender = await db.query.user.findFirst();
    }

    if (!systemSender) {
        console.error("No users found to act as system sender");
        return { success: false };
    }

    await db.insert(message).values({
      id: nanoid(),
      senderId: systemSender.id,
      receiverId: userId,
      content,
      isRead: false,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending system message:", error);
    return { success: false };
  }
}

/**
 * Creates a notification in the notifications table (structured notifications)
 */
export async function createNotification({
  userId,
  fromUserId,
  type,
  title,
  message: msg,
  metadata,
}: {
  userId: string;
  fromUserId?: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}) {
  try {
    const id = crypto.randomUUID();
    await db.insert(notifications).values({
      id,
      userId,
      fromUserId: fromUserId ?? null,
      type,
      title,
      message: msg,
      read: false,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
    return { success: true, id };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false };
  }
}

/**
 * Sends a welcome email to the user
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
        to: email,
        subject: "Welcome to Edora Tracker! 🎉",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <h2>Welcome to Edora, ${name}!</h2>
                <p>We're thrilled to have you join our community of students, mentors, and professionals.</p>
                <p>Edora Tracker helps you manage your learning journey, connect with mentors, and track your progress through personalized roadmaps.</p>
                <p>Get started by exploring your dashboard and setting up your goals!</p>
                <br/>
                <p>Best regards,<br/>The Edora Team</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false };
  }
}

/**
 * Sends a notification for a new roadmap task
 */
export async function sendRoadmapTaskReminder(userId: string, milestoneTitle: string, taskTitle: string) {
  const content = `Roadmap Reminder: New task "${taskTitle}" added to your "${milestoneTitle}" milestone. Keep up the great work!`;
  await sendSystemInboxMessage(userId, content);
  return createNotification({
    userId,
    type: "study_reminder",
    title: "Roadmap Task Reminder",
    message: content,
    metadata: { milestoneTitle, taskTitle },
  });
}

/**
 * Sends a morning reminder for today's calendar events
 */
export async function sendCalendarMorningReminders(userId: string, eventTitle: string, startTime: string) {
  const content = `Good morning! You have an event today: "${eventTitle}" starting at ${startTime}. Don't miss it!`;
  await sendSystemInboxMessage(userId, content);
  return createNotification({
    userId,
    type: "calendar_reminder",
    title: "Calendar Reminder",
    message: content,
    metadata: { eventTitle, startTime },
  });
}

/**
 * Sends a notification when a new calendar event is created
 */
export async function sendCalendarEventNotification(userId: string, eventTitle: string, startTime: string) {
  const content = `📅 New event added to your calendar: "${eventTitle}" on ${startTime}. You can view it in your Calendar.`;
  await sendSystemInboxMessage(userId, content);
  return createNotification({
    userId,
    type: "calendar_event",
    title: "New Calendar Event",
    message: content,
    metadata: { eventTitle, startTime },
  });
}

/**
 * Sends a notification to the student when a recruiter schedules an interview
 */
export async function sendInterviewScheduledNotification(
  userId: string,
  jobTitle: string,
  companyName: string,
  dateTime: string,
  recruiterId?: string,
) {
  const content = `🎉 Great news! Your interview for "${jobTitle}" at ${companyName} has been scheduled for ${dateTime}. Check your Calendar for details.`;
  await sendSystemInboxMessage(userId, content);
  return createNotification({
    userId,
    fromUserId: recruiterId,
    type: "interview_scheduled",
    title: "Interview Scheduled",
    message: content,
    metadata: { jobTitle, companyName, dateTime },
  });
}

/**
 * Sends a notification when an interview is rescheduled
 */
export async function sendInterviewRescheduledNotification(
  userId: string,
  jobTitle: string,
  newDateTime: string,
  reason?: string,
  recruiterId?: string,
) {
  const content = `🔄 Your interview for "${jobTitle}" has been rescheduled to ${newDateTime}.${reason ? ` Reason: ${reason}` : ''} Check your Calendar for updated details.`;
  await sendSystemInboxMessage(userId, content);
  return createNotification({
    userId,
    fromUserId: recruiterId,
    type: "interview_rescheduled",
    title: "Interview Rescheduled",
    message: content,
    metadata: { jobTitle, newDateTime, reason },
  });
}

/**
 * Sends a daily study reminder to a student
 */
export async function sendDailyStudyReminder(userId: string) {
  const content = `📚 Daily Study Reminder: Don't forget to study with your roadmap today! Consistency is key to achieving your goals. Open your Roadmap to continue learning.`;
  return createNotification({
    userId,
    type: "study_reminder",
    title: "Daily Study Reminder",
    message: content,
  });
}

/**
 * Sends a collaboration request notification to target user
 */
export async function sendCollaborationRequestNotification(
  targetUserId: string,
  fromUserId: string,
  fromUserName: string,
  fileName: string,
  fileId: string,
  collaboratorId: string,
) {
  const content = `🤝 ${fromUserName} has invited you to collaborate on "${fileName}". Accept or decline this invitation.`;
  return createNotification({
    userId: targetUserId,
    fromUserId,
    type: "collab_invite",
    title: "Collaboration Request",
    message: content,
    metadata: { fileId, collaboratorId, fileName },
  });
}

/**
 * Sends a mentor verification notification to a student
 */
export async function sendMentorVerificationNotification(
  userId: string,
  mentorName: string,
  mentorId?: string,
) {
  const content = `✅ Mentor Verification: ${mentorName} has been verified and is now available to guide you. Check your Classrooms to connect.`;
  return createNotification({
    userId,
    fromUserId: mentorId,
    type: "mentor_verification",
    title: "Mentor Verified",
    message: content,
    metadata: { mentorName },
  });
}
