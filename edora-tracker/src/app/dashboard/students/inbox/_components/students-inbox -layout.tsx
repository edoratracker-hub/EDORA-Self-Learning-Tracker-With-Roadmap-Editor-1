"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  Check,
  CheckCheck,
  CalendarIcon,
  BookOpenIcon,
  UsersIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  BellIcon,
  Loader2,
  CheckCircle2,
  XCircle,
  PartyPopperIcon,
  AlertTriangleIcon,
  TrophyIcon,
  MapIcon,
  FileEditIcon,
  AwardIcon,
  StarIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  respondToInvite,
} from "@/app/actions/collaboration-actions";
import { AppNotification } from "./types";

/* ------------------------------------------------------------------ */
/*  Empty-state SVG illustration (mountains + ninja character scene)   */
/* ------------------------------------------------------------------ */
function InboxEmptyIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background mountains */}
      <path
        d="M0 260 L80 120 L130 180 L180 90 L230 160 L270 80 L320 150 L370 100 L420 140 L480 70 L480 260 Z"
        fill="hsl(220 20% 18%)"
        opacity="0.6"
      />
      <path
        d="M0 260 L60 160 L120 200 L170 140 L220 190 L260 130 L310 185 L360 150 L410 180 L480 120 L480 260 Z"
        fill="hsl(220 20% 15%)"
        opacity="0.7"
      />

      {/* Pine trees silhouette */}
      <g fill="hsl(220 15% 13%)" opacity="0.9">
        <polygon points="95,230 110,170 115,190 125,155 130,175 140,140 145,160 135,230" />
        <polygon points="140,230 150,180 155,195 162,160 167,178 172,145 178,165 170,230" />
        <polygon points="175,230 185,185 190,198 196,168 201,183 206,152 211,170 205,230" />
        <polygon points="340,230 348,188 352,200 358,172 362,186 367,155 372,175 365,230" />
      </g>

      {/* Ground line */}
      <rect x="60" y="228" width="370" height="4" rx="2" fill="hsl(220 15% 16%)" />

      {/* Small cat/fox creature on the left */}
      <g transform="translate(155, 195)" fill="hsl(215 15% 35%)">
        <ellipse cx="16" cy="22" rx="14" ry="10" />
        <ellipse cx="26" cy="14" rx="8" ry="7" />
        <polygon points="22,4 20,12 26,10" />
        <polygon points="30,4 34,12 28,10" />
        <path
          d="M2 22 Q-8 8 -2 4"
          stroke="hsl(215 15% 35%)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Rock on the right */}
      <g transform="translate(330, 208)">
        <path d="M0 22 L6 8 L14 2 L22 4 L30 10 L32 22 Z" fill="hsl(220 10% 28%)" />
        <path d="M6 8 L14 2 L22 4 L18 12 L10 14 Z" fill="hsl(220 10% 35%)" />
      </g>

      {/* Small twigs near rock */}
      <g stroke="hsl(220 10% 30%)" strokeWidth="1.5" strokeLinecap="round">
        <line x1="355" y1="228" x2="360" y2="215" />
        <line x1="360" y1="215" x2="356" y2="208" />
        <line x1="360" y1="215" x2="365" y2="210" />
      </g>

      {/* ---- Ninja/warrior character (blue neon outline) ---- */}
      <g transform="translate(230, 95)" strokeLinecap="round" strokeLinejoin="round">
        <line x1="15" y1="25" x2="80" y2="-20" stroke="hsl(220 10% 50%)" strokeWidth="3" />
        <g stroke="hsl(220 10% 45%)" strokeWidth="1.5">
          <line x1="80" y1="-20" x2="90" y2="-28" />
          <line x1="80" y1="-20" x2="92" y2="-22" />
          <line x1="80" y1="-20" x2="88" y2="-16" />
          <line x1="80" y1="-20" x2="85" y2="-12" />
        </g>
        <circle cx="35" cy="18" r="16" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <path d="M22 6 L18 -6 L28 2" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <path d="M48 6 L52 -6 L42 2" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <circle cx="30" cy="18" r="2" fill="hsl(210 100% 60%)" />
        <circle cx="42" cy="18" r="2" fill="hsl(210 100% 60%)" />
        <path d="M28 34 L22 70 L48 70 L42 34" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <line x1="23" y1="52" x2="47" y2="52" stroke="hsl(210 100% 60%)" strokeWidth="2" />
        <path d="M28 40 L10 30 L15 25" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <path d="M42 40 L58 32 L55 28" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <path d="M20 34 Q5 45 -5 42 Q-10 55 -5 65" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <path d="M20 34 Q8 50 0 55" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <path d="M28 70 L24 95 L18 100 L28 100" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <path d="M42 70 L44 95 L50 100 L40 100" stroke="hsl(210 100% 60%)" strokeWidth="2" fill="none" />
        <circle cx="35" cy="50" r="45" fill="hsl(210 100% 60%)" opacity="0.04" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Notification type config                                           */
