"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  Clock,
  CalendarDays,
  GraduationCap,
  Zap,
  Briefcase,
  ChevronDown,
  Play,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  date: string;
  progress?: number;
  tasks?: { title: string; completed: boolean }[];
  videoId?: string;
}

interface Track {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string; // tailwind color token like "green" | "blue" | "purple"
  milestones: Milestone[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const tracks: Track[] = [
  {
    key: "academic",
    label: "Academic Path",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "green",
    milestones: [
      {
        id: "1",
        title: "Foundation Year",
        description: "Core subjects and basic competencies",
        status: "completed",
        date: "Sep 2023 - Jun 2024",
        progress: 100,
        videoId: "dQw4w9WgXcQ",
        tasks: [
          { title: "Mathematics Fundamentals", completed: true },
          { title: "Science Basics", completed: true },
          { title: "Language Arts", completed: true },
        ],
      },
      {
        id: "2",
        title: "Intermediate Level",
        description: "Advanced topics and specialization introduction",
        status: "in-progress",
        date: "Sep 2024 - Jun 2025",
        progress: 65,
        videoId: "dQw4w9WgXcQ",
        tasks: [
          { title: "Advanced Mathematics", completed: true },
          { title: "Physics & Chemistry", completed: true },
          { title: "Literature Studies", completed: false },
          { title: "Computer Science Intro", completed: false },
        ],
      },
      {
        id: "3",
        title: "Advanced Studies",
        description: "Specialization and exam preparation",
        status: "upcoming",
        date: "Sep 2025 - Jun 2026",
        progress: 0,
        videoId: "dQw4w9WgXcQ",
        tasks: [
          { title: "Calculus & Statistics", completed: false },
          { title: "Advanced Sciences", completed: false },
          { title: "Research Project", completed: false },
        ],
      },
    ],
  },
  {
    key: "skills",
    label: "Skills Development",
    icon: <Zap className="h-4 w-4" />,
    color: "blue",
    milestones: [
      {
        id: "s1",
        title: "Communication Skills",
        description: "Presentation and writing proficiency",
        status: "completed",
        date: "Q1 2024",
        progress: 100,
      },
      {
        id: "s2",
        title: "Digital Literacy",
        description: "Technology and software competency",
        status: "in-progress",
        date: "Q2-Q3 2024",
        progress: 75,
      },
      {
        id: "s3",
        title: "Leadership Development",
        description: "Team management and project leadership",
        status: "upcoming",
        date: "Q4 2024",
        progress: 0,
      },
    ],
  },
  {
    key: "career",
    label: "Career Readiness",
    icon: <Briefcase className="h-4 w-4" />,
    color: "purple",
    milestones: [
      {
        id: "c1",
        title: "Career Exploration",
        description: "Discover interests and potential paths",
        status: "completed",
        date: "Jan - Mar 2024",
        progress: 100,
      },
      {
        id: "c2",
        title: "Skill Building",
        description: "Develop relevant competencies",
        status: "in-progress",
        date: "Apr - Aug 2024",
        progress: 60,
      },
      {
        id: "c3",
        title: "Internship Program",
        description: "Real-world experience and networking",
        status: "upcoming",
        date: "Sep 2024 - Dec 2024",
        progress: 0,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    dot: "bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,.45)]",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    line: "bg-emerald-500/60",
    ring: "ring-emerald-500/30",
  },
  "in-progress": {
    icon: Clock,
    label: "In Progress",
    dot: "bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,.45)] animate-pulse",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    line: "bg-blue-500/40",
    ring: "ring-blue-500/30",
  },
  upcoming: {
    icon: Circle,
    label: "Upcoming",
    dot: "bg-[#30363d]",
    badge: "bg-[#30363d]/50 text-[#8b949e] border-[#30363d]",
    line: "bg-[#30363d]",
    ring: "ring-[#30363d]/30",
  },
};

function computeOverallProgress(milestones: Milestone[]): number {
  const total = milestones.length;
  if (total === 0) return 0;
  const sum = milestones.reduce((acc, m) => acc + (m.progress ?? 0), 0);
  return Math.round(sum / total);
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TrackSelector({
  tracks,
  active,
  onChange,
}: {
  tracks: Track[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {tracks.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-[#161b22] text-foreground shadow-[0_0_0_1px_rgba(48,54,61,1)]"
                : "text-muted-foreground hover:text-foreground hover:bg-[#161b22]/50",
            )}
          >
            <span
              className={cn("transition-colors", isActive && "text-[#58a6ff]")}
            >
              {t.icon}
            </span>
            {t.label}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[#58a6ff]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function OverallProgressRing({
  value,
  size = 52,
}: {
  value: number;
  size?: number;
}) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#30363d"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#238636"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-foreground">
        {value}%
      </span>
    </div>
  );
}

function MilestoneNode({
  milestone,
  isLast,
  index,
}: {
  milestone: Milestone;
  isLast: boolean;
  index: number;
}) {
  const [expanded, setExpanded] = useState(milestone.status === "in-progress");
  const config = statusConfig[milestone.status];
  const Icon = config.icon;
  const completedTasks =
    milestone.tasks?.filter((t) => t.completed).length ?? 0;
  const totalTasks = milestone.tasks?.length ?? 0;

  return (
    <div className="relative flex gap-6 group">
      {/* Timeline spine */}
      <div className="relative flex flex-col items-center">
        {/* Dot */}
        <div
          className={cn(
            "z-10 h-3.5 w-3.5 rounded-full border-2 border-background transition-all duration-300",
            config.dot,
          )}
        />
        {/* Line */}
        {!isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 mt-1 rounded-full transition-colors",
              config.line,
            )}
          />
        )}
      </div>

      {/* Content card */}
      <div
        className={cn(
          "flex-1 mb-8 rounded-xl border border-[#30363d] bg-[#161b22] transition-all duration-300",
          "hover:border-[#484f58] hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,.5)]",
          milestone.status === "in-progress" &&
            "border-blue-500/30 shadow-[0_0_20px_-6px_rgba(59,130,246,.15)]",
        )}
      >
        {/* Header row */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-start justify-between gap-4 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          <div className="flex-1 min-w-0">
            {/* Step counter + title */}
            <div className="flex items-center gap-3 mb-1">
              <span className="flex items-center justify-center h-6 w-6 rounded-md bg-[#21262d] text-[10px] font-bold text-muted-foreground shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold text-foreground truncate">
                {milestone.title}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-[10px] font-medium border px-2 py-0 h-5 rounded-md",
                  config.badge,
                )}
              >
                {config.label}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground ml-9 line-clamp-1">
              {milestone.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-0.5">
            {/* Date pill */}
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground bg-[#21262d] rounded-md px-2 py-1">
              <CalendarDays className="h-3 w-3" />
              {milestone.date}
            </span>

            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                expanded && "rotate-180",
              )}
            />
          </div>
        </button>

        {/* Expanded detail */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            expanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 space-y-4">
              {/* Divider */}
              <div className="h-px bg-[#30363d]" />

              {/* Progress bar */}
              {milestone.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Progress
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        milestone.progress === 100
                          ? "text-emerald-400"
                          : milestone.progress > 0
                            ? "text-blue-400"
                            : "text-muted-foreground",
                      )}
                    >
                      {milestone.progress}%
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full rounded-full bg-[#21262d] overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                        milestone.progress === 100
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                          : "bg-gradient-to-r from-blue-600 to-blue-400",
                      )}
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Tasks checklist */}
                {milestone.tasks && milestone.tasks.length > 0 && (
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">
                        Tasks
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {completedTasks}/{totalTasks}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {milestone.tasks.map((task, idx) => (
                        <li
                          key={idx}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors",
                            task.completed
                              ? "bg-emerald-500/5"
                              : "bg-[#21262d]/60",
                          )}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-[#484f58] shrink-0" />
                          )}
                          <span
                            className={cn(
                              "transition-colors",
                              task.completed
                                ? "text-muted-foreground line-through"
                                : "text-foreground",
                            )}
                          >
                            {task.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Video embed */}
                {milestone.videoId && (
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-foreground mb-2 block">
                      Resource
                    </span>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#30363d] bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${milestone.videoId}`}
                        title={milestone.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function RoadmapContent() {
  const [activeTrack, setActiveTrack] = useState("academic");
  const track = tracks.find((t) => t.key === activeTrack)!;
  const overallProgress = computeOverallProgress(track.milestones);

  return (
    <div className=" space-y-8 ">
      {/* ---- Header ---- */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Professional Roadmap
            </h1>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-sm text-muted-foreground">
            Track your progress and plan your growth journey
          </p>
        </div>

        <OverallProgressRing value={overallProgress} />
      </div>

      <Separator className="bg-blue-500" />

      {/* ---- Track selector ---- */}
      <TrackSelector
        tracks={tracks}
        active={activeTrack}
        onChange={setActiveTrack}
      />

      {/* ---- Timeline ---- */}
      <div className="relative pl-1">
        {track.milestones.map((milestone, index) => (
          <MilestoneNode
            key={milestone.id}
            milestone={milestone}
            isLast={index === track.milestones.length - 1}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
