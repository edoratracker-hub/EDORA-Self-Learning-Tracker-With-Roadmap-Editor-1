"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingStepProps } from "./student-onboarding";
import { cn } from "@/lib/utils";

// Minimal radio card option
function MinimalOption({
    value,
    currentValue,
    label,
}: {
    value: string;
    currentValue: string;
    label: string;
}) {
    const isSelected = currentValue === value;
    return (
        <Label
            htmlFor={value}
            className={cn(
                "flex items-center justify-center p-4 rounded-xl border transition-all cursor-pointer text-center font-medium",
                isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border/50 bg-transparent text-muted-foreground hover:bg-accent/50"
            )}
        >
            <RadioGroupItem value={value} id={value} className="sr-only" />
            {label}
        </Label>
    );
}

export function ProfileStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <Label className="text-sm font-medium">Full Name</Label>
                <Input
                    placeholder="Enter your name"
                    value={data.name || ""}
                    onChange={(e) => onDataChange({ name: e.target.value })}
                    className="h-12 bg-transparent text-base rounded-xl"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Current Education</Label>
                <Input
                    placeholder="e.g., B.Tech 2nd Year, 12th Grade"
                    value={data.currentEducation || ""}
                    onChange={(e) => onDataChange({ currentEducation: e.target.value })}
                    className="h-12 bg-transparent text-base rounded-xl"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Current Academic Score</Label>
                <Input
                    placeholder="e.g., 85%, 8.5 CGPA"
                    value={data.currentMarksOrCGPA || ""}
                    onChange={(e) => onDataChange({ currentMarksOrCGPA: e.target.value })}
                    className="h-12 bg-transparent text-base rounded-xl max-w-[200px]"
                />
            </div>
        </div>
    );
}

export function SkillsStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <Label className="text-sm font-medium">What is your main study goal right now?</Label>
                <Textarea
                    placeholder="Describe what you want to learn or achieve..."
                    value={data.studyGoal || ""}
                    onChange={(e) => onDataChange({ studyGoal: e.target.value })}
                    rows={3}
                    className="resize-none bg-transparent p-4 rounded-xl text-base"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Do you know any programming?</Label>
                <RadioGroup
                    value={data.knowsProgramming ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ knowsProgramming: value === "yes" })}
                    className="grid grid-cols-2 gap-3"
                >
                    <MinimalOption value="yes" currentValue={data.knowsProgramming ? "yes" : "no"} label="Yes, I do" />
                    <MinimalOption value="no" currentValue={data.knowsProgramming ? "yes" : "no"} label="Not yet" />
                </RadioGroup>
            </div>

            {data.knowsProgramming && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-sm font-medium text-muted-foreground">Which languages?</Label>
                    <Input
                        placeholder="e.g., Python, JavaScript, C++"
                        value={(data.programmingLanguages || []).join(", ")}
                        onChange={(e) => {
                            const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                            onDataChange({ programmingLanguages: arr });
                        }}
                        className="h-12 bg-transparent rounded-xl text-base"
                    />
                </div>
            )}
        </div>
    );
}

export function CareerStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <Label className="text-sm font-medium">What is your dream job or field of interest?</Label>
                <Input
                    placeholder="e.g., Software Engineer, Data Scientist, Doctor"
                    value={data.dreamJob || ""}
                    onChange={(e) => onDataChange({ dreamJob: e.target.value })}
                    className="h-12 bg-transparent text-base rounded-xl"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Preferred Sector</Label>
                <RadioGroup
                    value={data.jobTypePreference || ""}
                    onValueChange={(value) => onDataChange({ jobTypePreference: value })}
                    className="grid grid-cols-2 gap-3"
                >
                    <MinimalOption value="government" currentValue={data.jobTypePreference} label="Government" />
                    <MinimalOption value="private" currentValue={data.jobTypePreference} label="Private" />
                    <MinimalOption value="business" currentValue={data.jobTypePreference} label="Business" />
                    <MinimalOption value="freelancing" currentValue={data.jobTypePreference} label="Freelance" />
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Primary Motivation</Label>
                <RadioGroup
                    value={data.careerPriority || ""}
                    onValueChange={(value) => onDataChange({ careerPriority: value })}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                    <MinimalOption value="high-salary" currentValue={data.careerPriority} label="High Salary" />
                    <MinimalOption value="work-life-balance" currentValue={data.careerPriority} label="Work-life Balance" />
                    <MinimalOption value="passion-driven" currentValue={data.careerPriority} label="Passion & Impact" />
                </RadioGroup>
            </div>
        </div>
    );
}

export function HabitsStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <Label className="text-sm font-medium">Daily Study Target (Hours)</Label>
                <Input
                    type="number"
                    min="0"
                    max="24"
                    placeholder="e.g., 4"
                    value={data.dailyStudyHours || ""}
                    onChange={(e) => onDataChange({ dailyStudyHours: parseInt(e.target.value) || 0 })}
                    className="h-12 bg-transparent text-base rounded-xl max-w-[200px]"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">How do you learn best?</Label>
                <RadioGroup
                    value={data.learningStyle || ""}
                    onValueChange={(value) => onDataChange({ learningStyle: value })}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                    <MinimalOption value="reading" currentValue={data.learningStyle} label="Reading" />
                    <MinimalOption value="watching" currentValue={data.learningStyle} label="Watching" />
                    <MinimalOption value="doing" currentValue={data.learningStyle} label="Hands-on" />
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">What is your biggest distraction?</Label>
                <Input
                    placeholder="e.g., Phone notifications, Social Media"
                    value={data.mainDistractions || ""}
                    onChange={(e) => onDataChange({ mainDistractions: e.target.value })}
                    className="h-12 bg-transparent text-base rounded-xl"
                />
            </div>
        </div>
    );
}
