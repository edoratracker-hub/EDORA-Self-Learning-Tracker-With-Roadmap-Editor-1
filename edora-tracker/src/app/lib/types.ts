export type JobStatus = 'draft' | 'open' | 'closed';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';

export type WorkMode = 'remote' | 'hybrid' | 'on-site';

export type EducationLevel = 'high-school' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'none';

export type SalaryType = 'yearly' | 'monthly' | 'hourly';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD';

export interface JobOpportunity {
    id: string;
    recruiterId: string;
    title: string;
    company: string | null;
    description: string | null;
    responsibilities: string | null;
    benefits: string | null;
    requiredSkills: string[] | null;
    niceToHaveSkills: string[] | null;
    experienceMin: number | null;
    experienceMax: number | null;
    educationRequired: EducationLevel | string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    currency: Currency | string | null;
    salaryType: SalaryType | string | null;
    jobType: JobType | string | null;
    workMode: WorkMode | string | null;
    location: string | null;
    country: string | null;
    applicationDeadline: Date | null;
    status: JobStatus;
    totalApplicants: number;
    views: number;
    createdAt: Date;
    updatedAt?: Date;
    organization?: {
        id: string;
        companyName: string | null;
        companyLogo: string | null;
        location?: string | null;
        website?: string | null;
        phoneNumber?: string | null;
        verified?: boolean | null;
        createdAt?: Date | string | null;
    } | null;
}
