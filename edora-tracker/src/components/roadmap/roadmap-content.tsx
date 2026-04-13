"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  Loader2,
  Play,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  generateRoadmapAction,
  fetchRoadmapAction,
  type Milestone,
  type RoadmapData,
} from "@/app/actions/roadmap-actions";
import { toast } from "sonner";
import { ExamDialog } from "./exam-dialog";

const StatusIcon = ({ status }: { status: Milestone["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-600" />;
    case "upcoming":
      return <Circle className="h-5 w-5 text-muted-foreground" />;
  }
};

const StatusBadge = ({ status }: { status: Milestone["status"] }) => {
  const variants = {
    completed: {
      variant: "default" as const,
      label: "Completed",
      className: "bg-green-600",
    },
    "in-progress": {
      variant: "default" as const,
      label: "In Progress",
      className: "bg-blue-600",
    },
    upcoming: { variant: "outline" as const, label: "Upcoming", className: "" },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const MilestoneCard = ({
  milestone,
  isLast,
  index,
}: {
  milestone: Milestone;
  isLast: boolean;
  index: number;
}) => {
  const isEven = index % 2 === 0;
  const [isExamOpen, setIsExamOpen] = useState(false);

  return (
    <div className="relative flex justify-center w-full">
      {/* Center Timeline Line */}
      {!isLast && (
        <div className="absolute left-1/2 top-12 -translate-x-1/2 h-full w-0.5 bg-border hidden sm:block" />
      )}

      {/* Timeline Dot */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10 hidden sm:block">
        <div className="bg-background p-1 rounded-full border-2 border-border shadow-sm">
          <StatusIcon status={milestone.status} />
        </div>
      </div>

      {/* Card Container */}
      <div
        className={`w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 pb-12`}
      >
        {/* Card Side */}
        <div
          className={cn(
            "flex flex-col",
            isEven ? "sm:col-start-1" : "sm:col-start-2",
          )}
        >
          <Card className="w-full border-2 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="space-y-1 pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-bold">
                  {milestone.title}
                </CardTitle>
                <StatusBadge status={milestone.status} />
              </div>
              <CardDescription className="text-sm">
                {milestone.description}
              </CardDescription>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Target className="h-3 w-3" />
                {milestone.date}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* YouTube Video Embed - Conditional */}
              {milestone.videoId && (
                <div className="group relative aspect-video w-full rounded-xl overflow-hidden shadow-inner bg-slate-100 ring-1 ring-slate-900/5">
                  <iframe
                    src={`https://www.youtube.com/embed/${milestone.videoId}`}
                    title={milestone.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-2 left-2 pointer-events-none">
                    <Badge
                      variant="secondary"
                      className="bg-white/80 backdrop-blur-sm text-[10px] items-center gap-1 font-bold"
                    >
                      <Play className="h-2 w-2 fill-current" /> VIDEO TUTORIAL
                    </Badge>
                  </div>
                </div>
              )}

              {/* Checklist (Tasks) Section */}
              {milestone.tasks && milestone.tasks.length > 0 && (
                <div className="space-y-2.5 p-3 rounded-lg bg-blue-50/30 border border-blue-100/50">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-bold text-blue-900">
                      MILESTONE CHECKLIST:
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {milestone.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs">
                        {task.completed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            task.completed &&
                            "text-muted-foreground line-through",
                          )}
                        >
                          {task.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress bar */}
              {milestone.progress !== undefined && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    <span>Completion</span>
                    <span className="text-blue-600">{milestone.progress}%</span>
                  </div>
                  <Progress value={milestone.progress} className="h-1.5" />
                </div>
              )}

              {/* Exam Section */}
              {milestone.exam && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full h-10 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-bold gap-2 text-xs"
                    onClick={() => setIsExamOpen(true)}
                  >
                    <Award className="h-4 w-4" />
                    CONDUCT EXAM (10 QUESTIONS)
                  </Button>
                  <ExamDialog
                    exam={milestone.exam}
                    open={isExamOpen}
                    onOpenChange={setIsExamOpen}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Empty Side for Desktop Timeline Alignment */}
        <div className="hidden sm:block" />
      </div>
    </div>
  );
};

export function RoadmapContent({ roleTitle }: { roleTitle: string }) {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [goal, setGoal] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const result = await fetchRoadmapAction();
      if (result.success && result.roadmap) {
        setData(result.roadmap);
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const handleGenerate = async () => {
    if (!goal.trim()) {
      toast.error("Please enter your goal first");
      return;
    }

    setIsGenerating(true);
    setIsDialogOpen(false);

    try {
      const result = await generateRoadmapAction(goal);
      if (result.success && result.roadmap) {
        setData(result.roadmap);
        toast.success("AI Roadmap Generated!", {
          description: "A new personalized path and exams have been created.",
          icon: <Sparkles className="h-4 w-4 text-yellow-500 font-bold" />,
        });
      } else {
        toast.error(result.error || "Failed to generate roadmap");
      }
    } catch (error) {
      console.error("Generate Error:", error);
      toast.error("An error occurred while generating your roadmap");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Section Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text">
                {roleTitle}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Track progress, plan milestones, and test your knowledge with AI
              exams.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 fill-current" />
                  )}
                  {isGenerating ? "CRAFTING YOUR PATH..." : "CREATE ROADMAP"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-blue-600">
                    <Sparkles className="h-5 w-5" />
                    Your Personalized Future
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Describe what you want to achieve. Edora AI will analyze your
                    profile, create 9 milestones across Academic, Skills, and
                    Career categories, and generate 90 unique exam questions for
                    you.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-700">
                      Defining your goal:
                    </p>
                    <Input
                      id="goal"
                      placeholder="e.g., Senior Full Stack Dev or Expert Mentor"
                      className="h-12 border-2 focus-visible:ring-blue-500 rounded-lg"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Be specific for better results (e.g., "Become AWS Certified
                      Solutions Architect in 6 months").
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-lg h-11"
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg h-11 px-8 font-bold"
                    disabled={!goal.trim() || isGenerating}
                  >
                    START AI GENERATION
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator className="bg-border rounded-full" />

        {/* Roadmap Tabs Skeleton */}
        <div className="space-y-8">
          <div className="w-full max-w-[300px]">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          <div className="max-w-4xl mx-auto px-4 min-h-[400px]">
            {/* Timeline Skeleton Cards */}
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative flex justify-center w-full pb-12">
                {/* Center Timeline Line */}
                {i !== 2 && (
                  <div className="absolute left-1/2 top-12 -translate-x-1/2 h-full w-0.5 bg-border hidden sm:block" />
                )}

                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10 hidden sm:block">
                  <div className="bg-background p-1 rounded-full border-2 border-border shadow-sm">
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>

                {/* Card Container */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                  <div className={cn("flex flex-col", i % 2 === 0 ? "sm:col-start-1" : "sm:col-start-2")}>
                    <Card className="w-full shadow-sm">
                      <CardHeader className="space-y-2 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-3 w-24 mt-2" />
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        <Skeleton className="w-full aspect-video rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text">
              {roleTitle}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Track progress, plan milestones, and test your knowledge with AI
            exams.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 fill-current" />
                )}
                {isGenerating ? "CRAFTING YOUR PATH..." : "CREATE ROADMAP"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                  Your Personalized Future
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Describe what you want to achieve. Edora AI will analyze your
                  profile, create 9 milestones across Academic, Skills, and
                  Career categories, and generate 90 unique exam questions for
                  you.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-700">
                    Defining your goal:
                  </p>
                  <Input
                    id="goal"
                    placeholder="e.g., Senior Full Stack Dev or Expert Mentor"
                    className="h-12 border-2 focus-visible:ring-blue-500 rounded-lg"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    Be specific for better results (e.g., "Become AWS Certified
                    Solutions Architect in 6 months").
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-lg h-11"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={handleGenerate}
                  className="bg-blue-600 hover:bg-blue-700 rounded-lg h-11 px-8 font-bold"
                  disabled={!goal.trim() || isGenerating}
                >
                  START AI GENERATION
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator className="bg-blue-500 rounded-full" />

      {/* Roadmap Tabs */}
      <Tabs defaultValue="academic" className="space-y-8">
        <TabsList>
          <TabsTrigger value="academic">ACADEMIC</TabsTrigger>
          <TabsTrigger value="skills">SKILLS</TabsTrigger>
          <TabsTrigger value="career">CAREER</TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="space-y-4 min-h-[400px]">
          {data?.academic.length ? (
            <div className="max-w-4xl mx-auto px-4">
              {data.academic.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  isLast={index === data.academic.length - 1}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed ">
              <div className="p-4 rounded-full mb-4">
                <Target className="h-10 w-10" />
              </div>
              <p className="text-slate-500 font-medium">
                No academic path initialized.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Use the AI generator to build your personalized roadmap.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4 min-h-[400px]">
          {data?.skills.length ? (
            <div className="max-w-4xl mx-auto px-4">
              {data.skills.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  isLast={index === data.skills.length - 1}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed ">
              <div className="p-4 rounded-full mb-4">
                <TrendingUp className="h-10 w-10" />
              </div>
              <p className="text-slate-500 font-medium">
                No skills path initialized.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                AI can suggest specific tools and technologies based on your
                goal.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="career" className="space-y-4 min-h-[400px]">
          {data?.career.length ? (
            <div className="max-w-4xl mx-auto px-4">
              {data.career.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  isLast={index === data.career.length - 1}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed ">
              <div className="p-4 rounded-full mb-4">
                <Award className="h-10 w-10" />
              </div>
              <p className="text-slate-500 font-medium">
                No career path initialized.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Plan your internship, job hunt, or promotion strategies here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
