"use client";

import { useEffect, useRef } from "react";
import { CalendarEvent, CalendarEventData } from "./calender-event";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WeekCalendarGridProps {
  currentDate: Date;
  events: CalendarEventData[];
  onEventClick?: (event: CalendarEventData) => void;
}

export function WeekCalendarGrid({
  currentDate,
  events,
  onEventClick,
}: WeekCalendarGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Get the start of the week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Update current time indicator
  useEffect(() => {
    const updateTimeline = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const topPercent = (totalMinutes / (24 * 60)) * 100;

      if (timelineRef.current) {
        timelineRef.current.style.top = `${topPercent}%`;
      }
    };

    updateTimeline();
    const interval = setInterval(updateTimeline, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Group events by day
  const getEventsByDay = (dayIndex: number) => {
    return events.filter((event) => event.dayIndex === dayIndex);
  };

  const timeSlots = Array.from({ length: 23 }, (_, i) => i + 1); // 1 AM to 11 PM

  // All-day events for this week
  const allDayEvents = events.filter((e) => e.isAllDay);

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
      {/* Header with days and all-day events */}
      <div className="border-b border-[#30363d]">
        {/* All-day events section */}
        {/* {allDayEvents.length > 0 && (
          <div className="px-4 py-3 border-b border-neutral-800">
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((date, dayIndex) => (
                <div key={dayIndex} className="flex flex-col gap-1">
                  {allDayEvents
                    .filter((e) => e.dayIndex === dayIndex)
                    .map((event) => (
                      <CalendarEvent key={event.id} {...event} isAllDay />
                    ))}
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Day headers */}
        <div className="grid grid-cols-7 sticky top-0 z-20 ml-16 bg-[#161b22] border-b border-[#30363d] shadow-sm">
          {weekDays.map((date, idx) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const dayName = date.toLocaleString("default", {
              weekday: "short",
            });
            const dayNum = date.getDate();

            return (
              <div
                key={idx}
                className={`flex-1 px-4 py-3 text-center border-l border-[#30363d] ${idx === 0 ? "border-l-0" : ""
                  }`}
              >
                <div className={`text-xs font-medium tracking-wider uppercase mb-1 ${isToday ? "text-blue-400" : "text-muted-foreground"}`}>
                  {dayName}
                </div>
                <div
                  className={`text-lg transition-colors font-semibold mx-auto flex items-center justify-center size-8 rounded-full ${isToday
                    ? "text-white bg-blue-600 shadow-md shadow-blue-900/20"
                    : "text-foreground hover:bg-[#30363d]"
                    }`}
                >
                  {dayNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full w-full">
          <div className="relative">
            {/* Current time indicator */}
            <div
              ref={timelineRef}
              className="absolute left-0 right-0 h-px bg-red-500/80 z-20 pointer-events-none transition-all"
            >
              <div className="absolute -left-2 w-2 h-2 rounded-full bg-red-500 top-1/2 -translate-y-1/2" />
              <div className="absolute -left-16 w-14 text-right top-0 text-[11px] font-bold text-red-500 -translate-y-1/2 select-none">
                {new Date().toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>

            {/* Time slots grid */}
            <div className="flex">
              {/* Time labels */}
              <div className="w-16 flex-shrink-0 border-r border-[#30363d] bg-[#0d1117] z-10">
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 text-[11px] text-muted-foreground font-medium flex justify-center items-start pt-2 pr-2"
                  >
                    {hour % 12 === 0 ? 12 : hour % 12}
                    <span className="ml-0.5 opacity-70 text-[9px]">{hour < 12 ? "AM" : "PM"}</span>
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="flex-1 grid grid-cols-7">
                {weekDays.map((date, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`border-l border-[#30363d]/50 relative ${dayIndex === 0 ? "border-l-0" : ""
                      }`}
                  >
                    {/* Hour rows */}
                    {timeSlots.map((hour) => (
                      <div
                        key={`${dayIndex}-${hour}`}
                        className="h-16 border-b border-[#30363d]/50 hover:bg-[#161b22]/40 transition-colors"
                      />
                    ))}

                    {/* Events */}
                    <div className="absolute inset-0 pt-6 px-1">
                      {getEventsByDay(dayIndex)
                        .filter((e) => !e.isAllDay)
                        .map((event) => {
                          const [startHour, startMin] = event.startTime
                            .split(":")
                            .map(Number);
                          const topOffset =
                            ((startHour * 60 + startMin) / (24 * 60)) * 100;
                          return (
                            <div
                              key={event.id}
                              className="absolute left-1 right-1"
                              style={{
                                top: `${topOffset}%`,
                              }}
                            >
                              <CalendarEvent
                                {...event}
                                onClick={() => onEventClick?.(event)}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
