# Interview Management System - Setup Guide

This guide will help you set up the complete interview management system with Google Calendar integration and email inbox.

## Features

✅ **Interview Scheduling** - Schedule interviews with candidates  
✅ **Google Calendar Integration** - Automatic calendar event creation with Google Meet links  
✅ **Email inbox** - Beautiful HTML emails with .ics calendar attachments  
✅ **Interview Rescheduling** - Change interview dates/times with automatic inbox  
✅ **Reschedule History** - Track all reschedule changes  
✅ **Interview Reminders** - Automated reminder emails before interviews  
✅ **Upcoming Interviews Dashboard** - View all scheduled interviews  

---

## 1. Database Setup

### Run Database Migrations

```bash
npm run db:push
```

This will create the following new tables:
- `scheduled_interviews` - Stores interview schedules
- `interview_reschedule_history` - Tracks reschedule changes

### New Database Fields

**scheduled_interviews table:**
- `googleCalendarEventId` - Google Calendar event ID
- `meetingLink` - Google Meet link (auto-generated)
- `emailSent` - Tracks if confirmation email was sent
- `reminderSent` - Timestamp of reminder email

**applied_jobs table:**
- `status` - Now includes: "applied", "scheduled", "rescheduled", "accepted", "rejected", "hired"

---

## 2. Google Calendar API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Google Calendar API" and enable it

### Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://your-domain.com/api/auth/google/callback` (production)
5. Copy the **Client ID** and **Client Secret**

### Step 3: Configure OAuth Consent Screen

1. Go to "OAuth consent screen"
2. Select "External" (for testing) or "Internal" (for organization)
3. Fill in app information:
   - App name
   - User support email
   - Developer contact information
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar.events`
5. Add test users if using "External"

---

## 3. Email Service Setup

You have two options for sending emails:

### Option A: Gmail (Quick Setup for Testing)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification
   - App passwords > Generate new
3. Copy the 16-character password

**Environment Variables:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
```

### Option B: Professional Email Service (Recommended for Production)

#### Using Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Generate API key
4. Configure:

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASSWORD=re_your_api_key_here
```

#### Using SendGrid

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_api_key_here
```

---

## 4. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required Variables:**

```env
# Google Calendar
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Email Service
EMAIL_SERVICE=gmail  # or 'smtp'
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. Install Dependencies

The following packages are required (should already be installed):

```bash
npm install googleapis @google-cloud/local-auth ical-generator nodemailer @types/nodemailer
```

---

## 6. Usage

### Scheduling an Interview

1. Navigate to Job Details page
2. Click "Accept" on a candidate
3. Select date and time
4. Click "Schedule"

**What happens:**
- ✅ Interview saved to database
- ✅ Google Calendar event created (with Meet link)
- ✅ Email sent to candidate with .ics attachment
- ✅ Application status updated to "scheduled"

### Rescheduling an Interview

1. Navigate to Job Details page
2. Find scheduled interview
3. Click "Reschedule" button
4. Select new date/time and add reason (optional)
5. Click "Reschedule"

**What happens:**
- ✅ Google Calendar event updated
- ✅ Reschedule history saved
- ✅ Email sent to candidate with updated .ics
- ✅ Notification includes old and new schedules

---

## 7. Email Templates

The system includes professional HTML email templates for:

### Interview Confirmation Email
- Job details
- Interview date/time
- Interviewer information
- Google Meet link (if available)
- Preparation checklist
- .ics calendar attachment

### Reschedule Notification Email
- Previous schedule (strikethrough)
- New schedule (highlighted)
- Reason for reschedule
- Updated .ics calendar attachment

### Interview Reminder Email
- Sent 24 hours before interview
- Quick checklist
- Meeting link
- Interview details

---

## 8. Automated Reminders (Future Implementation)

To enable automated reminders, set up a cron job or serverless function:

```typescript
// app/api/cron/send-reminders/route.ts
import { sendInterviewReminderEmail } from '@/app/lib/email-service';
import { getUpcomingInterviews } from '@/app/actions/interview-actions';

export async function GET(request: Request) {
  const { interviews } = await getUpcomingInterviews();
  
  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  for (const interview of interviews) {
    const interviewTime = new Date(interview.time);
    
    // Send reminder if interview is in 24 hours and reminder not sent
    if (interviewTime <= twentyFourHoursFromNow && 
        interviewTime > now && 
        !interview.reminderSent) {
      await sendInterviewReminderEmail({
        // ... interview details
      }, 24);
      
      // Mark reminder as sent
      // await db.update(scheduledInterviews)...
    }
  }
  
  return Response.json({ success: true });
}
```

**Use with Vercel Cron:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 * * * *"  // Every hour
  }]
}
```

---

## 9. Google Calendar Authentication Flow

### For Recruiters

1. Add a "Connect Google Calendar" button in recruiter settings
2. On click, redirect to Google OAuth:

```typescript
import { getAuthUrl } from '@/app/lib/google-calendar';

const authUrl = getAuthUrl();
window.location.href = authUrl;
```

3. Handle callback and store tokens:

```typescript
// app/api/auth/google/callback/route.ts
import { getTokenFromCode } from '@/app/lib/google-calendar';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const { tokens } = await getTokenFromCode(code);
    // Store tokens in database for the user
    // Encrypt tokens before storing!
  }
  
  return redirect('/dashboard/recruiter');
}
```

---

## 10. Testing

### Test Interview Scheduling

1. Create a test job posting
2. Have a test student apply
3. Schedule interview with your own email
4. Verify:
   - ✅ Email received with calendar invite
   - ✅ Google Calendar event created
   - ✅ Interview shows in applicants table

### Test Rescheduling

1. Reschedule an existing interview
2. Verify:
   - ✅ Email received with new schedule
   - ✅ Google Calendar event updated
   - ✅ History recorded in database

---

## 11. Troubleshooting

### Google Calendar Event Not Created

- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Verify Google Calendar API is enabled
- Ensure OAuth redirect URI matches exactly
- Check if access token is being passed correctly

### Emails Not Sending

- Verify email service credentials
- Check spam folder
- Test SMTP connection
- Review email service logs

### .ics File Not Attaching

- Ensure `ical-generator` is installed
- Check email template configuration
- Verify `nodemailer` version compatibility

---

## 12. Security Best Practices

1. **Encrypt Tokens**: Store Google access tokens encrypted in database
2. **Refresh Tokens**: Implement token refresh logic
3. **Rate Limiting**: Add rate limits to prevent abuse
4. **Input Validation**: Validate all date/time inputs
5. **Error Handling**: Never expose sensitive errors to users

---

## 13. Production Checklist

- [ ] Database migrations run successfully
- [ ] Google Cloud Project configured for production
- [ ] Email service verified and tested
- [ ] Environment variables set in production
- [ ] OAuth redirect URIs updated for production domain
- [ ] Error monitoring setup (e.g., Sentry)
- [ ] Email deliverability tested
- [ ] Calendar event creation tested
- [ ] Cron job for reminders configured

---

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all environment variables are set
3. Test each service independently (email, calendar)
4. Review Google Cloud logs for API errors

---

## Next Steps

1. Set up environment variables
2. Run database migrations
3. Configure Google Calendar API
4. Set up email service
5. Test the complete flow
6. Deploy to production

Happy interviewing! 🎉
