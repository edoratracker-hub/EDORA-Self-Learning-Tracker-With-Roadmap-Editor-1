"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceEditorProps {
  file: any;
}

export function WorkspaceEditor({ file }: WorkspaceEditorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
      <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
        <span className="text-2xl italic font-serif">N</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Tiptap Editor Removed</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          The Tiptap editor has been removed from the platform. Use the Project Editor tab to open the Novel editor for this file.
        </p>
      </div>
    </div>
  );
}

