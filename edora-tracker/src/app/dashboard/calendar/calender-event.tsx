"use client";

export interface CalendarEventData {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  color: string;
  isAllDay?: boolean;
  dayIndex?: number;
  onClick?: () => void;
}

interface CalendarEventProps extends CalendarEventData {
  isAllDay?: boolean;
}

export function CalendarEvent({
  title,
  startTime,
  color,
  isAllDay,
  onClick,
}: CalendarEventProps) {
  if (isAllDay) {
    return (
      <div
        className={`px-2 py-1 rounded text-xs font-medium text-white truncate cursor-pointer hover:opacity-90 transition-opacity ${color}`}
        title={title}
        onClick={onClick}
      >
        {title}
      </div>
    );
  }

  return (
    <div
      className={`px-2 py-1.5 rounded text-xs font-medium text-white truncate cursor-pointer hover:opacity-90 transition-opacity ${color}`}
      title={`${title} at ${startTime}`}
      onClick={onClick}
    >
      {title}
    </div>
  );
}
