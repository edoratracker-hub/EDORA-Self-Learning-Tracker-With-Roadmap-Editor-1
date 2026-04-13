"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarEventData } from "./calender-event";
import { CalendarSidebar } from "./calender-sidebar";
import { WeekCalendarGrid } from "./week-calender-grid";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { useRecruiterScheduledInterviews } from "@/app/hooks/use-recruiter-interviews";
import {
  InterviewDetailDialog,
  InterviewDetailData,
} from "./interview-detail-dialog";
import { format } from "date-fns";

// Mock event data
const MOCK_EVENTS: CalendarEventData[] = [
  // All-day events
  {
    id: "1",
    title: "MORNING DISCIPLINE",
    startTime: "00:00",
    color: "bg-blue-600",
    isAllDay: true,
    dayIndex: 1, // Sunday
  },
  {
    id: "2",
    title: "MORNING DISCIPLINE",
    startTime: "00:00",
    color: "bg-blue-600",
    isAllDay: true,
    dayIndex: 2, // Monday
  },
  {
    id: "3",
    title: "MORNING DISCIPLINE",
    startTime: "00:00",
    color: "bg-blue-600",
    isAllDay: true,
    dayIndex: 3, // Tuesday
  },
  {
    id: "4",
    title: "MORNING DISCIPLINE",
    startTime: "00:00",
    color: "bg-blue-600",
    isAllDay: true,
    dayIndex: 4, // Wednesday
  },
  {
    id: "5",
    title: "MORNING DISCIPLINE",
    startTime: "00:00",
    color: "bg-blue-600",
    isAllDay: true,
    dayIndex: 5, // Thursday
  },
  {
    id: "6",
    title: "Maharishi Dayanand Saraswati...",
    startTime: "00:00",
    color: "bg-green-600",
    isAllDay: true,
    dayIndex: 5, // Thursday
  },
  {
    id: "7",
    title: "MORNING DISCIPLINE",
    startTime: "00:00",
    color: "bg-blue-600",
    isAllDay: true,
    dayIndex: 6, // Friday
  },
  // Timed events
  {
    id: "8",
    title: "Team Standup",
    startTime: "09:30",
    endTime: "10:00",
    color: "bg-purple-600",
    dayIndex: 3,
  },
  {
    id: "9",
    title: "Project Review",
    startTime: "14:00",
    endTime: "15:30",
    color: "bg-cyan-600",
    dayIndex: 4,
  },
  {
    id: "10",
    title: "Client Call",
    startTime: "16:00",
    endTime: "17:00",
    color: "bg-amber-600",
    dayIndex: 2,
  },
];

import { AddEventDialog } from "./add-event-dialog";
import { getCalendarEvents } from "@/app/actions/calendar-actions";
import { Plus } from "lucide-react";

export function CalendarLayout() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewDetailData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  // Fetch scheduled interviews
  const { data: interviews, isLoading } = useRecruiterScheduledInterviews();

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

  // Convert interviews and DB events to calendar events
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
