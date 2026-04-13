"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingStepProps } from "./student-onboarding";

export function StrengthWeaknessStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Which subjects are you naturally good at?</Label>
                <Input
                    placeholder="Math, Physics, English (comma separated)"
                    value={data.goodAtSubjects?.join(", ") || ""}
                    onChange={(e) => onDataChange({ goodAtSubjects: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                />
            </div>

            <div className="space-y-2">
                <Label>Which subjects do you struggle with?</Label>
                <Input
                    placeholder="Chemistry, History (comma separated)"
                    value={data.struggleWithSubjects?.join(", ") || ""}
                    onChange={(e) => onDataChange({ struggleWithSubjects: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                />
            </div>

            <div className="space-y-3">
                <Label>How do you learn best?</Label>
                <RadioGroup value={data.learningStyle || ""} onValueChange={(value) => onDataChange({ learningStyle: value })}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reading" id="reading" />
                        <Label htmlFor="reading" className="font-normal cursor-pointer">Reading</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="watching" id="watching" />
                        <Label htmlFor="watching" className="font-normal cursor-pointer">Watching videos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="doing" id="doing" />
                        <Label htmlFor="doing" className="font-normal cursor-pointer">Hands-on practice</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label>Are you good at communication?</Label>
                <RadioGroup value={data.communicationSkills || ""} onValueChange={(value) => onDataChange({ communicationSkills: value })}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id="excellent" />
                        <Label htmlFor="excellent" className="font-normal cursor-pointer">Excellent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="good" />
                        <Label htmlFor="good" className="font-normal cursor-pointer">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="average" id="average" />
                        <Label htmlFor="average" className="font-normal cursor-pointer">Average</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="needs-improvement" id="needs-improvement" />
                        <Label htmlFor="needs-improvement" className="font-normal cursor-pointer">Needs improvement</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label>Are you better at logical thinking or memorization?</Label>
                <RadioGroup value={data.thinkingStyle || ""} onValueChange={(value) => onDataChange({ thinkingStyle: value })}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="logical-thinking" id="logical-thinking" />
                        <Label htmlFor="logical-thinking" className="font-normal cursor-pointer">Logical thinking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="memorization" id="memorization" />
                        <Label htmlFor="memorization" className="font-normal cursor-pointer">Memorization</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="balanced" />
                        <Label htmlFor="balanced" className="font-normal cursor-pointer">Balanced</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}

export function CareerAwarenessStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>What careers do you know about?</Label>
                <Input
                    placeholder="Doctor, Engineer, Teacher (comma separated)"
                    value={data.knownCareers?.join(", ") || ""}
                    onChange={(e) => onDataChange({ knownCareers: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                />
            </div>

            <div className="space-y-3">
                <Label>Have you spoken to anyone working in a field you're interested in?</Label>
                <RadioGroup
                    value={data.hasSpokenToProfessionals ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ hasSpokenToProfessionals: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="spoken-yes" />
                        <Label htmlFor="spoken-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="spoken-no" />
                        <Label htmlFor="spoken-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label>Do you follow any career-related content (YouTube/blogs)?</Label>
                <RadioGroup
                    value={data.followsCareerContent ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ followsCareerContent: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="follows-yes" />
                        <Label htmlFor="follows-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="follows-no" />
                        <Label htmlFor="follows-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}

export function CareerInterestStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>What job would you love to do even if the salary was low?</Label>
                <Input
                    placeholder="Your dream job..."
                    value={data.dreamJob || ""}
                    onChange={(e) => onDataChange({ dreamJob: e.target.value })}
                />
            </div>

            <div className="space-y-3">
                <Label>Do you want a government job, private job, business, or freelancing?</Label>
                <RadioGroup value={data.jobTypePreference || ""} onValueChange={(value) => onDataChange({ jobTypePreference: value })}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="government" id="government" />
                        <Label htmlFor="government" className="font-normal cursor-pointer">Government job</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="font-normal cursor-pointer">Private job</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="font-normal cursor-pointer">Business</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="freelancing" id="freelancing" />
                        <Label htmlFor="freelancing" className="font-normal cursor-pointer">Freelancing</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label>Which field attracts you most?</Label>
                <Input
                    placeholder="IT, medical, commerce, arts, teaching, design, etc."
                    value={data.fieldOfInterest || ""}
                    onChange={(e) => onDataChange({ fieldOfInterest: e.target.value })}
                />
            </div>

            <div className="space-y-3">
                <Label>Do you want to work in India or abroad?</Label>
                <RadioGroup value={data.workLocationPreference || ""} onValueChange={(value) => onDataChange({ workLocationPreference: value })}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="india" id="india" />
                        <Label htmlFor="india" className="font-normal cursor-pointer">India</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="abroad" id="abroad" />
                        <Label htmlFor="abroad" className="font-normal cursor-pointer">Abroad</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="flexible" />
                        <Label htmlFor="flexible" className="font-normal cursor-pointer">Flexible</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}

export function AcademicStatusStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>What marks/CGPA do you have?</Label>
                <Input
                    placeholder="85%, 8.5 CGPA, etc."
                    value={data.currentMarksOrCGPA || ""}
                    onChange={(e) => onDataChange({ currentMarksOrCGPA: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Are you preparing for any entrance exams?</Label>
                <Input
                    placeholder="JEE, NEET, GATE, etc."
                    value={data.preparingForExams || ""}
                    onChange={(e) => onDataChange({ preparingForExams: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Have you completed any certifications or extra courses?</Label>
                <Input
                    placeholder="Python, Web Development (comma separated)"
                    value={data.completedCertifications?.join(", ") || ""}
                    onChange={(e) => onDataChange({ completedCertifications: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                />
            </div>
        </div>
    );
}

export function SkillStatusStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label>Do you know programming?</Label>
                <RadioGroup
                    value={data.knowsProgramming ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ knowsProgramming: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="prog-yes" />
                        <Label htmlFor="prog-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="prog-no" />
                        <Label htmlFor="prog-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>

            {data.knowsProgramming && (
                <div className="space-y-2">
                    <Label>Which programming languages?</Label>
                    <Input
                        placeholder="Python, JavaScript, C++ (comma separated)"
                        value={data.programmingLanguages?.join(", ") || ""}
                        onChange={(e) => onDataChange({ programmingLanguages: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                    />
                </div>
            )}

            <div className="space-y-3">
                <Label>Do you know MS Office / Excel / communication tools?</Label>
                <RadioGroup
                    value={data.knowsOfficeTools ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ knowsOfficeTools: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="office-yes" />
                        <Label htmlFor="office-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="office-no" />
                        <Label htmlFor="office-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label>Do you have a portfolio / GitHub / resume?</Label>
                <RadioGroup
                    value={data.hasPortfolio ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ hasPortfolio: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="portfolio-yes" />
                        <Label htmlFor="portfolio-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="portfolio-no" />
                        <Label htmlFor="portfolio-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>

            {data.hasPortfolio && (
                <>
                    <div className="space-y-2">
                        <Label>Portfolio Link</Label>
                        <Input
                            type="url"
                            placeholder="https://yourportfolio.com"
                            value={data.portfolioLink || ""}
                            onChange={(e) => onDataChange({ portfolioLink: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>GitHub Link</Label>
                        <Input
                            type="url"
                            placeholder="https://github.com/username"
                            value={data.githubLink || ""}
                            onChange={(e) => onDataChange({ githubLink: e.target.value })}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export function TimeHabitsStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>How many hours can you study daily?</Label>
                <Input
                    type="number"
                    min="0"
                    max="24"
                    placeholder="e.g., 4"
                    value={data.dailyStudyHours || ""}
                    onChange={(e) => onDataChange({ dailyStudyHours: parseInt(e.target.value) || 0 })}
                />
            </div>

            <div className="space-y-3">
                <Label>Do you follow a study schedule?</Label>
                <RadioGroup
                    value={data.hasStudySchedule ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ hasStudySchedule: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="schedule-yes" />
                        <Label htmlFor="schedule-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="schedule-no" />
                        <Label htmlFor="schedule-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label>Do you procrastinate?</Label>
                <RadioGroup
                    value={data.procrastinates ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ procrastinates: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="procrastinate-yes" />
                        <Label htmlFor="procrastinate-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="procrastinate-no" />
                        <Label htmlFor="procrastinate-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label>What distracts you the most?</Label>
                <Input
                    placeholder="Social media, TV, games, etc."
                    value={data.mainDistractions || ""}
                    onChange={(e) => onDataChange({ mainDistractions: e.target.value })}
                />
            </div>
        </div>
    );
}

export function DreamVisionStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>What kind of life do you want at 30?</Label>
                <Input
                    placeholder="Describe your vision..."
                    value={data.lifeVisionAt30 || ""}
                    onChange={(e) => onDataChange({ lifeVisionAt30: e.target.value })}
                />
            </div>

            <div className="space-y-3">
                <Label>What do you prefer?</Label>
                <RadioGroup value={data.careerPriority || ""} onValueChange={(value) => onDataChange({ careerPriority: value })}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high-salary" id="high-salary" />
                        <Label htmlFor="high-salary" className="font-normal cursor-pointer">High salary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="work-life-balance" id="work-life-balance" />
                        <Label htmlFor="work-life-balance" className="font-normal cursor-pointer">Work-life balance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passion-driven" id="passion-driven" />
                        <Label htmlFor="passion-driven" className="font-normal cursor-pointer">Passion-driven work</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label>Do you want a stable job or a high-growth career?</Label>
                <RadioGroup value={data.jobStabilityPreference || ""} onValueChange={(value) => onDataChange({ jobStabilityPreference: value })}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stable" id="stable" />
                        <Label htmlFor="stable" className="font-normal cursor-pointer">Stable job</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high-growth" id="high-growth" />
                        <Label htmlFor="high-growth" className="font-normal cursor-pointer">High-growth career</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}

export function MindsetCheckStep({ data, onDataChange }: OnboardingStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label>Are you ready to continuously learn new things?</Label>
                <RadioGroup
                    value={data.readyForContinuousLearning ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ readyForContinuousLearning: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="learn-yes" />
                        <Label htmlFor="learn-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="learn-no" />
                        <Label htmlFor="learn-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label>How do you handle failure?</Label>
                <Input
                    placeholder="Describe your approach to setbacks..."
                    value={data.failureHandling || ""}
                    onChange={(e) => onDataChange({ failureHandling: e.target.value })}
                />
            </div>

            <div className="space-y-3">
                <Label>Have you ever quit learning something midway?</Label>
                <RadioGroup
                    value={data.hasQuitLearning ? "yes" : "no"}
                    onValueChange={(value) => onDataChange({ hasQuitLearning: value === "yes" })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="quit-yes" />
                        <Label htmlFor="quit-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="quit-no" />
                        <Label htmlFor="quit-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                </RadioGroup>
            </div>

            {data.hasQuitLearning && (
                <div className="space-y-2">
                    <Label>Why did you quit?</Label>
                    <Input
                        placeholder="What was the reason?"
                        value={data.quitReason || ""}
                        onChange={(e) => onDataChange({ quitReason: e.target.value })}
                    />
                </div>
            )}
        </div>
    );
}
