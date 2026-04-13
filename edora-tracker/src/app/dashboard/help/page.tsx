"use client";

import React, { useState } from "react";
import {
  Search,
  BookOpen,
  MessageCircleQuestion,
  Mail,
  LifeBuoy,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Calendar,
  Users,
  FileText,
  Settings,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ── Data ────────────────────────────────────────────────────────────────────

const quickLinks = [
  {
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "#getting-started",
  },
  {
    title: "FAQs",
    description: "Answers to commonly asked questions",
    icon: MessageCircleQuestion,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    href: "#faq",
  },
  {
    title: "Contact Support",
    description: "Reach out to our support team",
    icon: Mail,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    href: "#contact",
  },
  {
    title: "Guides & Tutorials",
    description: "Step-by-step walkthroughs",
    icon: LifeBuoy,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    href: "#guides",
  },
];

const faqItems = [
  {
    category: "Account",
    questions: [
      {
        q: "How do I reset my password?",
        a: 'Navigate to Settings → Security and click "Change Password". You\'ll receive a verification email to confirm the change.',
      },
      {
        q: "Can I change my email address?",
        a: "Yes, go to Settings → Profile and update your email. You'll need to verify the new address before it takes effect.",
      },
      {
        q: "How do I update my profile information?",
        a: 'Click on your avatar in the sidebar, then select "Edit Profile" to update your name, bio, and other details.',
      },
    ],
  },
  {
    category: "Dashboard",
    questions: [
      {
        q: "How do I navigate the dashboard?",
        a: "Use the sidebar on the left to switch between sections. The top bar has quick search and inbox. You can collapse the sidebar for more workspace.",
      },
      {
        q: "Can I customize my dashboard layout?",
        a: "Yes! Click the settings gear icon on the dashboard to rearrange widgets, hide sections, or change your preferred view.",
      },
    ],
  },
  {
    category: "Scheduling",
    questions: [
      {
        q: "How do I schedule a session?",
        a: 'Go to the Calendar section, click "New Session", pick a date and time, and select your mentor or mentee. Confirmations are sent automatically.',
      },
      {
        q: "Can I reschedule or cancel a session?",
        a: "Open the session from your calendar and choose Reschedule or Cancel. Please provide at least 24 hours notice when possible.",
      },
    ],
  },
  {
    category: "Collaboration",
    questions: [
      {
        q: "How does real-time collaboration work?",
        a: "Open any shared document and start editing — changes sync instantly for all participants. You'll see colored cursors showing who's editing what.",
      },
      {
        q: "How do I share a document with my team?",
        a: 'Click the "Share" button on any document to generate a link or invite specific team members by email.',
      },
    ],
  },
];

const guideItems = [
  {
    title: "Getting Started Guide",
    description:
      "Everything you need to set up your account and explore the platform.",
    icon: GraduationCap,
    tag: "Beginner",
  },
  {
    title: "Scheduling Sessions",
    description:
      "Learn how to book, manage, and track your mentoring sessions.",
    icon: Calendar,
    tag: "Essential",
  },
  {
    title: "Team Collaboration",
    description: "Work together in real-time with shared documents and chat.",
    icon: Users,
    tag: "Popular",
  },
  {
    title: "Reports & Analytics",
    description:
      "Understand your progress with detailed analytics and exports.",
    icon: FileText,
    tag: "Advanced",
  },
  {
    title: "Notification Preferences",
    description: "Customize how and when you receive alerts and reminders.",
    icon: Bell,
    tag: "Settings",
  },
  {
    title: "Account & Security",
    description:
      "Manage your credentials, two-factor auth, and privacy settings.",
    icon: Settings,
    tag: "Security",
  },
];

// ── Collapsible FAQ Item ────────────────────────────────────────────────────

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left group"
    >
      <div className="flex items-start justify-between gap-4 py-4">
        <span className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </div>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </button>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function DashboardHelpPage() {
  const [search, setSearch] = useState("");

  const filteredFaq = faqItems
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  const filteredGuides = guideItems.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Hero / Search ──────────────────────────────────── */}
      <section className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How can we help?
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          Search our guides and FAQs, or browse the topics below.
        </p>
        <div className="relative mx-auto mt-4 max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help…"
            className="h-11 pl-10 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* ── Quick Links ────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(
          ({ title, description, icon: Icon, color, bg, href }) => (
            <a key={title} href={href} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div
                    className={cn(
                      "mb-2 flex size-10 items-center justify-center rounded-lg",
                      bg,
                    )}
                  >
                    <Icon className={cn("size-5", color)} />
                  </div>
                  <CardTitle className="text-sm group-hover:text-primary transition-colors">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            </a>
          ),
        )}
      </section>

      {/* ── Guides & Tutorials ─────────────────────────────── */}
      <section id="guides" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Guides & Tutorials
          </h2>
        </div>

        {filteredGuides.length === 0 && search && (
          <p className="text-sm text-muted-foreground">
            No guides match your search.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map(({ title, description, icon: Icon, tag }) => (
            <Card
              key={title}
              className="group cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <Badge variant="secondary" className="text-[11px]">
                    {tag}
                  </Badge>
                </div>
                <CardTitle className="mt-2 text-sm group-hover:text-primary transition-colors">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">
                  {description}
                </CardDescription>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read more <ArrowRight className="size-3" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section id="faq" className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Frequently Asked Questions
        </h2>

        {filteredFaq.length === 0 && search && (
          <p className="text-sm text-muted-foreground">
            No questions match your search.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredFaq.map((cat) => (
            <Card key={cat.category}>
              <CardHeader>
                <CardTitle className="text-base">{cat.category}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y">
                  {cat.questions.map((item) => (
                    <FaqItem key={item.q} question={item.q} answer={item.a} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Contact Support ────────────────────────────────── */}
      <section id="contact" className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Still need help?
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="flex flex-col items-center p-6 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-5 text-primary" />
            </div>
            <CardTitle className="text-sm">Email Support</CardTitle>
            <CardDescription className="mt-1">
              Get a response within 24 hours
            </CardDescription>
            <Button variant="outline" size="sm" className="mt-4 gap-1.5">
              Send an email <ExternalLink className="size-3" />
            </Button>
          </Card>

          <Card className="flex flex-col items-center p-6 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <MessageCircleQuestion className="size-5 text-primary" />
            </div>
            <CardTitle className="text-sm">Live Chat</CardTitle>
            <CardDescription className="mt-1">
              Chat with us Mon–Fri, 9 AM – 6 PM
            </CardDescription>
            <Button size="sm" className="mt-4 gap-1.5">
              Start a conversation
            </Button>
          </Card>
        </div>
      </section>

      {/* ── Footer note ────────────────────────────────────── */}
      <p className="pb-4 text-center text-xs text-muted-foreground">
        Can&apos;t find what you&apos;re looking for?{" "}
        <a
          href="#contact"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Contact our team
        </a>{" "}
        and we&apos;ll get back to you as soon as possible.
      </p>
    </div>
  );
}
