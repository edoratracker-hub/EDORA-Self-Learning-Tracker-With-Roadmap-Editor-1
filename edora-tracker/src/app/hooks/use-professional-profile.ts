"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProfessionalProfile,
    createOrUpdateProfessionalProfile,
    updateProfessionalOnboardingStep,
    submitProfessionalForVerification,
    skipProfessionalOnboarding,
    ProfessionalProfileData,
} from "@/app/actions/professional-profile-actions";

export function useProfessionalProfile() {
    return useQuery({
        queryKey: ["professionalProfile"],
        queryFn: async () => {
            const result = await getProfessionalProfile();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch profile");
            }
            return result.profile;
        },
    });
}

export function useUpdateProfessionalProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ProfessionalProfileData) => {
            const result = await createOrUpdateProfessionalProfile(data);
            if (!result.success) {
                throw new Error(result.error || "Failed to update profile");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["professionalProfile"] });
        },
    });
}

export function useUpdateProfessionalOnboardingStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (stepData: Partial<ProfessionalProfileData>) => {
            const result = await updateProfessionalOnboardingStep(stepData);
            if (!result.success) {
                throw new Error(result.error || "Failed to update step");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["professionalProfile"] });
        },
    });
}

export function useSubmitProfessionalForVerification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const result = await submitProfessionalForVerification();
            if (!result.success) {
                throw new Error(result.error || "Failed to submit for verification");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["professionalProfile"] });
        },
    });
}

export function useSkipProfessionalOnboarding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const result = await skipProfessionalOnboarding();
            if (!result.success) {
                throw new Error(result.error || "Failed to skip");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["professionalProfile"] });
        },
    });
}
