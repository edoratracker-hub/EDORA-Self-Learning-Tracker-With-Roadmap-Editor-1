"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const sendOtpSchema = z.object({
    email: z.string().email(),
});

export async function sendOtpAction(values: { email: string }) {
    const parsed = sendOtpSchema.safeParse(values);

    if (!parsed.success) {
        return {
            error: "Invalid email address",
        };
    }

    try {
        await auth.api.sendVerificationOTP({
            body: {
                email: values.email,
                type: "sign-in",
            },
            headers: await headers(),
        });

        return {
            success: true,
        };
    } catch (error: any) {
        return {
            error: error.body?.message || error.message || "Failed to send OTP",
        };
    }
}

export async function verifyAndSignUpAction(values: {
    email: string;
    code: string;
    name: string;
    role: string;
}) {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email: values.email,
                name: values.name,
                role: values.role as any,
                password: "password123",
            },
            headers: await headers(),
        });

        if (response) {
            // Send welcome email and message
            const { sendWelcomeEmail, sendSystemInboxMessage, createNotification } = await import("@/app/lib/notification-service");
            await sendWelcomeEmail(values.email, values.name);
            await sendSystemInboxMessage(response.user.id, `Welcome to Edora Tracker, ${values.name}! We're excited to help you achieve your goals.`);
            await createNotification({
                userId: response.user.id,
                type: "welcome",
                title: "Welcome to Edora! 🎉",
                message: `Welcome to Edora Tracker, ${values.name}! We're excited to help you achieve your goals. Start exploring your dashboard, set up your goals, and begin your learning journey.`,
            });
        }

        return {
            success: true,
            data: response,
        };
    } catch (error: any) {
        return {
            error: error.body?.message || error.message || "Sign up failed",
        };
    }
}
