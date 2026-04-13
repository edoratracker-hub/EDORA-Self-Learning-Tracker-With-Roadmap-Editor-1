"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingStepProps } from "./student-onboarding";

export function BasicInfoStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={data.name || ""}
                    onChange={(e) => onDataChange({ name: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="currentEducation">
                    Current Education <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="currentEducation"
                    placeholder="e.g., 12th Grade, B.Tech 2nd Year, etc."
                    value={data.currentEducation || ""}
                    onChange={(e) => onDataChange({ currentEducation: e.target.value })}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Specify your class, year, or course
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="studyGoal">
                    What do you need to study? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                    id="studyGoal"
                    placeholder="Describe what you want to learn or achieve..."
                    value={data.studyGoal || ""}
                    onChange={(e) => onDataChange({ studyGoal: e.target.value })}
                    rows={4}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    This helps us create a personalized learning path for you
                </p>
            </div>
        </div>
    );
}
