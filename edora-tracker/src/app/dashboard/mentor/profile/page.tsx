/**
 * Mentor Profile Setup Page
 * Notion-style, minimal interface with 3 initial questions
 * After submission, mentor status is set to PENDING_APPROVAL
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileLayout, ProfileQuestion } from "./_components/profile-components";
import { Button } from "@/components/ui/button";
import {
  createOrUpdateMentorProfile,
  submitForVerification,
  skipProfessionalQuestions,
  MentorProfileData,
} from "@/app/actions/mentor-profile-actions";
import { authClient } from "@/app/lib/auth-client";
import { Loader2 } from "lucide-react";

// Input field styled to match Notion
function InputField({
  type = "text",
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
}: {
  type?: string;
  value: string | number;
  onChange: (value: any) => void;
  placeholder: string;
  multiline?: boolean;
  rows?: number;
}) {
  const baseClasses =
    "w-full px-4 py-3 bg-input border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${baseClasses} resize-none`}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? Number(e.target.value) : e.target.value)
      }
      placeholder={placeholder}
      className={baseClasses}
    />
  );
}

export default function MentorProfileSetupPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Profile data state
  const [areaOfExpertise, setAreaOfExpertise] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [professionalBio, setProfessionalBio] = useState("");

  const handleSaveAndContinue = async () => {
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    setLoading(true);

    try {
      const profileData: MentorProfileData = {
        expertise: areaOfExpertise ? [areaOfExpertise] : undefined,
        yearsOfExperience: yearsOfExperience || undefined,
        bio: professionalBio || undefined,
        fullName: session?.user?.name || undefined,
        email: session?.user?.email || undefined,
      };

      // Save the profile first
      await createOrUpdateMentorProfile(profileData);

      // Then submit for admin verification
      await submitForVerification();

      // Redirect to pending approval page
      router.push("/dashboard/mentor/pending-approval");
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    setLoading(true);

    try {
      await skipProfessionalQuestions();
      router.push("/dashboard/mentor/home");
    } catch (error) {
      console.error("Failed to skip profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = areaOfExpertise && yearsOfExperience > 0 && professionalBio;

  return (
    <ProfileLayout currentStep={currentStep} totalSteps={3}>
      {/* Question 1: Area of Expertise */}
      {currentStep === 1 && (
        <ProfileQuestion
          question="What is your area of expertise?"
          description="e.g., Web Development, Data Science, UX Design"
        >
          <InputField
            value={areaOfExpertise}
            onChange={setAreaOfExpertise}
            placeholder="Enter your primary area of expertise"
          />

          {/* Next button */}
          <Button
            onClick={() => setCurrentStep(2)}
            disabled={!areaOfExpertise.trim()}
            size="lg"
            className="mt-8 font-mono text-xs uppercase tracking-wider"
          >
            Next
          </Button>
        </ProfileQuestion>
      )}

      {/* Question 2: Years of Experience */}
      {currentStep === 2 && (
        <ProfileQuestion
          question="How many years of experience do you have?"
          description="This helps us match you with the right mentees"
        >
          <InputField
            type="number"
            value={yearsOfExperience}
            onChange={setYearsOfExperience}
            placeholder="0"
          />

          {/* Next button */}
          <Button
            onClick={() => setCurrentStep(3)}
            disabled={!yearsOfExperience || yearsOfExperience <= 0}
            size="lg"
            className="mt-8 font-mono text-xs uppercase tracking-wider"
          >
            Next
          </Button>

          {/* Back button */}
          <button
            onClick={() => setCurrentStep(1)}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors block"
          >
            ← Back
          </button>
        </ProfileQuestion>
      )}

      {/* Question 3: Professional Bio */}
      {currentStep === 3 && (
        <ProfileQuestion
          question="Tell us about yourself"
          description="A short professional bio (2-3 sentences)"
        >
          <InputField
            multiline
            value={professionalBio}
            onChange={setProfessionalBio}
            placeholder="Share your background, expertise, and what you're passionate about teaching..."
            rows={5}
          />

          {/* Action buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSaveAndContinue}
              disabled={!canProceed || loading}
              size="lg"
              className="flex-1 font-mono text-xs uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Approval"
              )}
            </Button>

            <Button
              onClick={handleSkip}
              disabled={loading}
              variant="ghost"
              size="lg"
              className="flex-1 font-mono text-xs uppercase tracking-wider"
            >
              Skip for now
            </Button>
          </div>

          {/* Info text */}
          {canProceed && (
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Your profile will be reviewed by our team. You'll receive an email once approved.
            </p>
          )}

          {/* Back button */}
          <button
            onClick={() => setCurrentStep(2)}
            className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors block"
          >
            ← Back
          </button>
        </ProfileQuestion>
      )}
    </ProfileLayout>
  );
}
