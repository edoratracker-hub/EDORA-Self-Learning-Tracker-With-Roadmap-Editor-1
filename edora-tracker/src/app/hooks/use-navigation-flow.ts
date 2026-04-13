"use client"


import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

/**
 * Enhanced Navigation Hook with Profile Completion Awareness
 * Supports Phase 1/Phase 2 profile setup distinction
 */

import { authClient } from "@/app/lib/auth-client"

interface UseNavigationFlowReturn {
  handleGetStarted: () => void
  handleChooseRole: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

export function useNavigationFlow(): UseNavigationFlowReturn {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user

  const getRole = useCallback(() => {
    return (user as any)?.role as string | null | undefined
  }, [user])

  const getProfileStatus = useCallback(() => {
    // In better-auth, we might need to add profileStatus to additionalFields 
    // for now we'll assume it's on the user object if added to config
    return (user as any)?.profileStatus as
      | "incomplete"
      | "phase1_complete"
      | "complete"
      | null
      | undefined
  }, [user])

  const handleGetStarted = useCallback(async () => {
    if (isPending || isNavigating) return

    setIsNavigating(true)

    try {
      // 1️⃣ Not logged in → Sign In
      if (!session) {
        router.push("/sign-in")
        return
      }

      const role = getRole()
      const profileStatus = getProfileStatus()

      // 2️⃣ Logged in but no role → Choose Role
      if (!role) {
        router.push("/choose-role")
        return
      }

      // 3️⃣ Logged in with role - check profile completion status
      if (profileStatus === "incomplete" || !profileStatus) {
        // Start Phase 1
        router.push(`/dashboard/profile-setup/phase1?role=${role}`)
        return
      }

      if (profileStatus === "phase1_complete") {
        // Phase 1 complete, offer Phase 2
        router.push(`/dashboard/profile-setup/phase2?role=${role}`)
        return
      }

      // Profile complete → Dashboard
      const dashboardPath = getRoleDashboardPath(role)
      router.push(dashboardPath)
    } finally {
      setIsNavigating(false)
    }
  }, [isPending, session, isNavigating, getRole, getProfileStatus, router])

  const handleChooseRole = useCallback(async () => {
    if (isPending || isNavigating) return

    setIsNavigating(true)

    try {
      // 1️⃣ Not logged in → Sign In
      if (!session) {
        router.push("/sign-in")
        return
      }

      const role = getRole()

      // 2️⃣ Logged in but no role → Choose Role page
      if (!role) {
        router.push("/choose-role")
        return
      }

      // 3️⃣ Logged in with role → Dashboard
      const dashboardPath = getRoleDashboardPath(role)
      router.push(dashboardPath)
    } finally {
      setIsNavigating(false)
    }
  }, [isPending, session, isNavigating, getRole, router])

  return {
    handleGetStarted,
    handleChooseRole,
    isLoading: isPending || isNavigating,
    isAuthenticated: !!session,
  }
}

/**
 * Helper: Determine role-based dashboard path
 */
function getRoleDashboardPath(role: string): string {
  const dashboardMap: Record<string, string> = {
    student: "/dashboard/students",
    mentor: "/dashboard/mentor",
    recruiter: "/dashboard/recruiter",
    admin: "/dashboard/admin",
  }

  return dashboardMap[role] || "/dashboard"
}
