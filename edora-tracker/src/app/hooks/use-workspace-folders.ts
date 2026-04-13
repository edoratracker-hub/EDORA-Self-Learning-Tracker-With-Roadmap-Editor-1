import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLatestFolders, createFolder, getWorkspace } from "@/app/actions/workspace-actions";
import { toast } from "sonner";

export function useWorkspaceFolders() {
    const queryClient = useQueryClient();

    const { data: workspaceData } = useQuery({
        queryKey: ["workspace"],
        queryFn: () => getWorkspace(),
    });

    const { data, isLoading } = useQuery({
        queryKey: ["latest-folders"],
        queryFn: () => getLatestFolders(),
        refetchOnWindowFocus: false,
    });

    const createFolderMutation = useMutation({
        mutationFn: async (name: string) => {
            if (!workspaceData?.workspace?.id) {
                throw new Error("Workspace not found");
            }
            return createFolder(workspaceData.workspace.id, name);
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Folder created");
                queryClient.invalidateQueries({ queryKey: ["latest-folders"] });
            } else {
                toast.error(res.error || "Failed to create folder");
            }
        },
    });

    return {
        folders: data?.folders || [],
        isLoading,
        createFolder: createFolderMutation.mutate,
        isCreating: createFolderMutation.isPending,
    };
}
