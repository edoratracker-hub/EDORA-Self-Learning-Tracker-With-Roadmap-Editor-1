"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMentorProfile,
    createOrUpdateMentorProfile,
    updateOnboardingStep,
    submitForVerification,
    skipProfessionalQuestions,
    MentorProfileData,
} from "@/app/actions/mentor-profile-actions";

export function useMentorProfile() {
    return useQuery({
        queryKey: ["mentorProfile"],
        queryFn: async () => {
            const result = await getMentorProfile();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch profile");
            }
            return result.profile;
        },
    });
}

export function useUpdateMentorProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: MentorProfileData) => {
            const result = await createOrUpdateMentorProfile(data);
            if (!result.success) {
                throw new Error(result.error || "Failed to update profile");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentorProfile"] });
        },
    });
}

export function useUpdateMentorOnboardingStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (stepData: Partial<MentorProfileData>) => {
            const result = await updateOnboardingStep(stepData);
            if (!result.success) {
                throw new Error(result.error || "Failed to update step");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentorProfile"] });
        },
    });
}

export function useSubmitForVerification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const result = await submitForVerification();
            if (!result.success) {
                throw new Error(result.error || "Failed to submit for verification");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentorProfile"] });
        },
    });
}

export function useSkipProfessionalQuestions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const result = await skipProfessionalQuestions();
            if (!result.success) {
                throw new Error(result.error || "Failed to skip");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentorProfile"] });
        },
    });
}
