"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Share2, Crown, Copy, Check, Link as LinkIcon, Search, Loader2 } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "head" | "student";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRACKER_BASE = "http://localhost:3000";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
];

function getInitials(name: string | null, email: string) {
  return (name ?? email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Avatar component (inline, no external dep) ───────────────────────────────

function Avatar({
  src,
  fallback,
  colorClass,
  size = "size-9",
}: {
  src?: string | null;
  fallback: string;
  colorClass?: string;
  size?: string;
}) {
  const [imgError, setImgError] = useState(false);
  return (
    <span
      className={`${size} rounded-full ring-2 ring-background inline-flex items-center justify-center overflow-hidden shrink-0`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={fallback}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className={`w-full h-full flex items-center justify-center text-[11px] font-semibold text-white ${colorClass ?? "bg-slate-600"}`}
        >
          {fallback}
        </span>
      )}
    </span>
  );
}

// ─── Tooltip component (inline, no external dep) ─────────────────────────────

function Tooltip({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded-md bg-popover border border-border shadow-md text-xs font-medium whitespace-nowrap z-50 text-popover-foreground">
          {label}
        </div>
      )}
    </div>
  );
}

// ─── Share Popover ────────────────────────────────────────────────────────────

function SharePopover({ classroomId, classroomName }: { classroomId: string; classroomName: string }) {
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  const inviteLink = `${TRACKER_BASE}/join/classroom/${classroomId}`;
  const whatsappMessage = encodeURIComponent(
    `🎓 You're invited to join the classroom "${classroomName}" on Edora!\n\nClick the link to join:\n${inviteLink}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy link.");
    }
  };

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${TRACKER_BASE}/api/classroom/external/${classroomId}/invite?q=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        setResults(data.users ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [classroomId]);

  const handleAdd = async (userId: string, userName: string) => {
    setAdding(userId);
    try {
      const res = await fetch(
        `${TRACKER_BASE}/api/classroom/external/${classroomId}/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setAddedIds((prev) => new Set([...prev, userId]));
        setResults((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert(data.error ?? "Failed to add student.");
      }
    } catch {
      alert("Failed to add student.");
    }
    setAdding(null);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background hover:bg-accent text-sm font-medium transition-colors"
          id="share-classroom-btn"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-[320px] sm:w-[400px] rounded-lg border border-border bg-background shadow-xl outline-none animate-in fade-in-0 zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Share2 className="size-4 text-blue-400" />
                Share Classroom
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Invite students to &quot;{classroomName}&quot;
              </p>
            </div>
            <Popover.Close className="rounded-sm opacity-70 hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                />
              </svg>
            </Popover.Close>
          </div>

          <div className="flex flex-col px-4 py-3 space-y-4">
            {/* WhatsApp share */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Share via
              </p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" id="share-whatsapp-btn">
                <button className="w-full flex items-center justify-start gap-3 h-9 px-3 rounded-md border border-border bg-background hover:bg-green-500/10 hover:border-green-500/40 hover:text-green-400 transition-colors text-sm">
                  {/* WhatsApp icon inline */}
                  <svg className="size-5 text-green-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="text-xs">Share on WhatsApp</span>
                </button>
              </a>
            </div>

            <div className="h-px bg-border" />

            {/* Search and Invite */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Invite Student
              </p>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  id="student-search-input"
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-8 pr-3 h-9 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {searching && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              )}

              {results.length > 0 && (
                <div className="max-h-[180px] overflow-y-auto border border-border rounded-md">
                  <div className="p-1">
                    {results.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50"
                      >
                        <Avatar
                          src={u.image}
                          fallback={u.name?.substring(0, 2).toUpperCase() || "??"}
                          colorClass="bg-slate-600"
                          size="size-7"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                        </div>
                        <button
                          className="h-7 px-2 rounded-md bg-primary text-primary-foreground text-[10px] font-medium shrink-0 disabled:opacity-60 flex items-center gap-1"
                          disabled={adding === u.id}
                          onClick={() => handleAdd(u.id, u.name || u.email)}
                        >
                          {adding === u.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            "Invite"
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Copy link */}
            <button
              className="w-full flex items-center justify-center gap-2 h-9 rounded-md border border-border bg-background text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleCopy}
              id="copy-link-btn"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <LinkIcon className="size-3.5" />
              )}
              {copied ? "Copied Link" : "Copy Invite Link"}
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ─── Collaborators ────────────────────────────────────────────────────────────

function ClassroomCollaborators({
  members,
  classroomId,
  classroomName,
}: {
  members: Member[];
  classroomId: string;
  classroomName: string;
}) {
  const visible = members.slice(0, 6);
  const overflow = members.length - 6;

  return (
    <div className="flex items-center gap-2">
      {/* Stacked avatars */}
      <div className="flex -space-x-1.5">
        {visible.map((member, index) => (
          <Tooltip
            key={member.id}
            label={
              <span className="flex items-end gap-1.5">
                {member.role === "head" && <Crown className="size-3 text-amber-400" />}
                {member.name ?? member.email}
                {member.role === "head" && (
                  <span className="text-amber-400 text-[10px]">(Head)</span>
                )}
              </span>
            }

          >
            <div
              className="relative cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              style={{ zIndex: visible.length - index }}
            >
              <Avatar
                src={member.image}
                fallback={getInitials(member.name, member.email)}
                colorClass={AVATAR_COLORS[index % AVATAR_COLORS.length]}
              />
              {member.role === "head" && (
                <span className="absolute -top-1 -right-0.5 size-3.5 rounded-full bg-amber-500 flex items-center justify-center ring-1 ring-background">
                  <Crown className="size-2 text-white" />
                </span>
              )}
            </div>
          </Tooltip>
        ))}
      </div>

      {/* +N overflow */}
      {overflow > 0 && (
        <div className="ml-1 flex items-center justify-center size-8 rounded-full bg-accent ring-2 ring-background text-xs font-medium text-muted-foreground">
          +{overflow}
        </div>
      )}

      {/* Share button */}
      <SharePopover classroomId={classroomId} classroomName={classroomName} />
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function ClassroomHeader({
  classroomName,
  classroomId,
}: {
  classroomName: string;
  classroomId: string;
}) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch(`${TRACKER_BASE}/api/classroom/external/${classroomId}/members`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMembers(data.members ?? []);
      })
      .catch(() => { });
  }, [classroomId]);

  return (
    <div className="w-full max-w-screen-lg flex items-center justify-between border-b border-border pb-3 mb-2">
      {/* Left: back + title */}
      <div className="flex items-center gap-3">
        <a
          href={`${TRACKER_BASE}/dashboard/students/classroom`}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </a>
        <h1 className="text-lg font-bold truncate max-w-[240px] sm:max-w-none">
          {classroomName}
        </h1>
      </div>

      {/* Right: collaborators + share */}
      <ClassroomCollaborators
        members={members}
        classroomId={classroomId}
        classroomName={classroomName}
      />
    </div>
  );
}
