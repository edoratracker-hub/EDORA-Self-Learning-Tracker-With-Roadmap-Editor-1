"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { scheduleInterview, type ScheduleInterviewData } from "@/app/actions/interview-actions";
import type { Job } from "@/app/hooks/use-job-detail";
import type { JobApplicant } from "@/app/hooks/use-job-detail";

interface ScheduleInterviewSheetProps {
    children: React.ReactNode;
    applicant: JobApplicant;
    job: Job;
    onScheduled?: () => void;
}

export function ScheduleInterviewSheet({
    children,
    applicant,
    job,
    onScheduled,
}: ScheduleInterviewSheetProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [hour, setHour] = useState<string>("10");
    const [minute, setMinute] = useState<string>("00");
    const [period, setPeriod] = useState<string>("AM");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minutes = ["00", "15", "30", "45"];

    const handleSchedule = async () => {
        if (!date) {
            toast.error("Please select a date");
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert 12-hour format to 24-hour format
            let hour24 = parseInt(hour);
            if (period === "PM" && hour24 !== 12) hour24 += 12;
            if (period === "AM" && hour24 === 12) hour24 = 0;

            const timeString = `${hour24.toString().padStart(2, '0')}:${minute}`;

            const data: ScheduleInterviewData = {
                jobId: job.id,
                studentId: applicant.studentId,
                applicationId: applicant.id,
                date: date,
                time: timeString,
            };

            const result = await scheduleInterview(data);

            if (result.success) {
                toast.success("Interview scheduled successfully!");
                setOpen(false);
                setDate(undefined);
                setHour("10");
                setMinute("00");
                setPeriod("AM");
                onScheduled?.();
            } else {
                toast.error(result.error || "Failed to schedule interview");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedDateTime = () => {
        if (!date) return null;
        let hour24 = parseInt(hour);
        if (period === "PM" && hour24 !== 12) hour24 += 12;
        if (period === "AM" && hour24 === 12) hour24 = 0;
        return `${format(date, "PPP")} at ${hour}:${minute} ${period}`;
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="sm:max-w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Schedule Interview</SheetTitle>
                    <SheetDescription>
                        Schedule an interview with the candidate for this position.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Job Details */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Job Details</h3>
                        <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-foreground">{job.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {job.organization?.companyName || "Organization"}
                                    </p>
                                </div>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                    {job.jobType}
                                </span>
                            </div>
                            {job.location && (
                                <p className="text-sm text-muted-foreground">📍 {job.location}</p>
                            )}
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Candidate Details</h3>
                        <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
                            <div>
                                <p className="font-semibold text-foreground">{applicant.studentName}</p>
                                <p className="text-sm text-muted-foreground">{applicant.email}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Applied {format(new Date(applicant.appliedAt), "PPP")}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Date Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Select Date</Label>
                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(date) => date < new Date()}
                                className="rounded-md border"
                            />
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Select Time</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <Select value={hour} onValueChange={setHour}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Hour" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hours.map((h) => (
                                        <SelectItem key={h} value={h}>
                                            {h}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={minute} onValueChange={setMinute}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Minute" />
                                </SelectTrigger>
                                <SelectContent>
                                    {minutes.map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="AM/PM" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AM">AM</SelectItem>
                                    <SelectItem value="PM">PM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Preview */}
                    {getSelectedDateTime() && (
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
                            <div className="flex items-start gap-3">
                                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Interview Scheduled
                                    </p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                        {getSelectedDateTime()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSchedule}
                            disabled={!date || isSubmitting}
                            className="min-w-[120px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Schedule
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
