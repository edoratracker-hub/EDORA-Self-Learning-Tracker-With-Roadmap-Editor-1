"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  ArrowRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

const ACCENT_KEYS = Object.keys(accentMap);
function getAccentKey(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_KEYS[Math.abs(hash) % ACCENT_KEYS.length];
}

/* ------------------------------------------------------------------ */
/*  Single file card                                                   */
/* ------------------------------------------------------------------ */
function FileCard({ file }: { file: any }) {
  const colorKey = getAccentKey(file.id);
  const accent = accentMap[colorKey];
  const iconColor = iconAccentMap[colorKey];

  // We could add delete functionality here if needed, 
  // mirroring ClassroomCard's isDeleting state.
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implementation for delete would go here
    toast.error("Delete not implemented for files yet.");
  };

  return (
    <Link
      href={`/dashboard/students/workspace/file/${file.id}`}
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
        {/* Top row: type tag + action/badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {file.type === "DOCUMENT" ? "Document" : file.type}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 rounded-md disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
          {file.name}
        </h3>

        {/* Description / Template */}
        {file.template && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 capitalize">
            {file.template} template
          </p>
        )}
        {!file.template && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
            Blank document
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

        {/* Footer: icon/info + action */}
        <div className="flex items-center justify-between mt-auto">
          {/* File info (replacing head avatar) */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#21262d] ring-1 ring-[#30363d]">
              <FileText className="size-3.5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {file.type === "DOCUMENT" ? "Text File" : "File"}
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
function EmptyFiles() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-[#30363d] rounded-xl gap-4">
      <div className="size-16 rounded-2xl bg-[#21262d] flex items-center justify-center">
        <FileText className="size-8 opacity-30" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">No files yet</p>
        <p className="text-sm mt-1">
          Create your first file using the add button above.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cards grid                                                         */
/* ------------------------------------------------------------------ */
export const FolderFilesCards = ({
  files,
}: {
  files: any[];
}) => {
  if (!files || files.length === 0) {
    return <EmptyFiles />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};
