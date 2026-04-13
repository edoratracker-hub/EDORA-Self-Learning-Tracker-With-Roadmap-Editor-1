

"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { workspaces, workspaceFolders, workspaceFiles } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkspace() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const userWorkspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.userId, session.user.id),
            with: {
                folders: {
                    with: {
                        files: true
                    }
                },
                files: true // Files directly in workspace if ever needed, though schema links files to folders and workspace
            }
        });

        if (userWorkspace) {
            return { success: true, workspace: userWorkspace };
        }

        // Create default workspace if not exists
        const newWorkspaceId = crypto.randomUUID();
        await db.insert(workspaces).values({
            id: newWorkspaceId,
            name: "My Workspace",
            userId: session.user.id,
        });

        const newWorkspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.id, newWorkspaceId),
            with: {
                folders: {
                    with: {
                        files: true
                    }
                },
                files: true
            }
        });

        return { success: true, workspace: newWorkspace };
    } catch (error: any) {
        console.error("Error fetching workspace:", error);
        return { success: false, error: error.message || "Failed to fetch workspace" };
    }
}

export async function getLatestFolders() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const userWorkspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.userId, session.user.id),
        });

        if (!userWorkspace) {
            return { success: true, folders: [] };
        }

        const latestFolders = await db.query.workspaceFolders.findMany({
            where: eq(workspaceFolders.workspaceId, userWorkspace.id),
            orderBy: (workspaceFolders, { desc }) => [desc(workspaceFolders.updatedAt)],
            limit: 3,
        });

        return { success: true, folders: latestFolders };
    } catch (error: any) {
        console.error("Error fetching latest folders:", error);
        return { success: false, error: error.message || "Failed to fetch latest folders" };
    }
}

export async function createFolder(workspaceId: string, name: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const id = crypto.randomUUID();
        await db.insert(workspaceFolders).values({
            id,
            name,
            workspaceId,
        });

        return { success: true, folderId: id };
    } catch (error: any) {
        console.error("Error creating folder:", error);
        return { success: false, error: error.message || "Failed to create folder" };
    }
}

export async function createFile(workspaceId: string, folderId: string, name: string, template: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const id = crypto.randomUUID();
        let initialContent = {};

        // Simple initial content based on template
        if (template === "todo") {
            initialContent = {
                type: "doc",
                content: [
                    {
                        type: "heading",
                        attrs: { level: 1 },
                        content: [{ type: "text", text: "To-Do List" }]
                    },
                    {
                        type: "taskList",
                        content: [
                            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Task 1" }] }] }
                        ]
                    }
                ]
            };
        } else if (template === "project") {
            initialContent = {
                type: "doc",
                content: [
                    {
                        type: "heading",
                        attrs: { level: 1 },
                        content: [{ type: "text", text: "Project Plan" }]
                    },
                    {
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: "Overview" }]
                    },
                    {
                        type: "paragraph",
                        content: []
                    },
                    {
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: "Goals" }]
                    }
                ]
            };
        } else if (template === "meeting") {
            initialContent = {
                type: "doc",
                content: [
                    {
                        type: "heading",
                        attrs: { level: 1 },
                        content: [{ type: "text", text: "Meeting Notes" }]
                    },
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: `Date: ${new Date().toLocaleDateString()}` }]
                    },
                    {
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: "Attendees" }]
                    },
                    {
                        type: "bulletList",
                        content: [
                            { type: "listItem", content: [{ type: "paragraph", content: [] }] }
                        ]
                    },
                    {
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: "Agenda" }]
                    },
                    {
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: "Action Items" }]
                    },
                    {
                        type: "taskList",
                        content: [
                            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Action 1" }] }] }
                        ]
                    }
                ]
            };
        } else if (template === "journal") {
            initialContent = {
                type: "doc",
                content: [
                    {
                        type: "heading",
                        attrs: { level: 1 },
                        content: [{ type: "text", text: "Learning Journal" }]
                    },
                    {
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: "What I Learned Today" }]
                    },
                    {
                        type: "paragraph",
                        content: []
                    },
                    {
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: "Challenges" }]
                    },
                    {
                        type: "paragraph",
                        content: []
                    },
                    {
                        type: "heading",
                        attrs: { level: 2 },
                        content: [{ type: "text", text: "Next Steps" }]
                    }
                ]
            };
        } else {
            // Default blank document
            initialContent = {
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: []
                    }
                ]
            };
        }

        await db.insert(workspaceFiles).values({
            id,
            name,
            workspaceId,
            folderId,
            template,
            content: initialContent,
            type: "DOCUMENT"
        });

        return { success: true, fileId: id };
    } catch (error: any) {
        console.error("Error creating file:", error);
        return { success: false, error: error.message || "Failed to create file" };
    }
}

export async function updateFileContent(fileId: string, content: any) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        await db.update(workspaceFiles)
            .set({ content, updatedAt: new Date() })
            .where(eq(workspaceFiles.id, fileId));

        return { success: true };
    } catch (error: any) {
        console.error("Error updating file:", error);
        return { success: false, error: error.message || "Failed to update file" };
    }
}

export async function getFile(fileId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const file = await db.query.workspaceFiles.findFirst({
            where: eq(workspaceFiles.id, fileId)
        });


        return { success: true, file };
    } catch (error: any) {
        console.error("Error fetching file:", error);
        return { success: false, error: error.message || "Failed to fetch file" };
    }
}

export async function getFolder(folderId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const folder = await db.query.workspaceFolders.findFirst({
            where: eq(workspaceFolders.id, folderId),
            with: {
                files: {
                    orderBy: (files, { desc }) => [desc(files.updatedAt)]
                },
                workspace: true
            }
        });

        if (!folder) {
            return { success: false, error: "Folder not found" };
        }

        return { success: true, folder };
    } catch (error: any) {
        console.error("Error fetching folder:", error);
        return { success: false, error: error.message || "Failed to fetch folder" };
    }
}


