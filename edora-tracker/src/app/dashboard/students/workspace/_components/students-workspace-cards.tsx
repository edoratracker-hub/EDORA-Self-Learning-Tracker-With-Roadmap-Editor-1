"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  CalendarDays,
  FileText,
  Folder,
  ArrowRight,
  Trash2,
  Loader2,
  Users,
  Share2,
  LayoutGrid,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface FolderItem {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  files?: any[];
}

interface SharedFile {
  id: string;
  name: string;
  type: string | null;
  template: string | null;
  updatedAt: Date;
  folderId: string;
  workspaceId: string;
  ownerName: string | null;
  ownerImage: string | null;
  ownerEmail: string | null;
}

/* ------------------------------------------------------------------ */
/*  Accent color mapping (folder-style)                                */
/* ------------------------------------------------------------------ */
const accentMap: Record<string, string> = {
  amber: "from-amber-500/8 to-transparent border-l-amber-500/40",
  blue: "from-blue-500/8 to-transparent border-l-blue-500/40",
  violet: "from-violet-500/8 to-transparent border-l-violet-500/40",
  emerald: "from-emerald-500/8 to-transparent border-l-emerald-500/40",
  rose: "from-rose-500/8 to-transparent border-l-rose-500/40",
  cyan: "from-cyan-500/8 to-transparent border-l-cyan-500/40",
};

const iconAccentMap: Record<string, string> = {
  amber: "text-amber-400",
  blue: "text-blue-400",
  violet: "text-violet-400",
  emerald: "text-emerald-400",
  rose: "text-rose-400",
  cyan: "text-cyan-400",
};

// Assign a consistent color to a folder based on its id
const ACCENT_KEYS = Object.keys(accentMap);
function getAccentKey(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_KEYS[Math.abs(hash) % ACCENT_KEYS.length];
}

/* ------------------------------------------------------------------ */
/*  Single folder card (mirrors ClassroomCard style)                   */
/* ------------------------------------------------------------------ */
function FolderCard({ folder, basePath }: { folder: FolderItem; basePath: string }) {
  const colorKey = getAccentKey(folder.id);
  const accent = accentMap[colorKey];
  const iconColor = iconAccentMap[colorKey];
  const fileCount = folder.files?.length ?? 0;

  return (
    <Link
      href={`${basePath}/workspace/${folder.id}`}
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
        {/* Top row: type tag */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Folder
          </span>
          <Badge
            variant="outline"
            className="text-[11px] gap-1.5 px-2 py-0.5 font-medium bg-amber-500/10 text-amber-400 border-amber-500/20"
          >
            <Folder className="size-3" />
            {fileCount} {fileCount === 1 ? "file" : "files"}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
          {folder.name}
        </h3>

        {/* Meta rows */}
        <div className="space-y-2.5 mb-5 mt-auto">
          {folder.createdAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className={cn("size-3.5 shrink-0", iconColor)} />
              <span>
                Created {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#21262d] mb-4" />

        {/* Footer: file count + action */}
        <div className="flex items-center justify-between mt-auto">
          {/* Folder icon + file info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-7 rounded-full bg-[#21262d] flex items-center justify-center ring-1 ring-[#30363d]">
              <Folder className={cn("size-3.5", iconColor)} />
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {fileCount} {fileCount === 1 ? "file" : "files"} inside
            </span>
          </div>

          {/* Action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="size-3.5 text-[#484f58]" />
            </div>
            <button
              className={cn(
                "flex items-center justify-center size-7 rounded-lg transition-all duration-200",
                "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
              )}
            >
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Single shared file card (mirrors classroom card style)             */
/* ------------------------------------------------------------------ */
function SharedFileCard({ file, basePath }: { file: SharedFile; basePath: string }) {
  const colorKey = getAccentKey(file.id);
  const accent = accentMap[colorKey];
  const iconColor = iconAccentMap[colorKey];

  return (
    <Link
      href={`${basePath}/workspace/file/${file.id}`}
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
        {/* Top row: type tag + shared badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {file.type === "DOCUMENT" ? "Document" : (file.type ?? "File")}
          </span>
          <Badge
            variant="outline"
            className="text-[11px] gap-1.5 px-2 py-0.5 font-medium bg-blue-500/10 text-blue-400 border-blue-500/20"
          >
            <Users className="size-3" />
            Shared
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
          {file.name}
        </h3>

        {/* Template tag */}
        {file.template && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 capitalize">
            {file.template} template
          </p>
        )}

        {/* Meta rows */}
        <div className="space-y-2.5 mb-5 mt-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className={cn("size-3.5 shrink-0", iconColor)} />
            <span>
              Edited {formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#21262d] mb-4" />

        {/* Footer: owner info + action */}
        <div className="flex items-center justify-between mt-auto">
          {/* Owner info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-7 ring-1 ring-[#30363d]">
              <AvatarImage src={file.ownerImage ?? undefined} />
              <AvatarFallback className="text-[10px] bg-[#21262d]">
                {(file.ownerName ?? "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {file.ownerName ?? file.ownerEmail ?? "Unknown"}
            </span>
          </div>

          {/* Action */}
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "flex items-center justify-center size-7 rounded-lg transition-all duration-200",
                "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
              )}
            >
              <ArrowRight className="size-3.5" />
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
function EmptyFolders() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-[#30363d] rounded-xl gap-4">
      <div className="size-16 rounded-2xl bg-[#21262d] flex items-center justify-center">
        <Folder className="size-8 opacity-30" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">No folders yet</p>
        <p className="text-sm mt-1">
          Create your first folder using the button above.
        </p>
      </div>
    </div>
  );
}

function EmptySharedFiles() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-[#30363d] rounded-xl gap-4">
      <div className="size-16 rounded-2xl bg-[#21262d] flex items-center justify-center">
        <Users className="size-8 opacity-30" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">No shared files yet</p>
        <p className="text-sm mt-1">
          When someone invites you to collaborate, files appear here.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cards grid (with tabs, matching classroom layout)                  */
/* ------------------------------------------------------------------ */
export const StudentsWorkspaceCards = ({
  folders,
  basePath,
}: {
  folders: FolderItem[];
  basePath: string;
}) => {

  return (
    <div className="space-y-6">
      {folders.length === 0 ? (
        <EmptyFolders />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} basePath={basePath} />
          ))}
        </div>
      )}
    </div>
  );
};
