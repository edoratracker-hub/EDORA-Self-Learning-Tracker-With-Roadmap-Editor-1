"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import {
  getUserActivityHeatmap,
  type ActivityDay,
} from "@/app/actions/activity-actions";
import { Skeleton } from "@/components/ui/skeleton";

interface ContributionDay {
  date: Date;
  count: number;
  level: number; // 0-4, similar to GitHub
}

interface ContributionWeek {
  days: (ContributionDay | null)[];
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Generate contribution level based on count
const getContributionLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

// Color mapping for different levels
const getLevelColor = (level: number): string => {
  switch (level) {
    case 0:
      return "bg-muted hover:bg-muted/80";
    case 1:
      return "bg-green-200 dark:bg-green-900/30 hover:bg-green-300 dark:hover:bg-green-900/40";
    case 2:
      return "bg-green-400 dark:bg-green-800/50 hover:bg-green-500 dark:hover:bg-green-800/60";
    case 3:
      return "bg-green-600 dark:bg-green-700/70 hover:bg-green-700 dark:hover:bg-green-700/80";
    case 4:
      return "bg-green-800 dark:bg-green-600 hover:bg-green-900 dark:hover:bg-green-700";
    default:
      return "bg-muted";
  }
};

// Build contribution grid from real activity data (keyed by "YYYY-MM-DD")
const buildContributionGrid = (
  activityMap: Map<string, number>,
): ContributionWeek[] => {
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Start from the Sunday of the week containing one year ago
  const startDate = new Date(oneYearAgo);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let currentDate = new Date(startDate);
  let currentWeek: (ContributionDay | null)[] = [];

  while (currentDate <= today) {
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push({ days: [...currentWeek] });
      currentWeek = [];
    }

    if (currentDate < oneYearAgo) {
      currentWeek.push(null);
    } else if (currentDate > today) {
      currentWeek.push(null);
    } else {
      const dateKey = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const count = activityMap.get(dateKey) ?? 0;

      currentWeek.push({
        date: new Date(currentDate),
        count,
        level: getContributionLevel(count),
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);

    if (
      currentDate > today &&
      currentWeek.length > 0 &&
      currentWeek.length < 7
    ) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push({ days: currentWeek });
  }

  return weeks;
};

// Format date for tooltip
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Calculate month labels positions
const getMonthLabels = (
  weeks: ContributionWeek[],
): { month: string; weekIndex: number }[] => {
  const labels: { month: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.days.find((day) => day !== null);
    if (firstDay) {
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({ month: MONTHS[month], weekIndex });
        lastMonth = month;
      }
    }
  });

  return labels;
};

export function ActivityHeatmap() {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const result = await getUserActivityHeatmap();
        if (result.success) {
          setActivityData(result.data);
        }
      } catch {
        // silently fail — heatmap will show all zeros
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  // Build a lookup map from date string → count
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const day of activityData) {
      map.set(day.date, day.count);
    }
    return map;
  }, [activityData]);

  const contributionData = useMemo(
    () => buildContributionGrid(activityMap),
    [activityMap],
  );
  const monthLabels = useMemo(
    () => getMonthLabels(contributionData),
    [contributionData],
  );

  // Calculate total contributions
  const totalContributions = contributionData.reduce((total, week) => {
    return (
      total +
      week.days.reduce((weekTotal, day) => {
        return weekTotal + (day?.count || 0);
      }, 0)
    );
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
        <CardDescription>
          {totalContributions} activities in the last year
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {/* Month labels skeleton */}
            <div className="flex justify-between pl-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-3 flex-1 mx-1" />
              ))}
            </div>

            {/* Grid rows skeleton */}
            <div className="flex gap-[2px]">
              {/* Day labels skeleton */}
              <div className="flex flex-col gap-[2px] shrink-0">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[10px] w-6"
                    style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
                  />
                ))}
              </div>

              {/* Squares skeleton */}
              <div className="flex-1 grid grid-rows-7 grid-flow-col gap-[2px]">
                {Array.from({ length: 7 * 53 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-sm" />
                ))}
              </div>
            </div>

            {/* Legend skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-6" />
              <div className="flex gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-[10px] h-[10px] rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="w-full ">
              {/* Month Labels */}
              <div className="flex justify-between mb-2 pl-8">
                {monthLabels.map((label, index) => (
                  <div
                    key={index}
                    className="text-xs text-muted-foreground"
                    style={{
                      marginLeft:
                        index === 0
                          ? 0
                          : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0)) * 14}px`,
                    }}
                  >
                    {label.month}
                  </div>
                ))}
              </div>

              {/* Heatmap Grid */}
              <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 shrink-0">
                  {DAYS_OF_WEEK.map((day, index) => (
                    <div
                      key={day}
                      className="text-xs text-muted-foreground h-3 flex items-center"
                      style={{
                        visibility: index % 2 === 1 ? "visible" : "hidden",
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Contribution squares */}
                <div className="flex gap-1 flex-1 justify-between">
                  <TooltipProvider delayDuration={0}>
                    {contributionData.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.days.map((day, dayIndex) => (
                          <Tooltip key={`${weekIndex}-${dayIndex}`}>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-3 h-3 rounded-sm border border-background transition-colors cursor-pointer ${day
                                  ? getLevelColor(day.level)
                                  : "bg-transparent"
                                  }`}
                                onMouseEnter={() => day && setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                              />
                            </TooltipTrigger>
                            {day && (
                              <TooltipContent>
                                <div className="text-xs">
                                  <div className="font-semibold">
                                    {day.count}{" "}
                                    {day.count === 1 ? "activity" : "activities"}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {formatDate(day.date)}
                                  </div>
                                </div>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        ))}
                      </div>
                    ))}
                  </TooltipProvider>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-sm border border-background ${getLevelColor(level)}`}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
