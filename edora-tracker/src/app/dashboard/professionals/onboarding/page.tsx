import React from "react";
import { ProfessionalOnboarding } from "./_components/professional-onboarding";
import { Separator } from "@/components/ui/separator";

const ProfessionalOnboardingPage = () => {
  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Professionals Profile Setup</h1>
        <p className="text-muted-foreground">
          Help us understand your professional background to provide tailored industry insights and networking
        </p>
      </div>

      <Separator className="bg-blue-500 rounded-full" />
      <ProfessionalOnboarding />
    </div>
  );
};

export default ProfessionalOnboardingPage;
