"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Medal, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface LeaderboardEntry {
    id: string;
    name: string;
    avatar?: string;
    score: number;
    rank: number;
    previousRank: number;
    specialty: string;
}

// Mock data - replace with actual data fetching
const getLeaderboardData = (): LeaderboardEntry[] => {
    return [
        {
            id: "1",
            name: "Dr. Anita Sharma",
            avatar: undefined,
            score: 3200,
            rank: 1,
            previousRank: 1,
            specialty: "Machine Learning",
        },
        {
            id: "2",
            name: "Prof. Rajesh Kumar",
            avatar: undefined,
            score: 2950,
            rank: 2,
            previousRank: 3,
            specialty: "Web Development",
        },
        {
            id: "3",
            name: "Dr. Emily Carter",
            avatar: undefined,
            score: 2870,
            rank: 3,
            previousRank: 2,
            specialty: "Data Science",
        },
        {
            id: "4",
            name: "Prof. John Mitchell",
            avatar: undefined,
            score: 2650,
            rank: 4,
            previousRank: 5,
            specialty: "Cybersecurity",
        },
        {
            id: "5",
            name: "Dr. Lisa Wang",
            avatar: undefined,
            score: 2520,
            rank: 5,
            previousRank: 4,
            specialty: "Cloud Computing",
        },
        {
            id: "6",
            name: "Prof. David Okafor",
            avatar: undefined,
            score: 2410,
            rank: 6,
            previousRank: 7,
            specialty: "UI/UX Design",
        },
        {
            id: "7",
            name: "Dr. Maria Gonzalez",
            avatar: undefined,
            score: 2380,
            rank: 7,
            previousRank: 6,
            specialty: "Mobile Development",
        },
    ];
};

const getRankBadge = (rank: number) => {
    switch (rank) {
        case 1:
            return {
                icon: Crown,
                color: "text-green-500",
                bgColor: "bg-green-500/10",
                borderColor: "border-green-500/20",
            };
        case 2:
            return {
                icon: Medal,
                color: "text-yellow-400",
                bgColor: "bg-yellow-400/10",
                borderColor: "border-yellow-400/20",
            };
        case 3:
            return {
                icon: Medal,
                color: "text-orange-600",
                bgColor: "bg-orange-600/10",
                borderColor: "border-orange-600/20",
            };
        default:
            return null;
    }
};

const getRankChange = (rank: number, previousRank: number) => {
    const change = previousRank - rank;
    if (change > 0) {
        return {
            icon: TrendingUp,
            color: "text-green-500",
            label: `+${change}`,
        };
    } else if (change < 0) {
        return {
            icon: TrendingDown,
            color: "text-red-500",
            label: `${change}`,
        };
    }
    return {
        icon: Minus,
        color: "text-muted-foreground",
        label: "—",
    };
};

const getInitials = (name: string): string => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

export const Leaderboard = () => {
    const leaderboardData = getLeaderboardData();

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">
                    Mentor Leaderboard
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Top mentors by impact this month
                </p>
            </div>
            <Separator className=" bg-green-500" />
            <div className="space-y-2 mt-6">
                <div className="space-y-2">
                    {leaderboardData.map((entry) => {
                        const rankBadge = getRankBadge(entry.rank);
                        const rankChange = getRankChange(entry.rank, entry.previousRank);
                        const isTopThree = entry.rank <= 3;

                        return (
                            <div
                                key={entry.id}
                                className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${isTopThree
                                        ? `${rankBadge?.borderColor} ${rankBadge?.bgColor}`
                                        : "bg-card"
                                    }`}
                            >
                                {/* Rank */}
                                <div className="flex items-center justify-center w-8 h-8 shrink-0">
                                    {rankBadge ? (
                                        <rankBadge.icon
                                            className={`h-6 w-6 ${rankBadge.color}`}
                                        />
                                    ) : (
                                        <span className="text-lg font-bold text-muted-foreground">
                                            {entry.rank}
                                        </span>
                                    )}
                                </div>

                                {/* Avatar & Info */}
                                <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarImage src={entry.avatar} alt={entry.name} />
                                    <AvatarFallback
                                        className={isTopThree ? rankBadge?.bgColor : ""}
                                    >
                                        {getInitials(entry.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{entry.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {entry.specialty}
                                    </p>
                                </div>

                                {/* Score & Change */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                        <p className="text-sm font-bold">
                                            {entry.score.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">impact pts</p>
                                    </div>

                                    <div
                                        className={`flex items-center gap-0.5 ${rankChange.color}`}
                                    >
                                        <rankChange.icon className="h-3 w-3" />
                                        <span className="text-xs font-medium min-w-[1.5rem] text-center">
                                            {rankChange.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
