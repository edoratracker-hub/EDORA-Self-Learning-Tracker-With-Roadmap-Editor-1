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
    User,
    Mail,
    CalendarClock,
    Filter,
} from "lucide-react";
import { useRecruiterScheduledInterviews } from "@/app/hooks/use-recruiter-interviews";
import { format, isPast, isFuture, formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RecruiterScheduledInterviewsList() {
    const { data: interviews, isLoading, error } = useRecruiterScheduledInterviews();

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
                <Filter className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error loading interviews</h3>
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
                    Scheduled interviews will appear here
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
        const student = interview.student;
        if (!job || !student) return null;

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
                                    <Badge variant="secondary">Completed</Badge>
                                )}
                                {hasRescheduleHistory && (
                                    <Badge variant="outline" className="bg-orange-50">
                                        <History className="h-3 w-3 mr-1" />
                                        Rescheduled {interview.rescheduleHistory.length}x
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <User className="h-3 w-3" />
                                {student.name || student.email}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Student Information */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${student.email}`} className="text-primary hover:underline">
                                {student.email}
                            </a>
                        </div>
                    </div>

                    {/* Interview Details */}
                    {interviewDateTime && (
                        <div className="space-y-3 pt-3 border-t">
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
                        <div className="flex items-center gap-2 text-sm pt-2">
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

                    {/* Email Status */}
                    <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {interview.emailSent ? (
                                <Badge variant="outline" className="bg-green-50">
                                    Email Sent
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-red-50">
                                    Email Pending
                                </Badge>
                            )}
                            {interview.googleCalendarEventId && (
                                <Badge variant="outline" className="bg-blue-50">
                                    Calendar Event Created
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Reschedule History */}
                    {hasRescheduleHistory && (
                        <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                            <p className="text-xs font-semibold mb-2">Reschedule History:</p>
                            {interview.rescheduleHistory.slice(0, 2).map((history, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground">
                                    {history.oldDate && history.newDate && (
                                        <>
                                            {format(new Date(history.oldDate), "MMM d, yyyy")} →{" "}
                                            {format(new Date(history.newDate), "MMM d, yyyy")}
                                        </>
                                    )}
                                    {history.reason && <span className="block italic">Reason: {history.reason}</span>}
                                </p>
                            ))}
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
                    <Button variant="outline" size="sm">
                        View Details
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold">Scheduled Interviews</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and track all scheduled candidate interviews
                    </p>
                </div>
                <div className="text-sm text-muted-foreground">
                    {interviews.length} {interviews.length === 1 ? "interview" : "interviews"}
                </div>
            </div>

            <Tabs defaultValue="upcoming">
                <TabsList>
                    <TabsTrigger value="upcoming">
                        Upcoming ({upcomingInterviews.length})
                    </TabsTrigger>
                    <TabsTrigger value="past">
                        Past ({pastInterviews.length})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        All ({interviews.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {upcomingInterviews.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingInterviews.map(renderInterviewCard)}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CalendarClock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No upcoming interviews</h3>
                            <p className="text-muted-foreground">
                                Schedule interviews from your job applications
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {pastInterviews.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pastInterviews.map(renderInterviewCard)}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CalendarClock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No past interviews</h3>
                            <p className="text-muted-foreground">
                                Completed interviews will appear here
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {interviews.map(renderInterviewCard)}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
