export const dynamic = 'force-dynamic';

import { getFolder } from "@/app/actions/workspace-actions";
import { CreateFileDialog } from "@/app/dashboard/students/workspace/_components/create-file-dialog";
import { FileText, ChevronLeft, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

interface FolderPageProps {
    params: Promise<{ folderId: string }>;
}

export default async function MentorFolderPage({ params }: FolderPageProps) {
    const { folderId } = await params;
    const { folder, error } = await getFolder(folderId);

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (error || !folder) {
        return (
            <div className="p-6">
                <Link href="/dashboard/mentor/workspace">
                    <Button variant="ghost" className="mb-4 pl-0">
                        <ChevronLeft className="mr-2 h-4 w-4" />
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
                <Link href="/dashboard/mentor/workspace" className="w-fit">
                    <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Workspace
                    </Button>
                </Link>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FolderOpen className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">{folder.name}</h1>
                    </div>
                    <CreateFileDialog workspaceId={folder.workspaceId} folderId={folder.id} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {folder.files.map((file: any) => (
                    <Link
                        key={file.id}
                        href={`${process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:3001'}?fileId=${file.id}&folderId=${file.folderId}&userId=${userId}`} target="_blank" className="transition-all hover:scale-[1.02]"
                    >
                        <Card className="h-full hover:bg-accent/50 cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {file.type === "DOCUMENT" ? "DOCUMENT" : file.type}
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold truncate pr-2">{file.name}</div>
                                <div className="flex justify-between items-end mt-2">
                                    <p className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-0.5 rounded-full">
                                        {file.template || "Blank"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Edited {formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {folder.files.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                        <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>No files yet. Create one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
