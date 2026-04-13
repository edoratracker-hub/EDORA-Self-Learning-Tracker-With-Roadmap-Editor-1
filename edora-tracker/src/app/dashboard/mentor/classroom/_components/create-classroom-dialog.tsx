"use client";

import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, Loader2, School2 } from "lucide-react";
import { createClassroom } from "@/app/actions/classroom-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = [
    { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "violet", label: "Violet", class: "bg-violet-500" },
    { value: "amber", label: "Amber", class: "bg-amber-500" },
    { value: "rose", label: "Rose", class: "bg-rose-500" },
    { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
];

export function CreateMentorClassroomDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        subject: "",
        description: "",
        color: "blue",
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.subject.trim()) {
            toast.error("Name and subject are required.");
            return;
        }

        setLoading(true);
        try {
            const res = await createClassroom({
                name: form.name.trim(),
                subject: form.subject.trim(),
                description: form.description.trim() || undefined,
                color: form.color,
            });

            if (res.success) {
                toast.success("Classroom created successfully!");
                setOpen(false);
                setForm({ name: "", subject: "", description: "", color: "blue" });
                router.refresh();
            } else {
                toast.error(res.error ?? "Failed to create classroom.");
            }
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button id="create-classroom-btn">
                    <PlusIcon className="size-4" />
                    Add
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <School2 className="size-4 text-blue-400" />
                        Create Classroom
                    </DialogTitle>
                    <DialogDescription>
                        You will be the head of this classroom. You can add students after creation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="classroom-name">Classroom Name *</Label>
                        <Input
                            id="classroom-name"
                            placeholder="e.g. Advanced Mathematics Batch A"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                        <Label htmlFor="classroom-subject">Subject *</Label>
                        <Input
                            id="classroom-subject"
                            placeholder="e.g. Mathematics, Physics, Web Dev..."
                            value={form.subject}
                            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="classroom-description">Description</Label>
                        <Textarea
                            id="classroom-description"
                            placeholder="Optional — describe what this classroom is about..."
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    {/* Color picker */}
                    <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex gap-2">
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setForm((p) => ({ ...p, color: c.value }))}
                                    className={cn(
                                        "size-7 rounded-full transition-all ring-offset-background",
                                        c.class,
                                        form.color === c.value
                                            ? "ring-2 ring-offset-2 ring-white/60 scale-110"
                                            : "opacity-60 hover:opacity-100"
                                    )}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} id="submit-create-classroom">
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Classroom"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
