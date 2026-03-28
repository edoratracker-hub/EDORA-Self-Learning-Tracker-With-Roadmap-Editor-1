"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/tailwind/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tailwind/ui/popover";
import { Share2Icon, Crown, Check, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "head" | "student";
}

// ─── Inline Avatar (no @radix-ui/react-avatar needed) ─────────────────────────

function Avatar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function AvatarImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) return null;

  return (
    <img
      src={src}
      alt={alt ?? ""}
      className={cn("aspect-square h-full w-full object-cover", className)}
      style={{ display: loaded ? "block" : "none" }}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  );
}

function AvatarFallback({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Inline Tooltip (CSS-only, no @radix-ui/react-tooltip needed) ─────────────

function TooltipWrap({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="group/tip relative inline-flex">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 scale-95 opacity-0 transition-all duration-150 group-hover/tip:scale-100 group-hover/tip:opacity-100">
        <div className="whitespace-nowrap rounded-md border bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-md">
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── WhatsApp SVG icon (no @tabler/icons-react needed) ────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5", className)}
    >
      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
      <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
    </svg>
  );
}

// ─── Share Popover ────────────────────────────────────────────────────────────

function ClassroomSharePopover({
  children,
  classroomId,
  classroomName,
}: {
  children?: React.ReactNode;
  classroomId: string;
  classroomName: string;
}) {
  const [copied, setCopied] = useState(false);

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/join/classroom/${classroomId}`
      : `https://edora.app/join/classroom/${classroomId}`;

  const whatsappMessage = encodeURIComponent(
    `🎓 You're invited to join the classroom "${classroomName}" on Edora!\n\nClick the link to join:\n${inviteLink}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Copied Link");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            <Share2Icon className="size-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] sm:w-[400px] p-0">
        {/* Header */}
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Share2Icon className="text-blue-400 size-4" />
            <span>Share Classroom</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Invite students to &quot;{classroomName}&quot;
          </p>
        </div>

        <div className="flex flex-col px-4 py-3 space-y-3">
          {/* WhatsApp share */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Share via
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="share-whatsapp-btn"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-9 hover:bg-green-500/10 hover:border-green-500/40 hover:text-green-400 transition-colors"
              >
                <WhatsAppIcon className="text-green-400 size-5" />
                <span className="text-xs">Share on WhatsApp</span>
              </Button>
            </a>
          </div>

          <div className="h-px bg-border" />

          {/* Copy link button */}
          <Button
            variant="outline"
            className="w-full gap-2 h-9 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            id="copy-link-btn"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <LinkIcon className="size-3.5" />
            )}
            {copied ? "Copied Link" : "Copy Invite Link"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Collaborator Avatars ─────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
];

function ClassroomCollaborators({
  members = [],
  classroomId,
  classroomName,
}: {
  members: Member[];
  classroomId: string;
  classroomName: string;
}) {
  const visible = members.slice(0, 6);
  const overflow = members.length - 6;

  if (!members.length) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {/* Stacked avatars */}
        <div className="flex -space-x-1.5">
          {visible.map((member, index) => (
            <TooltipWrap
              key={member.id}
              label={
                <div className="flex items-center gap-1.5">
                  {member.role === "head" && (
                    <Crown className="size-3 text-amber-400" />
                  )}
                  {member.name ?? member.email}
                  {member.role === "head" && (
                    <span className="text-amber-400 text-[10px]">(Head)</span>
                  )}
                </div>
              }
            >
              <div
                className="relative"
                style={{ zIndex: visible.length - index }}
              >
                <Avatar
                  className={cn(
                    "size-9 ring-2 ring-background cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:z-50"
                  )}
                >
                  <AvatarImage
                    src={member.image ?? undefined}
                    alt={member.name ?? ""}
                  />
                  <AvatarFallback
                    className={cn(
                      "text-[11px] font-medium text-white",
                      AVATAR_COLORS[index % AVATAR_COLORS.length]
                    )}
                  >
                    {(member.name ?? member.email)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* Head crown indicator */}
                {member.role === "head" && (
                  <span className="absolute -top-1 -right-0.5 size-3.5 rounded-full bg-amber-500 flex items-center justify-center ring-1 ring-background">
                    <Crown className="size-2 text-white" />
                  </span>
                )}
              </div>
            </TooltipWrap>
          ))}
        </div>

        {/* +N more count */}
        {overflow > 0 && (
          <div className="ml-1 flex items-center justify-center size-8 rounded-full bg-[#21262d] ring-2 ring-background text-xs font-medium text-muted-foreground">
            +{overflow}
          </div>
        )}
      </div>

      {/* Share button */}
      <div className="ml-2">
        <ClassroomSharePopover
          classroomId={classroomId}
          classroomName={classroomName}
        >
          <Button variant="outline" size="sm">
            <Share2Icon className="mr-2 size-4" />
            Share
          </Button>
        </ClassroomSharePopover>
      </div>
    </div>
  );
}

// ─── EditorHeader (main export) ───────────────────────────────────────────────

export const EditorHeader = ({
  classroomId,
  classroomName,
  members = [],
}: {
  classroomId?: string;
  classroomName?: string;
  members?: Member[];
}) => {
  return (
    <div className="w-full flex justify-end">
      {classroomId && classroomName ? (
        <ClassroomCollaborators
          classroomId={classroomId}
          classroomName={classroomName}
          members={members}
        />
      ) : (
        <span className="text-sm text-muted-foreground"></span>
      )}
    </div>
  );
}; 
