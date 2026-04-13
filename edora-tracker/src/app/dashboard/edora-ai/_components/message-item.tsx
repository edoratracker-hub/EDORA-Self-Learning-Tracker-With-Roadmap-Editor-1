"use client";

import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { BotMessageSquareIcon, Sparkles, User } from "lucide-react";
import { Message } from "./chat-interface";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex items-center justify-center size-8 rounded-full shrink-0",
          isUser ? "bg-primary" : "bg-muted-foreground/10",
        )}
      >
        {isUser ? (
          <User className="size-4 text-primary-foreground" />
        ) : (
          <BotMessageSquareIcon className="size-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex-1 max-w-[75%]",
          isUser && "flex flex-col items-end",
        )}
      >
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm",
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-muted-foreground mt-1.5 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
