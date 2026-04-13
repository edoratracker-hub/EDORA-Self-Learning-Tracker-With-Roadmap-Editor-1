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
  endTime,
  onClick,
}: CalendarEventProps) {
  // Extract the base color name if it is a standard tailwind bg-class (e.g. bg-blue-600 -> blue)
  const colorMatch = color.match(/bg-([a-z]+)-/);
  const baseColor = colorMatch ? colorMatch[1] : 'blue';

  if (isAllDay) {
    return (
      <div
        className={`px-2 py-1 rounded-sm text-xs font-medium truncate cursor-pointer transition-all hover:brightness-110 ${color} text-white`}
        title={title}
        onClick={onClick}
      >
        {title}
      </div>
    );
  }

  return (
    <div
      className={`h-full w-full px-2 py-1.5 rounded-md text-xs truncate cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col gap-0.5 relative overflow-hidden group border`}
      style={{
        backgroundColor: `var(--${baseColor}-900, rgba(30, 58, 138, 0.4))`,
        borderColor: `var(--${baseColor}-700, rgba(29, 78, 216, 0.6))`,
        color: `var(--${baseColor}-100, #e0e7ff)`,
      }}
      title={`${title} at ${startTime}`}
      onClick={onClick}
    >
      {/* Accent left border */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 bg-current opacity-70"
        style={{ color: `var(--${baseColor}-400, #60a5fa)` }}
      />
      
      {/* We add a small class fallback for arbitrary colors, otherwise inline styles do the trick */}
      <div className={`relative z-10 font-semibold pl-1.5 line-clamp-1 ${color.replace('bg-', 'text-').replace('600', '100')}`}>
        {title}
      </div>
      <div className="relative z-10 pl-1.5 text-[10px] opacity-70 font-medium">
        {startTime} {endTime ? `- ${endTime}` : ''}
      </div>
    </div>
  );
}
