export const dynamic = 'force-dynamic';

import { getFile } from "@/app/actions/workspace-actions";
import { WorkspaceEditor } from "@/app/dashboard/students/workspace/_components/workspace-editor";
import { ChevronLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/workspace/share-dialog";
import { CollaboratorAvatars } from "@/components/workspace/collaborator-avatars";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

interface FilePageProps {
    params: Promise<{ fileId: string }>;
}

export default async function MentorFilePage({ params }: FilePageProps) {
    const { fileId } = await params;
    const { file, error } = await getFile(fileId);

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (error || !file) {
        return (
            <div className="p-6">
                <Link href="/dashboard/mentor/workspace">
                    <Button variant="ghost" className="mb-4 pl-0">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Workspace
                    </Button>
                </Link>
                <div className="text-red-500">Error loading file: {error}</div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="border-b px-6 py-3 flex items-center gap-4 bg-background z-10">
                <Link href={`/dashboard/mentor/workspace/${file.folderId}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold leading-none">{file.name}</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        {file.template ? `${file.template} template` : "Document"} • Saved automatically
                    </p>
                </div>
                <CollaboratorAvatars fileId={file.id} />
                <ShareDialog fileId={file.id} fileName={file.name} />
            </div>

            <Tabs defaultValue="editor" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 pt-4 border-b">
                    <TabsList className="w-fit">
                        <TabsTrigger value="editor">Document Editor</TabsTrigger>
                        <TabsTrigger value="project">Project Editor</TabsTrigger>
                    </TabsList>
                </div>
                
                <TabsContent value="editor" className="flex-1 overflow-hidden m-0 border-none p-0 outline-none">
                    <WorkspaceEditor file={file} />
                </TabsContent>
                
                <TabsContent value="project" className="flex-1 overflow-y-auto p-6 m-0">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex justify-between items-center rounded-lg border p-4 bg-muted/20">
                            <div>
                                <h3 className="text-lg font-medium">Project Editor</h3>
                                <p className="text-sm text-muted-foreground">
                                    Document editing is managed via your external Novel editor project.
                                </p>
                            </div>
                            <Link href={`${process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:3001'}?fileId=${file.id}&folderId=${file.folderId}&userId=${userId}`} target="_blank">
                                <Button className="gap-2">
                                    Open Novel Editor <UserPlus className="size-4 hidden" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
