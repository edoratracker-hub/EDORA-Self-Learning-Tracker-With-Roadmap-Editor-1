"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Crown,
  ChevronUp,
  ChevronDown,
  Flame,
  Trophy,
  Zap,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/app/lib/auth-client";
import {
  getStudentLeaderboard,
  type LeaderboardStudent,
} from "@/app/actions/students/leaderboard-actions";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string | null;
  score: number;
  rank: number;
  previousRank: number;
  department: string;
  isCurrentUser?: boolean;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const rankColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-[#a8b1bc]",
  3: "text-amber-600",
};

const rankBg: Record<number, string> = {
  1: "bg-yellow-500/[0.05]",
  2: "bg-[#a8b1bc]/[0.04]",
  3: "bg-amber-600/[0.04]",
};

// ── Row ──────────────────────────────────────────────────────────────────

function LeaderboardRow({ e }: { e: LeaderboardEntry }) {
  const diff = e.previousRank - e.rank;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
        rankBg[e.rank],
        e.isCurrentUser &&
          "ring-1 ring-primary/40 bg-primary/[0.06] hover:bg-primary/[0.09]",
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
        <AvatarImage src={e.avatar ?? undefined} alt={e.name} />
        <AvatarFallback
          className={cn(
            "bg-muted text-muted-foreground",
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
            <span className="ml-1.5 text-[10px] font-bold text-primary uppercase tracking-wide">
              you
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

// ── Stat pill ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-card/50 px-3 py-3 flex-1">
      <Icon className={`size-4 ${accent}`} />
      <span className="text-lg font-bold tabular-nums leading-none">
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────

export const Leaderboard = () => {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;
  const currentUserName = session?.user?.name;
  const currentUserImage = (session?.user as any)?.image;

  const [students, setStudents] = React.useState<LeaderboardStudent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const result = await getStudentLeaderboard();
        if (result.success) {
          setStudents(result.data);
        } else {
          setError(result.error ?? "Failed to fetch leaderboard");
        }
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  // Build leaderboard entries with computed ranks
  const entries: LeaderboardEntry[] = React.useMemo(() => {
    return students.map((s, index) => ({
      id: s.userId,
      name: s.name,
      avatar: s.avatar,
      score: s.points,
      rank: index + 1,
      previousRank: s.previousRank,
      department: s.department,
      isCurrentUser: s.userId === currentUserId,
    }));
  }, [students, currentUserId]);

  const currentUser = entries.find((e) => e.isCurrentUser);
  const currentUserInTopList = entries.some((e) => e.isCurrentUser);

  const streakDays =
    students.find((s) => s.userId === currentUserId)?.streak ?? 0;
  const totalPoints = currentUser?.score ?? 0;
  const rank = currentUser?.rank ?? "—";

  return (
    <div className="space-y-6">
      {/* ── Loading state ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading leaderboard…</p>
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <Trophy className="h-8 w-8 opacity-40" />
          <p className="text-sm font-medium">No students yet</p>
          <p className="text-xs">
            The leaderboard will populate as students join.
          </p>
        </div>
      )}

      {/* ── Main content ── */}
      {!loading && !error && entries.length > 0 && (
        <>
          {/* ── Current user hero card ── */}
          {(currentUser || currentUserId) && (
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] p-5">
              <div className="flex items-center gap-3.5 mb-4">
                <Avatar className="h-11 w-11 text-sm ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
                  <AvatarImage
                    src={currentUserImage ?? currentUser?.avatar}
                    alt={currentUserName ?? currentUser?.name ?? "You"}
                  />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {initials(currentUserName ?? currentUser?.name ?? "You")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {currentUserName ?? currentUser?.name ?? "You"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {currentUser?.department ?? "Your stats this month"}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2.5">
                <StatCard
                  icon={Trophy}
                  label="Rank"
                  value={typeof rank === "number" ? `#${rank}` : rank}
                  accent="text-yellow-500"
                />
                <StatCard
                  icon={Flame}
                  label="Streak"
                  value={`${streakDays}d`}
                  accent="text-orange-500"
                />
                <StatCard
                  icon={Zap}
                  label="Points"
                  value={totalPoints.toLocaleString()}
                  accent="text-blue-500"
                />
              </div>
            </div>
          )}

          {/* ── Leaderboard heading ── */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Rankings</h3>
              <p className="text-[11px] text-muted-foreground">
                Top performers this month
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Points
            </span>
          </div>

          {/* ── List ── */}
          <div className="rounded-xl border divide-y overflow-hidden">
            {entries.map((e) => (
              <LeaderboardRow key={e.id} e={e} />
            ))}

            {/* Pin current user at bottom if not visible */}
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
        </>
      )}
    </div>
  );
};
