import React from 'react'
import { CreateClassroomDialog } from './create-classroom-dialog'

export const StudentsClassroomHeader = () => {
    return (
        <div className='flex items-center justify-between'>
            <div>
                <h1 className='text-2xl font-bold'>Classroom</h1>
                <p className='text-sm text-muted-foreground'>Manage your classrooms</p>
            </div>
            <div>
                <CreateClassroomDialog />
            </div>
        </div>
    )
}
