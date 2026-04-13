"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle2, TrendingUp, PenLine, Layout, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { updateScore } from '@/app/actions/todo-actions'
import { toast } from 'sonner'

export interface DailyTask {
  id: string;
  text: string;
  points: number;
  icon: React.ElementType;
}

const DEFAULT_TASKS: DailyTask[] = [
  { id: 'roadmap', text: 'Start study with roadmap', points: 50, icon: Layout },
  { id: 'editor', text: 'Start writing note with editor', points: 30, icon: PenLine },
  { id: 'explorer', text: 'Post one post into explorer', points: 40, icon: Sparkles },
]

export const DailyToDoList = () => {
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [lastDate, setLastDate] = useState<string>("")

  // Load status and check for daily refresh
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem('professional-daily-todo-status')
    
    if (saved) {
      try {
        const { date, completed } = JSON.parse(saved)
        if (date === today) {
          setCompletedIds(completed)
        } else {
          // New day, reset!
          localStorage.removeItem('professional-daily-todo-status')
        }
      } catch (e) {
        console.error("Local storage malformed", e)
      }
    }
    setLastDate(today)
    setIsLoaded(true)
  }, [])

  // Sync with local storage
  useEffect(() => {
    if (isLoaded && lastDate) {
      localStorage.setItem('professional-daily-todo-status', JSON.stringify({
        date: lastDate,
        completed: completedIds
      }))
    }
  }, [completedIds, isLoaded, lastDate])

  const toggleTask = async (task: DailyTask) => {
    if (completedIds.includes(task.id)) return;

    // Optimistic UI
    setCompletedIds(prev => [...prev, task.id])
    
    try {
      const res = await updateScore(task.points, task.text);
      if (res.success) {
        toast.success(`Challenge complete! Keep it up!`, {
          icon: <CheckCircle2 className="size-4 text-emerald-500" />
        })
      } else {
        // Rollback on error
        setCompletedIds(prev => prev.filter(id => id !== task.id))
        toast.error(res.error || "Connection error. Try again later.")
      }
    } catch (e) {
      setCompletedIds(prev => prev.filter(id => id !== task.id))
      toast.error("An error occurred.")
    }
  }

  const completedCount = completedIds.length
  const totalCount = DEFAULT_TASKS.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  if (!isLoaded) {
    return (
      <Card className="flex flex-col h-[400px] border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3 shrink-0 opacity-50"><CardTitle>Daily Challenges</CardTitle></CardHeader>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full min-h-[400px] overflow-hidden border-0 bg-white dark:bg-zinc-950 shadow-sm border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-3 shrink-0 bg-blue-50/30 dark:bg-blue-900/10 border-b border-blue-100/50 dark:border-blue-900/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="size-5 text-blue-500" />
              Daily Checklist
            </CardTitle>
            <CardDescription className="mt-1 font-medium text-blue-600/80 dark:text-blue-400">
              Your daily routine status
            </CardDescription>
          </div>
          <div className={cn(
            "text-xs font-bold px-3 py-1 rounded-full border tabular-nums transition-all duration-300",
            progressPercent === 100
              ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "border-blue-500/20 bg-blue-500/5 text-blue-600"
          )}>
            {progressPercent}%
          </div>
        </div>
        <Progress value={progressPercent} className="h-2 mt-4 bg-blue-100 dark:bg-zinc-800" />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-6 bg-gradient-to-b from-transparent to-zinc-50/50 dark:to-zinc-900/50">
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {DEFAULT_TASKS.map((task) => {
            const Icon = task.icon;
            const isCompleted = completedIds.includes(task.id);
            return (
              <div
                key={task.id}
                onClick={() => !isCompleted && toggleTask(task)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer group relative overflow-hidden",
                  isCompleted 
                    ? "bg-emerald-50/30 dark:bg-emerald-900/5 border-emerald-100 dark:border-emerald-900/20" 
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5"
                )}
              >
                {isCompleted && (
                   <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white rounded-bl-lg">
                      <CheckCircle2 className="size-3" />
                   </div>
                )}
                
                <div className={cn(
                  "p-3 rounded-xl transition-colors shrink-0",
                  isCompleted 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-blue-500/10 group-hover:text-blue-500"
                )}>
                  <Icon className="size-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      "text-sm font-semibold transition-all duration-300 block mb-0.5",
                      isCompleted ? "text-emerald-700 dark:text-emerald-400 line-through opacity-70" : "text-zinc-700 dark:text-zinc-200"
                    )}
                  >
                    {task.text}
                  </span>
                </div>

                <Checkbox
                  checked={isCompleted}
                  className={cn(
                    "size-5 rounded-full border-2 shrink-0 transition-all",
                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-300 dark:border-zinc-700"
                  )}
                  onCheckedChange={() => !isCompleted && toggleTask(task)}
                  disabled={isCompleted}
                />
              </div>
            )
          })}
        </div>
        
        <div className="pt-2 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">
          Challenge status resets daily
        </div>
      </CardContent>
    </Card>
  )
}
