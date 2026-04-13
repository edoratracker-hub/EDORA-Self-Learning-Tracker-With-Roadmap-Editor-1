import ical, { ICalCalendar, ICalAttendeeStatus, ICalAttendeeRole, ICalEventStatus, ICalEventBusyStatus } from 'ical-generator';
import nodemailer from 'nodemailer';

// Create transporter - configure with your email service
export function createEmailTransporter() {
    // For development, you can use services like Gmail, SendGrid, or Resend
    // For production, use a proper email service

    if (process.env.EMAIL_SERVICE === 'gmail') {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
            },
        });
    }

    // Default to Resend or custom SMTP
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.resend.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
}

export interface InterviewDetails {
    jobTitle: string;
    companyName: string;
    candidateName: string;
    candidateEmail: string;
    recruiterName: string;
    recruiterEmail: string;
    interviewDate: Date;
    interviewTime: Date;
    meetingLink?: string;
    location?: string;
}

export function generateCalendarInvite(details: InterviewDetails): ICalCalendar {
    const calendar = ical({ name: 'Interview Schedule' });

    // Combine date and time
    const startDateTime = new Date(details.interviewDate);
    const timeToUse = new Date(details.interviewTime);
    startDateTime.setHours(timeToUse.getHours(), timeToUse.getMinutes(), 0, 0);

    // End time is 1 hour after start
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    calendar.createEvent({
        start: startDateTime,
        end: endDateTime,
        summary: `Interview: ${details.jobTitle}`,
        description: `Interview for the position of ${details.jobTitle} at ${details.companyName}\n\nCandidate: ${details.candidateName}\nInterviewer: ${details.recruiterName}${details.meetingLink ? `\n\nMeeting Link: ${details.meetingLink}` : ''}`,
        location: details.location || details.meetingLink || 'Online',
        organizer: {
            name: details.recruiterName,
            email: details.recruiterEmail,
        },
        attendees: [
            {
                name: details.candidateName,
                email: details.candidateEmail,
                rsvp: true,
                status: ICalAttendeeStatus.NEEDSACTION,
                role: 'REQ-PARTICIPANT' as any,
            },
        ],
        status: ICalEventStatus.CONFIRMED,
        busystatus: ICalEventBusyStatus.BUSY,
    });

    return calendar;
}

