"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    Folder,
    FileText,
    Users,
    LayoutGrid,
    Share2,
    Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────── */
interface FolderItem {
    id: string;
    name: string;
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

interface WorkspaceViewProps {
    workspaceId: string;
    folders: FolderItem[];
    sharedFiles: SharedFile[];
    /** Base path for links, e.g. "/dashboard/students" */
    basePath: string;
    /** Slot for the "New Folder" button (server component) */
    createFolderSlot: React.ReactNode;
    title?: string;
    subtitle?: string;
}

/* ─────────────────────────────────────────────────────────────────────
   Tab labels
───────────────────────────────────────────────────────────────────── */
const TABS = [
    { id: "my", label: "My Workspace", icon: LayoutGrid },
    { id: "shared", label: "Shared with Me", icon: Share2 },
] as const;

type Tab = (typeof TABS)[number]["id"];

/* ─────────────────────────────────────────────────────────────────────
   WorkspaceView
───────────────────────────────────────────────────────────────────── */
export function WorkspaceView({
    folders,
    sharedFiles,
    basePath,
    createFolderSlot,
    title = "Workspace",
    subtitle = "Manage your files and folders.",
}: WorkspaceViewProps) {
    const [activeTab, setActiveTab] = useState<Tab>(
        sharedFiles.length > 0 && folders.length === 0 ? "shared" : "my"
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
                </div>
                {activeTab === "my" && createFolderSlot}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-border">
                {TABS.map(({ id, label, icon: Icon }) => {
                    const count = id === "my" ? folders.length : sharedFiles.length;
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all",
                                isActive
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                            {count > 0 && (
                                <span
                                    className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-full font-semibold min-w-[18px] text-center",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── MY WORKSPACE tab ─────────────────────────────────── */}
            {activeTab === "my" && (
                <div className="space-y-6">
                    {/* Folders */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {folders.map((folder) => (
                            <Link
                                key={folder.id}
                                href={`${basePath}/workspace/${folder.id}`}
                                className="group transition-all hover:scale-[1.02]"
                            >
                                <div className="relative h-full pt-3">
                                    {/* Tab nub */}
                                    <div className="absolute top-0 left-0 w-1/3 h-3.5 bg-amber-400/20 border border-b-0 border-amber-400/40 rounded-t-lg z-10 group-hover:bg-amber-400/30 transition-colors" />
                                    {/* Body */}
                                    <div className="relative bg-card border border-border rounded-lg rounded-tl-none overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-amber-400/40 transition-all">
                                        <div className="h-1 w-full bg-amber-400/30 group-hover:bg-amber-400/50 transition-colors" />
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <Folder className="h-8 w-8 text-amber-500 shrink-0 mt-0.5" />
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                    Folder
                                                </span>
                                            </div>
                                            <div className="text-base font-bold truncate">{folder.name}</div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {folder.files?.length ?? 0}{" "}
                                                {folder.files?.length === 1 ? "file" : "files"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {folders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl gap-3">
                            <Folder className="h-12 w-12 opacity-20" />
                            <div className="text-center">
                                <p className="font-medium">No folders yet</p>
                                <p className="text-sm opacity-70">Create a folder to organise your files</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── SHARED WITH ME tab ───────────────────────────────── */}
            {activeTab === "shared" && (
                <div className="space-y-4">
                    {sharedFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl gap-3">
                            <Users className="h-12 w-12 opacity-20" />
                            <div className="text-center">
                                <p className="font-medium">No shared files yet</p>
                                <p className="text-sm opacity-70">
                                    When someone invites you to collaborate, files appear here
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {sharedFiles.map((file) => (
                                <Link
                                    key={file.id}
                                    href={`${basePath}/workspace/file/${file.id}`}
                                    className="group transition-all hover:scale-[1.02]"
                                >
                                    <div className="relative h-full pt-3">
                                        {/* Tab nub with "shared" tint */}
                                        <div className="absolute top-0 left-0 w-1/3 h-3.5 bg-primary/20 border border-b-0 border-primary/30 rounded-t-lg z-10 group-hover:bg-primary/30 transition-colors" />
                                        {/* Body */}
                                        <div className="relative bg-card border border-border rounded-lg rounded-tl-none overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all">
                                            {/* Shared accent stripe */}
                                            <div className="h-1 w-full bg-primary/30 group-hover:bg-primary/50 transition-colors" />
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                        {file.type === "DOCUMENT" ? "Document" : (file.type ?? "File")}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3 text-primary/60" />
                                                        <FileText className="h-3.5 w-3.5 text-muted-foreground/50" />
                                                    </div>
                                                </div>

                                                <div className="text-base font-bold truncate pr-2">{file.name}</div>

                                                {file.template && (
                                                    <p className="text-[11px] text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full w-fit mt-1">
                                                        {file.template}
                                                    </p>
                                                )}

                                                {/* Owner + timestamp */}
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Avatar className="h-5 w-5 ring-1 ring-border">
                                                            <AvatarImage src={file.ownerImage ?? undefined} />
                                                            <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                                                                {file.ownerName
                                                                    ? file.ownerName
                                                                        .split(" ")
                                                                        .map((w) => w[0])
                                                                        .join("")
                                                                        .toUpperCase()
                                                                        .slice(0, 2)
                                                                    : "?"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-[11px] text-muted-foreground truncate max-w-[72px]">
                                                            {file.ownerName ?? file.ownerEmail ?? "Unknown"}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDistanceToNow(new Date(file.updatedAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
