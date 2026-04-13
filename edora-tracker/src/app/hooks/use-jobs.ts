import { useQuery } from "@tanstack/react-query";

export interface Organization {
    id: string;
    companyName: string | null;
    companyLogo: string | null;
    location: string | null;
    website: string | null;
}

export interface JobOpportunityData {
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
    educationRequired: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    currency: string | null;
    salaryType: string | null;
    jobType: string | null;
    workMode: string | null;
    location: string | null;
    country: string | null;
    applicationDeadline: string | null;
    status: string;
    totalApplicants: number;
    views: number;
    createdAt: string;
    organization?: Organization;
}

interface JobsResponse {
    success: boolean;
    data: JobOpportunityData[];
    count: number;
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
    error?: string;
}

interface UseJobsParams {
    search?: string;
    type?: string;
    workMode?: string;
    location?: string;
    category?: string;
}

export function useJobs(params: UseJobsParams = {}) {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.type && params.type !== "all") queryParams.append("type", params.type);
    if (params.workMode && params.workMode !== "all") queryParams.append("workMode", params.workMode);
    if (params.location && params.location !== "all") queryParams.append("location", params.location);
    if (params.category && params.category !== "all") queryParams.append("category", params.category);

    return useQuery<JobsResponse>({
        queryKey: ["jobs", params],
        queryFn: async () => {
            const url = `/api/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
            const response = await fetch(url);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch jobs");
            }
            return response.json();
        },
    });
}
