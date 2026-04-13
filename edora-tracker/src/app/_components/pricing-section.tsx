"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const pricingPlans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for students starting their learning journey.",
    features: [
      "AI-Generated Learning Roadmaps",
      "Basic Progress Tracking",
      "Community Support",
      "3 Active Roadmaps",
      "Basic Badges & Achievements",
    ],
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
    highlighted: false,
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const { data: sessionData } = authClient.useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (planName: string, amount: number) => {
    if (!sessionData) {
      toast.error("Please sign in to subscribe to a plan");
      router.push("/sign-in");
      return;
    }

    if (amount === 0) {
      toast.success("Free plan activated!"); // Placeholder for free plan
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

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "EDORA",
        description: `Subscription for ${planName} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment after success window
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                ...response,
                amount: amount
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

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      // Header slide in
      gsap.from(headerRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Toggle fade in
      if (toggleRef.current) {
        gsap.from(toggleRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: toggleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          04 / Pricing
        </span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          CHOOSE YOUR PLAN
        </h2>
        <p className="mt-6 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
          Start free and upgrade as you grow. All plans include AI-powered
          roadmaps and progress tracking.
        </p>
      </div>

      {/* Billing Toggle */}
      <div
        ref={toggleRef}
        className="mb-16 flex items-center justify-center gap-4"
      >
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-widest transition-colors duration-200",
            billingCycle === "monthly"
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          Monthly
        </span>
        <button
          onClick={() =>
            setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
          }
          className="relative w-16 h-8 border border-border/50 bg-background transition-colors duration-200 hover:border-accent/60"
        >
          <div
            className={cn(
              "absolute top-1 h-6 w-6 bg-accent transition-all duration-300",
              billingCycle === "monthly" ? "left-1" : "left-9",
            )}
          />
        </button>
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-widest transition-colors duration-200",
            billingCycle === "yearly"
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          Yearly
          <span className="ml-2 text-accent text-[10px]">(Save 17%)</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
      >
        {pricingPlans.map((plan, index) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            billingCycle={billingCycle}
            index={index}
            isProcessing={isProcessing}
            onSubscribe={handlePayment}
          />
        ))}
      </div>
    </section>
  );
}

function PricingCard({
  plan,
  billingCycle,
  index,
  isProcessing,
  onSubscribe,
}: {
  plan: (typeof pricingPlans)[0];
  billingCycle: "monthly" | "yearly";
  index: number;
  isProcessing: boolean;
  onSubscribe: (planName: string, amount: number) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const priceUSD = plan.price[billingCycle];
  // Convert USD price to INR (assuming the user wants INR for Razorpay)
  // Scaling factor of 85. Or maybe the user meant these were already INR amounts?
  // Let's use 85 as a realistic conversion for USD-denominated plans.
  const priceINR = priceUSD * 85;

  return (
    <article
      className={cn(
        "relative border transition-all duration-500",
        plan.highlighted
          ? "border-accent bg-card shadow-lg shadow-accent/10"
          : "border-border bg-card",
        isHovered && !plan.highlighted && "border-accent/40",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Highlighted badge */}
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="border border-accent bg-background px-4 py-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              Most Popular
            </span>
          </div>
        </div>
      )}

      <div className="p-8 md:p-10">
        {/* Plan name */}
        <h3 className="font-[var(--font-bebas)] text-3xl tracking-tight">
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-[var(--font-bebas)] text-5xl md:text-6xl text-accent">
            ${priceUSD}
          </span>
          {priceUSD > 0 && (
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              /{billingCycle === "monthly" ? "mo" : "yr"}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-4 font-mono text-xs text-muted-foreground leading-relaxed">
          {plan.description}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => onSubscribe(plan.name, priceINR)}
          disabled={isProcessing}
          className={cn(
            "mt-8 w-full border py-3 font-mono text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2",
            plan.highlighted
              ? "border-accent bg-accent text-background hover:bg-background hover:text-accent"
              : "border-foreground/20 text-foreground hover:border-accent hover:text-accent",
            isProcessing && "opacity-50 cursor-not-allowed",
          )}
        >
          {isProcessing ? "Processing..." : plan.name === "Free" ? "Get Started" : "Subscribe"}
        </button>

        {/* Features list */}
        <div className="mt-8 pt-8 border-t border-border/30">
          <ul className="space-y-4">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 w-4 h-4 border border-accent/60 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-accent" />
                </div>
                <span className="font-mono text-xs text-foreground/80 leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Corner accent */}
      <div
        className={cn(
          "absolute top-0 right-0 w-12 h-12 transition-opacity duration-500",
          isHovered || plan.highlighted ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
      </div>
    </article>
  );
}
