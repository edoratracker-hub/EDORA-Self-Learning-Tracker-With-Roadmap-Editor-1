"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMentorProfile } from "@/app/hooks/use-mentor-profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function MentorPendingApprovalPage() {
  const { data: profile, isLoading, refetch } = useMentorProfile();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-7 w-48 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isVerified = profile?.isVerified;
  const status = profile?.verificationStatus || "pending";

  // Already verified — redirect prompt
  if (isVerified) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center p-6">
        <Card className="max-w-md w-full border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/50 h-16 w-16 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-400">
              You're Verified! 🎉
            </CardTitle>
            <CardDescription>
              Your mentor application has been approved. You have full access to the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/mentor/home" className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rejected
  if (status === "rejected") {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-200 bg-red-50/30 dark:bg-red-950/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-red-100 dark:bg-red-900/50 h-16 w-16 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-700 dark:text-red-400">
              Application Not Approved
            </CardTitle>
            <CardDescription>
              Unfortunately your application was not approved at this time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.rejectionReason && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Reason:</p>
                <p className="text-sm text-red-700 dark:text-red-400">{profile.rejectionReason}</p>
              </div>
            )}
            <Link href="/dashboard/mentor/onboarding" className="w-full">
              <Button variant="outline" className="w-full">
                Update Profile & Reapply
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pending / Submitted
  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-amber-100 dark:bg-amber-900/50 h-16 w-16 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-amber-600 animate-pulse" />
          </div>
          <CardTitle className="text-2xl">Application Under Review</CardTitle>
          <CardDescription>
            Your mentor profile is being reviewed by our team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm">Profile submitted</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Admin review in progress</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-muted" />
              <span className="text-sm text-muted-foreground">Approval & dashboard access</span>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            This process typically takes <strong>1-2 business days</strong>.
            You'll receive an email notification once approved.
          </p>

          {profile?.verificationSubmittedAt && (
            <p className="text-xs text-center text-muted-foreground">
              Submitted on {new Date(profile.verificationSubmittedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          <div className="pt-4 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Status
            </Button>
            <Link href="/dashboard/mentor/home" className="w-full">
              <Button variant="ghost" className="w-full text-muted-foreground">
                Go to Dashboard (Limited Access)
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
