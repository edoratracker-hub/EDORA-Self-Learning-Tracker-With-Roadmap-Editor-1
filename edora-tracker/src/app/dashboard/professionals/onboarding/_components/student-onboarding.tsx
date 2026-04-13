"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import {
  useUpdateOnboardingStep,
  useStudentProfile,
} from "@/app/hooks/use-student-profile";
import { toast } from "sonner";

import {
  StrengthWeaknessStep,
  CareerAwarenessStep,
  CareerInterestStep,
  AcademicStatusStep,
  SkillStatusStep,
  TimeHabitsStep,
  DreamVisionStep,
  MindsetCheckStep,
} from "./onboarding-steps";
import { BasicInfoStep } from "./basic-info-step";
import { SelfDiscoveryStep } from "./self-discovery-step";

export interface OnboardingStepProps {
  data: any;
  onDataChange: (newData: any) => void;
}

const STEPS = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Let's start with the essentials",
    component: BasicInfoStep,
    mandatory: true,
  },
  {
    id: "self-discovery",
    title: "Self-Discovery",
    description: "Who are you?",
    component: SelfDiscoveryStep,
  },
  {
    id: "strength-weakness",
    title: "Strengths & Weaknesses",
    description: "Know your abilities",
    component: StrengthWeaknessStep,
  },
  {
    id: "career-awareness",
    title: "Career Awareness",
    description: "Explore career options",
    component: CareerAwarenessStep,
  },
  {
    id: "career-interest",
    title: "Career Interest",
    description: "What drives you?",
    component: CareerInterestStep,
  },
  {
    id: "academic-status",
    title: "Academic Status",
    description: "Your educational journey",
    component: AcademicStatusStep,
  },
  {
    id: "skill-status",
    title: "Skill Status",
    description: "Technical abilities",
    component: SkillStatusStep,
  },
  {
    id: "time-habits",
    title: "Time & Habits",
    description: "Your daily routine",
    component: TimeHabitsStep,
  },
  {
    id: "dream-vision",
    title: "Dream & Vision",
    description: "Your future aspirations",
    component: DreamVisionStep,
  },
  {
    id: "mindset-check",
    title: "Mindset Check",
    description: "Your attitude towards learning",
    component: MindsetCheckStep,
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
    const currentStepConfig = STEPS[currentStep];

    // Save current step data
    const result = await updateStep.mutateAsync(formData);

    if (result.success) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Completed
        toast.success("Onboarding completed! 🎉");
        router.push("/dashboard/professionals/home");
      }
    } else {
      toast.error("Failed to save progress");
    }
  };

  const handleSkip = async () => {
    if (STEPS[currentStep].mandatory) {
      toast.error("This step is mandatory");
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard/professionals/home");
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
      <div className=" space-y-6">
        {/* Progress Skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        {/* Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-7 w-48" />
            </div>
            <Skeleton className="h-5 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Navigation Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Step Indicators Skeleton */}
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-2 w-2 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {profile?.completionPercentage
              ? "Profile Completion"
              : `Step ${currentStep + 1} of ${STEPS.length}`}
          </span>
          <span className="font-medium">
            {profile?.completionPercentage || Math.round(progress)}%
          </span>
        </div>
        <Progress
          value={profile?.completionPercentage || progress}
          className="h-2"
        />
      </div>

      {/* Step Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
              {currentStep + 1}
            </span>
            {STEPS[currentStep].title}
            {STEPS[currentStep].mandatory && (
              <span className="text-xs text-destructive">*Required</span>
            )}
          </CardTitle>
          <CardDescription>{STEPS[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            data={formData}
            onDataChange={handleDataChange}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          {!STEPS[currentStep].mandatory && (
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
          )}
          <Button onClick={handleNext} disabled={updateStep.isPending}>
            {currentStep === STEPS.length - 1 ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Complete
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-2 pt-4">
        {STEPS.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? "bg-primary w-8"
                : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted"
            }`}
            aria-label={`Go to ${step.title}`}
          />
        ))}
      </div>
    </div>
  );
}
