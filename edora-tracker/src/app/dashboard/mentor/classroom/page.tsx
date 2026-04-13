export const dynamic = "force-dynamic";

import { getMyClassrooms } from '@/app/actions/classroom-actions'
import { MentorClassroomHeader } from './_components/students-classroom-header'
import { MentorClassroomCards } from './_components/mentor-classroom-cards'
import { Separator } from '@/components/ui/separator'
import { auth } from '@/app/lib/auth'
import { headers } from 'next/headers'

const MentorClassroomPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  const { classrooms } = await getMyClassrooms()
  return (
    <div className='p-6 space-y-6'>
      <MentorClassroomHeader />
      <Separator className='bg-blue-500' />
      <MentorClassroomCards classrooms={classrooms} userId={session?.user?.id} />
    </div>
  )
}

export default MentorClassroomPage