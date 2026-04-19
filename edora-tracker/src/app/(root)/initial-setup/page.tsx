"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRight, Check, ChevronLeft, Briefcase, GraduationCap, Star, Rocket, UploadCloud, FileText, Trash2 } from "lucide-react";
import { completeInitialSetup } from "@/app/actions/student-profile-actions";
import { completeMentorInitialSetup, submitForVerification } from "@/app/actions/mentor-profile-actions";
import { completeProfessionalInitialSetup } from "@/app/actions/professional-profile-actions";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// @ts-ignore
const getRole = (session: any) => (session?.user as any)?.role;

const SKILLS_LIST = [
    "React", "Node.js", "Python", "TypeScript", "UI/UX Design",
    "Digital Marketing", "Project Management", "Data Science",
    "Machine Learning", "Public Speaking", "Writing", "Graphic Design",
    "SEO", "Sales", "Customer Success", "DevOps", "Cybersecurity"
];

const STUDENT_EDUCATION_OPTIONS = [
    { id: "high_school", label: "High School Student", description: "Currently in 10th-12th grade" },
    { id: "undergrad", label: "Undergraduate", description: "Bachelors degree in progress" },
    { id: "grad", label: "Graduate/Post-Grad", description: "Masters or higher in progress" },
    { id: "self_taught", label: "Self-Learner", description: "Learning outside formal education" },
];

const SKILL_LEVELS = [
    { id: "beginner", label: "Beginner", description: "Just starting out, learning the fundamentals." },
    { id: "intermediate", label: "Intermediate", description: "Have some experience, building projects." },
    { id: "pro", label: "Pro", description: "Advanced skills, ready for professional work." },
];

const MENTOR_EXP_YEARS = ["0-2 years", "3-5 years", "5-10 years", "10+ years"];

