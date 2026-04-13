"use client";

import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { searchStudents, addStudentToClassroom } from "@/app/actions/classroom-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddStudentDialogProps {
    classroomId: string;
    existingMemberIds: string[];
    children?: React.ReactNode;
}

export function AddStudentDialog({ classroomId, existingMemberIds, children }: AddStudentDialogProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState<string | null>(null);
    const router = useRouter();

    const handleSearch = useCallback(async (q: string) => {
        setQuery(q);
        if (q.trim().length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        const res = await searchStudents(q);
        setResults(res.users ?? []);
        setSearching(false);
    }, []);

    const handleAdd = async (userId: string, userName: string) => {
        setAdding(userId);
        const res = await addStudentToClassroom(classroomId, userId);
        if (res.success) {
            toast.success(`${userName} added to the classroom!`);
            setResults((prev) => prev.filter((u) => u.id !== userId));
            router.refresh();
        } else {
            toast.error(res.error ?? "Failed to add student.");
        }
        setAdding(null);
    };

    const isAlreadyMember = (userId: string) => existingMemberIds.includes(userId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? (
                    <Button size="sm" id="add-student-btn">
                        <UserPlus className="size-4" />
                        Add Student
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="size-4 text-blue-400" />
                        Add Student to Classroom
                    </DialogTitle>
                    <DialogDescription>
                        Search for students by name or email to add them to this classroom.
                    </DialogDescription>
                </DialogHeader>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="student-search-input"
                        placeholder="Search students by name or email..."
                        className="pl-9"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {/* Loading */}
                {searching && (
                    <p className="text-xs text-muted-foreground text-center py-2 flex items-center justify-center gap-1.5">
                        <Loader2 className="size-3 animate-spin" /> Searching...
                    </p>
                )}

                {/* Results */}
                {results.length > 0 && (
                    <ScrollArea className="max-h-60 border rounded-md">
                        <div className="p-1">
                            {results.map((u) => {
                                const already = isAlreadyMember(u.id);
                                return (
                                    <div
                                        key={u.id}
                                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={u.image} />
                                            <AvatarFallback className="text-xs">
                                                {u.name?.substring(0, 2).toUpperCase() || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{u.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={already ? "ghost" : "default"}
                                            className="h-7 text-xs shrink-0"
                                            disabled={already || adding === u.id}
                                            onClick={() => handleAdd(u.id, u.name || u.email)}
                                            id={`add-student-${u.id}`}
                                        >
                                            {already
                                                ? "Member"
                                                : adding === u.id
                                                    ? <Loader2 className="size-3 animate-spin" />
                                                    : "Add"}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}

                {query.length >= 2 && !searching && results.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No students found matching &quot;{query}&quot;
                    </p>
                )}

                {query.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Type at least 2 characters to search students.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
