"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedNoise } from "./animated-noise";

import { ScrambleTextOnHover } from "./scramble-text";
import { BitmapChevron } from "./bitmap-chevron";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Silk from "@/components/animations/Silk";
import Shuffle from "@/components/animations/Shuffle";
import { authClient } from "@/app/lib/auth-client";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => {
    if (session) {
      // If session exists, redirect based on role
      const role = (session.user as any).role;
      if (role === "student") router.push("/dashboard/students");
      else if (role === "mentor") router.push("/dashboard/mentor");
      else if (role === "professional") router.push("/dashboard/mentor-professional");
      else if (role === "recruiter") router.push("/dashboard/recruiter");
      else if (role === "admin") router.push("/dashboard/admin");
      else router.push("/choose-role");
    } else {
      router.push("/choose-role");
    }
  };

  const handleRecruiters = (e: React.MouseEvent) => {
    if (session) {
      e.preventDefault();
      const role = (session.user as any).role;
      if (role === "recruiter") {
        router.push("/dashboard/recruiter");
      } else {
        router.push("/recruiter-landing-page");
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12"
    >
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical labels */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          EDORA
        </span>
      </div>

      <div className="absolute inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#1f6feb"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full">
        <Shuffle
          text="EDORA"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover
          respectReducedMotion={true}
          loop={false}
          loopDelay={0}
        />

        <h2 className="font-[var(--font-bebas)] text-muted-foreground text-[clamp(1rem,3vw,2rem)] mt-4 tracking-wide">
          AI-Powered Self-Learning, Structured for Real Growth
        </h2>

        <p className="mt-12 max-w-md font-mono text-sm text-muted-foreground leading-relaxed">
          EDORA helps students, mentors, and professionals design clear learning
          roadmaps, stay consistent, and grow with measurable outcomes — powered
          by AI and guided by humans.
        </p>

        <div className="mt-16 flex items-center gap-8">
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-3 border border-border bg-secondary/50 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200 rounded-md"
          >
            <ScrambleTextOnHover
              text="Get Started Free"
              as="span"
              duration={0.6}
            />
            <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
          </button>
          <Link
            href="/recruiter-landing-page"
            onClick={handleRecruiters}
            className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
          >
            For Recruiters
          </Link>
        </div>
      </div>

      {/* Floating info tag */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <div className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Built for learners who want clarity, not chaos
        </div>
      </div>
    </section>
  );
}