export async function sendInterviewConfirmationEmail(details: InterviewDetails) {
    try {
        const transporter = createEmailTransporter();
        const calendar = generateCalendarInvite(details);

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Interview Scheduled!</h1>
        </div>
        <div class="content">
            <p>Dear ${details.candidateName},</p>
            <p>Congratulations! Your interview has been scheduled for the position of <strong>${details.jobTitle}</strong> at <strong>${details.companyName}</strong>.</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="label">📅 Date:</span> ${new Date(details.interviewDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
                </div>
                <div class="info-row">
                    <span class="label">⏰ Time:</span> ${new Date(details.interviewTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })}
                </div>
                <div class="info-row">
                    <span class="label">👤 Interviewer:</span> ${details.recruiterName}
                </div>
                ${details.meetingLink ? `
                <div class="info-row">
                    <span class="label">🔗 Meeting Link:</span> <a href="${details.meetingLink}">${details.meetingLink}</a>
                </div>
                ` : ''}
                ${details.location ? `
                <div class="info-row">
                    <span class="label">📍 Location:</span> ${details.location}
                </div>
                ` : ''}
            </div>

            <p><strong>What to expect:</strong></p>
            <ul>
                <li>The interview will last approximately 1 hour</li>
                <li>Please be ready 5-10 minutes before the scheduled time</li>
                <li>Have a copy of your resume handy</li>
                <li>Prepare questions about the role and company</li>
            </ul>

            ${details.meetingLink ? `
            <center>
                <a href="${details.meetingLink}" class="button">Join Interview</a>
            </center>
            ` : ''}

            <p>A calendar invite has been attached to this email. Please add it to your calendar.</p>

            <p>If you need to reschedule, please contact us as soon as possible.</p>

            <p>Best of luck!<br>
            <strong>${details.companyName}</strong></p>

            <div class="footer">
                <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
            from: `"${details.companyName}" <${details.recruiterEmail}>`,
            to: details.candidateEmail,
            subject: `Interview Scheduled: ${details.jobTitle} at ${details.companyName}`,
            html: htmlTemplate,
            icalEvent: {
                filename: 'interview.ics',
                method: 'REQUEST',
                content: calendar.toString(),
            },
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId,
            message: 'Interview confirmation email sent successfully',
        };
    } catch (error) {
        console.error('Error sending interview confirmation email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        };
    }
}

export async function sendInterviewReminderEmail(details: InterviewDetails, hoursUntil: number) {
    try {
        const transporter = createEmailTransporter();

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .reminder-box { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Interview Reminder</h1>
        </div>
        <div class="content">
            <p>Hi ${details.candidateName},</p>
            <p>This is a friendly reminder that your interview is coming up in <strong>${hoursUntil} hours</strong>!</p>
            
            <div class="reminder-box">
                <h3>Interview Details:</h3>
                <p><strong>Position:</strong> ${details.jobTitle}</p>
                <p><strong>Company:</strong> ${details.companyName}</p>
                <p><strong>Date:</strong> ${new Date(details.interviewDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        })}</p>
                <p><strong>Time:</strong> ${new Date(details.interviewTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })}</p>
            </div>

            <p><strong>Quick Checklist:</strong></p>
            <ul>
                <li>✓ Test your internet connection (if online)</li>
                <li>✓ Review your resume and application</li>
                <li>✓ Prepare answers to common interview questions</li>
                <li>✓ Have questions ready for the interviewer</li>
                <li>✓ Dress professionally</li>
            </ul>

            ${details.meetingLink ? `
            <center>
                <a href="${details.meetingLink}" class="button">Join Interview</a>
            </center>
            ` : ''}

            <p>Good luck! We look forward to speaking with you.</p>

            <p>Best regards,<br>
            <strong>${details.companyName}</strong></p>
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
            from: `"${details.companyName}" <${details.recruiterEmail}>`,
            to: details.candidateEmail,
            subject: `Reminder: Interview in ${hoursUntil} hours - ${details.jobTitle}`,
            html: htmlTemplate,
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Error sending reminder email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send reminder',
        };
    }
}

export async function sendRescheduleNotificationEmail(
    details: InterviewDetails,
    oldDate: Date,
    oldTime: Date
) {
    try {
        const transporter = createEmailTransporter();
        const calendar = generateCalendarInvite(details);

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .change-box { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .old { text-decoration: line-through; color: #6b7280; }
        .new { color: #3b82f6; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Interview Rescheduled</h1>
        </div>
        <div class="content">
            <p>Dear ${details.candidateName},</p>
            <p>Your interview for <strong>${details.jobTitle}</strong> at <strong>${details.companyName}</strong> has been rescheduled.</p>
            
            <div class="change-box">
                <p><strong>Previous Schedule:</strong></p>
                <p class="old">
                    ${new Date(oldDate).toLocaleDateString()} at ${new Date(oldTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
                
                <p><strong>New Schedule:</strong></p>
                <p class="new">
                    ${new Date(details.interviewDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${new Date(details.interviewTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
            </div>

            <p>An updated calendar invite has been attached to this email.</p>

            <p>We apologize for any inconvenience. If you have any questions, please don't hesitate to contact us.</p>

            <p>Best regards,<br>
            <strong>${details.companyName}</strong></p>
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
            from: `"${details.companyName}" <${details.recruiterEmail}>`,
            to: details.candidateEmail,
            subject: `Interview Rescheduled: ${details.jobTitle}`,
            html: htmlTemplate,
            icalEvent: {
                filename: 'interview.ics',
                method: 'REQUEST',
                content: calendar.toString(),
            },
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Error sending reschedule email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        };
    }
}
