"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRight, Check, ChevronLeft, Briefcase, GraduationCap, Star, Rocket } from "lucide-react";
import { completeInitialSetup } from "@/app/actions/student-profile-actions";
import { completeMentorInitialSetup } from "@/app/actions/mentor-profile-actions";
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

const EXPERIENCE_LEVELS = [
    { id: "none", label: "No Experience", description: "Just starting my journey" },
    { id: "projects", label: "Project Based", description: "Built some personal projects" },
    { id: "internship", label: "Internships", description: "Experienced professional setting" },
    { id: "pro", label: "Working Professional", description: "Currently employed or freelance" },
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
                setShowSuccess(true);
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
                                            <Label htmlFor="name" className="text-lg font-medium">What should we call you?</Label>
                                            <p className="text-sm text-muted-foreground mb-4">This name will be visible on your profile and dashboard.</p>
                                            <Input
                                                id="name"
                                                autoFocus
                                                required
                                                className="h-14 text-xl bg-background/50 border-white/10 focus:border-primary/50"
                                                value={role === 'student' ? formData.name : formData.fullName}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (role === 'student') setFormData({ ...formData, name: val });
                                                    else setFormData({ ...formData, fullName: val });
                                                }}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 1: Background (Role Specific) */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <Label className="text-xl font-medium block mb-4">
                                            {role === 'student' ? "Tell us about your education" : "Select your experience level"}
                                        </Label>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {role === 'student' ? (
                                                STUDENT_EDUCATION_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => setFormData({ ...formData, currentEducation: opt.label })}
                                                        className={cn(
                                                            "flex flex-col items-start text-left p-5 rounded-xl border transition-all duration-200 group",
                                                            formData.currentEducation === opt.label
                                                                ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                                                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                                        )}
                                                    >
                                                        <GraduationCap className={cn("h-6 w-6 mb-3 transition-colors", formData.currentEducation === opt.label ? "text-primary" : "text-muted-foreground")} />
                                                        <span className="font-semibold text-base mb-1">{opt.label}</span>
                                                        <span className="text-xs text-muted-foreground leading-relaxed">{opt.description}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                MENTOR_EXP_YEARS.map((years) => (
                                                    <button
                                                        key={years}
                                                        onClick={() => setFormData({ ...formData, yearsOfExperience: years })}
                                                        className={cn(
                                                            "flex items-center justify-between p-6 rounded-xl border transition-all duration-200",
                                                            formData.yearsOfExperience === years
                                                                ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                                                                : "border-white/10 bg-white/5 hover:border-white/20"
                                                        )}
                                                    >
                                                        <span className="font-semibold text-lg">{years}</span>
                                                        {formData.yearsOfExperience === years && <Check className="h-5 w-5 text-primary" />}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Experience / Current Status */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <Label className="text-xl font-medium block mb-4">
                                            {role === 'student' ? "Your current experience level" : "Your current role"}
                                        </Label>

                                        {role === 'student' ? (
                                            <div className="grid grid-cols-1 gap-4">
                                                {EXPERIENCE_LEVELS.map((lvl) => (
                                                    <button
                                                        key={lvl.id}
                                                        onClick={() => setFormData({ ...formData, experienceLevel: lvl.label })}
                                                        className={cn(
                                                            "flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 text-left",
                                                            formData.experienceLevel === lvl.label
                                                                ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                                                                : "border-white/10 bg-white/5 hover:border-white/20"
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
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <Label>Current Title</Label>
                                                    <Input
                                                        className="h-14 bg-background/50 border-white/10"
                                                        placeholder="e.g. Senior Software Engineer"
                                                        value={formData.currentRole}
                                                        onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label>Industry</Label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {["Technology", "Finance", "Healthcare", "Education", "Design", "Marketing"].map(ind => (
                                                            <button
                                                                key={ind}
                                                                onClick={() => setFormData({ ...formData, industry: ind })}
                                                                className={cn(
                                                                    "px-4 py-3 rounded-lg border text-sm transition-all",
                                                                    formData.industry === ind ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                                                                )}
                                                            >
                                                                {ind}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Skills Selection */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <Label className="text-xl font-medium">Identify your skill set</Label>
                                            <Badge variant="outline" className="text-primary border-primary/20">
                                                {formData.skills.length} Selected
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {SKILLS_LIST.map((skill) => (
                                                <button
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className={cn(
                                                        "px-4 py-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center gap-2",
                                                        formData.skills.includes(skill)
                                                            ? "border-primary bg-primary/20 text-primary shadow-lg shadow-primary/10"
                                                            : "border-white/5 bg-white/5 hover:border-white/20 text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <Star className={cn("h-4 w-4", formData.skills.includes(skill) ? "fill-primary" : "hidden")} />
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
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
