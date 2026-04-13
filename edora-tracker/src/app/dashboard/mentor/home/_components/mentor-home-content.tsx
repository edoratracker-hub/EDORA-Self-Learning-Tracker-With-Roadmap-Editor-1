"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Calendar,
    Clock,
    TrendingUp,
    Users,
    FileText,
    MessageSquare,
    Star,
    CircleCheckBigIcon,
    UserPlusIcon,
    CheckCircle2Icon,
    VideoIcon,
    BellRingIcon,
    SendIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActivityHeatmap } from "@/app/dashboard/students/home/_components/activity-heatmap";
import { getProfileStatus } from "@/app/actions/mentor-profile-actions";
import { authClient } from "@/app/lib/auth-client";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { DailyToDoList } from "./daily-to-do-list";
import Link from "next/link";
import { useWorkspaceFolders } from "@/app/hooks/use-workspace-folders";
import { CreateFolderDialog } from "@/app/dashboard/students/workspace/_components/create-folder-dialog";

type ActivityCategory = "session" | "review" | "message" | "content" | "admin";

interface TodayActivity {
    id: string;
    time: string;
    title: string;
    description: string;
    category: ActivityCategory;
    completed: boolean;
}

const initialActivities: TodayActivity[] = [
    {
        id: "1",
        time: "09:00 AM",
        title: "1-on-1 with Arjun K.",
        description: "React performance optimization session",
        category: "session",
        completed: true,
    },
    {
        id: "2",
        time: "10:30 AM",
        title: "Review Priya's assignment",
        description: "Binary Search Tree implementation",
        category: "review",
        completed: true,
    },
    {
        id: "3",
        time: "12:00 PM",
        title: "Reply to Deepa L.",
        description: "Question about async/await patterns",
        category: "message",
        completed: false,
    },
    {
        id: "4",
        time: "02:00 PM",
        title: "Group mentoring session",
        description: "Web Dev Bootcamp — Week 5 discussion",
        category: "session",
        completed: false,
    },
    {
        id: "5",
        time: "03:30 PM",
        title: "Prepare learning materials",
        description: "Create slides for Next.js middleware topic",
        category: "content",
        completed: false,
    },

];

const categoryConfig: Record<ActivityCategory, { label: string; color: string }> = {
    session: { label: "Session", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    review: { label: "Review", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    message: { label: "Message", color: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
    content: { label: "Content", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    admin: { label: "Admin", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
};

export function MentorHomeContent() {
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;
    const [showProfileBanner, setShowProfileBanner] = useState(false);
    const [activities, setActivities] = useState<TodayActivity[]>(initialActivities);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { createFolder, isCreating } = useWorkspaceFolders();

    const handleCreateFolder = (name: string) => {
        createFolder(name, {
            onSuccess: (res) => {
                if (res.success) {
                    setIsDialogOpen(false);
                }
            },
        });
    };

    const completedCount = activities.filter(a => a.completed).length;
    const progressPercent = Math.round((completedCount / activities.length) * 100);

    const toggleActivity = (id: string) => {
        setActivities(prev =>
            prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
        );
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        async function checkProfileStatus() {
            if (!userId) return;

            try {
                const status = await getProfileStatus(userId);
                if (!status?.profile_completed) {
                    setShowProfileBanner(true);
                    timer = setTimeout(() => setShowProfileBanner(false), 5000);
                }
            } catch (error) {
                console.error('Failed to fetch profile status:', error);
            }
        }

        checkProfileStatus();
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [userId]);

    return (
        <div className="space-y-6">
            {showProfileBanner && (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4" role="alert">
                    <p className="font-bold">Complete your profile</p>
                    <p>Please complete your profile setup to start mentoring students. <a href="/dashboard/mentor/profile" className="underline">Go to Profile Setup</a></p>
                </div>
            )}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your mentorship sessions and track mentee progress
                </p>
            </div>

            <Separator className="bg-blue-500 rounded-full" />

            {/* Activity Heatmap - Reusing existing component for visual consistency */}
            <ActivityHeatmap />

            {/* Main Content Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <DailyToDoList />

                <div className="flex flex-col gap-4">

                    <Link href="http://localhost:3002" className="group" target="_blank">
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors duration-300">
                                    <TrendingUp className="h-6 w-6 text-indigo-500" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">Roadmap Builder</CardTitle>
                                    <CardDescription>Design learning paths and milestones</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                    Launch application <span className="ml-1">→</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <div onClick={() => setIsDialogOpen(true)} className="group cursor-pointer">
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors duration-300">
                                    <BookOpen className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">Coding Workspace</CardTitle>
                                    <CardDescription>Collaborative development environment</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                    Launch application <span className="ml-1">→</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <CreateFolderDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleCreateFolder}
                isLoading={isCreating}
            />
        </div>
    );
}
