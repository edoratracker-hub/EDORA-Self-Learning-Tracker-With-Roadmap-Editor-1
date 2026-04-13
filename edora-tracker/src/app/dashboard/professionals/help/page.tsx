"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageSquare,
  BookOpen,
  Video,
  Mail,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Users,
  Settings,
  Briefcase,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const faqData = [
  {
    category: "Getting Started",
    icon: Sparkles,
    questions: [
      {
        q: "How do I complete my professional profile?",
        a: "Navigate to Dashboard → Onboarding or Settings → Profile. Fill in your professional background, expertise, skills, and links. A complete profile improves your visibility and connects you with more opportunities.",
      },
      {
        q: "What does the verification process involve?",
        a: "After completing your profile, you can submit it for verification. Our admin team reviews your credentials and professional background. Verification typically takes 1-3 business days. You'll receive an email notification once reviewed.",
      },
      {
        q: "How do I navigate between sections?",
        a: "Use the sidebar on the left to access all dashboard sections: Home, Roadmap, Analytics, Classroom, Career, Workspace, inbox, Explore, and Edora AI. You can collapse the sidebar by clicking the toggle button.",
      },
    ],
  },
  {
    category: "Edora AI",
    icon: Sparkles,
    questions: [
      {
        q: "What can I ask Edora AI?",
        a: "Edora AI is your personal career assistant. Ask it about: interview preparation, resume writing, career roadmaps, salary negotiation, skill development, networking strategies, career transitions, and any professional growth questions.",
      },
      {
        q: "Does Edora AI remember my previous conversations?",
        a: "Edora AI maintains context within your current session. Each time you start a new session, the conversation resets. We're working on persistent memory as a future feature.",
      },
      {
        q: "How accurate is the AI's career advice?",
        a: "Edora AI provides general career guidance based on industry best practices. For specialized advice (legal, financial, medical careers), we recommend consulting certified professionals. Always verify specific salary data with current market sources.",
      },
    ],
  },
  {
    category: "inbox & Messaging",
    icon: MessageSquare,
    questions: [
      {
        q: "How do I send a message to a mentor?",
        a: "Go to the Mentors page, find a mentor you'd like to connect with, and click 'Message'. This will open a direct conversation in your inbox. You can also access inbox directly from the sidebar.",
      },
      {
        q: "Can I send files or images in messages?",
        a: "Currently, the messaging system supports text messages. File sharing functionality is on our roadmap and will be available in a future update.",
      },
      {
        q: "How do I know when I have new messages?",
        a: "Check the inbox section regularly. We're working on real-time inbox to alert you immediately when new messages arrive.",
      },
    ],
  },
  {
    category: "Career & Jobs",
    icon: Briefcase,
    questions: [
      {
        q: "How do I apply to jobs on the platform?",
        a: "Go to the Career section and browse available opportunities. Click 'Apply Now' on any job listing. Your application is submitted directly to the recruiter. Track your applications in the 'My Applications' tab.",
      },
      {
        q: "Where can I see my scheduled interviews?",
        a: "Navigate to Career → Interviews tab to see all your scheduled interviews with details like date, time, and company. You can also view them in the Calendar section.",
      },
      {
        q: "Can I withdraw a job application?",
        a: "Currently, once submitted, applications cannot be withdrawn through the platform. Contact the recruiter directly through the inbox to communicate any changes.",
      },
    ],
  },
  {
    category: "Workspace",
    icon: BookOpen,
    questions: [
      {
        q: "How do I create a new workspace folder?",
        a: "In the Workspace section, click 'Create Folder' and give it a name. Inside each folder, you can create files with different templates like To-Do lists, project plans, notes, and more.",
      },
      {
        q: "Are my workspace files saved automatically?",
        a: "Yes! The workspace editor features auto-save. Your content is saved to the database as you type, so you never have to worry about losing your work.",
      },
      {
        q: "Can I share workspace files with my team?",
        a: "Currently, workspaces are private to each user. Collaborative editing and file sharing are planned for a future release.",
      },
    ],
  },
  {
    category: "Settings & Account",
    icon: Settings,
    questions: [
      {
        q: "How do I change my profile photo?",
        a: "Go to Settings → Profile and click 'Upload Photo'. Currently supported formats are JPG, PNG and GIF up to 2MB.",
      },
      {
        q: "How do I change the app theme (dark/light mode)?",
        a: "Navigate to Settings → Appearance and select your preferred theme. Changes apply immediately across the entire application.",
      },
      {
        q: "How do I update my notification preferences?",
        a: "Go to Settings → inbox to customize which alerts you receive, including email inbox, in-app alerts, and activity digests.",
      },
    ],
  },
];

const quickLinks = [
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides for all features",
    icon: Video,
    action: "Coming Soon",
    disabled: true,
  },
  {
    title: "Community Forum",
    description: "Connect with other professionals",
    icon: Users,
    action: "Visit Forum",
    disabled: true,
  },
  {
    title: "Email Support",
    description: "Get help from our support team",
    icon: Mail,
    action: "edoratracker@gmail.com",
    href: "mailto:edoratracker@gmail.com",
    disabled: false,
  },
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("general");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const filteredFAQs = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmittingFeedback(true);
    // Simulate sending feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thank you for your feedback! We'll review it shortly.");
    setFeedback("");
    setSubmittingFeedback(false);
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        </div>
        <p className="text-muted-foreground">
          Find answers to common questions or reach out to our support team
        </p>
      </div>

      <Separator className="bg-blue-500 rounded-full" />

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => (
          <Card
            key={link.title}
            className={`hover:shadow-md transition-shadow ${link.disabled ? "opacity-70" : "cursor-pointer"}`}
          >
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 shrink-0">
                <link.icon className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{link.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {link.description}
                </p>
                {link.disabled ? (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {link.action}
                  </Badge>
                ) : link.href ? (
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    {link.action}
                    <ChevronRight className="size-3" />
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>

        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No results found for "{searchQuery}"</p>
            <p className="text-sm mt-1">
              Try a different search term or browse all categories
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFAQs.map((category) => (
              <Card key={category.category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <category.icon className="size-5 text-primary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, idx) => (
                      <AccordionItem key={idx} value={`${category.category}-${idx}`}>
                        <AccordionTrigger className="text-left text-sm font-medium">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            Still need help?
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Send us your feedback or
            question.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "general",
                  "bug report",
                  "feature request",
                  "account issue",
                ].map((cat) => (
                  <Badge
                    key={cat}
                    variant={feedbackCategory === cat ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setFeedbackCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Your Message
              </label>
              <Textarea
                id="feedback"
                placeholder="Describe your question, issue, or feedback in detail..."
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={submittingFeedback || !feedback.trim()}>
              {submittingFeedback ? "Sending..." : "Send Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
