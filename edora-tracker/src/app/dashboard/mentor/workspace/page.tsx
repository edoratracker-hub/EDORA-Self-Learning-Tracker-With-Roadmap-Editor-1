export const dynamic = 'force-dynamic';

import { getWorkspace } from "@/app/actions/workspace-actions";
import { getSharedFiles } from "@/app/actions/collaboration-actions";
import { CreateFolderButton } from "@/app/dashboard/students/workspace/_components/create-folder-button";
import { WorkspaceView } from "@/components/workspace/workspace-view";

export default async function MentorWorkspacePage() {
    const [{ workspace, error }, { files: sharedFiles }] = await Promise.all([
        getWorkspace(),
        getSharedFiles(),
    ]);

    if (error || !workspace) {
        return (
            <div className="p-6">
                <div className="text-red-500">Error loading workspace: {error}</div>
            </div>
        );
    }

    return (
        <WorkspaceView
            workspaceId={workspace.id}
            folders={workspace.folders ?? []}
            sharedFiles={sharedFiles ?? []}
            basePath="/dashboard/mentor"
            title="Mentor Workspace"
            subtitle="Manage your mentorship resources, notes, and session plans."
            createFolderSlot={<CreateFolderButton workspaceId={workspace.id} />}
        />
    );
}
