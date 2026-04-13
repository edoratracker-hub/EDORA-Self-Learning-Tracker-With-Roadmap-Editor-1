"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessagesSquareIcon,
  Minimize2Icon,
  SendIcon,
} from "lucide-react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getClassroomMessages, sendClassroomMessage } from "@/app/actions/classroom-actions";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: string;
  senderImage?: string | null;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

export const StudentsClassroomChat = ({
  classroomId,
  classroomName,
  memberCount = 0,
  children,
}: {
  classroomId: string;
  classroomName: string;
  memberCount?: number;
  children?: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Drag state ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    const res = await getClassroomMessages(classroomId);
    if (res.success) {
      setMessages(res.messages);
    }
  }, [classroomId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "instant",
        });
      }, 50);
    }
  }, [open, messages.length]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        originX: position.x,
        originY: position.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [position],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current?.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    if (dragRef.current) {
      dragRef.current.isDragging = false;
    }
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput("");
    const res = await sendClassroomMessage(classroomId, trimmed);
    if (res.success) {
      loadMessages();
    } else {
      toast.error(res.error || "Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-8 z-50"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="cursor-grab active:cursor-grabbing select-none touch-none"
        >
          {children || (
            <Button
              variant="default"
              size="sm"
              className="h-15 w-15 rounded-full shadow-lg"
            >
              <MessagesSquareIcon className="size-8" />
            </Button>
          )}
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-80 sm:w-96 sm:h-100 p-0 flex flex-col overflow-hidden rounded-xl bg-background/95 backdrop-blur-md border-[#30363d] shadow-2xl"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
        >
          {/* Header — draggable handle */}
          <div className="flex items-center justify-between gap-2 border-b border-[#30363d] px-4 py-3 bg-muted/50 ">
            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">
                  {classroomName}
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <span>{memberCount} members</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setOpen(false)}
            >
              <Minimize2Icon className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-4 h-[350px] scrollbar-none"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <MessagesSquareIcon className="size-10 mb-2" />
                <p className="text-xs">No messages yet. <br /> Start the conversation!</p>
              </div>
            )}
            {messages.map((msg, index) => {
              const showAvatar =
                index === 0 || messages[index - 1].sender !== msg.sender;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.isOwn ? "flex-row-reverse" : "flex-row"} ${!showAvatar ? (msg.isOwn ? "mr-8" : "ml-8") : ""}`}
                >
                  {showAvatar && (
                    <Avatar size="sm" className="mt-1 shrink-0 h-6 w-6">
                      <AvatarImage src={msg.senderImage ?? undefined} />
                      <AvatarFallback
                        className={
                          msg.isOwn
                            ? "bg-primary/20 text-primary text-[10px]"
                            : "bg-muted-foreground/20 text-muted-foreground text-[10px]"
                        }
                      >
                        {msg.sender
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col ${msg.isOwn ? "items-end" : "items-start"} min-w-0 flex-1`}
                  >
                    {showAvatar && (
                      <span className="text-[10px] font-medium text-muted-foreground mb-0.5 px-1">
                        {msg.sender}
                      </span>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.isOwn
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                        }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 mt-0.5 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="border-t border-[#30363d] px-3 py-3 flex items-center gap-2 bg-[#0d1117]/50">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="h-9 text-xs bg-background/50 border-[#30363d]"
            />
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
