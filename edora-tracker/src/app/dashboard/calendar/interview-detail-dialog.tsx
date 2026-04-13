"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Briefcase,
    Building2,
    Video,
    Mail,
} from "lucide-react";
import { format } from "date-fns";

export interface InterviewDetailData {
    id: string;
    studentName: string;
    studentEmail: string;
    jobTitle: string;
    companyName: string;
    date: Date;
    time: Date;
    meetingLink?: string;
    location?: string;
    status?: string;
}

interface InterviewDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    interview: InterviewDetailData | null;
}

export function InterviewDetailDialog({
    isOpen,
    onClose,
    interview,
}: InterviewDetailDialogProps) {
    if (!interview) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Interview Details</DialogTitle>
                    <DialogDescription>
                        Complete information about the scheduled interview
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Candidate Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            Candidate Information
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{interview.studentName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {interview.studentEmail}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Job Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-purple-500" />
                            Position Details
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{interview.jobTitle}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {interview.companyName}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-500" />
                            Schedule
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {format(interview.date, "EEEE, MMMM d, yyyy")}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {format(interview.time, "h:mm a")}
                                </span>
                            </div>
                            {interview.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {interview.location}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meeting Link */}
                    {interview.meetingLink && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Video className="h-5 w-5 text-amber-500" />
                                Meeting Link
                            </h3>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline flex items-center gap-2"
                                >
                                    <Video className="h-4 w-4" />
                                    Join Meeting
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    {interview.status && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Status:</span>
                            <Badge variant="secondary">{interview.status}</Badge>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        {interview.meetingLink && (
                            <Button asChild>
                                <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Video className="h-4 w-4" />
                                    Join Interview
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
