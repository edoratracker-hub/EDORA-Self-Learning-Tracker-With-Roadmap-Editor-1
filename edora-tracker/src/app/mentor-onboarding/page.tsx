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
    GraduationCap,
} from "lucide-react";
import {
    useMentorProfile,
    useUpdateMentorOnboardingStep,
    useSubmitForVerification,
} from "@/app/hooks/use-mentor-profile";
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
                    Full Name
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
                        Professional Email
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
                    Location
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
                    Professional Bio
                </Label>
                <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your experience, and what drives you..."
                    value={data.bio || ""}
                    onChange={(e) => onDataChange({ bio: e.target.value })}
                    rows={4}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    This will be visible to students looking for mentors
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
                        Job Title
                    </Label>
                    <Input
                        id="title"
                        placeholder="e.g., Senior Software Engineer"
                        value={data.title || ""}
                        onChange={(e) => onDataChange({ title: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="company">
                        Company / Organization
                    </Label>
                    <Input
                        id="company"
                        placeholder="e.g., Google, Microsoft, Self-employed"
                        value={data.company || ""}
                        onChange={(e) => onDataChange({ company: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="currentRole">Current Role</Label>
                    <Input
                        id="currentRole"
                        placeholder="e.g., Tech Lead, Principal Consultant"
                        value={data.currentRole || ""}
                        onChange={(e) => onDataChange({ currentRole: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">
                        Years of Experience
                    </Label>
                    <Input
                        id="yearsOfExperience"
                        type="number"
                        min="0"
                        max="50"
                        placeholder="e.g., 8"
                        value={data.yearsOfExperience || ""}
                        onChange={(e) => onDataChange({ yearsOfExperience: parseInt(e.target.value) || 0 })}
                        required
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label>Industry</Label>
                <RadioGroup
                    value={data.industry || ""}
                    onValueChange={(value) => onDataChange({ industry: value })}
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {["Technology", "Finance", "Healthcare", "Education", "E-commerce", "Media", "Consulting", "Manufacturing", "Other"].map((ind) => (
                            <div key={ind} className="flex items-center space-x-2">
                                <RadioGroupItem value={ind.toLowerCase()} id={`industry-${ind.toLowerCase()}`} />
                                <Label htmlFor={`industry-${ind.toLowerCase()}`} className="font-normal cursor-pointer">{ind}</Label>
                            </div>
                        ))}
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label htmlFor="previousRoles">Previous Roles</Label>
                <Input
                    id="previousRoles"
                    placeholder="SDE-2 at Flipkart, Intern at TCS (comma separated)"
                    value={data.previousRoles?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        previousRoles: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
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
                <Label>Highest Degree</Label>
                <RadioGroup
                    value={data.highestDegree || ""}
                    onValueChange={(value) => onDataChange({ highestDegree: value })}
                >
                    {["PhD / Doctorate", "Master's Degree", "Bachelor's Degree", "Diploma", "Self-taught / No Formal Degree"].map((deg) => (
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
                        placeholder="e.g., IIT Delhi, Stanford University"
                        value={data.university || ""}
                        onChange={(e) => onDataChange({ university: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                        id="fieldOfStudy"
                        placeholder="e.g., Computer Science, MBA"
                        value={data.fieldOfStudy || ""}
                        onChange={(e) => onDataChange({ fieldOfStudy: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="certifications">Professional Certifications</Label>
                <Textarea
                    id="certifications"
                    placeholder="AWS Solutions Architect, PMP, Google Cloud Professional (comma separated)"
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

function ExpertiseSkillsStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="expertise">
                    Core Areas of Expertise
                </Label>
                <Input
                    id="expertise"
                    placeholder="Web Development, System Design, Cloud Architecture (comma separated)"
                    value={data.expertise?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        expertise: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="technicalSkills">Technical Skills</Label>
                <Input
                    id="technicalSkills"
                    placeholder="JavaScript, Python, React, Docker, AWS (comma separated)"
                    value={data.technicalSkills?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        technicalSkills: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="softSkills">Soft Skills</Label>
                <Input
                    id="softSkills"
                    placeholder="Leadership, Communication, Problem-solving (comma separated)"
                    value={data.softSkills?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        softSkills: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="toolsAndTechnologies">Tools & Technologies</Label>
                <Input
                    id="toolsAndTechnologies"
                    placeholder="VS Code, Git, Jira, Figma (comma separated)"
                    value={data.toolsAndTechnologies?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        toolsAndTechnologies: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                />
            </div>
        </div>
    );
}

function MentorshipDetailsStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="mentorshipTopics">
                    Mentorship Topics
                </Label>
                <Input
                    id="mentorshipTopics"
                    placeholder="Career guidance, Resume review, Interview prep (comma separated)"
                    value={data.mentorshipTopics?.join(", ") || ""}
                    onChange={(e) => onDataChange({
                        mentorshipTopics: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    })}
                    required
                />
            </div>

            <div className="space-y-3">
                <Label>Mentorship Style</Label>
                <RadioGroup
                    value={data.mentorshipStyle || ""}
                    onValueChange={(value) => onDataChange({ mentorshipStyle: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hands-on" id="hands-on" />
                        <Label htmlFor="hands-on" className="font-normal cursor-pointer">Hands-on (pair programming, live coding)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advisory" id="advisory" />
                        <Label htmlFor="advisory" className="font-normal cursor-pointer">Advisory (guidance, feedback)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="coaching" id="coaching" />
                        <Label htmlFor="coaching" className="font-normal cursor-pointer">Coaching (structured learning plans)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="career-guidance" id="career-guidance" />
                        <Label htmlFor="career-guidance" className="font-normal cursor-pointer">Career Guidance (industry insights)</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label>Preferred Mentee Level</Label>
                <RadioGroup
                    value={data.preferredMenteeLevel || ""}
                    onValueChange={(value) => onDataChange({ preferredMenteeLevel: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner" className="font-normal cursor-pointer">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate" className="font-normal cursor-pointer">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced" className="font-normal cursor-pointer">Advanced</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="any-level" />
                        <Label htmlFor="any-level" className="font-normal cursor-pointer">Any level</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="maxMentees">Max Mentees at a time</Label>
                    <Input
                        id="maxMentees"
                        type="number"
                        min="1"
                        max="50"
                        placeholder="e.g., 5"
                        value={data.maxMentees || ""}
                        onChange={(e) => onDataChange({ maxMentees: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sessionDurationMinutes">Session Duration (min)</Label>
                    <Input
                        id="sessionDurationMinutes"
                        type="number"
                        min="15"
                        max="180"
                        step="15"
                        placeholder="e.g., 45"
                        value={data.sessionDurationMinutes || ""}
                        onChange={(e) => onDataChange({ sessionDurationMinutes: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </div>
        </div>
    );
}

function MotivationGoalsStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="whyMentor">
                    Why do you want to be a mentor?
                </Label>
                <Textarea
                    id="whyMentor"
                    placeholder="Share your motivation for mentoring. What drives you to help others grow?"
                    value={data.whyMentor || ""}
                    onChange={(e) => onDataChange({ whyMentor: e.target.value })}
                    rows={4}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    This is reviewed by our team during the verification process
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="mentorshipGoals">What do you hope to achieve as a mentor?</Label>
                <Textarea
                    id="mentorshipGoals"
                    placeholder="e.g., Help 10 students land their first tech job..."
                    value={data.mentorshipGoals || ""}
                    onChange={(e) => onDataChange({ mentorshipGoals: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="teachingApproach">How do you approach teaching?</Label>
                <Textarea
                    id="teachingApproach"
                    placeholder="Describe your teaching philosophy and style..."
                    value={data.teachingApproach || ""}
                    onChange={(e) => onDataChange({ teachingApproach: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile (recommended)</Label>
                <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={data.linkedinUrl || ""}
                    onChange={(e) => onDataChange({ linkedinUrl: e.target.value })}
                />
            </div>
        </div>
    );
}

// ===== STEPS CONFIG =====

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
        id: "motivation",
        title: "Motivation & Goals",
        description: "Why you want to mentor on Edora",
        component: MotivationGoalsStep,
        mandatory: true,
    },
];

// ===== MAIN PAGE =====

export default function MentorOnboardingPage() {
    const router = useRouter();
    const { data: profile, isLoading } = useMentorProfile();
    const updateStep = useUpdateMentorOnboardingStep();
    const submitVerification = useSubmitForVerification();

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

    React.useEffect(() => {
        if (profile) {
            setFormData(profile);

            // If already verified, allow access to dashboard (but also render this page if they navigated back)
            if (profile.isVerified) {
                // We don't force them out, but provide an exit
            }
            // If submitted/pending, check status
            if (profile.verificationStatus === "submitted") {
                router.push("/mentor-pending");
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
            router.push("/mentor-pending");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit for verification");
        }
    };

    const progress = showVerificationPrompt
        ? 100
        : ((currentStep + 1) / STEPS.length) * 100;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl space-y-6">
                    <Skeleton className="h-8 w-64 mx-auto" />
                    <Skeleton className="h-2 w-full" />
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-5 w-64 mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Verification submission screen
    if (showVerificationPrompt) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-lg space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto mb-3 bg-emerald-100 dark:bg-emerald-900/50 h-16 w-16 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h1 className="text-2xl font-bold">Ready for Verification</h1>
                        <p className="text-muted-foreground">
                            Your professional profile is complete! Submit it for admin review.
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    Our team reviews all mentor applications to ensure quality mentorship.
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
            </div>
        );
    }

    // Main onboarding steps
    const CurrentStepComponent = STEPS[currentStep].component;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-10 px-6">
            <div className="w-full max-w-2xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="mx-auto mb-2 bg-emerald-100 dark:bg-emerald-900/50 h-12 w-12 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Mentor Application</h1>
                    <p className="text-muted-foreground text-sm">
                        Complete your professional profile to apply as a mentor on Edora
                    </p>
                </div>

                <Separator className="bg-emerald-500/30" />

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Step {currentStep + 1} of {STEPS.length}
                        </span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-bold">
                                {currentStep + 1}
                            </span>
                            {STEPS[currentStep].title}
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
        </div>
    );
}
