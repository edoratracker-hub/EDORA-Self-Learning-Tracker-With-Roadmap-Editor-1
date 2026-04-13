"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteClassroom } from "@/app/actions/classroom-actions";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  CalendarDays,
  Users,
  School2,
  ArrowRight,
  Crown,
  Trash2,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ClassroomMemberRole = "head" | "student";

interface ClassroomItem {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  color: string;
  memberCount: number;
  createdAt: Date;
  headId: string;
  headName: string | null;
  headImage: string | null;
  role: ClassroomMemberRole;
}

/* ------------------------------------------------------------------ */
/*  Accent color mapping                                               */
/* ------------------------------------------------------------------ */
const accentMap: Record<string, string> = {
  emerald: "from-emerald-500/8 to-transparent border-l-emerald-500/40",
  blue: "from-blue-500/8 to-transparent border-l-blue-500/40",
  violet: "from-violet-500/8 to-transparent border-l-violet-500/40",
  amber: "from-amber-500/8 to-transparent border-l-amber-500/40",
  rose: "from-rose-500/8 to-transparent border-l-rose-500/40",
  cyan: "from-cyan-500/8 to-transparent border-l-cyan-500/40",
};

const iconAccentMap: Record<string, string> = {
  emerald: "text-emerald-400",
  blue: "text-blue-400",
  violet: "text-violet-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
  cyan: "text-cyan-400",
};

/* ------------------------------------------------------------------ */
/*  Single classroom card                                              */
/* ------------------------------------------------------------------ */
function ClassroomCard({ classroom, userId }: { classroom: ClassroomItem; userId?: string }) {
  const accent = accentMap[classroom.color] ?? accentMap.blue;
  const iconColor = iconAccentMap[classroom.color] ?? iconAccentMap.blue;
  const isHead = classroom.role === "head";
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this classroom? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    const result = await deleteClassroom(classroom.id);
    if (!result.success) {
      toast.error(result.error ?? "Failed to delete classroom.");
      setIsDeleting(false);
    } else {
      toast.success("Classroom deleted successfully.");
    }
  };

  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:3001'}?classroomId=${classroom.id}${userId ? `&userId=${userId}` : ''}`}
      target="_blank"
      className={cn(
        "group relative flex flex-col rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden transition-all duration-300",
        "hover:border-[#484f58] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
      )}
    >
      {/* Subtle left accent + gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r pointer-events-none border-l-2",
          accent
        )}
      />

      <div className="relative flex flex-col flex-1 p-5">
        {/* Top row: subject tag + role badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {classroom.subject}
          </span>
          <div className="flex items-center gap-2">
            {isHead && (
              <Badge
                variant="outline"
                className="text-[11px] gap-1.5 px-2 py-0.5 font-medium bg-amber-500/10 text-amber-400 border-amber-500/20"
              >
                <Crown className="size-3" />
                Head
              </Badge>
            )}
            {isHead && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 rounded-md disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
          {classroom.name}
        </h3>

        {/* Description */}
        {classroom.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
            {classroom.description}
          </p>
        )}

        {/* Meta rows */}
        <div className="space-y-2.5 mb-5 mt-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className={cn("size-3.5 shrink-0", iconColor)} />
            <span>
              Created {formatDistanceToNow(new Date(classroom.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#21262d] mb-4" />

        {/* Footer: head avatar + member count + action */}
        <div className="flex items-center justify-between mt-auto">
          {/* Head info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-7 ring-1 ring-[#30363d]">
              <AvatarImage src={classroom.headImage ?? undefined} />
              <AvatarFallback className="text-[10px] bg-[#21262d]">
                {(classroom.headName ?? "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {classroom.headName ?? "Unknown"}
            </span>
          </div>

          {/* Members + action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3.5 text-[#484f58]" />
              <span>{classroom.memberCount}</span>
            </div>

            <button
              className={cn(
                "flex items-center justify-center size-7 rounded-lg transition-all duration-200",
                "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
              )}
            >
              {isHead ? (
                <School2 className="size-3.5" />
              ) : (
                <ArrowRight className="size-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */
function EmptyClassrooms() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-[#30363d] rounded-xl gap-4">
      <div className="size-16 rounded-2xl bg-[#21262d] flex items-center justify-center">
        <School2 className="size-8 opacity-30" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">No classrooms yet</p>
        <p className="text-sm mt-1">
          Create your first classroom using the&nbsp;
          <span className="text-blue-400 font-medium">Add</span> button above.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cards grid                                                         */
/* ------------------------------------------------------------------ */
export const MentorClassroomCards = ({
  classrooms,
  userId,
}: {
  classrooms: ClassroomItem[];
  userId?: string;
}) => {
  if (!classrooms || classrooms.length === 0) {
    return <EmptyClassrooms />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {classrooms.map((classroom) => (
        <ClassroomCard key={classroom.id} classroom={classroom} userId={userId} />
      ))}
    </div>
  );
};
