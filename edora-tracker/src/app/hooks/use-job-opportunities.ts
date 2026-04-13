import { useQuery } from "@tanstack/react-query";
import { JobOpportunity } from "@/app/lib/types";

export type RecruiterOrganization = NonNullable<JobOpportunity["organization"]>;

export interface JobOpportunityWithOrganization extends JobOpportunity { }

interface JobOpportunitiesResponse {
    success: boolean;
    data: JobOpportunityWithOrganization[];
    count: number;
    stats?: {
        activeJobs: number;
        totalApplicants: number;
        totalInterviews: number;
    };
    organization: RecruiterOrganization | null;
    message?: string;
    error?: string;
}

export function useJobOpportunities() {
    return useQuery<JobOpportunitiesResponse>({
        queryKey: ["recruiter-job-opportunities"],
        queryFn: async () => {
            const response = await fetch("/api/recruiters/job-opportunities");
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch job opportunities");
            }
            return response.json();
        },
    });
}