export default function InitialSetupPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState<any>({
        // Shared
        name: "",
        fullName: "",
        location: "",
        bio: "",
        skills: [] as string[],
        skillLevel: "",
        resumeFile: null as File | null,

        // Student specific
        currentEducation: "",
        experienceLevel: "",
        studyGoal: "",

        // Mentor/Pro specific
        yearsOfExperience: "",
        currentRole: "",
        industry: "",
    });

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in");
        }
        if (session?.user) {
            setFormData((prev: any) => ({
                ...prev,
                name: session.user.name || "",
                fullName: session.user.name || "",
                email: session.user.email || "",
            }));
        }
    }, [session, isPending, router]);

    const handleNext = () => {
        if (step === 0 && !formData.name && !formData.fullName) {
            toast.error("Please enter your name");
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(Math.max(0, step - 1));
    };

    const toggleSkill = (skill: string) => {
        setFormData((prev: any) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s: string) => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            let result;
            const role = getRole(session);

            if (role === "student") {
                result = await completeInitialSetup({
                    name: formData.name,
                    currentEducation: formData.currentEducation,
                    studyGoal: formData.studyGoal || "General Improvement",
                    experienceLevel: formData.experienceLevel,
                    programmingLanguages: formData.skills.filter((s: string) => ["Python", "JavaScript", "TypeScript", "Node.js"].includes(s)),
                    computerSkills: formData.skills,
                    jobTypePreference: "Any",
                });
            } else if (role === "mentor") {
                result = await completeMentorInitialSetup({
                    fullName: formData.fullName,
                    location: formData.location || "Remote",
                    bio: formData.bio || `Experienced ${formData.currentRole} in ${formData.industry}`,
                    yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
                    industry: formData.industry,
                    expertise: formData.skills,
                    currentRole: formData.currentRole,
                });
            } else if (role === "professional") {
                result = await completeProfessionalInitialSetup({
                    fullName: formData.fullName,
                    location: formData.location || "Remote",
                    bio: formData.bio || `Professional ${formData.currentRole} focusing on ${formData.industry}`,
                    yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
                    industry: formData.industry,
                    expertise: formData.skills,
                    currentRole: formData.currentRole,
                });
            }

            if (result?.success) {
                toast.success("Profile saved!");
                if (role === "mentor") {
                    // Trigger verification email to admin and redirect to pending screen
                    await submitForVerification();
                    router.push("/mentor-pending");
                } else {
                    setShowSuccess(true);
                }
            } else {
                toast.error(result?.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to save. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Initializing your experience...</p>
            </div>
        );
    }

    if (showSuccess) {
        const currentRole = getRole(session);
        const roleHome = currentRole === "student"
            ? "/dashboard/students/home"
            : currentRole === "mentor"
                ? "/dashboard/mentor/home"
                : "/dashboard/professionals/home";

        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-card/50 backdrop-blur-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                                <Rocket className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold tracking-tight">You&apos;re All Set!</CardTitle>
                            <CardDescription className="text-base">
                                Your profile has been created. Ready to explore Edora?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <Button
                                className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20"
                                onClick={() => router.push(roleHome)}
                            >
                                Enter Dashboard
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const totalSteps = 4;
    const progress = (step / (totalSteps - 1)) * 100;
    const role = getRole(session);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505] overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="mb-8 space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Step {step + 1} of {totalSteps}</p>
                            <h2 className="text-2xl font-bold">Personalize your journey</h2>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-primary/10 shadow-2xl bg-card/30 backdrop-blur-xl">
                            <CardContent className="pt-8 pb-8 px-6 sm:px-10">

                                {/* Step 0: Basic Info */}
                                {step === 0 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xl font-medium block">What should we call you?</Label>
                                            <p className="text-sm text-muted-foreground mb-4">This name will be visible on your profile and dashboard.</p>
                                            <Input
                                                id="name"
                                                autoFocus
                                                required
                                                className="h-14 text-xl bg-background/50 border-white/10 focus:border-primary/50"
                                                value={formData.fullName || formData.name}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData({ ...formData, name: val, fullName: val });
                                                }}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 1: Current Profession */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="profession" className="text-xl font-medium block">What is your current profession?</Label>
                                            <p className="text-sm text-muted-foreground mb-4">E.g. Computer Science Student, Frontend Developer, Product Manager</p>
                                            <Input
                                                id="profession"
                                                autoFocus
                                                required
                                                className="h-14 text-xl bg-background/50 border-white/10 focus:border-primary/50"
                                                value={formData.currentRole || formData.currentEducation}
                                                onChange={(e) => setFormData({ ...formData, currentRole: e.target.value, currentEducation: e.target.value })}
                                                placeholder="Enter your profession or major"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Skill Level */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <Label className="text-xl font-medium block mb-4">Select your skill level</Label>
                                        <div className="grid grid-cols-1 gap-4">
                                            {SKILL_LEVELS.map((lvl) => (
                                                <button
                                                    key={lvl.id}
                                                    onClick={() => setFormData({ ...formData, experienceLevel: lvl.label })}
                                                    className={cn(
                                                        "flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 text-left",
                                                        formData.experienceLevel === lvl.label
                                                            ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                                                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                                    )}
                                                >
                                                    <div className={cn("p-3 rounded-lg bg-background", formData.experienceLevel === lvl.label ? "text-primary" : "text-muted-foreground")}>
                                                        <Briefcase className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold flex items-center gap-2">
                                                            {lvl.label}
                                                            {formData.experienceLevel === lvl.label && <Check className="h-4 w-4 text-primary" />}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{lvl.description}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Resume Upload */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <Label className="text-xl font-medium block">Upload your resume (Optional)</Label>
                                            <p className="text-sm text-muted-foreground mt-1">You can always update this later in settings.</p>
                                        </div>
                                        
                                        {formData.resumeFile ? (
                                            <div className="flex items-center justify-between p-4 border border-primary/20 bg-primary/5 rounded-xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-primary/10 rounded-lg">
                                                        <FileText className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium line-clamp-1">{formData.resumeFile.name}</p>
                                                        <p className="text-xs text-muted-foreground">{(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => setFormData({...formData, resumeFile: null})} className="text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <label htmlFor="resume-upload" className="border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors bg-white/5 hover:bg-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer group">
                                                <div className="p-4 bg-white/5 group-hover:bg-primary/10 rounded-full transition-colors">
                                                    <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-muted-foreground">PDF, DOCX up to 5MB</p>
                                                </div>
                                                <Input 
                                                    id="resume-upload" 
                                                    type="file" 
                                                    accept=".pdf,.doc,.docx" 
                                                    className="hidden" 
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setFormData({...formData, resumeFile: e.target.files[0]});
                                                        }
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}

                                <div className="mt-12 flex justify-between items-center bg-muted/20 p-4 rounded-2xl ring-1 ring-white/5">
                                    <Button
                                        variant="ghost"
                                        onClick={handleBack}
                                        disabled={step === 0 || loading}
                                        className="h-12 px-6 hover:bg-white/5"
                                    >
                                        <ChevronLeft className="mr-2 h-5 w-5" />
                                        Back
                                    </Button>

                                    {step < totalSteps - 1 ? (
                                        <Button
                                            onClick={handleNext}
                                            className="h-12 px-8 font-semibold shadow-lg shadow-primary/20"
                                        >
                                            Continue
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="h-12 px-8 font-semibold shadow-lg shadow-primary/20"
                                        >
                                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete My Profile"}
                                            {!loading && <Check className="ml-2 h-5 w-5" />}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
