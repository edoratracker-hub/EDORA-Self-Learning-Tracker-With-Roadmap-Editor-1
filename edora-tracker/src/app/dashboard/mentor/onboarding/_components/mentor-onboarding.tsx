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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Send,
    ShieldCheck,
    SkipForward,
    Info,
} from "lucide-react";
import {
    useMentorProfile,
    useUpdateMentorOnboardingStep,
    useSubmitForVerification,
    useSkipProfessionalQuestions,
} from "@/app/hooks/use-mentor-profile";
import { toast } from "sonner";

import {
    ProfessionalBackgroundStep,
    EducationStep,
    ExpertiseSkillsStep,
    MentorshipDetailsStep,
    ProfessionalLinksStep,
    MotivationGoalsStep,
} from "./onboarding-steps";
import { BasicInfoStep } from "./basic-info-step";

export interface OnboardingStepProps {
    data: any;
    onDataChange: (newData: any) => void;
}

const STEPS = [
    {
        id: "basic",
        title: "Basic Information",
        description: "Let's start with who you are",
        component: BasicInfoStep,
        mandatory: true,
    },
    {
        id: "professional-background",
        title: "Professional Background",
        description: "Tell us about your career journey",
        component: ProfessionalBackgroundStep,
        mandatory: true,
    },
    {
        id: "education",
        title: "Education & Qualifications",
        description: "Your academic credentials",
        component: EducationStep,
    },
    {
        id: "expertise",
        title: "Expertise & Skills",
        description: "What you bring to the table",
        component: ExpertiseSkillsStep,
        mandatory: true,
    },
    {
        id: "mentorship-details",
        title: "Mentorship Details",
        description: "How you want to mentor",
        component: MentorshipDetailsStep,
        mandatory: true,
    },
    {
        id: "professional-links",
        title: "Professional Links",
        description: "Connect your online presence",
        component: ProfessionalLinksStep,
    },
    {
        id: "motivation",
        title: "Motivation & Goals",
        description: "Why you want to mentor on Edora",
        component: MotivationGoalsStep,
        mandatory: true,
    },
];

export function MentorOnboarding() {
    const router = useRouter();
    const { data: profile, isLoading } = useMentorProfile();
    const updateStep = useUpdateMentorOnboardingStep();
    const submitVerification = useSubmitForVerification();
    const skipQuestions = useSkipProfessionalQuestions();

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

    React.useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleDataChange = (newData: any) => {
        setFormData((prev: any) => ({ ...prev, ...newData }));
    };

    const handleNext = async () => {
        // Save current step data
        const result = await updateStep.mutateAsync(formData);

        if (result.success) {
            if (currentStep < STEPS.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                // All steps completed — show verification prompt
                setShowVerificationPrompt(true);
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
            setShowVerificationPrompt(true);
        }
    };

    const handleBack = () => {
        if (showVerificationPrompt) {
            setShowVerificationPrompt(false);
            return;
        }
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmitForVerification = async () => {
        try {
            const result = await submitVerification.mutateAsync();
            toast.success(result.message || "Verification submitted! 🎉");
            router.push("/dashboard/mentor/pending-approval");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit for verification");
        }
    };

    const handleSkipAll = async () => {
        try {
            const result = await skipQuestions.mutateAsync();
            toast.info(result.message || "Skipped! You can complete your profile later.");
            router.push("/dashboard/mentor/home");
        } catch (error: any) {
            toast.error(error.message || "Failed to skip");
        }
    };

    const progress = showVerificationPrompt
        ? 100
        : ((currentStep + 1) / STEPS.length) * 100;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                </div>

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

                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        );
    }

    // Verification prompt after completing all steps
    if (showVerificationPrompt) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Profile Complete</span>
                        <span className="font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                </div>

                <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10 dark:border-emerald-800">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-3 bg-emerald-100 dark:bg-emerald-900/50 h-16 w-16 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <CardTitle className="text-2xl">Ready for Verification</CardTitle>
                        <CardDescription className="text-base">
                            Your professional profile is complete! Submit it for admin review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                Our team carefully reviews all mentor applications to ensure quality mentorship.
                                This typically takes <strong>1-2 business days</strong>. You'll receive an email once approved.
                            </AlertDescription>
                        </Alert>

                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <h4 className="font-medium text-sm">What happens next?</h4>
                            <ul className="text-sm text-muted-foreground space-y-1.5">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">1.</span>
                                    Your application is sent to our admin for review
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">2.</span>
                                    Admin verifies your credentials and experience
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">3.</span>
                                    You receive an approval email notification
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">4.</span>
                                    Full mentor dashboard access is unlocked!
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                size="lg"
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                onClick={handleSubmitForVerification}
                                disabled={submitVerification.isPending}
                            >
                                {submitVerification.isPending ? (
                                    "Submitting..."
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Submit for Verification
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                                onClick={handleBack}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Go back and edit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const CurrentStepComponent = STEPS[currentStep].component;

    return (
        <div className="space-y-6">
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
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-bold">
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
                    {currentStep === 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={handleSkipAll}
                            disabled={skipQuestions.isPending}
                        >
                            <SkipForward className="h-4 w-4 mr-1" />
                            Skip All
                        </Button>
                    )}
                    {!STEPS[currentStep].mandatory && (
                        <Button variant="ghost" onClick={handleSkip}>
                            Skip
                        </Button>
                    )}
                    <Button
                        onClick={handleNext}
                        disabled={updateStep.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
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
                        className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                            ? "bg-emerald-500 w-8"
                            : index < currentStep
                                ? "bg-emerald-500/50"
                                : "bg-muted"
                            }`}
                        aria-label={`Go to ${step.title}`}
                    />
                ))}
            </div>
        </div>
    );
}
