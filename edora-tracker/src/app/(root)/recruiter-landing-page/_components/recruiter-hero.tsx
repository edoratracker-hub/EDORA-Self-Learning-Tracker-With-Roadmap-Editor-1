"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LightRays from "@/components/animations/LightRays";
import Ballpit from "@/components/animations/Ballpit";
import { checkRecruiterOrganizationStatus } from "@/app/actions/recruiter-actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function RecruiterHero() {
  const router = useRouter();
  const [hasOrg, setHasOrg] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isRecruiter, setIsRecruiter] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const { hasOrganization, organization, session } =
        await checkRecruiterOrganizationStatus();

      if (session && session.user.role === "recruiter") {
        setIsRecruiter(true);
        setHasOrg(hasOrganization);

        if (organization) {
          setIsVerified(organization.verified);
          // Don't auto-redirect here - let the user see the landing page
          // Redirect only happens when they click "Go to Dashboard"
        }
      }
    }
    checkStatus();
  }, [router]);

  const handleDashboardClick = () => {
    if (!isVerified) {
      toast.error("Organization Not Verified", {
        description: "Please complete verification before accessing the dashboard.",
        duration: 5000,
      });
      router.push("/recruiter-organization-completed");
    } else {
      router.push("/dashboard/recruiter");
    }
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Silk Effect */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Ballpit
          count={100}
          gravity={0.5}
          friction={0.9975}
          wallBounce={0.95}
          followCursor
          colors={["#5227FF", "#7cff67", "#ff6b6b"]}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex flex-col items-center gap-6 text-center px-4 md:px-6">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Hire Top Talent with <span className="text-primary">Edora</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl">
            Streamline your recruitment process with our AI-powered platform.
            Connect with qualified candidates, manage applications effortlessly,
            and build your dream team.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          {!isRecruiter && (
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/sign-in?role=recruiter">Start Hiring Now</Link>
            </Button>
          )}

          {isRecruiter && !hasOrg && (
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/recruiter-organization">Set up Organization</Link>
            </Button>
          )}

          {isRecruiter && hasOrg && (
            <Button
              size="lg"
              className="h-12 px-8 text-base"
              onClick={handleDashboardClick}
            >
              Go to Dashboard
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base"
            asChild
          >
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
