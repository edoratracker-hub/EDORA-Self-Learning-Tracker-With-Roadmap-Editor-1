"use client";

import { ArrowLeft, Share } from "lucide-react";

export default function ClassroomHeader({ 
  classroomName, 
  classroomId 
}: { 
  classroomName: string; 
  classroomId: string; 
}) {
  return (
    <div className="w-full max-w-screen-lg flex items-center justify-between border-b pb-4 mb-4">
      <div className="flex items-center gap-4">
        {/* Back button that returns to Edora Tracker */}
        <a 
          href={`http://localhost:3000/dashboard/students/classroom/${classroomId}`}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classroom
        </a>
        <h1 className="text-xl font-bold">{classroomName}</h1>
      </div>

      <div className="flex items-center gap-2">
         {/* Share / Collab Button Placeholder */}
        <button 
          onClick={() => {
            navigator.clipboard.writeText(`http://localhost:3000/join/classroom/${classroomId}`);
            alert("Invite link copied to clipboard!");
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium"
        >
          <Share className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}
