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
            <DialogContent className="max-w-2xl bg-[#0d1117] border-[#30363d] p-0 overflow-hidden shadow-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto">
                <div className="border-b border-[#30363d] p-6 bg-[#161b22]/50">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Interview Details</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Complete information about the scheduled interview
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-6">
                    {/* Candidate Information */}
                    <div className="space-y-3">
                        <h3 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            Candidate Information
                        </h3>
                        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-blue-400" />
                                </div>
                                <span className="font-semibold text-[15px]">{interview.studentName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-neutral-800/50 flex items-center justify-center">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-foreground">
                                    {interview.studentEmail}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Job Information */}
                    <div className="space-y-3">
                        <h3 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-purple-500" />
                            Position Details
                        </h3>
                        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Briefcase className="h-4 w-4 text-purple-400" />
                                </div>
                                <span className="font-semibold text-[15px]">{interview.jobTitle}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-neutral-800/50 flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-foreground">
                                    {interview.companyName}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="space-y-3">
                        <h3 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-500" />
                            Schedule
                        </h3>
                        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-green-400" />
                                </div>
                                <span className="font-semibold text-[15px]">
                                    {format(interview.date, "EEEE, MMMM d, yyyy")}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-neutral-800/50 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-foreground">
                                    {format(interview.time, "h:mm a")}
                                </span>
                            </div>
                            {interview.location && (
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-neutral-800/50 flex items-center justify-center">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm text-foreground">
                                        {interview.location}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meeting Link */}
                    {interview.meetingLink && (
                        <div className="space-y-3">
                            <h3 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Video className="h-4 w-4 text-amber-500" />
                                Meeting Link
                            </h3>
                            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm">
                                <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline flex items-center gap-2 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Video className="h-4 w-4 text-blue-400" />
                                    </div>
                                    Join Meeting
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    {interview.status && (
                        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <span className="text-sm font-medium text-foreground">Status</span>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">{interview.status}</Badge>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-[#30363d]">
                        <Button variant="outline" className="border-[#30363d] bg-[#161b22] hover:bg-[#30363d] hover:text-foreground" onClick={onClose}>
                            Close
                        </Button>
                        {interview.meetingLink && (
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/20" asChild>
                                <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Video className="h-4 w-4 mr-2" />
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
