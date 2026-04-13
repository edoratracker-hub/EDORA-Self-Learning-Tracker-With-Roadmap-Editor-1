import React from "react";
import { MentorOnboarding } from "./_components/mentor-onboarding";
import { Separator } from "@/components/ui/separator";

const MentorOnboardingPage = () => {
    return (
        <div className="min-h-screen p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Mentor Profile Setup</h1>
                <p className="text-muted-foreground">
                    Complete your professional profile to start mentoring students on Edora
                </p>
            </div>

            <Separator className="bg-emerald-500 rounded-full" />
            <MentorOnboarding />
        </div>
    );
};

export default MentorOnboardingPage;
