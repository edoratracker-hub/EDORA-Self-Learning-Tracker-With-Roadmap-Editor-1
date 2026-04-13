"use client";

import React, { useState, useEffect } from "react";
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

import {
    ArrowRight,
    ArrowLeft,
    Check,
    Briefcase,
    Loader2
} from "lucide-react";
import {
    useProfessionalProfile,
    useUpdateProfessionalOnboardingStep,
} from "@/app/hooks/use-professional-profile";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// ===== STEP COMPONENTS =====

interface OnboardingStepProps {
    data: any;
    onDataChange: (newData: any) => void;
}

// Keeps raw string while typing; converts to array only on blur
function CommaSeparatedInput({
    id,
    placeholder,
    value,
    onChange,
    textarea = false,
    rows,
    required,
}: {
    id: string;
    placeholder: string;
    value: string[];
    onChange: (arr: string[]) => void;
    textarea?: boolean;
    rows?: number;
    required?: boolean;
}) {
    const [raw, setRaw] = useState(value.join(", "));

    // Sync if parent resets (e.g. profile load)
    useEffect(() => {
        setRaw(value.join(", "));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.join(",")]);

    const handleBlur = () => {
        const arr = raw.split(",").map((s) => s.trim()).filter(Boolean);
        onChange(arr);
        setRaw(arr.join(", "));
    };

    const props = {
        id,
        placeholder,
        value: raw,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setRaw(e.target.value),
        onBlur: handleBlur,
        required,
    };

    if (textarea) {
        const { onChange: _, ...rest } = props as any;
        return (
            <textarea
                {...rest}
                rows={rows ?? 3}
                onChange={(e) => setRaw(e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
        );
    }

    return (
        <input
            {...props}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
    );
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
                <CommaSeparatedInput
                    id="previousRoles"
                    placeholder="Lead Designer at Apple, Architect at Tesla (comma separated)"
                    value={data.previousRoles || []}
                    onChange={(arr) => onDataChange({ previousRoles: arr })}
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
                <CommaSeparatedInput
                    id="expertise"
                    placeholder="Product Strategy, GTM, Distributed Systems, UX Research (comma separated)"
                    value={data.expertise || []}
                    onChange={(arr) => onDataChange({ expertise: arr })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="technicalSkills">Hard Skills / Competencies</Label>
                <CommaSeparatedInput
                    id="technicalSkills"
                    placeholder="Agile, SQL, Python, Financial Modeling, Figma (comma separated)"
                    value={data.technicalSkills || []}
                    onChange={(arr) => onDataChange({ technicalSkills: arr })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="softSkills">Leadership & Soft Skills</Label>
                <CommaSeparatedInput
                    id="softSkills"
                    placeholder="Stakeholder Management, Public Speaking, Mentoring (comma separated)"
                    value={data.softSkills || []}
                    onChange={(arr) => onDataChange({ softSkills: arr })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="toolsAndTechnologies">Industry Standard Tools</Label>
                <CommaSeparatedInput
                    id="toolsAndTechnologies"
                    placeholder="Jira, Salesforce, Docker, Tableau, GCP (comma separated)"
                    value={data.toolsAndTechnologies || []}
                    onChange={(arr) => onDataChange({ toolsAndTechnologies: arr })}
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
                <CommaSeparatedInput
                    id="certifications"
                    placeholder="PMP, AWS Professional, FINRA Series 7 (comma separated)"
                    value={data.certifications || []}
                    onChange={(arr) => onDataChange({ certifications: arr })}
                    textarea
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

// ===== MAIN COMPONENT =====

export function ProfessionalOnboarding() {
    const router = useRouter();
    const { data: profile, isLoading } = useProfessionalProfile();
    const updateStep = useUpdateProfessionalOnboardingStep();

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
                toast.success("Profile saved! Welcome to Edora. 🎉");
                router.push("/dashboard/professionals/home");
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
            toast.success("Profile saved! Welcome to Edora. 🎉");
            router.push("/dashboard/professionals/home");
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const progress = ((currentStep + 1) / STEPS.length) * 100;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your profile...</p>
            </div>
        );
    }


    return (
        <div className="flex flex-col items-center py-5 px-0 font-sans">
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
