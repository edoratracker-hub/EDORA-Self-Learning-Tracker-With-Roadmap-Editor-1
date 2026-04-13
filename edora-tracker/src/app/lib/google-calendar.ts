import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

export function getOAuth2Client() {
    const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    );

    return oauth2Client;
}

export interface CalendarEvent {
    summary: string;
    description: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    attendees: Array<{
        email: string;
        displayName?: string;
    }>;
    reminders: {
        useDefault: false;
        overrides: Array<{
            method: 'email' | 'popup';
            minutes: number;
        }>;
    };
}

export async function createCalendarEvent(
    accessToken: string,
    event: CalendarEvent
) {
    try {
        const oauth2Client = getOAuth2Client();
        oauth2Client.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                ...event,
                conferenceData: {
                    createRequest: {
                        requestId: `${Date.now()}`,
                        conferenceSolutionKey: {
                            type: 'hangoutsMeet'
                        }
                    }
                },
            },
            conferenceDataVersion: 1,
            sendUpdates: 'all', // Send email invites to all attendees
        });

        return {
            success: true,
            eventId: response.data.id,
            htmlLink: response.data.htmlLink,
            meetLink: response.data.hangoutLink,
        };
    } catch (error) {
        console.error('Error creating calendar event:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create calendar event',
        };
    }
}

export async function updateCalendarEvent(
    accessToken: string,
    eventId: string,
    event: Partial<CalendarEvent>
) {
    try {
        const oauth2Client = getOAuth2Client();
        oauth2Client.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const response = await calendar.events.patch({
            calendarId: 'primary',
            eventId: eventId,
            requestBody: event,
            sendUpdates: 'all',
        });

        return {
            success: true,
            eventId: response.data.id,
            htmlLink: response.data.htmlLink,
        };
    } catch (error) {
        console.error('Error updating calendar event:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update calendar event',
        };
    }
}

export async function deleteCalendarEvent(
    accessToken: string,
    eventId: string
) {
    try {
        const oauth2Client = getOAuth2Client();
        oauth2Client.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
            sendUpdates: 'all',
        });

        return { success: true };
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete calendar event',
        };
    }
}

export function getAuthUrl() {
    const oauth2Client = getOAuth2Client();

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });
}

export async function getTokenFromCode(code: string) {
    try {
        const oauth2Client = getOAuth2Client();
        const { tokens } = await oauth2Client.getToken(code);

        return {
            success: true,
            tokens,
        };
    } catch (error) {
        console.error('Error getting token from code:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get token',
        };
    }
}
