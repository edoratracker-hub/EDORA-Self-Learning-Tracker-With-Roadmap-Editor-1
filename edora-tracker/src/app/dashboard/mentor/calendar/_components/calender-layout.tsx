"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarEventData } from "./calender-event";
import { CalendarSidebar } from "./calender-sidebar";
import { WeekCalendarGrid } from "./week-calender-grid";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useUserScheduledInterviews } from "@/app/hooks/use-recruiter-interviews";
import {
  InterviewDetailDialog,
  InterviewDetailData,
} from "./interview-detail-dialog";
import { format } from "date-fns";
import { getCalendarEvents } from "@/app/actions/calendar-actions";
import { AddEventDialog } from "../add-event-dialog";

export function CalendarLayout() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewDetailData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  // Fetch scheduled interviews for the current user
  const { data: interviews, isLoading } = useUserScheduledInterviews();

  const fetchDbEvents = useCallback(async () => {
    setDbLoading(true);
    const weekStart = getWeekStart(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const result = await getCalendarEvents(weekStart, weekEnd);
    if (result.success) {
      setDbEvents(result.events);
    }
    setDbLoading(false);
  }, [currentDate]);

  useEffect(() => {
    fetchDbEvents();
  }, [fetchDbEvents]);

  const calendarEvents: CalendarEventData[] = useMemo(() => {
    const interviewEvents = (interviews || [])
      .map((interview) => {
        if (!interview.time || !interview.date) return null;

        const interviewDate = new Date(interview.time);
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        if (interviewDate < weekStart || interviewDate >= weekEnd) return null;

        return {
          id: interview.id,
          title: interview.job?.title || "Interview",
          startTime: format(interviewDate, "HH:mm"),
          color: "bg-purple-600",
          dayIndex: interviewDate.getDay(),
          isAllDay: false,
          interviewData: interview,
        } as any;
      })
      .filter((e): e is any => e !== null);

    const mappedDbEvents = dbEvents.map((event) => {
      const eventDate = new Date(event.startTime);
      return {
        id: event.id,
        title: event.title,
        startTime: format(eventDate, "HH:mm"),
        color: event.color || "bg-blue-600",
        dayIndex: eventDate.getDay(),
        isAllDay: false,
      };
    });

    return [...interviewEvents, ...mappedDbEvents];
  }, [interviews, dbEvents, currentDate]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  const handleGridAction = (data: any, isNewEvent?: boolean) => {
    if (isNewEvent) {
      setSelectedDate(data as Date);
      setIsAddEventOpen(true);
    } else {
      handleEventClick(data as CalendarEventData);
    }
  };

  const handleEventClick = (event: CalendarEventData) => {
    if ((event as any).interviewData) {
      const interview = (event as any).interviewData;
      const interviewDetail: InterviewDetailData = {
        id: interview.id,
        studentName: interview.student?.name || "Unknown",
        studentEmail: interview.student?.email || "",
        jobTitle: interview.job?.title || "Position",
        companyName: interview.job?.organization?.companyName || "Company",
        date: new Date(interview.date!),
        time: new Date(interview.time),
        meetingLink: interview.meetingLink || undefined,
        location: interview.job?.location || undefined,
        status: "Scheduled",
      };
      setSelectedInterview(interviewDetail);
      setIsDetailDialogOpen(true);
    }
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  function getWeekStart(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CalendarSidebar
        currentDate={selectedDate}
        onDateChange={setSelectedDate}
        interviews={interviews || []}
      />

      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevWeek}
                className="text-neutral-400"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-neutral-50">
                {monthName}
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextWeek}
                  className="text-neutral-400"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>View</SelectLabel>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                className="gap-2"
                onClick={() => setIsAddEventOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
            </div>
          </div>
        </div>

        {isLoading || dbLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <WeekCalendarGrid
            currentDate={currentDate}
            events={calendarEvents}
            onEventClick={handleGridAction}
          />
        )}
      </div>

      <AddEventDialog
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        selectedDate={selectedDate}
        onEventAdded={fetchDbEvents}
      />

      <InterviewDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        interview={selectedInterview}
      />
    </div>
  );
}
