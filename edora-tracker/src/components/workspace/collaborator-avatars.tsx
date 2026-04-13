"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActiveUser {
    userId: string;
    name: string;
    image: string | null;
    email: string;
}

interface CollaboratorAvatarsProps {
    fileId: string;
}

// Stable color palette for user rings
const RING_COLORS = [
    "ring-blue-400",
    "ring-green-400",
    "ring-purple-400",
    "ring-orange-400",
    "ring-pink-400",
    "ring-teal-400",
    "ring-yellow-400",
    "ring-red-400",
];

function getColor(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return RING_COLORS[Math.abs(hash) % RING_COLORS.length];
}

export function CollaboratorAvatars({ fileId }: CollaboratorAvatarsProps) {
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchPresence = async () => {
        try {
            const res = await fetch(`/api/presence/${fileId}`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setActiveUsers(data.users ?? []);
            }
        } catch {
            // silently ignore network errors
        }
    };

    useEffect(() => {
        fetchPresence();
        // Poll every 8 seconds
        intervalRef.current = setInterval(fetchPresence, 8000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fileId]);

    if (activeUsers.length === 0) return null;

    const visible = activeUsers.slice(0, 6);
    const overflow = activeUsers.length - 6;

    return (
        <div className="flex items-center gap-2" id="collab-avatars">
            {/* "Live" indicator */}
            <div className="flex items-center gap-1.5 mr-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                    {activeUsers.length} online
                </span>
            </div>

            {/* Avatar stack */}
            <div className="flex items-center -space-x-2">
                <TooltipProvider delayDuration={200}>
                    {visible.map((u) => (
                        <Tooltip key={u.userId}>
                            <TooltipTrigger asChild>
                                <Avatar
                                    className={`h-7 w-7 border-2 border-background ring-2 ${getColor(u.userId)} cursor-default transition-transform hover:scale-110 hover:z-10`}
                                >
                                    <AvatarImage src={u.image ?? undefined} alt={u.name} />
                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                                        {u.name
                                            ? u.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
                                            : (u.email?.[0] ?? "?").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                <p className="font-medium">{u.name || u.email}</p>
                                <p className="text-muted-foreground text-[10px]">Currently editing</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    {overflow > 0 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="h-7 w-7 rounded-full border-2 border-background bg-muted ring-2 ring-border flex items-center justify-center text-[10px] font-semibold text-muted-foreground cursor-default z-10">
                                    +{overflow}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                {overflow} more user{overflow > 1 ? "s" : ""} online
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            </div>
        </div>
    );
}
