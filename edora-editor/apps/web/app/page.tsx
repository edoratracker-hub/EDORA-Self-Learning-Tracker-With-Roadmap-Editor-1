"use client";

import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JSONContent } from "novel";
import ClassroomHeader from "@/components/tailwind/classroom-header";
import { EdoraEditorChat } from "@/components/edora-editor-chat";
import { ArrowLeftIcon } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroomId");
  const fileId = searchParams.get("fileId");
  const userId = searchParams.get("userId");

  const [initialContent, setInitialContent] = useState<JSONContent | null>(null);
  const [documentName, setDocumentName] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!classroomId && !fileId) {
      setIsLoading(false);
      setDocumentName("Local Sandbox");
      return;
    }

    if (classroomId) {
      fetch(`http://localhost:3000/api/classroom/external/${classroomId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.classroom) {
            setDocumentName(data.classroom.name);
            if (data.classroom.content) {
              setInitialContent(data.classroom.content);
            }
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load classroom", err);
          setIsLoading(false);
        });
    } else if (fileId) {
      fetch(`http://localhost:3000/api/workspace/file/external/${fileId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.file) {
            setDocumentName(data.file.name);
            if (data.file.content) {
              setInitialContent(data.file.content);
            }
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load workspace file", err);
          setIsLoading(false);
        });
    }
  }, [classroomId, fileId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 sm:px-5 w-full max-w-screen-lg mx-auto mt-4 px-4">
        {/* Header Skeleton */}
        <div className="w-full flex items-center justify-between border-b pb-3 mb-2 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-8 w-16 bg-muted rounded-md" />
            <div className="h-6 w-48 bg-muted rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 hidden sm:flex">
              <div className="h-9 w-9 bg-muted rounded-full ring-2 ring-background" />
              <div className="h-9 w-9 bg-muted rounded-full ring-2 ring-background" />
              <div className="h-9 w-9 bg-muted rounded-full ring-2 ring-background" />
            </div>
            <div className="h-8 w-20 bg-muted rounded-md ml-0 sm:ml-2" />
          </div>
        </div>

        {/* Editor Content Skeleton */}
        <div className="w-full mt-4 animate-pulse space-y-8">
          {/* Title Placeholder */}
          <div className="h-10 w-2/3 max-w-[400px] bg-muted rounded-lg" />

          {/* First Paragraph Block */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-11/12 bg-muted rounded-md" />
            <div className="h-4 w-5/6 bg-muted rounded-md" />
          </div>

          {/* Second Paragraph Block */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-[95%] bg-muted rounded-md" />
            <div className="h-4 w-3/4 bg-muted rounded-md" />
          </div>

          {/* Section Placeholder */}
          <div className="pt-6">
            <div className="h-7 w-1/3 max-w-[200px] bg-muted rounded-md mb-5" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded-md" />
              <div className="h-4 w-4/5 bg-muted rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4 sm:px-5">
      {classroomId && (
        <ClassroomHeader classroomName={documentName} classroomId={classroomId} />
      )}

      {fileId && (
        <div className="w-full max-w-screen-lg flex items-center gap-2 mb-0">
          <a
            href={`http://localhost:3000/dashboard/students/workspace`}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground flex items-center text-sm transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </a>
          <h1 className="text-2xl font-semibold">{documentName}</h1>
        </div>
      )}
      {/* Pass the dynamic props down to the Editor */}
      <TailwindAdvancedEditor
        classroomId={classroomId || undefined}
        fileId={fileId || undefined}
        dynamicInitialContent={initialContent}
      />

      {/* Floating Chat Interface */}
      {classroomId && userId && <EdoraEditorChat classroomId={classroomId} userId={userId} />}
    </div>
  );
}