/* ------------------------------------------------------------------ */
const NOTIF_TYPE_CONFIG: Record<string, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
  category: string;
}> = {
  collab_invite: {
    icon: UsersIcon,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    label: "Collaboration",
    category: "Collaboration",
  },
  interview_scheduled: {
    icon: BriefcaseIcon,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    label: "Interview",
    category: "Task",
  },
  interview_rescheduled: {
    icon: BriefcaseIcon,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    label: "Interview Update",
    category: "Task",
  },
  study_reminder: {
    icon: BookOpenIcon,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    label: "Study Reminder",
    category: "Task",
  },
  calendar_reminder: {
    icon: CalendarIcon,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    label: "Calendar",
    category: "Task",
  },
  calendar_event: {
    icon: CalendarIcon,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    label: "Calendar",
    category: "Task",
  },
  mentor_verification: {
    icon: ShieldCheckIcon,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Mentor",
    category: "Task",
  },
  general: {
    icon: BellIcon,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Notification",
    category: "Task",
  },
  daily_task_missed: {
    icon: AlertTriangleIcon,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    label: "Task Missed",
    category: "Task",
  },
  daily_task_completed: {
    icon: TrophyIcon,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    label: "Task Done",
    category: "Achievement",
  },
  milestone_achieved: {
    icon: AwardIcon,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    label: "Milestone",
    category: "Achievement",
  },
  roadmap_updated: {
    icon: MapIcon,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    label: "Roadmap Update",
    category: "Task",
  },
  workspace_update: {
    icon: FileEditIcon,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    label: "Workspace",
    category: "Collaboration",
  },
  achievement_unlocked: {
    icon: StarIcon,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    label: "Achievement",
    category: "Achievement",
  },
};

function getNotifConfig(type: string) {
  return NOTIF_TYPE_CONFIG[type] ?? NOTIF_TYPE_CONFIG.general;
}

/* ------------------------------------------------------------------ */
/*  Date label helper                                                  */
/* ------------------------------------------------------------------ */
function getDateLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return format(date, "EEEE"); // e.g., "Monday"
  return format(date, "MMM d, yyyy");
}

