"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Clock,
    Video,
    Briefcase,
    ExternalLink,
    CalendarDays,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import {
    getUpcomingEventsForProfessional,
    type UpcomingEvent,
} from "@/app/actions/professional-events-actions";

function formatEventDate(date: Date): string {
    const now = new Date();
    const eventDate = new Date(date);
    const diffMs = eventDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;

    return eventDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

function formatEventTime(time: Date | null): string | null {
    if (!time) return null;
    return new Date(time).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

function getEventBadge(type: UpcomingEvent["type"]) {
    switch (type) {
        case "interview":
            return (
                <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/20 hover:bg-purple-500/15">
                    Interview
                </Badge>
            );
        case "deadline":
            return (
                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/15">
                    Deadline
                </Badge>
            );
        case "webinar":
            return (
                <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20 hover:bg-blue-500/15">
                    Webinar
                </Badge>
            );
    }
}

function getEventIcon(type: UpcomingEvent["type"]) {
    switch (type) {
        case "interview":
            return <Video className="h-4 w-4 text-purple-400" />;
        case "deadline":
            return <Briefcase className="h-4 w-4 text-amber-400" />;
        case "webinar":
            return <Calendar className="h-4 w-4 text-blue-400" />;
    }
}

export function UpcomingEventsCard() {
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            const result = await getUpcomingEventsForProfessional();
            if (result.success) {
                setEvents(result.events);
            }
            setLoading(false);
        }
        fetchEvents();
    }, []);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-blue-500" />
                        Upcoming Events
                    </CardTitle>
                    <CardDescription>
                        Interviews, deadlines, and scheduled events
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/professionals/calendar">
                        View Calendar
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                ) : events.length > 0 ? (
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                                {/* Icon */}
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                    {getEventIcon(event.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-medium leading-none truncate">
                                            {event.title}
                                        </p>
                                        {getEventBadge(event.type)}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatEventDate(event.date)}
                                        </span>
                                        {formatEventTime(event.time) && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatEventTime(event.time)}
                                            </span>
                                        )}
                                        {event.company && (
                                            <span className="truncate">
                                                {event.company}
                                            </span>
                                        )}
                                    </div>

                                    {event.candidateName && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            with {event.candidateName}
                                        </p>
                                    )}
                                </div>

                                {/* Meeting Link */}
                                {event.meetingLink && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        asChild
                                    >
                                        <a
                                            href={event.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CalendarDays className="h-10 w-10 text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground italic">
                            No upcoming events scheduled.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            asChild
                        >
                            <Link href="/dashboard/professionals/calendar">
                                Go to Calendar
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
