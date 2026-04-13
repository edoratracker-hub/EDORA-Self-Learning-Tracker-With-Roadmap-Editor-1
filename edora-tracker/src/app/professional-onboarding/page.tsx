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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Send,
    ShieldCheck,
    Info,
    Briefcase,
    Loader2
} from "lucide-react";
import {
    useProfessionalProfile,
    useUpdateProfessionalOnboardingStep,
    useSubmitProfessionalForVerification,
} from "@/app/hooks/use-professional-profile";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// ===== STEP COMPONENTS =====

interface OnboardingStepProps {
    data: any;
    onDataChange: (newData: any) => void;
}

function BasicInfoStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">
                    Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={data.fullName || ""}
                    onChange={(e) => onDataChange({ fullName: e.target.value })}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">
                        Professional Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={data.email || ""}
                        onChange={(e) => onDataChange({ email: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        placeholder="+91 9876543210"
                        value={data.phone || ""}
                        onChange={(e) => onDataChange({ phone: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">
                    Location <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="location"
                    placeholder="e.g., Mumbai, India"
                    value={data.location || ""}
                    onChange={(e) => onDataChange({ location: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">
                    Professional Summary <span className="text-destructive">*</span>
                </Label>
                <Textarea
                    id="bio"
                    placeholder="Describe your professional career, key achievements, and areas of expertise..."
                    value={data.bio || ""}
                    onChange={(e) => onDataChange({ bio: e.target.value })}
                    rows={4}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    This will be your primary profile bio for industry connections.
                </p>
            </div>
        </div>
    );
}

function ProfessionalBackgroundStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">
                        Current Job Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="title"
                        placeholder="e.g., Senior Product Manager"
                        value={data.title || ""}
                        onChange={(e) => onDataChange({ title: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="company">
                        Current Company <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="company"
                        placeholder="e.g., Google, Amazon, Startup Inc"
                        value={data.company || ""}
                        onChange={(e) => onDataChange({ company: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">
                        Total Years of Industry Experience <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="yearsOfExperience"
                        type="number"
                        min="0"
                        max="60"
                        placeholder="e.g., 10"
                        value={data.yearsOfExperience || ""}
                        onChange={(e) => onDataChange({ yearsOfExperience: parseInt(e.target.value) || 0 })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="industry">Core Industry</Label>
                    <Input
                        id="industry"
                        placeholder="e.g., Fintech, SaaS, HealthTech"
                        value={data.industry || ""}
                        onChange={(e) => onDataChange({ industry: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="previousRoles">Previous Notable Roles</Label>
                <Input
                    id="previousRoles"
                    placeholder="Lead Designer at Apple, Architect at Tesla (comma separated)"
                    value={data.previousRoles?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        previousRoles: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                />
            </div>
        </div>
    );
}

function ExpertiseSkillsStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="expertise">
                    Dominant Areas of Expertise <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="expertise"
                    placeholder="Product Strategy, GTM, Distributed Systems, UX Research (comma separated)"
                    value={data.expertise?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        expertise: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="technicalSkills">Hard Skills / Competencies</Label>
                <Input
                    id="technicalSkills"
                    placeholder="Agile, SQL, Python, Financial Modeling, Figma (comma separated)"
                    value={data.technicalSkills?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        technicalSkills: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="softSkills">Leadership & Soft Skills</Label>
                <Input
                    id="softSkills"
                    placeholder="Stakeholder Management, Public Speaking, Mentoring (comma separated)"
                    value={data.softSkills?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        softSkills: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="toolsAndTechnologies">Industry Standard Tools</Label>
                <Input
                    id="toolsAndTechnologies"
                    placeholder="Jira, Salesforce, Docker, Tableau, GCP (comma separated)"
                    value={data.toolsAndTechnologies?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        toolsAndTechnologies: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                />
            </div>
        </div>
    );
}

function EducationStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label>Highest Academic Qualification</Label>
                <RadioGroup
                    value={data.highestDegree || ""}
                    onValueChange={(value) => onDataChange({ highestDegree: value })}
                >
                    {["Executive Program / MBA", "PhD / Doctorate", "Master's Degree", "Bachelor's Degree", "Chartered Qualification (CFA, CA, etc)"].map((deg) => (
                        <div key={deg} className="flex items-center space-x-2">
                            <RadioGroupItem value={deg.toLowerCase()} id={`degree-${deg.toLowerCase().replace(/[^a-z]/g, "-")}`} />
                            <Label htmlFor={`degree-${deg.toLowerCase().replace(/[^a-z]/g, "-")}`} className="font-normal cursor-pointer">{deg}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="university">University / Institution</Label>
                    <Input
                        id="university"
                        placeholder="e.g., Harvard Business School, ISB"
                        value={data.university || ""}
                        onChange={(e) => onDataChange({ university: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                        id="fieldOfStudy"
                        placeholder="e.g., Strategic Management, CS"
                        value={data.fieldOfStudy || ""}
                        onChange={(e) => onDataChange({ fieldOfStudy: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="certifications">Active Professional Certifications</Label>
                <Textarea
                    id="certifications"
                    placeholder="PMP, AWS Professional, FINRA Series 7 (comma separated)"
                    value={data.certifications?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        certifications: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                    rows={3}
                />
            </div>
        </div>
    );
}

function LinksStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile <span className="text-destructive">*</span></Label>
                <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={data.linkedinUrl || ""}
                    onChange={(e) => onDataChange({ linkedinUrl: e.target.value })}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Professional Portfolio / Website</Label>
                <Input
                    id="portfolioUrl"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={data.portfolioUrl || ""}
                    onChange={(e) => onDataChange({ portfolioUrl: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Profile (optional)</Label>
                <Input
                    id="githubUrl"
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={data.githubUrl || ""}
                    onChange={(e) => onDataChange({ githubUrl: e.target.value })}
                />
            </div>
        </div>
    );
}

function MotivationGoalsStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="whyJoin">
                    Why do you want to join the Professional Network? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                    id="whyJoin"
                    placeholder="What value do you expect from the network, and how do you plan to contribute?"
                    value={data.whyJoin || ""}
                    onChange={(e) => onDataChange({ whyJoin: e.target.value })}
                    rows={4}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    This helps our admins understand your professional intent.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="goals">What are your primary career goals?</Label>
                <Textarea
                    id="goals"
                    placeholder="e.g., Transitioning to C-suite, starting a venture, expanding industry network..."
                    value={data.goals || ""}
                    onChange={(e) => onDataChange({ goals: e.target.value })}
                    rows={3}
                />
            </div>
        </div>
    );
}

// ===== STEPS CONFIG =====

const STEPS = [
    {
        id: "basic",
        title: "Identify Yourself",
        description: "Your official professional record",
        component: BasicInfoStep,
        mandatory: true,
    },
    {
        id: "background",
        title: "Industry Experience",
        description: "Your career tenure and current standing",
        component: ProfessionalBackgroundStep,
        mandatory: true,
    },
    {
        id: "expertise",
        title: "Areas of Impact",
        description: "Where you excel in the industry",
        component: ExpertiseSkillsStep,
        mandatory: true,
    },
    {
        id: "education",
        title: "Qualifications",
        description: "Academic and professional credentials",
        component: EducationStep,
    },
    {
        id: "links",
        title: "Professional Footprint",
        description: "Where else we can find you",
        component: LinksStep,
        mandatory: true,
    },
    {
        id: "motivation",
        title: "Network Intent",
        description: "Your goals within Edora",
        component: MotivationGoalsStep,
        mandatory: true,
    },
];

// ===== MAIN PAGE =====

export default function ProfessionalOnboardingPage() {
    const router = useRouter();
    const { data: profile, isLoading } = useProfessionalProfile();
    const updateStep = useUpdateProfessionalOnboardingStep();
    const submitVerification = useSubmitProfessionalForVerification();

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

    React.useEffect(() => {
        if (profile) {
            setFormData(profile);
            if (profile.verificationStatus === "submitted") {
                router.push("/professional-pending");
            }
        }
    }, [profile, router]);

    const handleDataChange = (newData: any) => {
        setFormData((prev: any) => ({ ...prev, ...newData }));
    };

    const handleNext = async () => {
        const result = await updateStep.mutateAsync(formData);

        if (result.success) {
            if (currentStep < STEPS.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                setShowVerificationPrompt(true);
            }
        } else {
            toast.error("Failed to save progress");
        }
    };

    const handleSkip = async () => {
        if (STEPS[currentStep].mandatory) {
            toast.error("This step is mandatory for professionals");
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
            toast.success(result.message || "Professional application submitted! 💼");
            router.push("/professional-pending");
        } catch (error: any) {
            toast.error(error.message || "Submission failed");
        }
    };

    const progress = showVerificationPrompt
        ? 100
        : ((currentStep + 1) / STEPS.length) * 100;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your profile...</p>
            </div>
        );
    }

    if (showVerificationPrompt) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-lg space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto mb-3 bg-blue-100 dark:bg-blue-900/50 h-16 w-16 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-blue-700">Verification Required</h1>
                        <p className="text-muted-foreground italic">
                            Elevate your status to Industry Professional
                        </p>
                    </div>

                    <Card className="border-blue-200 shadow-lg">
                        <CardContent className="pt-6 space-y-4">
                            <Alert className="bg-blue-50 border-blue-200">
                                <Info className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800 text-sm">
                                    Admin verification ensures valid industry experts join our network.
                                    Approval usually takes <strong>24-48 hours</strong>.
                                </AlertDescription>
                            </Alert>

                            <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2">The Approval Path:</h4>
                                <ul className="text-xs text-muted-foreground space-y-2">
                                    <li>• Submission of verified professional records</li>
                                    <li>• Credential review by Edora Administrators</li>
                                    <li>• Approval notification and full dashboard unlock</li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <Button
                                    size="lg"
                                    className="w-full bg-blue-700 hover:bg-blue-800"
                                    onClick={handleSubmitForVerification}
                                    disabled={submitVerification.isPending}
                                >
                                    {submitVerification.isPending ? "Submitting..." : "Submit Application"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="text-muted-foreground text-xs"
                                >
                                    Review Answers
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-10 px-6 font-sans">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="mx-auto mb-2 bg-blue-50 dark:bg-blue-900/40 h-14 w-14 rounded-full flex items-center justify-center border border-blue-200 shadow-sm">
                        <Briefcase className="h-7 w-7 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase font-mono">
                        Professional Onboarding
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Your professional status grants you access to industry-grade monitoring, career roadmaps, and more.
                    </p>
                </div>

                <Separator className="bg-blue-400/20" />

                {/* Progress */}
                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        <span>Section {currentStep + 1} / {STEPS.length}</span>
                        <span>Progress: {Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-blue-100" />
                </div>

                {/* Step Card */}
                <Card className="border-border/60 shadow-md">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 rounded bg-blue-600 text-white text-xs font-mono">
                                {currentStep + 1}
                            </span>
                            {STEPS[currentStep].title}
                            {STEPS[currentStep].mandatory && (
                                <span className="ml-auto text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Required</span>
                            )}
                        </CardTitle>
                        <CardDescription className="text-xs">{STEPS[currentStep].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        {(() => {
                            const CurrentStepComponent = STEPS[currentStep].component;
                            return (
                                <CurrentStepComponent
                                    data={formData}
                                    onDataChange={handleDataChange}
                                />
                            );
                        })()}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-2">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <div className="flex gap-3">
                        {!STEPS[currentStep].mandatory && (
                            <Button variant="outline" onClick={handleSkip} className="px-6 font-mono text-[10px] uppercase">
                                Skip Section
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            disabled={updateStep.isPending}
                            className="bg-blue-700 hover:bg-blue-800 px-8 font-mono text-[10px] uppercase tracking-widest h-11"
                        >
                            {currentStep === STEPS.length - 1 ? (
                                <>
                                    Finalize <Check className="h-4 w-4 ml-2" />
                                </>
                            ) : (
                                <>
                                    Next Section <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Footer Page Dots */}
                <div className="flex justify-center gap-2">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i === currentStep ? "w-6 bg-blue-600" : "bg-muted hover:bg-muted-foreground/30 cursor-pointer"
                                }`}
                            onClick={() => setCurrentStep(i)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

