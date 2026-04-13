"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applyToJob, getAppliedJobs } from "@/app/actions/student-actions";
import { toast } from "sonner";

export function useAppliedJobs() {
    return useQuery({
        queryKey: ["appliedJobs"],
        queryFn: async () => {
            const result = await getAppliedJobs();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch applied jobs");
            }
            return result.appliedJobIds;
        },
    });
}

export function useApplyToJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobId: string) => {
            const result = await applyToJob(jobId);
            if (!result.success) {
                throw new Error(result.error || "Failed to apply to job");
            }
            return result;
        },
        onSuccess: () => {
            // Invalidate the applied jobs query to refetch
            queryClient.invalidateQueries({ queryKey: ["appliedJobs"] });
            toast.success("Applied to Job Successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to apply to job");
        },
    });
}
