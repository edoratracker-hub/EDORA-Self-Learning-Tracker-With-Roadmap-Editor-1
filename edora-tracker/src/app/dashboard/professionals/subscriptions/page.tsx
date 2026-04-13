"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "For students starting their learning journey.",
    features: [
      "AI-Generated Learning Roadmaps",
      "Basic Progress Tracking",
      "Community Support",
      "3 Active Roadmaps",
      "Basic Badges & Achievements",
    ],
    cta: "Current Plan",
    current: true,
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: 9, yearly: 90 },
    description: "For serious learners and professionals.",
    features: [
      "Everything in Free",
      "Unlimited Active Roadmaps",
      "Mentor-Guided Validation",
      "Advanced Analytics & Insights",
      "Priority Support",
      "Verifiable Certificates",
      "Custom Learning Goals",
    ],
    cta: "Upgrade to Pro",
    current: false,
    highlighted: true,
  },
  {
    name: "Pro Plus",
    price: { monthly: 19, yearly: 190 },
    description: "For mentors and teams who want maximum impact.",
    features: [
      "Everything in Pro",
      "Mentor Dashboard & Tools",
      "1-on-1 Video Sessions",
      "Team Collaboration (Up to 5)",
      "Custom Branding",
      "Advanced Reporting",
      "API Access",
      "White-label Certificates",
    ],
    cta: "Upgrade to Pro Plus",
    current: false,
    highlighted: false,
  },
];

export default function ProfessionalsSubscriptionsPage() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: sessionData } = authClient.useSession();
  const router = useRouter();

  const handlePayment = async (planName: string, amount: number) => {
    if (!sessionData) {
      toast.error("Please sign in to subscribe to a plan");
      router.push("/sign-in");
      return;
    }

    if (amount === 0) {
      toast.success("Free plan activated!");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "EDORA",
        description: `Subscription for ${planName} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment after success
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                ...response,
                amount: amount,
              }),
            });

            if (verifyRes.ok) {
              toast.success(`Successfully subscribed to ${planName}!`);
              router.push("/dashboard");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (e) {
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: sessionData.user.name,
          email: sessionData.user.email,
        },
        theme: {
          color: "#ffffff",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className=" space-y-8 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-sm text-muted-foreground">
          Choose the plan that fits your goals
        </p>
      </div>

      <Separator className="bg-blue-500" />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              cycle === "monthly" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setCycle(cycle === "monthly" ? "yearly" : "monthly")}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors duration-200",
              cycle === "yearly" ? "bg-emerald-600" : "bg-[#30363d]",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200",
                cycle === "yearly" && "translate-x-5",
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              cycle === "yearly" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Yearly
            <span className="ml-1.5 text-[11px] font-semibold text-emerald-400">
              Save 17%
            </span>
          </span>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const price = plan.price[cycle];
            const priceINR = price * 85;

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-[#161b22] transition-all duration-200",
                  plan.highlighted
                    ? "border-emerald-500/40 shadow-[0_0_24px_-6px_rgba(16,185,129,.12)]"
                    : "border-[#30363d] hover:border-[#484f58]",
                )}
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5">
                    <Sparkles className="h-3 w-3 text-white" />
                    <span className="text-[11px] font-semibold text-white">
                      Popular
                    </span>
                  </div>
                )}

                <div className="flex flex-col flex-1 p-6">
                  {/* Plan name */}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-sm text-muted-foreground">
                        /{cycle === "monthly" ? "mo" : "yr"}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    disabled={plan.current || isProcessing}
                    onClick={() => handlePayment(plan.name, priceINR)}
                    className={cn(
                      "mt-6 w-full rounded-lg py-2.5 text-sm font-medium transition-colors duration-200",
                      plan.current
                        ? "bg-[#21262d] text-muted-foreground cursor-default"
                        : plan.highlighted
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "bg-[#21262d] text-foreground hover:bg-[#30363d]",
                      isProcessing && !plan.current && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {isProcessing && !plan.current ? "Processing..." : plan.cta}
                  </button>

                  {/* Divider */}
                  <div className="my-6 h-px bg-[#30363d]" />

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check
                          className={cn(
                            "h-4 w-4 mt-0.5 shrink-0",
                            plan.highlighted
                              ? "text-emerald-400"
                              : "text-[#484f58]",
                          )}
                        />
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
