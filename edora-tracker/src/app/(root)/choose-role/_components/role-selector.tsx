"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Lightbulb,
  Briefcase,
  Loader2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { updateUserRole } from "@/app/actions/sign-in";
import { toast } from "sonner";

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  href: string;
}

const roles: Role[] = [
  {
    id: "student",
    title: "Student",
    description: "Track your self-learning journey",
    icon: <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />,
    features: [
      "AI-powered learning roadmaps",
      "Progress tracking & analytics",
      "Community & mentorship",
    ],
    href: "/dashboard/students/onboarding",
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Guide learners on their path",
    icon: <Lightbulb className="w-5 h-5 md:w-6 md:h-6" />,
    features: [
      "Create learning programs",
      "Track mentee progress",
      "Build your portfolio",
    ],
    href: "/dashboard/mentors/onboarding",
  },
  {
    id: "professional",
    title: "Professional",
    description: "Advance your career skills",
    icon: <Briefcase className="w-5 h-5 md:w-6 md:h-6" />,
    features: [
      "Career-focused pathways",
      "Industry certifications",
      "Networking opportunities",
    ],
    href: "/dashboard/professionals/onboarding",
  },
]; 

export function RoleSelector() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  return (
    <section className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 py-10">
      {/* Subtle grid background */}
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Section header - Notion style */}
        <header className="mb-12 sm:mb-16 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3 sm:mb-4 block">
            Choose Your Path
          </span>
          <h1 className="font-[var(--font-bebas)] text-4xl sm:text-5xl md:text-7xl tracking-tight text-foreground mb-4 sm:mb-6 px-2">
            SELECT YOUR ROLE
          </h1>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Choose the role that best describes your learning journey.
          </p>
        </header>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 sm:mb-8 max-w-2xl mx-auto p-3 sm:p-4 border-l-2 border-destructive bg-destructive/5 text-destructive text-xs sm:text-sm font-mono"
          >
            {error}
          </div>
        )}

        {/* Role cards - Mobile-first, responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {roles.map((role, index) => (
            <article
              key={role.id}
              className="group relative"
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              {/* Main card */}
              <div
                className={`
                relative h-full p-6 sm:p-8 border border-border bg-card/30 backdrop-blur-sm
                transition-all duration-300 ease-out
                ${hoveredRole === role.id ? "border-accent bg-card/50 md:-translate-y-1" : ""}
                ${loading === role.id ? "opacity-50" : ""}
              `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className={`
                      transition-colors duration-300
                      ${hoveredRole === role.id ? "text-accent" : "text-muted-foreground"}
                    `}
                    >
                      {role.icon}
                    </div>

                    {/* Title */}
                    <h2 className="font-[var(--font-bebas)] text-2xl sm:text-3xl tracking-tight text-foreground">
                      {role.title.toUpperCase()}
                    </h2>
                  </div>

                  {/* Number indicator - hidden on mobile */}
                  <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
                    0{index + 1}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {role.description}
                </p>

                {/* Features - Collapsible on mobile */}
                <div className="mb-6">
                  {/* Mobile: Show/Hide toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedRole(
                        expandedRole === role.id ? null : role.id,
                      );
                    }}
                    className="md:hidden w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
                    aria-expanded={expandedRole === role.id}
                    aria-controls={`features-${role.id}`}
                  >
                    <span className="font-mono uppercase tracking-wider">
                      Features
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${expandedRole === role.id ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Features list - Always visible on desktop, toggleable on mobile */}
                  <ul
                    id={`features-${role.id}`}
                    className={`
                      space-y-2
                      ${expandedRole === role.id ? "block" : "hidden"}
                      md:block
                    `}
                  >
                    {role.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <span className="text-accent mt-0.5 shrink-0">•</span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action button - Full width on mobile */}
                <button
                  onClick={async () => {
                    setLoading(role.id);
                    
                    // If user is already logged in (e.g. via Google but missing role)
                    if (session) {
                        try {
                            const res = await updateUserRole(role.id);
                            if (res?.success) {
                                router.push("/initial-setup");
                                return;
                            } else {
                                toast.error(res?.error || "Failed to update role");
                                setLoading(null);
                                return;
                            }
                        } catch (err) {
                            toast.error("An error occurred");
                            setLoading(null);
                            return;
                        }
                    }

                    const redirectUrl = email 
                      ? `/sign-in?role=${role.id}&email=${encodeURIComponent(email)}`
                      : `/sign-in?role=${role.id}`;
                    router.push(redirectUrl);
                  }}
                  disabled={loading !== null}
                  className={`
                    w-full h-11 sm:h-auto sm:w-auto
                    flex items-center justify-center sm:justify-start gap-2 
                    font-mono text-xs uppercase tracking-widest
                    transition-all duration-300
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
                    disabled:cursor-not-allowed
                    ${hoveredRole === role.id ? "text-accent" : "text-muted-foreground hover:text-foreground"}
                  `}
                  aria-label={`Select ${role.title} role`}
                >
                  {loading === role.id ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Setting up...</span>
                    </>
                  ) : (
                    <>
                      <span>Select Role</span>
                      <ArrowRight
                        className={`
                        w-3 h-3 transition-all duration-300
                        ${hoveredRole === role.id ? "translate-x-1" : ""}
                      `}
                      />
                    </>
                  )}
                </button>

                {/* Accent border on hover - desktop only */}
                <div
                  className={`
                  hidden md:block
                  absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-300
                  ${hoveredRole === role.id ? "w-full" : "w-0"}
                `}
                />
              </div>
            </article>
          ))}
        </div>

        {/* Footer note */}
        <footer className="mt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 px-4">
            Not sure? Start as a student
          </p>
        </footer>
      </div>
    </section>
  );
}
