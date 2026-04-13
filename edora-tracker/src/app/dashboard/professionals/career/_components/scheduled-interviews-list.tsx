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
    Calendar,
    Clock,
    Building2,
    Loader2,
    Video,
    MapPin,
    History,
    ExternalLink,
    CalendarClock,
} from "lucide-react";
import { useStudentScheduledInterviews } from "@/app/hooks/use-student-interviews";
import { format, isPast, isFuture, formatDistanceToNow } from "date-fns";

export function ScheduledInterviewsList() {
    const { data: interviews, isLoading, error } = useStudentScheduledInterviews();

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
                <p className="text-destructive">{error.message || "Failed to load scheduled interviews"}</p>
            </div>
        );
    }

    if (!interviews || interviews.length === 0) {
        return (
            <div className="text-center py-12">
                <CalendarClock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scheduled interviews</h3>
                <p className="text-muted-foreground">
                    Your scheduled interviews will appear here
                </p>
            </div>
        );
    }

    // Separate upcoming and past interviews
    const upcomingInterviews = interviews.filter((interview) => {
        if (!interview.time) return false;
        return isFuture(new Date(interview.time));
    });

    const pastInterviews = interviews.filter((interview) => {
        if (!interview.time) return false;
        return isPast(new Date(interview.time));
    });

    const renderInterviewCard = (interview: typeof interviews[0]) => {
        const job = interview.job;
        if (!job) return null;

        const interviewDateTime = interview.time ? new Date(interview.time) : null;
        const isUpcoming = interviewDateTime ? isFuture(interviewDateTime) : false;
        const hasRescheduleHistory = interview.rescheduleHistory && interview.rescheduleHistory.length > 0;

        return (
            <Card key={interview.id} className={`hover:shadow-lg transition-shadow ${isUpcoming ? "border-l-4 border-l-green-600" : ""}`}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {isUpcoming ? (
                                    <Badge className="bg-green-600">Upcoming</Badge>
                                ) : (
                                    <Badge variant="secondary">Past</Badge>
                                )}
                                {hasRescheduleHistory && (
                                    <Badge variant="outline" className="bg-orange-50">
                                        <History className="h-3 w-3 mr-1" />
                                        Rescheduled
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <Building2 className="h-3 w-3" />
                                {job.organization?.companyName || "Company"}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {interviewDateTime && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {format(interviewDateTime, "EEEE, MMMM d, yyyy")}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {format(interviewDateTime, "h:mm a")}
                                </span>
                                {isUpcoming && (
                                    <span className="text-muted-foreground">
                                        ({formatDistanceToNow(interviewDateTime, { addSuffix: true })})
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {interview.meetingLink && (
                        <div className="flex items-center gap-2 text-sm">
                            <Video className="h-4 w-4 text-muted-foreground" />
                            <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Join Meeting
                            </a>
                        </div>
                    )}

                    {job.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                        </div>
                    )}

                    {hasRescheduleHistory && (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                                <History className="h-3 w-3 inline mr-1" />
                                This interview was rescheduled {interview.rescheduleHistory.length} {interview.rescheduleHistory.length === 1 ? "time" : "times"}
                            </p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex gap-2">
                    {interview.meetingLink && isUpcoming && (
                        <Button className="flex-1" asChild>
                            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-2" />
                                Join Interview
                            </a>
                        </Button>
                    )}
                    {interview.googleCalendarEventId && (
                        <Button variant="outline" size="icon">
                            <Calendar className="h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Scheduled Interviews</h2>
                <p className="text-sm text-muted-foreground">
                    {interviews.length} {interviews.length === 1 ? "interview" : "interviews"}
                </p>
            </div>

            {upcomingInterviews.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingInterviews.map(renderInterviewCard)}
                    </div>
                </div>
            )}

            {pastInterviews.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">Past Interviews</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pastInterviews.map(renderInterviewCard)}
                    </div>
                </div>
            )}
        </div>
    );
}
