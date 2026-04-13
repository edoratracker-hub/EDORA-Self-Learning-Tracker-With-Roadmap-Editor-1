"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const footerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current) return

        const ctx = gsap.context(() => {
            // Header slide in
            if (headerRef.current) {
                gsap.from(headerRef.current, {
                    x: -60,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Grid columns fade up with stagger
            if (gridRef.current) {
                const columns = gridRef.current.querySelectorAll(":scope > div")
                gsap.from(columns, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Footer fade in
            if (footerRef.current) {
                gsap.from(footerRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 95%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="colophon"
            className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
        >
            {/* Section header */}
            <div ref={headerRef} className="mb-16">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">04 / Get Started</span>
                <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">START BUILDING YOUR LEARNING JOURNEY WITH PURPOSE</h2>
            </div>

            {/* Multi-column layout */}
            <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
                {/* Platform */}
                <div className="col-span-1">
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Platform</h4>
                    <ul className="space-y-2">
                        <li className="font-mono text-xs text-foreground/80">AI Roadmaps</li>
                        <li className="font-mono text-xs text-foreground/80">Progress Tracking</li>
                        <li className="font-mono text-xs text-foreground/80">Mentor Validation</li>
                    </ul>
                </div>

                {/* For */}
                <div className="col-span-1">
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">For</h4>
                    <ul className="space-y-2">
                        <li className="font-mono text-xs text-foreground/80">Students</li>
                        <li className="font-mono text-xs text-foreground/80">Mentors</li>
                        <li className="font-mono text-xs text-foreground/80">Professionals</li>
                    </ul>
                </div>

                {/* Features */}
                <div className="col-span-1">
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Features</h4>
                    <ul className="space-y-2">
                        <li className="font-mono text-xs text-foreground/80">Milestones</li>
                        <li className="font-mono text-xs text-foreground/80">Badges</li>
                        <li className="font-mono text-xs text-foreground/80">Certificates</li>
                    </ul>
                </div>

                {/* Focus */}
                <div className="col-span-1">
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Focus</h4>
                    <ul className="space-y-2">
                        <li className="font-mono text-xs text-foreground/80">Clarity</li>
                        <li className="font-mono text-xs text-foreground/80">Consistency</li>
                        <li className="font-mono text-xs text-foreground/80">Outcomes</li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="col-span-1">
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact</h4>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="mailto:hello@edora.app"
                                className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200"
                            >
                                Email
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200"
                            >
                                Support
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Year */}
                <div className="col-span-1">
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Year</h4>
                    <ul className="space-y-2">
                        <li className="font-mono text-xs text-foreground/80">2026</li>
                        <li className="font-mono text-xs text-foreground/80">Launch</li>
                    </ul>
                </div>
            </div>

            {/* Bottom copyright */}
            <div
                ref={footerRef}
                className="mt-24 pt-8 border-t border-border/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    © 2026 EDORA. All rights reserved.
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">EDORA — Structured Learning. Guided Growth.</p>
            </div>
        </section>
    )
}
