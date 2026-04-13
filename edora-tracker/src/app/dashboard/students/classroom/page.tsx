export const dynamic = "force-dynamic";
import { StudentsClassroomHeader } from './_components/students-classroom-header'
import { Separator } from '@/components/ui/separator'
import { StudentsClassroomCards } from './_components/students-classroom-cards'
import { getMyClassrooms } from '@/app/actions/classroom-actions'
import { auth } from '@/app/lib/auth'
import { headers } from 'next/headers'

const StudentsClassroomPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  const { classrooms } = await getMyClassrooms()

  return (
    <div className='p-6 space-y-6'>
      <StudentsClassroomHeader />
      <Separator className='bg-blue-500' />
      <StudentsClassroomCards classrooms={classrooms} userId={session?.user?.id} />
    </div>
  )
}

export default StudentsClassroomPage