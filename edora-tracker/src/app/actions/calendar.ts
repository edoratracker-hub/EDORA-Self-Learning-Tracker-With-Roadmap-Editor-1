"use server";
import { google } from "googleapis";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { refreshToken } from "better-auth/api";

export async function createGoogleCalendarEvent(eventDetails: {
  title: string;
  description: string;
  startTime: string; // Must be ISO string: 2026-03-10T22:00:00Z
  endTime: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  // Retrieve the Google Access Token from the user's account in the DB
  const token = await auth.api.getAccessToken({
    body: { providerId: "google" },
    headers: await headers(),
  });

  if (!token?.accessToken) {
    throw new Error("Missing Google Access Token. Please re-login.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    access_token: token.accessToken,
    refresh_token: (token as any).refreshToken, // Refresh token allows background updates
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = {
    summary: eventDetails.title,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime,
      timeZone: "UTC",
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: "UTC",
    },
    // Automatic Notifications
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // 1 day before
        { method: "popup", minutes: 30 }, // 30 mins before
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    return { success: true, url: response.data.htmlLink };
  } catch (error: any) {
    console.error("Calendar Sync Error:", error);
    return { success: false, error: error.message };
  }
}
