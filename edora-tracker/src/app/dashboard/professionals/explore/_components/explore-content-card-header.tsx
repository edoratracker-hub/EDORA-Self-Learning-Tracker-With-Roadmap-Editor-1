import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookmarkIcon, MoreHorizontalIcon, UserPlusIcon } from "lucide-react";
import { ExploreContentDropdown } from "./explore-content-dropdown";

type CardHeaderProps = {
  author: {
    name: string;
    avatar: string;
    role: string;
    location: string;
  };
  timeAgo: string;
};

export const ExploreContentCardHeader = ({
  author,
  timeAgo,
}: CardHeaderProps) => {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-10 ring-2 ring-border/50 ring-offset-2 ring-offset-card">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className="text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold leading-none">
              {author.name}
            </span>
            <span className="text-xs text-muted-foreground">· {timeAgo}</span>
          </div>
          <span className="text-xs text-muted-foreground leading-none">
            {author.role}
          </span>
          <span className="text-[11px] text-muted-foreground/60 leading-none mt-0.5">
            {author.location}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-accent"
            >
              <UserPlusIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Follow</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-accent"
            >
              <BookmarkIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save</TooltipContent>
        </Tooltip>

        <ExploreContentDropdown>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </ExploreContentDropdown>
      </div>
    </div>
  );
};
