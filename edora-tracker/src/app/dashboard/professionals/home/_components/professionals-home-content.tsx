"use client";

import { useState } from "react";
import { ActivityHeatmap } from "./activity-heatmap";
import { Separator } from "@/components/ui/separator";
import { ProfessionalProfileCard } from "./professional-profile-card";
import { UpcomingEventsCard } from "./upcoming-events-card";
import { useWorkspaceFolders } from "@/app/hooks/use-workspace-folders";
import { CreateFolderDialog } from "@/app/dashboard/students/workspace/_components/create-folder-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";
import { DailyToDoList } from "./daily-to-do-list";

export function ProfessionalsHomeContent() {
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

    return (
        <div className="space-y-6">
            <ProfessionalProfileCard />

            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Monitor your activity, applications, and mentee outreach
                </p>
            </div>

            <Separator className="bg-blue-500 rounded-full h-1" />

            <ActivityHeatmap />

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <DailyToDoList />
                <UpcomingEventsCard />

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
