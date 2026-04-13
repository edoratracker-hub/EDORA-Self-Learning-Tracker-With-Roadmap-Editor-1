"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import {
    studentProfile,
    mentorProfile,
    professionalProfile,
    roadmaps,
    milestones,
    milestoneTasks,
    exams,
    examQuestions,
    examAttempts
} from "@/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export interface ExamQuestion {
    id?: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
}

export interface Exam {
    id?: string;
    title: string;
    questions: ExamQuestion[];
    pointsPossible: number;
}

export interface Milestone {
    id: string;
    dbId?: string;
    title: string;
    description: string;
    status: "completed" | "in-progress" | "upcoming";
    date: string;
    progress?: number;
    tasks?: { id?: string; title: string; completed: boolean }[];
    videoId?: string;
    exam?: Exam;
}

export interface RoadmapData {
    id?: string;
    academic: Milestone[];
    skills: Milestone[];
    career: Milestone[];
}

export async function fetchRoadmapAction() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) return { success: false, error: "Unauthorized" };

        const userId = session.user.id;

        // Fetch the latest roadmap for the user
        const userRoadmap = await db.query.roadmaps.findFirst({
            where: eq(roadmaps.userId, userId),
            orderBy: [desc(roadmaps.createdAt)],
            with: {
                milestones: {
                    with: {
                        tasks: true,
                        exam: {
                            with: {
                                questions: true
                            }
                        }
                    }
                }
            }
        });

        if (!userRoadmap) return { success: true, roadmap: null };

        const data: RoadmapData = {
            id: userRoadmap.id,
            academic: [],
            skills: [],
            career: []
        };

        userRoadmap.milestones.forEach((m: any) => {
            const milestone: Milestone = {
                id: m.id,
                dbId: m.id,
                title: m.title,
                description: m.description,
                status: m.status as any,
                date: m.date,
                progress: m.progress,
                videoId: m.videoId || undefined,
                tasks: m.tasks.map((t: any) => ({ id: t.id, title: t.title, completed: t.completed })),
                exam: m.exam ? {
                    id: m.exam.id,
                    title: m.exam.title,
                    pointsPossible: m.exam.pointsPossible,
                    questions: m.exam.questions.map((q: any) => ({
                        id: q.id,
                        questionText: q.questionText,
                        options: q.options as string[],
                        correctAnswer: q.correctAnswer
                    }))
                } : undefined
            };

            if (m.category === "academic") data.academic.push(milestone);
            else if (m.category === "skills") data.skills.push(milestone);
            else if (m.category === "career") data.career.push(milestone);
        });

        return { success: true, roadmap: data };

    } catch (error: any) {
        console.error("Fetch Roadmap Error:", error);
        return { success: false, error: error.message };
    }
}

