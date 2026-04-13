"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
  RepeatIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
}

type CardFooterProps = {
  likes: number;
  comments: number;
  shares: number;
};

export const ExploreContentCardFooter = ({
  likes,
  comments,
  shares,
}: CardFooterProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center justify-between w-full -mx-2">
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5 text-muted-foreground hover:text-rose-400 transition-colors h-8 px-3",
            liked && "text-rose-400",
          )}
          onClick={() => setLiked(!liked)}
        >
          <HeartIcon className={cn("size-4", liked && "fill-rose-400")} />
          <span className="text-xs font-medium">
            {formatCount(liked ? likes + 1 : likes)}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-accent transition-colors h-8 px-3"
        >
          <MessageCircleIcon className="size-4" />
          <span className="text-xs font-medium">{formatCount(comments)}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-emerald-400 transition-colors h-8 px-3"
        >
          <RepeatIcon className="size-4" />
          <span className="text-xs font-medium">{formatCount(shares)}</span>
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-accent transition-colors h-8 px-3"
      >
        <Share2Icon className="size-4" />
      </Button>
    </div>
  );
};
