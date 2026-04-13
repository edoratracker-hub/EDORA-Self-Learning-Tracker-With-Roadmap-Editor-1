"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  previousRank: number;
  department: string;
  isCurrentUser?: boolean;
}

// TODO: Replace with real data from your API / context
const CURRENT_USER_ID = "4";

const entries: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    score: 2850,
    rank: 1,
    previousRank: 2,
    department: "Computer Science",
    avatar: undefined,
  },
  {
    id: "2",
    name: "Michael Chen",
    score: 2720,
    rank: 2,
    previousRank: 1,
    department: "Engineering",
    avatar: undefined,
  },
  {
    id: "3",
    name: "Emma Wilson",
    score: 2680,
    rank: 3,
    previousRank: 4,
    department: "Mathematics",
    avatar: undefined,
  },
  {
    id: "4",
    name: "James Brown",
    score: 2540,
    rank: 4,
    previousRank: 3,
    department: "Physics",
    avatar: undefined,
  },
  {
    id: "5",
    name: "Olivia Davis",
    score: 2420,
    rank: 5,
    previousRank: 5,
    department: "Chemistry",
    avatar: undefined,
  },
  {
    id: "6",
    name: "Liam Martinez",
    score: 2380,
    rank: 6,
    previousRank: 7,
    department: "Biology",
    avatar: undefined,
  },
  {
    id: "7",
    name: "Sophia Anderson",
    score: 2310,
    rank: 7,
    previousRank: 6,
    department: "Data Science",
    avatar: undefined,
  },
].map((e) => ({ ...e, isCurrentUser: e.id === CURRENT_USER_ID }));

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const rankColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-[#8b949e]",
  3: "text-amber-600",
};

function LeaderboardRow({ e }: { e: LeaderboardEntry }) {
  const diff = e.previousRank - e.rank;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#1c2129]",
        e.rank === 1 && "bg-yellow-500/[0.03]",
        e.isCurrentUser &&
          "ring-1 ring-primary/50 bg-primary/[0.06] hover:bg-primary/[0.1]",
      )}
    >
      {/* Rank */}
      <span
        className={cn(
          "w-6 text-center text-sm font-bold shrink-0",
          rankColors[e.rank] ?? "text-muted-foreground",
        )}
      >
        {e.rank === 1 ? (
          <Crown className="h-4 w-4 mx-auto text-yellow-400" />
        ) : (
          e.rank
        )}
      </span>

      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0 text-[11px]">
        <AvatarImage src={e.avatar} alt={e.name} />
        <AvatarFallback
          className={cn(
            "bg-[#21262d] text-muted-foreground",
            e.isCurrentUser && "bg-primary/20 text-primary",
          )}
        >
          {initials(e.name)}
        </AvatarFallback>
      </Avatar>

      {/* Name + dept */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {e.name}
          {e.isCurrentUser && (
            <span className="ml-1.5 text-[10px] font-semibold text-primary">
              YOU
            </span>
          )}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          {e.department}
        </p>
      </div>

      {/* Score */}
      <span className="text-sm font-semibold tabular-nums shrink-0">
        {e.score.toLocaleString()}
      </span>

      {/* Rank change */}
      <span
        className={cn(
          "flex items-center gap-0.5 text-[11px] font-medium w-8 justify-end shrink-0",
          diff > 0
            ? "text-emerald-400"
            : diff < 0
              ? "text-red-400"
              : "text-muted-foreground",
        )}
      >
        {diff > 0 ? (
          <>
            <ChevronUp className="h-3 w-3" />
            {diff}
          </>
        ) : diff < 0 ? (
          <>
            <ChevronDown className="h-3 w-3" />
            {Math.abs(diff)}
          </>
        ) : (
          "—"
        )}
      </span>
    </div>
  );
}

export const Leaderboard = () => {
  const currentUser = entries.find((e) => e.isCurrentUser);
  const currentUserInTopList = entries.some((e) => e.isCurrentUser);

  return (
    <div className="space-y-5">
      {/* Current user summary card */}
      {currentUser && (
        <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 text-xs">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {initials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Your Position</p>
                <p className="text-[11px] text-muted-foreground">
                  {currentUser.department}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums text-primary">
                #{currentUser.rank}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {currentUser.score.toLocaleString()} pts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] divide-y divide-[#30363d] overflow-hidden">
        {entries.map((e) => (
          <LeaderboardRow key={e.id} e={e} />
        ))}

        {/* If the current user isn't in the visible list, pin them at the bottom */}
        {currentUser && !currentUserInTopList && (
          <>
            <div className="px-4 py-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
              <Separator className="flex-1" />
              <span>•••</span>
              <Separator className="flex-1" />
            </div>
            <LeaderboardRow e={currentUser} />
          </>
        )}
      </div>
    </div>
  );
};
