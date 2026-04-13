"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRecruiterOrganization } from "@/app/actions/recruiter-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  CheckCircle2,
  Clock,
  Mail,
  Building2,
  Loader2,
  ArrowRight,
  FileSearch,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import Beams from "@/components/animations/Beams";

export default function RecruiterOrganizationCompletedPage() {
  const router = useRouter();
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrganization() {
      const { organization, error } = await getRecruiterOrganization();

      if (error || !organization) {
        toast.error("Organization not found");
        router.push("/recruiter-organization");
        return;
      }

      setOrganization(organization);
      setLoading(false);
    }

    fetchOrganization();
  }, [router]);

  const handleContinueToDashboard = () => {
    if (!organization?.verified) {
      toast.error("Organization Not Verified", {
        description:
          "Please wait for admin approval before accessing the dashboard.",
        duration: 5000,
      });
      return;
    }

    router.push("/dashboard/recruiter");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (organization?.verified) {
    // Show original success page if verified
    return (
      <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
        <div className="absolute inset-0 z-0">
          <Beams
            beamWidth={2}
            beamHeight={15}
            beamNumber={15}
            lightColor="#22c55e"
            speed={1.5}
            noiseIntensity={1.2}
            scale={0.2}
            rotation={0}
          />
        </div>

        <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in duration-500">
          <Card className="border-2 border-primary/20 shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center ">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 ring-4 ring-green-500/20">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Organization Verified!
              </CardTitle>
              <CardDescription className="text-lg mt-2 max-w-md mx-auto">
                Your organization has been verified. You can now start using
                Edora's recruiting tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3 ">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 border hover:bg-muted/80 transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-1">Manage Profile</h3>
                <p className="text-xs text-muted-foreground">
                  Update branding and company details
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 border hover:bg-muted/80 transition-colors">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <FileSearch className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-1">Post Jobs</h3>
                <p className="text-xs text-muted-foreground">
                  Create listings and find talent
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 border hover:bg-muted/80 transition-colors">
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                  <UserPlus className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-1">Invite Team</h3>
                <p className="text-xs text-muted-foreground">
                  Add recruiters to your team
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center bg-muted/20 border-t ">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 text-base"
                onClick={handleContinueToDashboard}
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/recruiter-landing-page">View Landing Page</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Show pending verification page
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={15}
          lightColor="#facc15"
          speed={1.5}
          noiseIntensity={1.2}
          scale={0.2}
          rotation={0}
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <Card className="border border-border/40 shadow-xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center ">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
              <Clock className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Pending Verification
            </CardTitle>
            <CardDescription className="text-base mt-2">
              We are currently reviewing your organization details.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 ">
            <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg border border-border/40">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Organization
              </p>
              <p className="text-lg font-semibold mt-0.5">
                {organization?.companyName || "N/A"}
              </p>
            </div>

            <p className="text-sm text-center text-muted-foreground px-4 leading-relaxed">
              This usually takes 24-48 hours. You'll be notified via email once
              approved.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleContinueToDashboard}
            >
              Try Dashboard Access
            </Button>

            <p className="text-xs text-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <a href="mailto:support@edora.com">Contact Support</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
