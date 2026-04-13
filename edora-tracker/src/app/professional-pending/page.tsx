"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { getProfessionalProfileStatus } from "@/app/actions/professional-profile-actions";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function ProfessionalPendingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!session?.user?.id) return;
      const res = await getProfessionalProfileStatus(session.user.id);
      setStatus(res);
      setLoading(false);

      // Redirect if verified
      if (res.is_verified) {
        router.push("/dashboard/professionals");
      }
    };

    if (!isPending) {
      if (!session) {
        router.push("/sign-in");
      } else if ((session.user as any).role !== "professional") {
        router.push("/dashboard");
      } else {
        checkStatus();
      }
    }
  }, [session, isPending, router]);

  if (loading || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full bg-card border border-border p-10 rounded-lg shadow-sm text-center">
        <div className="mb-8 flex justify-center">
          {status.verification_status === "submitted" ? (
            <div className="p-4 bg-blue-500/10 rounded-full">
              <Clock className="h-12 w-12 text-blue-500" />
            </div>
          ) : status.is_verified ? (
            <div className="p-4 bg-green-500/10 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          ) : (
            <div className="p-4 bg-amber-500/10 rounded-full">
              <ShieldCheck className="h-12 w-12 text-amber-500" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {status.verification_status === "submitted"
            ? "Verification in Progress"
            : status.is_verified
              ? "Account Verified!"
              : "Verification Required"}
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          {status.verification_status === "submitted"
            ? "Your professional application has been submitted to our team for review. This typically takes 24-48 hours. We'll notify you via email once your status is updated."
            : status.is_verified
              ? "Congratulations! Your professional profile is verified. You can now access your full dashboard."
              : "Please complete your professional onboarding to gain access to the dashboard."}
        </p>

        <div className="space-y-4">
          {status.is_verified ? (
            <Button
              asChild
              className="w-full h-12 font-mono text-xs uppercase tracking-widest"
            >
              <Link href="/dashboard/mentor-professional">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : status.verification_status === "submitted" ? (
            <Button
              variant="outline"
              asChild
              className="w-full h-12 font-mono text-xs uppercase tracking-widest"
            >
              <Link href="/dashboard/students/home">
                Explore as Student <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="w-full h-12 font-mono text-xs uppercase tracking-widest"
            >
              <Link href="/professional-onboarding">
                Complete Onboarding <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => authClient.signOut()}
            className="w-full h-12 text-muted-foreground"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
