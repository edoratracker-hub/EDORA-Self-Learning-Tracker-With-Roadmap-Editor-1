import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { payments } from "@/drizzle/schema";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            // Payment verified!
            // Update database
            await db.insert(payments).values({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                userId: session.user.id,
                amount: Math.round(amount), // user-provided amount in INR usually, depends on client request
                status: "paid",
                createdAt: new Date(),
            });

            return NextResponse.json({ success: true, message: "Payment verified" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
