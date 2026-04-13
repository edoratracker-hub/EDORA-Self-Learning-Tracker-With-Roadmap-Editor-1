"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingStepProps } from "./mentor-onboarding";

export function ProfessionalBackgroundStep({
  data,
  onDataChange,
}: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            placeholder="e.g., Senior Software Engineer"
            value={data.title || ""}
            onChange={(e) => onDataChange({ title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company / Organization</Label>
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
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            placeholder="e.g., 8"
            value={data.yearsOfExperience || ""}
            onChange={(e) =>
              onDataChange({ yearsOfExperience: parseInt(e.target.value) || 0 })
            }
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
            {[
              "Technology",
              "Finance",
              "Healthcare",
              "Education",
              "E-commerce",
              "Media",
              "Consulting",
              "Manufacturing",
              "Other",
            ].map((ind) => (
              <div key={ind} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={ind.toLowerCase()}
                  id={`industry-${ind.toLowerCase()}`}
                />
                <Label
                  htmlFor={`industry-${ind.toLowerCase()}`}
                  className="font-normal cursor-pointer"
                >
                  {ind}
                </Label>
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
          onChange={(e) =>
            onDataChange({
              previousRoles: e.target.value
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
            })
          }
        />
        <p className="text-xs text-muted-foreground">
          List your previous positions, comma separated
        </p>
      </div>
    </div>
  );
}

export function EducationStep({ data, onDataChange }: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Highest Degree</Label>
        <RadioGroup
          value={data.highestDegree || ""}
          onValueChange={(value) => onDataChange({ highestDegree: value })}
        >
          {[
            "PhD / Doctorate",
            "Master's Degree",
            "Bachelor's Degree",
            "Diploma",
            "Self-taught / No Formal Degree",
          ].map((deg) => (
            <div key={deg} className="flex items-center space-x-2">
              <RadioGroupItem
                value={deg.toLowerCase()}
                id={`degree-${deg.toLowerCase().replace(/[^a-z]/g, "-")}`}
              />
              <Label
                htmlFor={`degree-${deg.toLowerCase().replace(/[^a-z]/g, "-")}`}
                className="font-normal cursor-pointer"
              >
                {deg}
              </Label>
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
          placeholder="AWS Solutions Architect, PMP, Google Cloud Professional (one per line or comma separated)"
          value={data.certifications?.join(", ") || ""}
          onChange={(e) =>
            onDataChange({
              certifications: e.target.value
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
            })
          }
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Industry certifications add credibility to your mentor profile
        </p>
      </div>
    </div>
  );
}

export function ExpertiseSkillsStep({
  data,
  onDataChange,
}: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="expertise">Core Areas of Expertise</Label>
        <Input
          id="expertise"
          placeholder="Web Development, System Design, Cloud Architecture (comma separated)"
          value={data.expertise?.join(", ") || ""}
          onChange={(e) =>
            onDataChange({
              expertise: e.target.value
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
            })
          }
          required
        />
        <p className="text-xs text-muted-foreground">
          What are you an expert in? These will be shown to students
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technicalSkills">Technical Skills</Label>
        <Input
          id="technicalSkills"
          placeholder="JavaScript, Python, React, Docker, AWS (comma separated)"
          value={data.technicalSkills?.join(", ") || ""}
          onChange={(e) =>
            onDataChange({
              technicalSkills: e.target.value
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="softSkills">Soft Skills</Label>
        <Input
          id="softSkills"
          placeholder="Leadership, Communication, Problem-solving (comma separated)"
          value={data.softSkills?.join(", ") || ""}
          onChange={(e) =>
            onDataChange({
              softSkills: e.target.value
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="toolsAndTechnologies">Tools & Technologies</Label>
        <Input
          id="toolsAndTechnologies"
          placeholder="VS Code, Git, Jira, Figma, Slack (comma separated)"
          value={data.toolsAndTechnologies?.join(", ") || ""}
          onChange={(e) =>
            onDataChange({
              toolsAndTechnologies: e.target.value
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
            })
          }
        />
        <p className="text-xs text-muted-foreground">
          Tools you use daily and can teach
        </p>
      </div>
    </div>
  );
}

export function MentorshipDetailsStep({
  data,
  onDataChange,
}: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mentorshipTopics">Mentorship Topics</Label>
        <Input
          id="mentorshipTopics"
          placeholder="Career guidance, Resume review, Interview prep, Code review (comma separated)"
          value={data.mentorshipTopics?.join(", ") || ""}
          onChange={(e) =>
            onDataChange({
              mentorshipTopics: e.target.value
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
            })
          }
          required
        />
        <p className="text-xs text-muted-foreground">
          What topics will you cover in mentoring sessions?
        </p>
      </div>

      <div className="space-y-3">
        <Label>Mentorship Style</Label>
        <RadioGroup
          value={data.mentorshipStyle || ""}
          onValueChange={(value) => onDataChange({ mentorshipStyle: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hands-on" id="hands-on" />
            <Label htmlFor="hands-on" className="font-normal cursor-pointer">
              Hands-on (pair programming, live coding)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advisory" id="advisory" />
            <Label htmlFor="advisory" className="font-normal cursor-pointer">
              Advisory (guidance, feedback, direction)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="coaching" id="coaching" />
            <Label htmlFor="coaching" className="font-normal cursor-pointer">
              Coaching (structured learning plans)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="career-guidance" id="career-guidance" />
            <Label
              htmlFor="career-guidance"
              className="font-normal cursor-pointer"
            >
              Career Guidance (industry insights, career planning)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Preferred Mentee Level</Label>
        <RadioGroup
          value={data.preferredMenteeLevel || ""}
          onValueChange={(value) =>
            onDataChange({ preferredMenteeLevel: value })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner" className="font-normal cursor-pointer">
              Beginner (completely new learners)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label
              htmlFor="intermediate"
              className="font-normal cursor-pointer"
            >
              Intermediate (some experience)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced" className="font-normal cursor-pointer">
              Advanced (experienced professionals)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="any-level" />
            <Label htmlFor="any-level" className="font-normal cursor-pointer">
              Any level
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxMentees">Maximum Mentees at a time</Label>
          <Input
            id="maxMentees"
            type="number"
            min="1"
            max="50"
            placeholder="e.g., 5"
            value={data.maxMentees || ""}
            onChange={(e) =>
              onDataChange({ maxMentees: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionDurationMinutes">
            Session Duration (minutes)
          </Label>
          <Input
            id="sessionDurationMinutes"
            type="number"
            min="15"
            max="180"
            step="15"
            placeholder="e.g., 45"
            value={data.sessionDurationMinutes || ""}
            onChange={(e) =>
              onDataChange({
                sessionDurationMinutes: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Are you willing to mentor students for free?</Label>
        <RadioGroup
          value={data.isFreeForStudents ? "yes" : "no"}
          onValueChange={(value) =>
            onDataChange({ isFreeForStudents: value === "yes" })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="free-yes" />
            <Label htmlFor="free-yes" className="font-normal cursor-pointer">
              Yes, I'm happy to volunteer
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="free-no" />
            <Label htmlFor="free-no" className="font-normal cursor-pointer">
              No, I'd like to set a rate
            </Label>
          </div>
        </RadioGroup>
      </div>

      {!data.isFreeForStudents && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              placeholder="e.g., 500"
              value={data.hourlyRate || ""}
              onChange={(e) =>
                onDataChange({ hourlyRate: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              placeholder="INR"
              value={data.currency || "INR"}
              onChange={(e) => onDataChange({ currency: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function ProfessionalLinksStep({
  data,
  onDataChange,
}: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Adding professional links increases your profile trust and helps
        students verify your expertise.
      </p>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/yourname"
          value={data.linkedinUrl || ""}
          onChange={(e) => onDataChange({ linkedinUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub</Label>
        <Input
          id="githubUrl"
          type="url"
          placeholder="https://github.com/username"
          value={data.githubUrl || ""}
          onChange={(e) => onDataChange({ githubUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Personal Website / Blog</Label>
        <Input
          id="websiteUrl"
          type="url"
          placeholder="https://yourwebsite.com"
          value={data.websiteUrl || ""}
          onChange={(e) => onDataChange({ websiteUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitterUrl">Twitter / X</Label>
        <Input
          id="twitterUrl"
          type="url"
          placeholder="https://twitter.com/username"
          value={data.twitterUrl || ""}
          onChange={(e) => onDataChange({ twitterUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioUrl">Portfolio</Label>
        <Input
          id="portfolioUrl"
          type="url"
          placeholder="https://portfolio.dev/username"
          value={data.portfolioUrl || ""}
          onChange={(e) => onDataChange({ portfolioUrl: e.target.value })}
        />
      </div>
    </div>
  );
}

export function MotivationGoalsStep({
  data,
  onDataChange,
}: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="whyMentor">Why do you want to be a mentor? </Label>
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
        <Label htmlFor="mentorshipGoals">
          What do you hope to achieve as a mentor?
        </Label>
        <Textarea
          id="mentorshipGoals"
          placeholder="e.g., Help 10 students land their first tech job, build a community of learners..."
          value={data.mentorshipGoals || ""}
          onChange={(e) => onDataChange({ mentorshipGoals: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="successStory">
          Share a mentoring success story (optional)
        </Label>
        <Textarea
          id="successStory"
          placeholder="Have you mentored someone before? What was the outcome?"
          value={data.successStory || ""}
          onChange={(e) => onDataChange({ successStory: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teachingApproach">
          How do you approach teaching / knowledge transfer?
        </Label>
        <Textarea
          id="teachingApproach"
          placeholder="Describe your teaching philosophy and how you make complex concepts simple..."
          value={data.teachingApproach || ""}
          onChange={(e) => onDataChange({ teachingApproach: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}
