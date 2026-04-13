export const dynamic = "force-dynamic";
import { StudentsWorkspaceHeader } from './_components/students-workspace-header'
import { Separator } from '@/components/ui/separator'
import { StudentsWorkspaceCards } from './_components/students-workspace-cards'
import { getWorkspace } from '@/app/actions/workspace-actions'
import { getSharedFiles } from '@/app/actions/collaboration-actions'

const StudentsWorkspacePage = async () => {
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
    <div className='p-6 space-y-6'>
      <StudentsWorkspaceHeader workspaceId={workspace.id} />
      <Separator className='bg-blue-500' />
      <StudentsWorkspaceCards
        folders={workspace.folders ?? []}
        basePath="/dashboard/students"
      />
    </div>
  )
}

export default StudentsWorkspacePage
