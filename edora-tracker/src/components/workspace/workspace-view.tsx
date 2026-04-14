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
import { Separator } from "../ui/separator";

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
            </div>

            <Separator className="bg-blue-500" />

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

        </div>
    );
}
