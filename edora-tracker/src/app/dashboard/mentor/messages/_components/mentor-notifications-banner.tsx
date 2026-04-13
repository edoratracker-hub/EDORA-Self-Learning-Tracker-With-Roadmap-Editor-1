"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Empty-state SVG illustration (mountains + ninja character scene)   */
/* ------------------------------------------------------------------ */
function InboxEmptyIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 480 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            {/* Background mountains */}
            <path
                d="M0 260 L80 120 L130 180 L180 90 L230 160 L270 80 L320 150 L370 100 L420 140 L480 70 L480 260 Z"
                fill="hsl(220 20% 18%)"
                opacity="0.6"
            />
            <path
                d="M0 260 L60 160 L120 200 L170 140 L220 190 L260 130 L310 185 L360 150 L410 180 L480 120 L480 260 Z"
                fill="hsl(220 20% 15%)"
                opacity="0.7"
            />

            {/* Pine trees silhouette */}
            <g fill="hsl(220 15% 13%)" opacity="0.9">
                {/* Tree 1 */}
                <polygon points="95,230 110,170 115,190 125,155 130,175 140,140 145,160 135,230" />
                {/* Tree 2 */}
                <polygon points="140,230 150,180 155,195 162,160 167,178 172,145 178,165 170,230" />
                {/* Tree 3 */}
                <polygon points="175,230 185,185 190,198 196,168 201,183 206,152 211,170 205,230" />
                {/* Tree 4 */}
                <polygon points="340,230 348,188 352,200 358,172 362,186 367,155 372,175 365,230" />
            </g>

            {/* Ground line */}
            <rect x="60" y="228" width="370" height="4" rx="2" fill="hsl(220 15% 16%)" />

            {/* Small cat/fox creature on the left */}
            <g transform="translate(155, 195)" fill="hsl(215 15% 35%)">
                {/* Body */}
                <ellipse cx="16" cy="22" rx="14" ry="10" />
                {/* Head */}
                <ellipse cx="26" cy="14" rx="8" ry="7" />
                {/* Ears */}
                <polygon points="22,4 20,12 26,10" />
                <polygon points="30,4 34,12 28,10" />
                {/* Tail */}
                <path
                    d="M2 22 Q-8 8 -2 4"
                    stroke="hsl(215 15% 35%)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />
            </g>

            {/* Rock on the right */}
            <g transform="translate(330, 208)">
                <path d="M0 22 L6 8 L14 2 L22 4 L30 10 L32 22 Z" fill="hsl(220 10% 28%)" />
                <path d="M6 8 L14 2 L22 4 L18 12 L10 14 Z" fill="hsl(220 10% 35%)" />
            </g>

            {/* Small twigs near rock */}
            <g stroke="hsl(220 10% 30%)" strokeWidth="1.5" strokeLinecap="round">
                <line x1="355" y1="228" x2="360" y2="215" />
                <line x1="360" y1="215" x2="356" y2="208" />
                <line x1="360" y1="215" x2="365" y2="210" />
            </g>

            {/* ---- Ninja/warrior character (blue neon outline) ---- */}
            <g transform="translate(230, 95)" strokeLinecap="round" strokeLinejoin="round">
                {/* Broom/staff */}
                <line
                    x1="15"
                    y1="25"
                    x2="80"
                    y2="-20"
                    stroke="hsl(220 10% 50%)"
                    strokeWidth="3"
                />
                {/* Broom bristles */}
                <g stroke="hsl(220 10% 45%)" strokeWidth="1.5">
                    <line x1="80" y1="-20" x2="90" y2="-28" />
                    <line x1="80" y1="-20" x2="92" y2="-22" />
                    <line x1="80" y1="-20" x2="88" y2="-16" />
                    <line x1="80" y1="-20" x2="85" y2="-12" />
                </g>

                {/* Head */}
                <circle
                    cx="35"
                    cy="18"
                    r="16"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />
                {/* Cat ears on head */}
                <path
                    d="M22 6 L18 -6 L28 2"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />
                <path
                    d="M48 6 L52 -6 L42 2"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />
                {/* Eyes */}
                <circle cx="30" cy="18" r="2" fill="hsl(210 100% 60%)" />
                <circle cx="42" cy="18" r="2" fill="hsl(210 100% 60%)" />

                {/* Body / torso */}
                <path
                    d="M28 34 L22 70 L48 70 L42 34"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />
                {/* Belt */}
                <line
                    x1="23"
                    y1="52"
                    x2="47"
                    y2="52"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                />

                {/* Left arm holding broom */}
                <path
                    d="M28 40 L10 30 L15 25"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />
                {/* Right arm */}
                <path
                    d="M42 40 L58 32 L55 28"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />

                {/* Cape / scarf flowing */}
                <path
                    d="M20 34 Q5 45 -5 42 Q-10 55 -5 65"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />
                <path
                    d="M20 34 Q8 50 0 55"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />

                {/* Legs */}
                <path
                    d="M28 70 L24 95 L18 100 L28 100"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />
                <path
                    d="M42 70 L44 95 L50 100 L40 100"
                    stroke="hsl(210 100% 60%)"
                    strokeWidth="2"
                    fill="none"
                />

                {/* Subtle glow effect */}
                <circle
                    cx="35"
                    cy="50"
                    r="45"
                    fill="hsl(210 100% 60%)"
                    opacity="0.04"
                />
            </g>
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Inbox Layout Component                                        */
/* ------------------------------------------------------------------ */
type FilterTab = "all" | "unread";
type GroupByOption = "Date" | "Collaboration" | "Task";


