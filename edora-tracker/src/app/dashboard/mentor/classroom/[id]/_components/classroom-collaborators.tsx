"use client";

import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Share2Icon, Crown } from "lucide-react";
import { StudentsClassroomShareDialog } from "./students-classroom-share-popover";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "head" | "student";
}

interface ClassroomCollaboratorsProps {
  members: Member[];
  classroomId: string;
  classroomName: string;
}

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
];

export function ClassroomCollaborators({
  members,
  classroomId,
  classroomName,
}: ClassroomCollaboratorsProps) {
  const visible = members.slice(0, 6);
  const overflow = members.length - 6;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider delayDuration={100}>
        <div className="flex items-center">
          {/* Stacked avatars */}
          <div className="flex -space-x-1.5">
            {visible.map((member, index) => (
              <Tooltip key={member.id}>
                <TooltipTrigger asChild>
                  <div
                    className="relative"
                    style={{ zIndex: visible.length - index }}
                  >
                    <Avatar
                      className={cn(
                        "size-9 ring-2 ring-background cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:z-50"
                      )}
                    >
                      <AvatarImage src={member.image ?? undefined} alt={member.name ?? ""} />
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
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="text-xs font-medium"
                >
                  <div className="flex items-center gap-1.5">
                    {member.role === "head" && (
                      <Crown className="size-3 text-amber-400" />
                    )}
                    {member.name ?? member.email}
                    {member.role === "head" && (
                      <span className="text-amber-400 text-[10px]">(Head)</span>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* +N more count (if needed) */}
          {overflow > 0 && (
            <div className="ml-1 flex items-center justify-center size-8 rounded-full bg-[#21262d] ring-2 ring-background text-xs font-medium text-muted-foreground">
              +{overflow}
            </div>
          )}
        </div>
      </TooltipProvider>

      {/* Member count badge */}
      {/* <Badge variant="outline" className="text-xs gap-1">
        {members.length} {members.length === 1 ? "member" : "members"}
      </Badge> */}

      <div>
        <StudentsClassroomShareDialog
          classroomId={classroomId}
          classroomName={classroomName}
        >
          <Button variant="outline" size="sm">
            <Share2Icon />
            Share
          </Button>
        </StudentsClassroomShareDialog>
      </div>
    </div>
  );
}
