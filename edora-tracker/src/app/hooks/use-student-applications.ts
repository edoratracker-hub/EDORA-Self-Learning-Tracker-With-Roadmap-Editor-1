"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentApplications } from "@/app/actions/student-career-actions";
import { toast } from "sonner"; // Assuming sonner is used for toast

export function useAppliedJobsDetails() {
    return useQuery({
        queryKey: ["student-applications"],
        queryFn: async () => {
            const result = await getStudentApplications();
            if (!result.success) {
                toast.error(typeof result.error === 'string' ? result.error : "Failed to fetch applications");
                throw new Error(typeof result.error === 'string' ? result.error : "Failed to fetch applications");
            }
            return result.data;
        },
    });
}
