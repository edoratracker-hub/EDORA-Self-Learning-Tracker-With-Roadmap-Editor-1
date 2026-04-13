"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateRoadmapAction, fetchRoadmapAction, toggleTaskCompletionAction, type Milestone, type RoadmapData } from "@/app/actions/roadmap-actions";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const initialRoadmapData: RoadmapData = {
  academic: [
    {
      id: "1",
      title: "Foundation Year",
      description: "Core subjects and basic competencies",
      status: "completed",
      date: "Sep 2023 - Jun 2024",
      progress: 100,
      videoId: "dQw4w9WgXcQ", // Add YouTube video ID
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
      videoId: "dQw4w9WgXcQ", // Add YouTube video ID
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
      videoId: "dQw4w9WgXcQ", // Add YouTube video ID
      tasks: [
        { title: "Calculus & Statistics", completed: false },
        { title: "Advanced Sciences", completed: false },
        { title: "Research Project", completed: false },
      ],
    },
  ],
  skills: [
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
  career: [
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
};

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
  onToggleTask,
}: {
  milestone: Milestone;
  isLast: boolean;
  index: number;
  onToggleTask: (taskTitle: string, completed: boolean) => void;
}) => {
  const isEven = index % 2 === 0;

  return (
    <div className="relative flex justify-center">
      {/* Center Timeline Line */}
      {!isLast && (
        <div className="absolute left-1/2 top-12 -translate-x-1/2 h-full w-0.5 bg-border" />
      )}

      {/* Timeline Dot */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10">
        <div className="bg-background p-1 rounded-full border-2 border-border">
          <StatusIcon status={milestone.status} />
        </div>
      </div>

      {/* Card Container */}
      <div className={`w-full grid grid-cols-2 gap-8`}>
        {/* Left Side */}
        <div className={`${isEven ? "" : "invisible"}`}>
          {isEven && (
            <Card className="w-full">
              <CardHeader className="space-y-1 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{milestone.title}</CardTitle>
                  <StatusBadge status={milestone.status} />
                </div>
                <CardDescription className="text-xs">
                  {milestone.description}
                </CardDescription>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Target className="h-3 w-3" />
                  {milestone.date}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {/* YouTube Video Embed */}
                {milestone.videoId && (
                  <div className="aspect-video w-full rounded-md overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${milestone.videoId}`}
                      title={milestone.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}

                {/* Progress Section */}
                {milestone.progress !== undefined && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-1.5" />
                  </div>
                )}

                {/* Tasks Section */}
                {milestone.tasks && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium">Tasks:</p>
                    <ul className="space-y-1">
                      {milestone.tasks.map((task, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-1.5 text-xs"
                        >
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(checked) => onToggleTask(task.title, !!checked)}
                            className="h-3.5 w-3.5"
                          />
                          <span
                            className={cn(
                              "cursor-pointer",
                              task.completed &&
                              "text-muted-foreground line-through",
                            )}
                            onClick={() => onToggleTask(task.title, !task.completed)}
                          >
                            {task.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side */}
        <div className={`${!isEven ? "" : "invisible"}`}>
          {!isEven && (
            <Card className="w-full">
              <CardHeader className="space-y-1 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{milestone.title}</CardTitle>
                  <StatusBadge status={milestone.status} />
                </div>
                <CardDescription className="text-xs">
                  {milestone.description}
                </CardDescription>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Target className="h-3 w-3" />
                  {milestone.date}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {/* YouTube Video Embed */}
                {milestone.videoId && (
                  <div className="aspect-video w-full rounded-md overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${milestone.videoId}`}
                      title={milestone.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}

                {/* Progress Section */}
                {milestone.progress !== undefined && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-1.5" />
                  </div>
                )}

                {/* Tasks Section */}
                {milestone.tasks && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium">Tasks:</p>
                    <ul className="space-y-1">
                      {milestone.tasks.map((task, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-1.5 text-xs"
                        >
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(checked) => onToggleTask(task.title, !!checked)}
                            className="h-3.5 w-3.5"
                          />
                          <span
                            className={cn(
                              "cursor-pointer",
                              task.completed &&
                              "text-muted-foreground line-through",
                            )}
                            onClick={() => onToggleTask(task.title, !task.completed)}
                          >
                            {task.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export function RoadmapContent() {
  const [data, setData] = React.useState<RoadmapData | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [goal, setGoal] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const loadRoadmap = async () => {
      const result = await fetchRoadmapAction();
      if (result.success && result.roadmap) {
        setData(result.roadmap);
      }
    };
    loadRoadmap();
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
        toast.success("AI Roadmap generated based on your profile and goal!", {
          description: "Your personalized learning path is ready.",
          icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
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

  const handleToggleTask = async (milestoneId: string, taskTitle: string, completed: boolean) => {
    if (!data) return;

    // Optimistic update
    setData(prev => {
      if (!prev) return prev;
      const newData = { ...prev };
      (['academic', 'skills', 'career'] as const).forEach(cat => {
        const currentMilestones = data[cat];
        if (Array.isArray(currentMilestones)) {
          (newData as any)[cat] = currentMilestones.map(m => {
            if (m.id === milestoneId) {
              const newTasks = m.tasks?.map(t => t.title === taskTitle ? { ...t, completed } : t) || [];
              const completedCount = newTasks.filter(t => t.completed).length;
              const progress = newTasks.length > 0 ? Math.round((completedCount / newTasks.length) * 100) : 0;

              let status: Milestone["status"] = "in-progress";
              if (progress === 100) status = "completed";
              else if (progress === 0) status = "upcoming";

              return { ...m, tasks: newTasks, progress, status };
            }
            return m;
          });
        }
      });
      return newData;
    });

    try {
      const result = await toggleTaskCompletionAction(milestoneId, taskTitle, completed);
      if (!result.success) {
        toast.error("Failed to update task on server");
      }
    } catch (error) {
      console.error("Toggle Task Error:", error);
      toast.error("An error occurred while updating task");
    }
  };

  const calculateOverallProgress = () => {
    if (!data) return 0;
    const allMilestones = [...data.academic, ...data.skills, ...data.career];
    if (allMilestones.length === 0) return 0;
    const totalProgress = allMilestones.reduce((acc, m) => acc + (m.progress || 0), 0);
    return Math.round(totalProgress / allMilestones.length);
  };


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentor Roadmap</h1>
          <p className="text-muted-foreground mt-1">
            Track progress and plan your educational journey
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium">{calculateOverallProgress()}% Overall Progress</span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-none gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 fill-current" />
                )}
                {isGenerating ? "Generating..." : "Generate AI Roadmap"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Personalized AI Roadmap
                </DialogTitle>
                <DialogDescription>
                  Enter your goal (e.g., "Become an expert React Mentor" or "Help 50 students").
                  Edora AI will analyze your profile and create a tailored path for you.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">What is your current goal?</p>
                  <Input
                    id="goal"
                    placeholder="e.g., I want to help students master Web Development"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleGenerate}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!goal.trim() || isGenerating}
                >
                  Generate Roadmap
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator className="bg-blue-500 rounded-full" />

      {/* Roadmap Tabs */}
      <Tabs defaultValue="academic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="academic">Academic Path</TabsTrigger>
          <TabsTrigger value="skills">Skills Development</TabsTrigger>
          <TabsTrigger value="career">Career Readiness</TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="space-y-4">
          {data && data.academic.length > 0 ? (
            data.academic.map((milestone, index) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                isLast={index === data.academic.length - 1}
                index={index}
                onToggleTask={(taskTitle, completed) => handleToggleTask(milestone.id, taskTitle, completed)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
              <Target className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground">No academic roadmap yet. Generate one with AI!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          {data && data.skills.length > 0 ? (
            data.skills.map((milestone, index) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                isLast={index === data.skills.length - 1}
                index={index}
                onToggleTask={(taskTitle, completed) => handleToggleTask(milestone.id, taskTitle, completed)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground">No skills roadmap yet. Generate one with AI!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="career" className="space-y-4">
          {data && data.career.length > 0 ? (
            data.career.map((milestone, index) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                isLast={index === data.career.length - 1}
                index={index}
                onToggleTask={(taskTitle, completed) => handleToggleTask(milestone.id, taskTitle, completed)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
              <Award className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground">No career roadmap yet. Generate one with AI!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

