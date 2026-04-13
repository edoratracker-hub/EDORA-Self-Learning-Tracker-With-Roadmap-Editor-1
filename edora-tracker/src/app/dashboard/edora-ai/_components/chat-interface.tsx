"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageItem } from "./message-item";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BotMessageSquareIcon, Trash2 } from "lucide-react";
import { getEdoraAiResponse } from "@/app/actions/ai-actions";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const preRecordedQA: Record<string, string> = {
  "How do I prepare for interviews?":
    "Preparing for interviews involves researching the company, practicing common behavioral questions (like the STAR method), and reviewing technical concepts relevant to the role. Edora provides mentorship, mock interviews and detailed resume reviews to help you get ready!",
  "Can I improve my resume with AI?":
    "Yes! Edora AI can analyze your resume, suggest impactful action verbs, optimize your bullet points for ATS (Applicant Tracking Systems), and tailor your experience to match specific target job descriptions.",
  "What is a career roadmap?":
    "A career roadmap is a step-by-step interactive guide that outlines the skills, milestones, and experiences you need to reach a specific career goal. Edora offers dynamically generated, personalized personalized roadmaps based on your target role.",
  "How do I choose the right career?":
    "Choosing the right career starts with understanding your strengths, interests, and current market demand. Explore different fields, try out small projects, talk to mentors on Edora, and use our platform to analyze potential career paths.",
  "Why should I practice mock interviews?":
    "Mock interviews simulate the real interview environment, helping you reduce anxiety, refine your answers, and identify areas for improvement. Feedback from mentors or our AI coach can drastically improve your real-world performance.",
};

const suggestionChips = Object.keys(preRecordedQA);

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const presetAnswer = preRecordedQA[content.trim()];

    if (presetAnswer) {
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: presetAnswer,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 600);
      return;
    }

    try {
      // Map the entire conversational history to give the AI context over previous questions
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content,
      })).concat([{ role: "user", content }]);

      const response = await getEdoraAiResponse(historyPayload);

      if (response.success && response.text) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.text,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || "Unknown response format from Edora AI API");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, there was an error processing your request: ${error.message}`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  // ── Welcome / Landing View ──
  if (!hasMessages) {
    return (
      <div className="relative flex flex-col items-center justify-center h-full bg-background overflow-hidden">
        {/* Dot‑grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl px-4">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-10 tracking-tight">
            How can we help?
          </h1>

          {/* Search / Chat input bar */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            variant="landing"
          />

          {/* Suggestion chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-border hover:bg-card transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Chat View ──
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-muted-foreground/10">
            <BotMessageSquareIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Edora AI</h2>
            <p className="text-xs text-muted-foreground">
              Your AI Career Assistant
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="gap-2"
        >
          <Trash2 className="size-4" />
          Clear Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center size-8 rounded-full shrink-0">
                  <BotMessageSquareIcon className="size-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                      <div className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                      <div className="size-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          variant="chat"
        />
      </div>
    </div>
  );
}
