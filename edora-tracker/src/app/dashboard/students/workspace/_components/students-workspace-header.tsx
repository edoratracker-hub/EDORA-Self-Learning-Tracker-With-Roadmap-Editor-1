import React from 'react'
import { CreateFolderButton } from './create-folder-button'

interface StudentsWorkspaceHeaderProps {
    workspaceId: string;
}

export const StudentsWorkspaceHeader = ({ workspaceId }: StudentsWorkspaceHeaderProps) => {
    return (
        <div className='flex items-center justify-between'>
            <div>
                <h1 className='text-2xl font-bold'>Workspace</h1>
                <p className='text-sm text-muted-foreground'>Manage your files and folders</p>
            </div>
            <div>
                <CreateFolderButton workspaceId={workspaceId} />
            </div>
        </div>
    )
}
