"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getStudentProfile,
    createOrUpdateStudentProfile,
    updateOnboardingStep,
    StudentProfileData,
} from "@/app/actions/student-profile-actions";

export function useStudentProfile() {
    return useQuery({
        queryKey: ["studentProfile"],
        queryFn: async () => {
            const result = await getStudentProfile();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch profile");
            }
            return result.profile;
        },
    });
}

export function useUpdateStudentProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: StudentProfileData) => {
            const result = await createOrUpdateStudentProfile(data);
            if (!result.success) {
                throw new Error(result.error || "Failed to update profile");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
        },
    });
}

export function useUpdateOnboardingStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (stepData: Partial<StudentProfileData>) => {
            const result = await updateOnboardingStep(stepData);
            if (!result.success) {
                throw new Error(result.error || "Failed to update step");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
        },
    });
}
