"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProfileLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
}

export function ProfileLayout({
    children,
    currentStep,
    totalSteps,
}: ProfileLayoutProps) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl space-y-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        <span>Profile Setup</span>
                        <span>
                            Step {currentStep} of {totalSteps}
                        </span>
                    </div>
                    <Progress value={progress} className="h-1" />
                </div>
                <div className="bg-card border rounded-lg p-8 shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface ProfileQuestionProps {
    question: string;
    description?: string;
    children: React.ReactNode;
}

export function ProfileQuestion({
    question,
    description,
    children,
}: ProfileQuestionProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">{question}</h2>
                {description && (
                    <p className="text-muted-foreground text-sm">{description}</p>
                )}
            </div>
            <div className="space-y-4 pt-2">
                {children}
            </div>
        </div>
    );
}
