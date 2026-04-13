export interface JobOpportunity {
    id: string;
    title: string;
    company: string;
    description: string;
    responsibilities?: string | null;
    benefits?: string | null;
    requiredSkills?: string[] | null;
    niceToHaveSkills?: string[] | null;
    experienceMin?: number | null;
    experienceMax?: number | null;
    educationRequired?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency: "INR" | "USD" | "EUR" | "GBP" | "CAD";
    salaryType?: "yearly" | "monthly" | "hourly" | null;
    jobType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
    workMode: "remote" | "hybrid" | "on-site";
    location?: string | null;
    country?: string | null;
    applicationDeadline?: Date | string | null;
    status: "draft" | "open" | "closed";
    recruiterId: string;
    totalApplicants: number;
    views: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}
