"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useUpdateOnboardingStep,
  useStudentProfile,
} from "@/app/hooks/use-student-profile";
import { toast } from "sonner";

import {
  ProfileStep,
  SkillsStep,
  CareerStep,
  HabitsStep,
} from "./onboarding-steps";

export interface OnboardingStepProps {
  data: any;
  onDataChange: (newData: any) => void;
}

const STEPS = [
  {
    id: "profile",
    title: "About You",
    subtitle: "Tell us who you are",
    component: ProfileStep,
  },
  {
    id: "skills",
    title: "Skills & Goals",
    subtitle: "What do you want to learn?",
    component: SkillsStep,
  },
  {
    id: "career",
    title: "Career Direction",
    subtitle: "Where do you see yourself?",
    component: CareerStep,
  },
  {
    id: "habits",
    title: "Study Habits",
    subtitle: "How do you like to work?",
    component: HabitsStep,
  },
];

export function StudentOnboarding() {
  const router = useRouter();
  const { data: profile, isLoading } = useStudentProfile();
  const updateStep = useUpdateOnboardingStep();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  React.useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleDataChange = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const handleNext = async () => {
    const result = await updateStep.mutateAsync(formData);

    if (result.success) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        toast.success("You're all set! 🎉");
        router.push("/dashboard/students/home");
      }
    } else {
      toast.error("Failed to save progress");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep].component;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-8">
          <Skeleton className="mx-auto h-2 w-full rounded-full" />
          <div className="space-y-3 text-center">
            <Skeleton className="mx-auto h-7 w-40" />
            <Skeleton className="mx-auto h-5 w-56" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-11 w-24 rounded-xl" />
            <Skeleton className="h-11 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Progress bar */}
        <div className="mb-10 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step heading */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {STEPS[currentStep].title}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {STEPS[currentStep].subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="mb-8">
          <CurrentStepComponent
            data={formData}
            onDataChange={handleDataChange}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="lg"
            className={cn("rounded-xl", currentStep === 0 && "invisible")}
            onClick={handleBack}
            disabled={currentStep === 0 || updateStep.isPending}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>

          <Button
            size="lg"
            className="rounded-xl px-6"
            onClick={handleNext}
            disabled={updateStep.isPending}
          >
            {updateStep.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : currentStep === STEPS.length - 1 ? (
              <>
                Finish
                <Check className="ml-2 size-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </div>

        {/* Dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted-foreground/20",
              )}
              aria-label={`Go to ${step.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
