import React from 'react'
import { CreateMentorClassroomDialog } from './create-classroom-dialog'

export const MentorClassroomHeader = () => {
    return (
        <div className='flex items-center justify-between'>
            <div>
                <h1 className='text-2xl font-bold'>Classroom</h1>
                <p className='text-sm text-muted-foreground'>Manage your classrooms</p>
            </div>
            <div>
                <CreateMentorClassroomDialog />
            </div>
        </div>
    )
}
