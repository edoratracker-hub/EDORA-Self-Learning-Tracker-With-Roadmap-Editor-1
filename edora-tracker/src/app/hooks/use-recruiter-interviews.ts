"use client";

import { useQuery } from "@tanstack/react-query";
import { getScheduledInterviews, getUpcomingInterviews, getUserScheduledInterviews } from "@/app/actions/interview-actions";

export function useRecruiterScheduledInterviews(jobId?: string) {
    return useQuery({
        queryKey: ["recruiterScheduledInterviews", jobId],
        queryFn: async () => {
            const result = await getScheduledInterviews(jobId);
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch scheduled interviews");
            }
            return result.interviews;
        },
    });
}

export function useUserScheduledInterviews() {
    return useQuery({
        queryKey: ["userScheduledInterviews"],
        queryFn: async () => {
            const result = await getUserScheduledInterviews();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch scheduled interviews");
            }
            return result.interviews;
        },
    });
}

export function useUpcomingInterviews() {
    return useQuery({
        queryKey: ["upcomingInterviews"],
        queryFn: async () => {
            const result = await getUpcomingInterviews();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch upcoming interviews");
            }
            return result.interviews;
        },
    });
}
