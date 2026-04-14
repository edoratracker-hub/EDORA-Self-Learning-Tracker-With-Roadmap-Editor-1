"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createJobOpportunity } from "@/app/actions/recruiters/create-job-post";
import { updateJobOpportunity } from "@/app/actions/recruiter-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type { z } from "zod";
import { jobOpportunitySchema } from "@/app/lib/validations";
import { XIcon } from "lucide-react";

interface EditJobVacancyFormProps {
  children?: React.ReactNode;
  jobId?: string;
  initialData?: any;
}

type JobOpportunityFormData = z.infer<typeof jobOpportunitySchema>;

export const EditJobVacancyForm = ({
  children,
  jobId,
  initialData,
}: EditJobVacancyFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<JobOpportunityFormData>({
    resolver: zodResolver(jobOpportunitySchema as any),
    defaultValues: {
      title: initialData.title || "",
      company: initialData.organization?.companyName || "",
      description: initialData.description || "",
      responsibilities: initialData.responsibilities || "",
      benefits: initialData.benefits || "",
      requiredSkills: initialData.requiredSkills || "",
      niceToHaveSkills: initialData.niceToHaveSkills || "",
      experienceMin: initialData.experienceMin ?? undefined,
      experienceMax: initialData.experienceMax ?? undefined,
      educationRequired: initialData.educationRequired || "",
      salaryMin: initialData.salaryMin ?? undefined,
      salaryMax: initialData.salaryMax ?? undefined,
      currency: initialData.currency || "INR",
      salaryType: initialData.salaryType || "yearly",
      jobType: initialData.jobType || "full-time",
      workMode: initialData.workMode || "hybrid",
      location: initialData.location || "",
      country: initialData.country || "India",
      applicationDeadline: initialData.applicationDeadline || "",
      status: initialData.status || "draft",
    },
  });

  const onSubmit = async (data: JobOpportunityFormData) => {
    if (!jobId) {
      toast.error("Job ID is missing!");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateJobOpportunity(jobId, data);

      if (result.success) {
        toast.success("Job updated successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update job posting");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || <Button>Edit Job Vaccancy</Button>}
      </SheetTrigger>
      <SheetContent
        className="w-full p-0 sm:max-w-2xl grid-rows-[auto,1fr,auto] gap-0 bg-card overflow-hidden backdrop-blur-sm"
        showCloseButton={false}
      >
        <SheetHeader className="flex flex-row items-start justify-between space-y-0 bg-muted px-4 py-4 text-left shadow-sm z-10">
          <div className="space-y-1">
            <SheetTitle className="uppercase text-xl">
              Edit Job Vacancy
            </SheetTitle>
            <SheetDescription className="text-xs">
              Edit the details below. Required fields are marked with an
              asterisk.
            </SheetDescription>
          </div>

          <SheetClose asChild>
            <Button variant="ghost" size="icon" disabled={isSubmitting}>
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </SheetHeader>

        <ScrollArea className="flex-1 h-full w-full px-4 overflow-hidden ">
          <div className="pb-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form id="job-vacancy-form" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup className="space-y-8 py-4">
                {/* Section 1: Basic Information */}
                <FieldSet>
                  <FieldLegend className="text-lg font-semibold mb-4">
                    Basic Information
                  </FieldLegend>
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field className="col-span-1 md:col-span-2">
                      <FieldLabel htmlFor="title">Job Title</FieldLabel>
                      <Input
                        id="title"
                        placeholder="e.g. Senior Frontend Developer"
                        {...register("title")}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="company">Company Name</FieldLabel>
                      <Input
                        id="company"
                        placeholder="e.g. Tech Solutions Inc."
                        {...register("company")}
                      />
                      {errors.company && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.company.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="location">Location</FieldLabel>
                      <Input
                        id="location"
                        placeholder="e.g. Bangalore, India"
                        {...register("location")}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.location.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="country">Country</FieldLabel>
                      <Select
                        onValueChange={(value) => setValue("country", value)}
                        defaultValue={watch("country")}
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.country && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Section 2: Job Details */}
                <FieldSet>
                  <FieldLegend className="text-lg font-semibold mb-4">
                    Job Details
                  </FieldLegend>
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel htmlFor="jobType">Job Type</FieldLabel>
                      <Select
                        onValueChange={(value) =>
                          setValue("jobType", value as any)
                        }
                        defaultValue={watch("jobType")}
                      >
                        <SelectTrigger id="jobType">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.jobType && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.jobType.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="workMode">Work Mode</FieldLabel>
                      <Select
                        onValueChange={(value) =>
                          setValue("workMode", value as any)
                        }
                        defaultValue={watch("workMode")}
                      >
                        <SelectTrigger id="workMode">
                          <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="on-site">On-site</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.workMode && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.workMode.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="experienceMin">
                        Minimum Experience (years)
                      </FieldLabel>
                      <Input
                        id="experienceMin"
                        type="number"
                        min="0"
                        placeholder="e.g. 2"
                        {...register("experienceMin", { valueAsNumber: true })}
                      />
                      {errors.experienceMin && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.experienceMin.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="experienceMax">
                        Maximum Experience (years)
                      </FieldLabel>
                      <Input
                        id="experienceMax"
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        {...register("experienceMax", { valueAsNumber: true })}
                      />
                      {errors.experienceMax && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.experienceMax.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="educationRequired">
                        Education Required
                      </FieldLabel>
                      <Select
                        onValueChange={(value) =>
                          setValue("educationRequired", value)
                        }
                        defaultValue={watch("educationRequired")}
                      >
                        <SelectTrigger id="educationRequired">
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">
                            High School
                          </SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="bachelor">
                            Bachelor's Degree
                          </SelectItem>
                          <SelectItem value="master">
                            Master's Degree
                          </SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="none">
                            No Formal Education Required
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.educationRequired && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.educationRequired.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="applicationDeadline">
                        Application Deadline
                      </FieldLabel>
                      <Input
                        id="applicationDeadline"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("applicationDeadline", {
                          setValueAs: (value) =>
                            value ? new Date(value) : undefined,
                        })}
                      />
                      {errors.applicationDeadline && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.applicationDeadline.message}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Section 3: Salary Information */}
                <FieldSet>
                  <FieldLegend className="text-lg font-semibold mb-4">
                    Salary Information
                  </FieldLegend>
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel htmlFor="salaryMin">
                        Minimum Salary (₹)
                      </FieldLabel>
                      <Input
                        id="salaryMin"
                        type="number"
                        min="0"
                        placeholder="e.g. 600000"
                        {...register("salaryMin", { valueAsNumber: true })}
                      />
                      {errors.salaryMin && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.salaryMin.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="salaryMax">
                        Maximum Salary (₹)
                      </FieldLabel>
                      <Input
                        id="salaryMax"
                        type="number"
                        min="0"
                        placeholder="e.g. 1200000"
                        {...register("salaryMax", { valueAsNumber: true })}
                      />
                      {errors.salaryMax && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.salaryMax.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="currency">Currency</FieldLabel>
                      <Select
                        onValueChange={(value) => setValue("currency", value as any)}
                        defaultValue={watch("currency")}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">₹ INR</SelectItem>
                          <SelectItem value="USD">$ USD</SelectItem>
                          <SelectItem value="EUR">€ EUR</SelectItem>
                          <SelectItem value="GBP">£ GBP</SelectItem>
                          <SelectItem value="CAD">$ CAD</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currency && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.currency.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="salaryType">Salary Type</FieldLabel>
                      <Select
                        onValueChange={(value) =>
                          setValue("salaryType", value as any)
                        }
                        defaultValue={watch("salaryType")}
                      >
                        <SelectTrigger id="salaryType">
                          <SelectValue placeholder="Select salary type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.salaryType && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.salaryType.message}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Section 4: Skills */}
                <FieldSet>

                  <FieldGroup className="space-y-6">
                    <Field>
                      <FieldLabel htmlFor="requiredSkills">
                        Required Skills
                      </FieldLabel>
                      <Textarea
                        id="requiredSkills"
                        placeholder="Enter required skills separated by commas (e.g., React, TypeScript, Node.js)"
                        className="min-h-[100px] resize-y"
                        {...register("requiredSkills")}
                      />
                      {errors.requiredSkills && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.requiredSkills.message}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Separate skills with commas
                      </p>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="niceToHaveSkills">
                        Nice-to-Have Skills
                      </FieldLabel>
                      <Textarea
                        id="niceToHaveSkills"
                        placeholder="Enter nice-to-have skills separated by commas"
                        className="min-h-[100px] resize-y"
                        {...register("niceToHaveSkills")}
                      />
                      {errors.niceToHaveSkills && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.niceToHaveSkills.message}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Separate skills with commas
                      </p>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Section 5: Job Description */}
                <FieldSet>

                  <FieldGroup className="space-y-6">
                    <Field>
                      <FieldLabel htmlFor="description">
                        Job Description
                      </FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Provide an overview of the role..."
                        className="min-h-[150px] resize-y"
                        {...register("description")}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="responsibilities">
                        Key Responsibilities
                      </FieldLabel>
                      <Textarea
                        id="responsibilities"
                        placeholder="List the key responsibilities of the role..."
                        className="min-h-[150px] resize-y"
                        {...register("responsibilities")}
                      />
                      {errors.responsibilities && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.responsibilities.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="benefits">
                        Benefits & Perks
                      </FieldLabel>
                      <Textarea
                        id="benefits"
                        placeholder="List the benefits and perks offered..."
                        className="min-h-[150px] resize-y"
                        {...register("benefits")}
                      />
                      {errors.benefits && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.benefits.message}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Section 6: Publishing */}
                <FieldSet>
                  <FieldLegend className="text-lg font-semibold mb-4">
                    Publishing Options
                  </FieldLegend>
                  <Field className="max-w-xs">
                    <FieldLabel htmlFor="status">Listing Status</FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        setValue("status", value as any)
                      }
                      defaultValue={watch("status")}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Save as Draft</SelectItem>
                        <SelectItem value="open">Publish Now</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.status.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Drafts are only visible to you
                    </p>
                  </Field>
                </FieldSet>
              </FieldGroup>
            </form>
          </div>
        </ScrollArea>

        <SheetFooter className="gap-2 bg-muted border-t">
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                reset();
                setError(null);
              }}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="job-vacancy-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
