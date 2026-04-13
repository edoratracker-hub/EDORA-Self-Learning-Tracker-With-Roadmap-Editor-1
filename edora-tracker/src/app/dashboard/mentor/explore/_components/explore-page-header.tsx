import { Button } from "@/components/ui/button";
import { PenSquareIcon, CompassIcon } from "lucide-react";
import React from "react";
import { ExplorePostsDialogForm } from "../_forms/explore-posts-dialog-form";

interface ExplorePageHeaderProps {
  onPostCreated?: () => void;
}

export const ExplorePageHeader = ({ onPostCreated }: ExplorePageHeaderProps) => {
  return (
    <div className="space-y-5">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CompassIcon className="size-5 text-accent" />
            <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Discover what your peers and mentors are sharing
          </p>
        </div>
      </div>
    </div>
  );
};
