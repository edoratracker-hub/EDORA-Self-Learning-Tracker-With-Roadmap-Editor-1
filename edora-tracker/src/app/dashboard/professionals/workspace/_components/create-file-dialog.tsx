
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Loader2, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFile } from "@/app/actions/workspace-actions";
import { cn } from "@/lib/utils";

interface CreateFileDialogProps {
    workspaceId: string;
    folderId: string;
}

const TEMPLATES = [
    {
        id: "blank",
        name: "Blank Document",
        description: "Start from scratch",
        icon: FileText
    },
    {
        id: "todo",
        name: "To-Do List",
        description: "Keep track of tasks",
        icon: Check
    },
    {
        id: "project",
        name: "Project Planning",
        description: "Plan your next big project",
        icon: FileText
    },
    {
        id: "meeting",
        name: "Meeting Notes",
        description: "Capture meeting minutes",
        icon: FileText
    },
    {
        id: "journal",
        name: "Learning Journal",
        description: "Track your learning progress",
        icon: FileText
    }
];

export function CreateFileDialog({ workspaceId, folderId }: CreateFileDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("blank");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await createFile(workspaceId, folderId, name, selectedTemplate);
            if (result.success) {
                toast.success("File created successfully");
                setOpen(false);
                setName("");
                setSelectedTemplate("blank");
                router.refresh();
                // Optionally redirect to the new file
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    New File
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New File</DialogTitle>
                        <DialogDescription>
                            Create a new file inside this folder.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                File Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My Document"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Choose Template</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {TEMPLATES.map((template) => (
                                    <div
                                        key={template.id}
                                        className={cn(
                                            "cursor-pointer rounded-md border p-4 hover:border-primary transition-all text-center",
                                            selectedTemplate === template.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-input"
                                        )}
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            <template.icon className="h-5 w-5" />
                                        </div>
                                        <div className="text-sm font-medium">{template.name}</div>
                                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create File
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
