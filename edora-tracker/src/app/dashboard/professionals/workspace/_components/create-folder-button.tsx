"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateFolderDialog } from "./create-folder-dialog";
import { createFolder } from "@/app/actions/workspace-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateFolderButtonProps {
    workspaceId: string;
}

export function CreateFolderButton({ workspaceId }: CreateFolderButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const handleCreateFolder = async (name: string) => {
        setIsCreating(true);
        try {
            const result = await createFolder(workspaceId, name);
            if (result.success) {
                toast.success("Folder created successfully");
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to create folder");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Folder
            </Button>
            <CreateFolderDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                onSubmit={handleCreateFolder}
                isLoading={isCreating}
            />
        </>
    );
}
