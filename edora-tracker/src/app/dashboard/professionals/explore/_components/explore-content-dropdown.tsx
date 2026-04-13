"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FlagIcon,
  EyeOffIcon,
  LinkIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { ComponentProps, useState } from "react";

export const ExploreContentDropdown = ({
  children,
  props,
}: {
  children?: React.ReactNode;
  props?: ComponentProps<typeof DropdownMenu>;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu modal {...props} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LinkIcon className="size-4" />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EyeOffIcon className="size-4" />
            Hide post
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FlagIcon className="size-4" />
            Report
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <Trash2Icon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
