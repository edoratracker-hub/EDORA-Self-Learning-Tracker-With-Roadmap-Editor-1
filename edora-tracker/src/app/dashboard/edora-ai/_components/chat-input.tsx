"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Paperclip,
  Image,
  Smile,
  ArrowRight,
  Sparkles,
  BotMessageSquareIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  variant?: "landing" | "chat";
}

export function ChatInput({
  onSendMessage,
  isLoading,
  variant = "chat",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  // ── Landing variant: pill‑shaped bar matching the screenshot ──
  if (variant === "landing") {
    return (
      <div className="w-full">
        <div className="relative flex items-center rounded-full border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg transition-all focus-within:border-ring/50 focus-within:shadow-ring/10 focus-within:shadow-xl">
          {/* AI icon */}
          <div className="flex items-center justify-center pl-5 pr-1">
            <BotMessageSquareIcon className="size-5 text-accent" />
          </div>

          {/* Input */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about careers and get instant answers..."
            className="min-h-[52px] max-h-[52px] resize-none border-0 bg-transparent px-3 py-3.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 flex-1"
            disabled={isLoading}
            rows={1}
          />

          {/* Arrow button */}
          <div className="pr-3">
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className={cn(
                "flex items-center justify-center size-10 rounded-full transition-all",
                message.trim() && !isLoading
                  ? "bg-muted-foreground/20 hover:bg-muted-foreground/30 text-foreground"
                  : "bg-muted-foreground/10 text-muted-foreground/40",
              )}
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Chat variant (existing input bar) ──
  return (
    <div className="px-4 md:px-6 py-4 bg-gradient-to-t from-background via-background to-background/80">
      <div className="max-w-4xl mx-auto">
        {/* Main Input Container */}
        <div className="relative rounded-2xl border-2 border-input bg-background shadow-sm transition-all focus-within:border-primary focus-within:shadow-md">
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message Edora AI..."
            className="min-h-[52px] max-h-[150px] resize-none border-0 bg-transparent px-4 py-3.5 pr-32 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            disabled={isLoading}
            rows={1}
          />

          {/* Action Buttons Container */}
          <div className="absolute bottom-2 right-2 flex items-center justify-between gap-1">
            {/* Attachment Buttons */}
            <div className="flex items-center gap-0.5 mr-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-accent"
                disabled={isLoading}
                title="Attach file"
              >
                <Paperclip className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-accent"
                disabled={isLoading}
                title="Add image"
              >
                <Image className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-accent"
                disabled={isLoading}
                title="Add emoji"
              >
                <Smile className="size-4" />
              </Button>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              size="icon"
              className={cn(
                "size-9 rounded-lg transition-all",
                message.trim() && !isLoading
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-muted",
              )}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>

        {/* Footer Text */}
        <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
          <span>Edora AI can make mistakes.</span>
          <span className="text-muted-foreground/60">•</span>
          <span>Press Enter to send, Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