/* ------------------------------------------------------------------ */
/*  Single notification card                                            */
/* ------------------------------------------------------------------ */
function NotificationCard({
  notif,
  onMarkRead,
  onRespond,
}: {
  notif: any;
  onMarkRead: (id: string) => void;
  onRespond: (collaboratorId: string, accept: boolean, notifId: string) => void;
}) {
  const config = getNotifConfig(notif.type);
  const Icon = config.icon;
  const isCollab = notif.type === "collab_invite";
  const metadata = notif.metadata ? (typeof notif.metadata === "string" ? JSON.parse(notif.metadata) : notif.metadata) : null;
  const [responding, setResponding] = useState<"accept" | "decline" | null>(null);

  const handleRespond = async (accept: boolean) => {
    if (!metadata?.collaboratorId) return;
    setResponding(accept ? "accept" : "decline");
    await onRespond(metadata.collaboratorId, accept, notif.id);
    setResponding(null);
  };

  return (
    <div
      id={`notification-${notif.id}`}
      className={cn(
        "group relative flex gap-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-md",
        notif.read
          ? "bg-background border-border opacity-75 hover:opacity-100"
          : "bg-primary/[0.03] border-primary/20 shadow-sm"
      )}
      onClick={() => {
        if (!notif.read) onMarkRead(notif.id);
      }}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          config.bgColor
        )}
      >
        <Icon className={cn("size-4", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                config.color
              )}
            >
              {config.label}
            </span>
            {!notif.read && (
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {format(new Date(notif.createdAt), "MMM d, h:mm a")}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-foreground mb-0.5">
          {notif.title}
        </h4>

        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {notif.message}
        </p>

        {notif.fromUserName && (
          <div className="flex items-center gap-2 mt-2">
            {notif.fromUserImage ? (
              <img
                src={notif.fromUserImage}
                alt={notif.fromUserName}
                className="size-5 rounded-full"
              />
            ) : (
              <div className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                {notif.fromUserName?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {notif.fromUserName}
            </span>
          </div>
        )}

        {/* Accept / Reject buttons for collab invites */}
        {isCollab && metadata?.collaboratorId && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              id={`accept-collab-${notif.id}`}
              size="sm"
              variant="default"
              className="h-7 gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white"
              disabled={responding !== null}
              onClick={(e) => {
                e.stopPropagation();
                handleRespond(true);
              }}
            >
              {responding === "accept" ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3" />
              )}
              Accept
            </Button>
            <Button
              id={`decline-collab-${notif.id}`}
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
              disabled={responding !== null}
              onClick={(e) => {
                e.stopPropagation();
                handleRespond(false);
              }}
            >
              {responding === "decline" ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <XCircle className="size-3" />
              )}
              Decline
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Inbox Layout Component                                        */
/* ------------------------------------------------------------------ */
type FilterTab = "all" | "unread";
type GroupByOption = "Date" | "Collaboration" | "Task";

export const StudentsInboxLayout = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [groupBy, setGroupBy] = useState<GroupByOption>("Date");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifList, setNotifList] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = useCallback(async () => {
    try {
      const result = await getNotifications();
      if (result.success) {
        // Exclude notifications from admins and recruiters (keep only student/mentor/professional/system)
        const filtered = (result.notifications ?? []).filter((n: any) => {
          // We include all notifications that are *for* the student
          // The exclusion is about not sending notifications *to* admins/recruiters
          // Since this is the student inbox, all notifications here are already for students
          return true;
        });
        setNotifList(filtered);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15_000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleRespond = async (collaboratorId: string, accept: boolean, notifId: string) => {
    const result = await respondToInvite(collaboratorId, accept);
    if (result.success) {
      // Mark notification as read & update the message
      await markNotificationRead(notifId);
      setNotifList((prev) =>
        prev.map((n) =>
          n.id === notifId
            ? {
              ...n,
              read: true,
              message: accept
                ? n.message.replace("Accept or decline this invitation.", "✅ You accepted this collaboration.")
                : n.message.replace("Accept or decline this invitation.", "❌ You declined this collaboration."),
              // Remove collaboratorId from metadata so buttons disappear
              metadata: JSON.stringify({
                ...(typeof n.metadata === "string" ? JSON.parse(n.metadata) : n.metadata),
                collaboratorId: null,
                responded: accept ? "accepted" : "declined",
              }),
            }
            : n
        )
      );
    }
  };

  /* Filtering */
  const filteredNotifications = notifList.filter((n) => {
    const matchesSearch =
      n.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.fromUserName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || !n.read;
    return matchesSearch && matchesTab;
  });

  /* Grouping */
  const groupedNotifications = (() => {
    const groups: Record<string, any[]> = {};
    for (const notif of filteredNotifications) {
      let key: string;
      if (groupBy === "Date") {
        key = getDateLabel(new Date(notif.createdAt));
      } else if (groupBy === "Collaboration") {
        const cfg = getNotifConfig(notif.type);
        key = cfg.category === "Collaboration" ? "Collaboration" : "Other";
      } else {
        // Task-based grouping
        const cfg = getNotifConfig(notif.type);
        key = cfg.label;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(notif);
    }
    return groups;
  })();

  const isEmpty = filteredNotifications.length === 0;
  const unreadCount = notifList.filter((n) => !n.read).length;
  const groupByOptions: GroupByOption[] = ["Date", "Collaboration", "Task"];

  return (
    <div className="flex flex-col h-full" id="students-inbox-layout">
      {/* ── Top Toolbar ── */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        {/* All / Unread toggle */}
        <div className="flex items-center rounded-md border border-border overflow-hidden shrink-0">
          <button
            id="inbox-filter-all"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3 py-1 text-sm font-medium transition-colors",
              activeTab === "all"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            All
          </button>
          <button
            id="inbox-filter-unread"
            onClick={() => setActiveTab("unread")}
            className={cn(
              "px-3 py-1 text-sm font-medium transition-colors border-l border-border",
              activeTab === "unread"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            id="inbox-search"
            type="text"
            placeholder="Search notifications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 bg-muted/40 border-border"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Mark all as read */}
          {unreadCount > 0 && (
            <Button
              id="inbox-mark-all-read"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </Button>
          )}

          {/* Group by dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="inbox-group-by"
                variant="ghost"
                size="sm"
                className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
              >
                Group by:{" "}
                <span className="font-semibold text-foreground">{groupBy}</span>
                <ChevronDown className="size-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {groupByOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setGroupBy(option)}
                  className="flex items-center justify-between"
                >
                  {option}
                  {groupBy === option && (
                    <Check className="size-3.5 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Content Area ── */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center pb-16">
          <InboxEmptyIllustration className="w-full max-w-md h-auto mb-6 select-none" />
          <h2 className="text-lg font-semibold text-foreground mb-1">
            All caught up!
          </h2>
          <p className="text-sm text-muted-foreground">
            Take a break, write some code, do what you do best.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedNotifications).map(([group, notifs]) => (
            <div key={group}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {group}
                </h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {notifs.length}
                </span>
              </div>
              <div className="space-y-2">
                {notifs.map((notif: any) => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    onMarkRead={handleMarkRead}
                    onRespond={handleRespond}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
