"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, PlusIcon, CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMonthEvents } from "@/app/actions/calendar-actions";
import { format } from "date-fns";

interface CalendarSidebarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  interviews?: any[];
}

export function CalendarSidebar({
  currentDate,
  onDateChange,
  interviews = [],
}: CalendarSidebarProps) {
  const [displayMonth, setDisplayMonth] = useState(new Date(currentDate));
  const [monthEvents, setMonthEvents] = useState<any[]>([]);

  const fetchMonthEvents = useCallback(async () => {
    const result = await getMonthEvents(displayMonth);
    if (result.success) {
      setMonthEvents(result.events);
    }
  }, [displayMonth]);

  useEffect(() => {
    fetchMonthEvents();
  }, [fetchMonthEvents]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setDisplayMonth(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setDisplayMonth(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1),
    );
  };

  const daysInMonth = getDaysInMonth(displayMonth);
  const firstDay = getFirstDayOfMonth(displayMonth);
  const monthName = displayMonth.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      displayMonth.getMonth() === today.getMonth() &&
      displayMonth.getFullYear() === today.getFullYear()
    );
  };

  // Get upcoming interviews (future only)
  const upcomingInterviews = interviews
    .filter((i) => {
      if (!i.time) return false;
      return new Date(i.time) > new Date();
    })
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col w-70 border-r p-4 gap-6 overflow-y-auto">
      {/* Mini Calendar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200">
            {monthName}
          </h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-xs text-neutral-400">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="text-center text-xs h-6" />
          ))}
          {days.map((day) => (
            <button
              key={day}
              onClick={() => {
                const newDate = new Date(
                  displayMonth.getFullYear(),
                  displayMonth.getMonth(),
                  day,
                );
                onDateChange(newDate);
              }}
              className={`h-6 text-xs rounded flex items-center justify-center transition-colors ${isToday(day)
                ? "bg-blue-500 text-white font-medium"
                : "hover:bg-neutral-800 text-neutral-300"
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase">
            Upcoming Interviews
          </h4>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex flex-col p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20"
              >
                <span className="text-xs font-medium text-neutral-200 truncate">
                  {interview.job?.title || "Interview"}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <CalendarIcon className="h-3 w-3 text-purple-400" />
                  <span className="text-[10px] text-neutral-400">
                    {format(new Date(interview.date), "MMM d")}
                  </span>
                  <Clock className="h-3 w-3 text-purple-400 ml-1" />
                  <span className="text-[10px] text-neutral-400">
                    {format(new Date(interview.time), "h:mm a")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Events List */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase">
          Daily Events
        </h4>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {monthEvents.length === 0 ? (
            <p className="text-xs text-neutral-500">No events this month</p>
          ) : (
            monthEvents.map((event) => (
              <div key={event.id} className="flex flex-col p-2 bg-neutral-900/50 rounded border border-neutral-800">
                <span className="text-xs font-medium text-neutral-200 truncate">{event.title}</span>
                <span className="text-[10px] text-neutral-500">
                  {format(new Date(event.startTime), "MMM d, h:mm a")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>



    </div>
  );
}
