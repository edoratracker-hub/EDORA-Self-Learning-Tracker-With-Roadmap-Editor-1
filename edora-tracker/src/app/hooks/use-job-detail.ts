import { useQuery } from "@tanstack/react-query";
import { JobOpportunityWithOrganization } from "./use-job-opportunities";

export type Job = JobOpportunityWithOrganization;

export interface JobApplicant {
    id: string;
    studentId: string;
    studentName: string;
    email: string;
    phone: string;
    appliedAt: Date;
    status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired" | "applied" | "accept" | "reject" | "scheduled" | "rescheduled" | "selected";
    resume: string;
    coverLetter?: string;
    experience: number; // years
    education: string;
    interviewDate?: Date;
    interviewTime?: Date;
}

export interface JobDetailResponse {
    success: boolean;
    job: JobOpportunityWithOrganization;
    applicants: JobApplicant[];
    error?: string;
}

export function useJobDetail(jobId: string) {
    return useQuery<JobDetailResponse>({
        queryKey: ["job-detail", jobId],
        queryFn: async () => {
            const response = await fetch(`/api/recruiters/job-opportunities/${jobId}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch job details");
            }
            return response.json();
        },
        enabled: !!jobId,
    });
}
