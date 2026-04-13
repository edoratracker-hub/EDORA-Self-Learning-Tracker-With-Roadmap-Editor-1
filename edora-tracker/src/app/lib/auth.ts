import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import { sendOTPEmail } from "@/app/lib/email";
import { emailOTP } from "better-auth/plugins";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
    basePath: "/api/auth",
    baseURL,
    trustedOrigins: [
        "http://localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    databaseHooks: {
        user: {
            create: {
                after: async (user: any) => {
                    try {
                        const { sendWelcomeEmail, sendSystemInboxMessage, createNotification } = await import("@/app/lib/notification-service");
                        const userName = user.name || user.email.split('@')[0];
                        await sendWelcomeEmail(user.email, userName);
                        await sendSystemInboxMessage(user.id, `Welcome to Edora Tracker, ${userName}! We're thrilled to have you join our community.`);
                        await createNotification({
                            userId: user.id,
                            type: "welcome",
                            title: "Welcome to Edora! 🎉",
                            message: `Welcome to Edora Tracker, ${userName}! We're thrilled to have you join our community. Start exploring your dashboard, set up your goals, and begin your learning journey.`,
                        });
                    } catch (error) {
                        console.error("Error in welcome hook:", error);
                    }
                }
            }
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 15, // 15 days in seconds
        updateAge: 60 * 60 * 24, // Update session every 24 hours
        additionalFields: {
            role: {
                type: "string",
            },
            email: {
                type: "string",
            },
        },
    },
    emailAndPassword: {
        enabled: false,
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                await sendOTPEmail(email, otp);
            },
            expiresIn: 600, // 10 mins
        }),
    ],
    socialProviders: {
        ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? {
            github: {
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                redirectURI: `${baseURL}/api/auth/callback/github`,
            }
        } : {}),
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                redirectURI: `${baseURL}/api/auth/callback/google`,
                // --- CALENDAR INTEGRATION ADDITIONS ---
                scope: [
                    "openid",
                    "email",
                    "profile",
                    "https://www.googleapis.com/auth/calendar.events" // Permission to manage events
                ],
                accessType: "offline", // Required to get the refresh token
                prompt: "consent",    // Forces Google to show the consent screen for the refresh token
                // --------------------------------------
            }
        } : {}),
        ...(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET ? {
            microsoft: {
                clientId: process.env.MICROSOFT_CLIENT_ID,
                clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
                redirectURI: `${baseURL}/api/auth/callback/microsoft`,
            }
        } : {}),
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
        cookiePrefix: "better-auth",
    },
    callbacks: {
        session: {
            async after(session: any, user: any) {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        role: user.role
                    }
                }
            }
        }
    }
});