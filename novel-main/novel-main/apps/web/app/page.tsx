"use client";

import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JSONContent } from "novel";
import ClassroomHeader from "@/components/tailwind/classroom-header";

export default function Page() {
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroomId");
  
  const [initialContent, setInitialContent] = useState<JSONContent | null>(null);
  const [classroomName, setClassroomName] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!classroomId) {
      setIsLoading(false);
      setClassroomName("Local Sandbox");
      return;
    }

    // Fetch the stored classroom content from Edora Tracker
    fetch(`http://localhost:3000/api/classroom/external/${classroomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.classroom) {
          setClassroomName(data.classroom.name);
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
  }, [classroomId]);

  if (isLoading) {
    return <div className="flex justify-center py-20">Loading document...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4 sm:px-5">
      {classroomId && (
        <ClassroomHeader classroomName={classroomName} classroomId={classroomId} />
      )}
      {/* Pass the dynamic props down to the Editor */}
      <TailwindAdvancedEditor 
        classroomId={classroomId} 
        dynamicInitialContent={initialContent} 
      />
    </div>
  );
}
