"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Building2,
    Loader2,
    Calendar,
    ExternalLink,
} from "lucide-react";
import { useAppliedJobsDetails } from "@/app/hooks/use-student-applications";
import { formatDistanceToNow } from "date-fns";

const statusColors = {
    applied: "bg-blue-600",
    reviewing: "bg-yellow-600",
    shortlisted: "bg-purple-600",
    scheduled: "bg-green-600",
    rescheduled: "bg-orange-600",
    rejected: "bg-red-600",
    accepted: "bg-green-700",
};

export function AppliedJobsList() {
    const { data: applications, isLoading, error } = useAppliedJobsDetails();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive">{error.message || "Failed to load applied jobs"}</p>
            </div>
        );
    }

    if (!applications || applications.length === 0) {
        return (
            <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground">
                    Start applying to jobs to see them here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">My Applications</h2>
                <p className="text-sm text-muted-foreground">
                    {applications.length} {applications.length === 1 ? "application" : "applications"}
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((application) => {
                    const job = application.job;
                    if (!job) return null;

                    const getPostedTime = () => {
                        try {
                            if (!application.createdAt) return "Recently";
                            return formatDistanceToNow(new Date(application.createdAt), { addSuffix: true });
                        } catch {
                            return "Recently";
                        }
                    };

                    const getSalaryText = () => {
                        if (job.salaryMin && job.salaryMax) {
                            return `${job.currency || "INR"} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
                        } else if (job.salaryMin) {
                            return `${job.currency || "INR"} ${job.salaryMin.toLocaleString()}+`;
                        }
                        return "Competitive";
                    };

                    return (
                        <Card key={application.id} className="group relative flex flex-col h-full hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-1 ${statusColors[application.status as keyof typeof statusColors] || "bg-gray-600"}`} />
                            
                            <CardHeader className="pb-3 pt-6">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                    <div>
                                        <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                            {job.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1.5 mt-1.5 text-sm font-medium">
                                            <Building2 className="h-3.5 w-3.5 text-muted-foreground/70" />
                                            {job.organization?.companyName || "Company"}
                                        </CardDescription>
                                    </div>
                                    {application.status && (
                                        <Badge className={`shrink-0 shadow-sm border-0 ${statusColors[application.status as keyof typeof statusColors] || "bg-gray-600"}`}>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col gap-4 pb-4">
                                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                                        <span className="text-muted-foreground truncate">{job.location || "Remote"}</span>
                                    </div>
                                    {job.jobType ? (
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                                            <span className="text-muted-foreground truncate capitalize">{job.jobType.replace("-", " ")}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                                            <span className="text-muted-foreground truncate capitalize">Full Type</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                                        <span className="text-muted-foreground truncate">{getSalaryText()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                                        <span className="text-muted-foreground truncate">Applied {getPostedTime()}</span>
                                    </div>
                                </div>

                                {(job.requiredSkills as any) && Array.isArray(job.requiredSkills) && (job.requiredSkills as any).length > 0 && (
                                    <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
                                        {(job.requiredSkills as string[]).slice(0, 3).map((skill: string, idx: number) => (
                                            <Badge key={idx} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {job.requiredSkills.length > 3 && (
                                            <Badge variant="outline" className="text-[11px] px-2 py-0.5 rounded-md text-muted-foreground/80 font-medium">
                                                +{job.requiredSkills.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
