"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingStepProps } from "./student-onboarding";

export function SelfDiscoveryStep({ data, onDataChange }: OnboardingStepProps) {
    const handleSubjectsChange = (value: string) => {
        const subjects = value.split(",").map((s) => s.trim()).filter(Boolean);
        onDataChange({ favoriteSubjects: subjects });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="favoriteSubjects">What subjects do you enjoy the most?</Label>
                <Input
                    id="favoriteSubjects"
                    placeholder="Math, Science, History (comma separated)"
                    value={data.favoriteSubjects?.join(", ") || ""}
                    onChange={(e) => handleSubjectsChange(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="topicsThatEngageYou">What topics make you lose track of time?</Label>
                <Textarea
                    id="topicsThatEngageYou"
                    placeholder="Describe the topics that fascinate you..."
                    value={data.topicsThatEngageYou || ""}
                    onChange={(e) => onDataChange({ topicsThatEngageYou: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="space-y-3">
                <Label>Do you like theory, problem-solving, creativity, or working with people?</Label>
                <RadioGroup
                    value={data.learningPreference || ""}
                    onValueChange={(value) => onDataChange({ learningPreference: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="theory" id="theory" />
                        <Label htmlFor="theory" className="font-normal cursor-pointer">Theory</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="problem-solving" id="problem-solving" />
                        <Label htmlFor="problem-solving" className="font-normal cursor-pointer">Problem-solving</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="creativity" id="creativity" />
                        <Label htmlFor="creativity" className="font-normal cursor-pointer">Creativity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="working-with-people" id="working-with-people" />
                        <Label htmlFor="working-with-people" className="font-normal cursor-pointer">Working with people</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label>Do you prefer working alone or in a team?</Label>
                <RadioGroup
                    value={data.workPreference || ""}
                    onValueChange={(value) => onDataChange({ workPreference: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alone" id="alone" />
                        <Label htmlFor="alone" className="font-normal cursor-pointer">Alone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="team" id="team" />
                        <Label htmlFor="team" className="font-normal cursor-pointer">Team</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="font-normal cursor-pointer">Both</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label htmlFor="hobbies">What are your hobbies?</Label>
                <Textarea
                    id="hobbies"
                    placeholder="Reading, coding, sports, music..."
                    value={data.hobbies || ""}
                    onChange={(e) => onDataChange({ hobbies: e.target.value })}
                    rows={2}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="confidenceActivities">What kind of activities make you feel confident?</Label>
                <Textarea
                    id="confidenceActivities"
                    placeholder="Describe activities where you excel..."
                    value={data.confidenceActivities || ""}
                    onChange={(e) => onDataChange({ confidenceActivities: e.target.value })}
                    rows={3}
                />
            </div>
        </div>
    );
}
