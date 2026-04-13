export const dynamic = 'force-dynamic';
import { getFolder } from "@/app/actions/workspace-actions";
import { CreateFileDialog } from "@/app/dashboard/students/workspace/_components/create-file-dialog";
import { ChevronLeft, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FolderFilesCards } from "./_components/folder-files-cards";

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  const { folder, error } = await getFolder(folderId);

  if (error || !folder) {
    return (
      <div className="p-6">
        <Link href="/dashboard/students/workspace">
          <Button variant="ghost" className="mb-4 pl-0">
            <ChevronLeft className="mr-2 size-4" />
            Back to Workspace
          </Button>
        </Link>
        <div className="text-red-500">Error loading folder: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <Link href="/dashboard/students/workspace" className="w-fit">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <ChevronLeft className="mr-2 size-4" />
            Back to Workspace
          </Button>
        </Link>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#21262d] flex items-center justify-center ring-1 ring-[#30363d]">
              <FolderOpen className="size-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{folder.name}</h1>
              <p className="text-sm text-muted-foreground">Manage files inside this folder</p>
            </div>
          </div>
          <CreateFileDialog
            workspaceId={folder.workspaceId}
            folderId={folder.id}
          />
        </div>
      </div>

      <Separator className='bg-[#30363d]' />

      <FolderFilesCards files={folder.files} />
    </div>
  );
}
