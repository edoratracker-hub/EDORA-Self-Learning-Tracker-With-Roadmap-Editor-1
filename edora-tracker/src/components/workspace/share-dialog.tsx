"use client";

import { useState, useCallback, useEffect } from "react";
import { Users, Share2, Search, Check, X, Clock, Copy, Link as LinkIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { searchUsers, inviteCollaborator, getFileCollaborators } from "@/app/actions/collaboration-actions";
import { IconBrandWhatsapp } from "@tabler/icons-react";

interface ShareDialogProps {
    fileId: string;
    fileName: string;
}

export function ShareDialog({ fileId, fileName }: ShareDialogProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [inviting, setInviting] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const loadCollaborators = useCallback(async () => {
        const res = await getFileCollaborators(fileId);
        if (res.success) setCollaborators(res.collaborators);
    }, [fileId]);

    useEffect(() => {
        if (open) loadCollaborators();
    }, [open, loadCollaborators]);

    const handleSearch = useCallback(async (q: string) => {
        setQuery(q);
        if (q.trim().length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        const res = await searchUsers(q);
        setResults(res.users || []);
        setSearching(false);
    }, []);

    const handleInvite = async (userId: string, userName: string) => {
        setInviting(userId);
        const res = await inviteCollaborator(fileId, userId);
        if (res.success) {
            toast.success(`Invite sent to ${userName}`);
            loadCollaborators();
            setResults((prev) => prev.filter((u) => u.id !== userId));
        } else {
            toast.error(res.error || "Failed to send invite");
        }
        setInviting(null);
    };

    const alreadyInvited = (userId: string) =>
        collaborators.some((c) => c.userId === userId);

    const shareLink = typeof window !== "undefined"
        ? `${window.location.origin}/dashboard/students/workspace/file/${fileId}`
        : "";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            toast.success("Copied Link");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy link.");
        }
    };

    const whatsappMessage = encodeURIComponent(
        `Collaborate with me on "${fileName}" on Edora!\n\nLink: ${shareLink}`
    );
    const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5" id="share-file-btn">
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        Share &quot;{fileName}&quot;
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    {/* Share Link Section */}
                    <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Share Link</p>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={shareLink}
                                className="text-xs h-9 truncate bg-muted/40"
                            />
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-9 shrink-0"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check className="size-4 text-emerald-400" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* WhatsApp share */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-3 h-9 hover:bg-green-500/10 hover:border-green-500/40 hover:text-green-400 transition-colors"
                        >
                            <IconBrandWhatsapp className="text-green-400 size-5" />
                            <span className="text-xs">Share on WhatsApp</span>
                        </Button>
                    </a>

                    <div className="h-px bg-border" />

                    {/* Search Section */}
                    <div className="space-y-2">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Invite Collaborator</p>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="collab-search-input"
                                placeholder="Search by name or email..."
                                className="pl-9 h-9 text-xs"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {searching && (
                            <p className="text-[10px] text-muted-foreground text-center py-1">Searching...</p>
                        )}

                        {results.length > 0 && (
                            <ScrollArea className="max-h-40 border rounded-md">
                                <div className="p-1">
                                    {results.map((u) => {
                                        const invited = alreadyInvited(u.id);
                                        return (
                                            <div
                                                key={u.id}
                                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50"
                                            >
                                                <Avatar className="h-7 w-7">
                                                    <AvatarImage src={u.image} />
                                                    <AvatarFallback className="text-[10px]">
                                                        {u.name?.substring(0, 2).toUpperCase() || "??"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate">{u.name}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={invited ? "ghost" : "default"}
                                                    className="h-7 px-2 text-[10px] shrink-0"
                                                    disabled={invited || inviting === u.id}
                                                    onClick={() => handleInvite(u.id, u.name || u.email)}
                                                >
                                                    {invited ? "Invited" : inviting === u.id ? "..." : "Invite"}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        )}
                    </div>

                    <div className="h-px bg-border" />

                    {/* Current collaborators */}
                    {collaborators.length > 0 && (
                        <div>
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                People with access
                            </p>
                            <ScrollArea className="max-h-32">
                                <div className="space-y-1">
                                    {collaborators.map((c) => (
                                        <div key={c.id} className="flex items-center gap-3 p-1.5 rounded-md">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={c.image} />
                                                <AvatarFallback className="text-[9px]">
                                                    {c.name?.substring(0, 2).toUpperCase() || "??"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate">{c.name}</p>
                                            </div>
                                            <Badge
                                                variant={c.status === "accepted" ? "default" : "outline"}
                                                className="text-[9px] h-4 px-1"
                                            >
                                                {c.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
