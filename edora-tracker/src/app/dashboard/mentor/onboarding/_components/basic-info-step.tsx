"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingStepProps } from "./mentor-onboarding";

export function BasicInfoStep({ data, onDataChange }: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
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
          <Label htmlFor="email">Professional Email</Label>
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
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g., Mumbai, India"
          value={data.location || ""}
          onChange={(e) => onDataChange({ location: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground">
          City and country where you are currently based
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself, your experience, and what drives you as a professional..."
          value={data.bio || ""}
          onChange={(e) => onDataChange({ bio: e.target.value })}
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground">
          This will be visible to students looking for mentors. Make it
          compelling!
        </p>
      </div>
    </div>
  );
}