export async function generateRoadmapAction(goal: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) return { success: false, error: "Unauthorized" };

        const userId = session.user.id;
        const role = session.user.role;

        let profileData: any = null;
        if (role === "student") {
            profileData = await db.query.studentProfile.findFirst({ where: eq(studentProfile.userId, userId) });
        } else if (role === "mentor") {
            profileData = await db.query.mentorProfile.findFirst({ where: eq(mentorProfile.userId, userId) });
        } else if (role === "professional") {
            profileData = await db.query.professionalProfile.findFirst({ where: eq(professionalProfile.userId, userId) });
        }

        if (!profileData) {
            return { success: false, error: "Profile not found. Please complete onboarding first." };
        }

        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        if (!GROQ_API_KEY) return { success: false, error: "Groq API Key missing." };

        const systemPrompt = `You are Edora AI, an expert career counselor. 
Generate a comprehensive, personalized roadmap for a ${role} with goal: "${goal}".
Include major milestones. For EACH milestone, you MUST generate an EXAM with exactly 10 questions.
Each question must be challenging and relevant to that milestone's topic.

Structure:
{
  "academic": Milestone[],
  "skills": Milestone[],
  "career": Milestone[]
}

Milestone interface:
interface Milestone {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  date: string;
  progress: number;
  tasks: { title: string; completed: boolean }[];
  videoId?: string; // Search for actual YouTube video IDs (e.g., "dQw4w9WgXcQ") related to the topic.
  exam: {
    title: string;
    questions: {
       questionText: string;
       options: string[]; // Exactly 4 options
       correctAnswer: string; // Must match one of the options
    }[]
  }
}

Guidelines:
1. Provide 3 milestones per category.
2. videoId: ONLY include if you are confident it's a valid, relevant YouTube ID. If unsure, leave it out.
3. Every milestone MUST have an exam object with 10 questions.
4. Output ONLY valid JSON. No conversational text.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `User Profile: ${JSON.stringify(profileData)}\n\nGoal: ${goal}` }
                ],
                temperature: 0.2,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API Error:", errorText);
            return { success: false, error: "Groq AI failed." };
        }

        const result = await response.json();
        const textResponse = result.choices?.[0]?.message?.content;
        if (!textResponse) return { success: false, error: "Empty AI response." };

        const roadmapRaw = JSON.parse(textResponse);

        // Save to Database
        const [newRoadmap] = await db.insert(roadmaps).values({
            userId,
            role: role as any,
            goal
        }).returning();

        const categories = ["academic", "skills", "career"];

        for (const cat of categories) {
            const mileList = roadmapRaw[cat] || [];
            for (let i = 0; i < mileList.length; i++) {
                const m = mileList[i];
                const [newMilestone] = await db.insert(milestones).values({
                    roadmapId: newRoadmap.id,
                    category: cat,
                    title: m.title,
                    description: m.description,
                    status: m.status,
                    date: m.date,
                    progress: m.progress,
                    videoId: m.videoId || null,
                    order: i
                }).returning();

                if (m.tasks && m.tasks.length > 0) {
                    await db.insert(milestoneTasks).values(
                        m.tasks.map((t: any) => ({
                            milestoneId: newMilestone.id,
                            title: t.title,
                            completed: t.completed
                        }))
                    );
                }

                if (m.exam) {
                    const [newExam] = await db.insert(exams).values({
                        milestoneId: newMilestone.id,
                        title: m.exam.title,
                        pointsPossible: 100
                    }).returning();

                    if (m.exam.questions && m.exam.questions.length > 0) {
                        await db.insert(examQuestions).values(
                            m.exam.questions.map((q: any) => ({
                                examId: newExam.id,
                                questionText: q.questionText,
                                options: q.options,
                                correctAnswer: q.correctAnswer
                            }))
                        );
                    }
                }
            }
        }

        // Send a summary reminder to the inbox
        const { sendSystemInboxMessage } = await import("@/app/lib/notification-service");
        await sendSystemInboxMessage(userId, `Your new roadmap for "${goal}" has been generated! Check your dashboard for the new milestones and tasks.`);

        return fetchRoadmapAction();

    } catch (error: any) {
        console.error("Roadmap Action Error:", error);
        return { success: false, error: error.message };
    }
}

export async function submitExamAction(examId: string, answers: string[], score: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) return { success: false, error: "Unauthorized" };

        await db.insert(examAttempts).values({
            userId: session.user.id,
            examId,
            score,
            answers
        });

        return { success: true };
    } catch (error: any) {
        console.error("Submit Exam Error:", error);
        return { success: false, error: error.message };
    }
}

export async function toggleTaskCompletionAction(milestoneId: string, taskTitle: string, completed: boolean) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) return { success: false, error: "Unauthorized" };

        // Update the task
        await db.update(milestoneTasks)
            .set({ completed })
            .where(
                and(
                    eq(milestoneTasks.milestoneId, milestoneId),
                    eq(milestoneTasks.title, taskTitle)
                )
            );

        // Recalculate progress for the milestone
        const allTasks = await db.query.milestoneTasks.findMany({
            where: eq(milestoneTasks.milestoneId, milestoneId)
        });

        if (allTasks.length > 0) {
            const completedTasks = allTasks.filter(t => t.completed).length;
            const progress = Math.round((completedTasks / allTasks.length) * 100);

            let status: "completed" | "in-progress" | "upcoming" = "in-progress";
            if (progress === 100) status = "completed";
            else if (progress === 0) status = "upcoming";

            await db.update(milestones)
                .set({ progress, status })
                .where(eq(milestones.id, milestoneId));
        }

        return { success: true };
    } catch (error: any) {
        console.error("Toggle Task Error:", error);
        return { success: false, error: error.message };
    }
}

