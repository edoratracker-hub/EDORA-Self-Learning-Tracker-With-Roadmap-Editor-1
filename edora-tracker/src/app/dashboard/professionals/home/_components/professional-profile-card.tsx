"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, CheckCircle2, XIcon } from "lucide-react";
import Link from "next/link";
import { getProfessionalProfile } from "@/app/actions/professional-profile-actions";

export const ProfessionalProfileCard = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            const result = await getProfessionalProfile();
            if (result.success) {
                setProfile(result.profile);
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    if (loading || isDismissed) {
        return null;
    }

    // If profile is completed, we don't need to show the "Incomplete" alert
    if (profile?.onboardingCompleted) {
        return (
            <Alert className="relative border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle>Profile is Live</AlertTitle>
                <AlertDescription>
                    Your professional profile is complete. You're ready to explore opportunities and connect with mentees.
                </AlertDescription>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-emerald-900 hover:bg-emerald-100 dark:text-emerald-50 dark:hover:bg-emerald-900"
                    onClick={() => setIsDismissed(true)}
                    aria-label="Dismiss alert"
                >
                    <XIcon className="h-4 w-4" />
                </Button>
            </Alert>
        );
    }

    return (
        <Alert className="relative border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
            <AlertTitle>Professional Profile Incomplete</AlertTitle>
            <AlertDescription>
                Set up your professional background, skills, and expertise to unlock the full potential of your dashboard.
            </AlertDescription>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-amber-900 hover:bg-amber-100 dark:text-amber-50 dark:hover:bg-amber-900"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss alert"
            >
                <XIcon className="h-4 w-4" />
            </Button>

            <div className="mt-4">
                <Button size="sm" asChild>
                    <Link href="/dashboard/professionals/onboarding">
                        Complete Profile
                    </Link>
                </Button>
            </div>
        </Alert>
    );
};
