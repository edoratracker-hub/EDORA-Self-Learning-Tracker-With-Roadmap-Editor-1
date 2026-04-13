"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentInterviews } from "@/app/actions/student-career-actions";
import { toast } from "sonner"; // Assuming sonner is used for toast

export function useStudentScheduledInterviews() {
    return useQuery({
        queryKey: ["student-interviews"],
        queryFn: async () => {
            const result = await getStudentInterviews();
            if (!result.success) {
                toast.error(typeof result.error === 'string' ? result.error : "Failed to fetch interviews");
                throw new Error(typeof result.error === 'string' ? result.error : "Failed to fetch interviews");
            }
            return result.data;
        },
    });
}
