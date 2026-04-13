export const dynamic = "force-dynamic";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Separator } from "@/components/ui/separator";
import { ClassroomCollaborators } from "./_components/classroom-collaborators";
import { StudentsClassroomChat } from "./_components/students-classroom-chat";
import {
  getClassroom,
  getClassroomMembers,
} from "@/app/actions/classroom-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, UserPlus, Crown } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { AddStudentDialog } from "./_components/add-student-dialog";
import { Badge } from "@/components/ui/badge";

export default async function ClassroomSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });

  const [{ classroom, isMember }, { members }] = await Promise.all([
    getClassroom(id),
    getClassroomMembers(id),
  ]);

  if (!classroom) {
    notFound();
  }

  const isHead = session?.user.id === classroom.headId;
  const memberIds = (members ?? []).map((m) => m.userId);

  return (
    <div className="p-6 space-y-6">
      {/* Back navigation */}


      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 ">
          <Link href="/dashboard/students/classroom">
            <Button
              variant="ghost"
              size="sm"
              className="pl-0 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {classroom.name}
            </h1>
            {isHead && (
              <Badge
                variant="outline"
                className="gap-1 text-amber-400 border-amber-500/30 bg-amber-500/10 shrink-0"
              >
                <Crown className="size-3" />
                Head
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {classroom.subject}
            {classroom.description && ` • ${classroom.description}`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Member avatars + share */}
          <ClassroomCollaborators
            members={members ?? []}
            classroomId={id}
            classroomName={classroom.name}
          />
        </div>
      </div>

      <Separator className="bg-blue-500" />

      <div>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center rounded-lg border p-4 bg-muted/20">
            <div>
              <h3 className="text-lg font-medium">Classroom Editor</h3>
              <p className="text-sm text-muted-foreground">
                Document editing is managed via your external Novel editor project.
              </p>
            </div>
            <Link
              href="http://localhost:3001"
              target="_blank"
            >
              <Button className="gap-2">
                Open Novel Editor <UserPlus className="size-4 hidden" />
              </Button>
            </Link>
          </div>

          {/* Optional: You can embed the editor directly inside this page using an iframe */}
          {/* <iframe src={`${process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:3001'}?classroomId=${id}`} className="w-full h-[60vh] rounded-md border" /> */}
        </div>

        <StudentsClassroomChat classroomId={id} classroomName={classroom.name} memberCount={(members ?? []).length} />
      </div>
    </div>
  );
}
