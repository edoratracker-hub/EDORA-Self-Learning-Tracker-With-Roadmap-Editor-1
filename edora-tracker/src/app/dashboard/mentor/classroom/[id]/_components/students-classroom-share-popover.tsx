"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import {
  Share2Icon,
  Copy,
  Check,
  Link as LinkIcon,
  Search,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  searchStudents,
  addStudentToClassroom,
} from "@/app/actions/classroom-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface ClassroomSharePopoverProps {
  children?: React.ReactNode;
  classroomId: string;
  classroomName: string;
}

export const StudentsClassroomShareDialog = ({
  children,
  classroomId,
  classroomName,
}: ClassroomSharePopoverProps) => {
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const router = useRouter();

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/join/classroom/${classroomId}`
      : `https://edora.app/join/classroom/${classroomId}`;

  const whatsappMessage = encodeURIComponent(
    `🎓 You're invited to join the classroom "${classroomName}" on Edora!\n\nClick the link to join:\n${inviteLink}`,
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Copied Link");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const res = await searchStudents(q);
    setResults(res.users ?? []);
    setSearching(false);
  }, []);

  const handleAdd = async (userId: string, userName: string) => {
    setAdding(userId);
    const res = await addStudentToClassroom(classroomId, userId);
    if (res.success) {
      toast.success(`${userName} added to the classroom!`);
      setResults((prev) => prev.filter((u) => u.id !== userId));
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to add student.");
    }
    setAdding(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            <Share2Icon />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] sm:w-[400px] p-0 gap-0">
        <PopoverHeader className="border-b px-4 py-3">
          <PopoverTitle className="flex items-center gap-2">
            <Share2Icon className="text-blue-400 size-4" />
            <span>Share Classroom</span>
          </PopoverTitle>
          <PopoverDescription className="text-[11px]">
            Invite students to &quot;{classroomName}&quot;
          </PopoverDescription>
        </PopoverHeader>

        <div className="flex flex-col px-4 py-3 space-y-4">

          {/* WhatsApp share */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Share via
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="share-whatsapp-btn"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-9 hover:bg-green-500/10 hover:border-green-500/40 hover:text-green-400 transition-colors"
              >
                <IconBrandWhatsapp className="text-green-400 size-5" />
                <span className="text-xs">Share on WhatsApp</span>
              </Button>
            </a>
          </div>

          <div className="h-px bg-border" />

          {/* Search and Invite Student */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Invite Student
            </p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="student-search-input"
                placeholder="Search by name or email..."
                className="pl-8 h-9 text-xs"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {searching && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {results.length > 0 && (
              <ScrollArea className="h-[180px] border rounded-md">
                <div className="p-1">
                  {results.map((u) => (
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
                        <p className="text-[10px] text-muted-foreground truncate">
                          {u.email}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="h-7 px-2 text-[10px] shrink-0"
                        disabled={adding === u.id}
                        onClick={() => handleAdd(u.id, u.name || u.email)}
                      >
                        {adding === u.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          "Invite"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Copy link button */}
          <Button
            variant="outline"
            className="w-full gap-2 h-9 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            id="copy-link-btn"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <LinkIcon className="size-3.5" />
            )}
            {copied ? "Copied Link" : "Copy Invite Link"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
