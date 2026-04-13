import { NextResponse } from "next/server";
import { razorpay } from "@/app/lib/razorpay";
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

        const { amount } = await req.json();

        const options = {
            amount: amount * 100, // razorpay expects amount in paise (100 paise = 1 INR)
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Razorpay Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
