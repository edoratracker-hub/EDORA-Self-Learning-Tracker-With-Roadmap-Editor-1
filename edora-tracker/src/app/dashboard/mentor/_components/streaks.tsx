"use client";

import React from "react";
import { Flame, Trophy, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    totalMentoringSessions: number;
    lastActivityDate: Date;
}

// Mock data - replace with actual data fetching
const getStreakData = (): StreakData => {
    return {
        currentStreak: 12,
        longestStreak: 45,
        totalMentoringSessions: 328,
        lastActivityDate: new Date(),
    };
};

export const Streaks = () => {
    const streakData = getStreakData();
    const isActiveToday =
        new Date().toDateString() === streakData.lastActivityDate.toDateString();

    const stats = [
        {
            label: "Current Streak",
            value: streakData.currentStreak,
            suffix: "days",
            icon: Flame,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            label: "Longest Streak",
            value: streakData.longestStreak,
            suffix: "days",
            icon: Trophy,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
        },
        {
            label: "Total Sessions",
            value: streakData.totalMentoringSessions,
            suffix: "sessions",
            icon: TrendingUp,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
    ];

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Mentoring Streak
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Keep inspiring your mentees!
                        </p>
                    </div>
                    {isActiveToday && (
                        <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-green-600 dark:text-green-400">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium">Active today</span>
                        </div>
                    )}
                </div>
                <Separator className="mt-4 bg-green-500" />
            </div>
            <div>
                <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center gap-4 p-4 rounded-lg border bg-card transition-colors"
                        >
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {stat.suffix}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {streakData.currentStreak >= 7 && (
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                        <div className="flex items-center gap-3">
                            <Flame className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-sm font-medium">You're on fire! 🔥</p>
                                <p className="text-xs text-muted-foreground">
                                    {streakData.currentStreak >= 30
                                        ? "Amazing dedication to your mentees! Keep it up!"
                                        : `Just ${30 - streakData.currentStreak} more days to reach 30-day milestone!`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
