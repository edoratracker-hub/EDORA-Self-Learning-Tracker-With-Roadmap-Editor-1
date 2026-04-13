"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Clock, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { rescheduleInterview, type RescheduleInterviewData } from "@/app/actions/interview-actions";

interface RescheduleInterviewSheetProps {
    children: React.ReactNode;
    interviewId: string;
    currentDate: Date;
    currentTime: Date;
    studentName: string;
    jobTitle: string;
    onRescheduled?: () => void;
}

export function RescheduleInterviewSheet({
    children,
    interviewId,
    currentDate,
    currentTime,
    studentName,
    jobTitle,
    onRescheduled,
}: RescheduleInterviewSheetProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [hour, setHour] = useState<string>("10");
    const [minute, setMinute] = useState<string>("00");
    const [period, setPeriod] = useState<string>("AM");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minutes = ["00", "15", "30", "45"];

    const handleReschedule = async () => {
        if (!date) {
            toast.error("Please select a new date");
            return;
        }

        setIsSubmitting(true);

        try {
            let hour24 = parseInt(hour);
            if (period === "PM" && hour24 !== 12) hour24 += 12;
            if (period === "AM" && hour24 === 12) hour24 = 0;

            const timeString = `${hour24.toString().padStart(2, '0')}:${minute}`;

            const data: RescheduleInterviewData = {
                interviewId,
                newDate: date,
                newTime: timeString,
                reason: reason || undefined,
            };

            const result = await rescheduleInterview(data);

            if (result.success) {
                toast.success("Interview rescheduled successfully!");
                setOpen(false);
                setDate(undefined);
                setHour("10");
                setMinute("00");
                setPeriod("AM");
                setReason("");
                onRescheduled?.();
            } else {
                toast.error(result.error || "Failed to reschedule interview");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="sm:max-w-[540px] w-full p-0 flex flex-col h-full">

                {/* ── Header ── */}
                <SheetHeader className="px-6 pt-6 pb-5 border-b shrink-0">
                    <SheetTitle className="text-lg font-semibold tracking-tight">
                        Reschedule Interview
                    </SheetTitle>
                    <SheetDescription className="text-sm mt-1">
                        Change the interview date and time for this candidate.
                    </SheetDescription>
                </SheetHeader>

                {/* ── Scrollable Body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-6">

                        {/* Current Schedule */}
                        <section className="space-y-3">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Current Schedule
                            </Label>
                            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                <div>
                                    <p className="font-medium text-foreground text-[15px] leading-snug">
                                        {jobTitle}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Candidate: <span className="font-medium text-foreground">{studentName}</span>
                                    </p>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-5 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{format(new Date(currentDate), "PPP")}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{format(new Date(currentTime), "h:mm a")}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* New Date */}
                        <section className="space-y-3">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                New Date
                            </Label>
                            <div className="flex justify-center rounded-lg border p-1">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="w-full"
                                />
                            </div>
                        </section>

                        {/* New Time */}
                        <section className="space-y-3">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                New Time
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] text-muted-foreground">Hour</Label>
                                    <Select value={hour} onValueChange={setHour}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Hour" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours.map((h) => (
                                                <SelectItem key={h} value={h}>{h}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] text-muted-foreground">Minute</Label>
                                    <Select value={minute} onValueChange={setMinute}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Min" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minutes.map((m) => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] text-muted-foreground">Period</Label>
                                    <Select value={period} onValueChange={setPeriod}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="AM/PM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AM">AM</SelectItem>
                                            <SelectItem value="PM">PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* Reason */}
                        <section className="space-y-3">
                            <Label htmlFor="reason" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Reason for Rescheduling
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="e.g., Conflict with another meeting..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </section>

                        {/* Preview */}
                        {date && (
                            <section className="rounded-lg border bg-muted/20 p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        New Schedule
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-foreground">
                                    {format(date, "PPP")} at {hour}:{minute} {period}
                                </p>
                                {reason && (
                                    <p className="text-xs text-muted-foreground pt-1 border-t break-words">
                                        {reason}
                                    </p>
                                )}
                            </section>
                        )}
                    </div>
                </div>

                {/* ── Footer (pinned to bottom) ── */}
                <SheetFooter className="px-6 py-4 border-t shrink-0 flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-muted-foreground leading-tight max-w-[200px]">
                        The candidate will be notified via email automatically.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleReschedule}
                            disabled={!date || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                    Reschedule
                                </>
                            )}
                        </Button>
                    </div>
                </SheetFooter>

            </SheetContent>
        </Sheet>
    );
}