export const MentorNotificationsBanner = () => {
    const [activeTab, setActiveTab] = useState<FilterTab>("all");
    const [groupBy, setGroupBy] = useState<GroupByOption>("Date");
    const [searchQuery, setSearchQuery] = useState("");

    // For now this is the empty state — swap to notification list when data exists
    const notifications: unknown[] = [];
    const isEmpty = notifications.length === 0;

    const groupByOptions: GroupByOption[] = ["Date", "Collaboration", "Task"];

    return (
        <div className="flex flex-col h-full" id="students-inbox-layout">
            {/* ── Top Toolbar ── */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
                {/* All / Unread toggle */}
                <div className="flex items-center rounded-md border border-border overflow-hidden shrink-0">
                    <button
                        id="inbox-filter-all"
                        onClick={() => setActiveTab("all")}
                        className={cn(
                            "px-3 py-1 text-sm font-medium transition-colors",
                            activeTab === "all"
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        All
                    </button>
                    <button
                        id="inbox-filter-unread"
                        onClick={() => setActiveTab("unread")}
                        className={cn(
                            "px-3 py-1 text-sm font-medium transition-colors border-l border-border",
                            activeTab === "unread"
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        Unread
                    </button>
                </div>

                {/* Search bar */}
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                        id="inbox-search"
                        type="text"
                        placeholder="Search notifications"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-8 bg-muted/40 border-border"
                    />
                </div>

                {/* Group by dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            id="inbox-group-by"
                            variant="ghost"
                            size="sm"
                            className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                            Group by:{" "}
                            <span className="font-semibold text-foreground">{groupBy}</span>
                            <ChevronDown className="size-3.5 opacity-60" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px]">
                        {groupByOptions.map((option) => (
                            <DropdownMenuItem
                                key={option}
                                onClick={() => setGroupBy(option)}
                                className="flex items-center justify-between"
                            >
                                {option}
                                {groupBy === option && (
                                    <Check className="size-3.5 text-primary" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ── Content Area ── */}
            {isEmpty ? (
                <div className="flex flex-1 flex-col items-center justify-center pb-16">
                    {/* Illustration */}
                    <InboxEmptyIllustration className="w-full max-w-md h-auto mb-6 select-none" />

                    {/* Messaging */}
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                        All caught up!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Take a break, write some code, do what you do best.
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {/* TODO: notification list goes here */}
                </div>
            )}
        </div>
    );
};