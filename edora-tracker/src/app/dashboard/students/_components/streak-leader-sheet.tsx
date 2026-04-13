"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronsRightIcon, XIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import { Leaderboard } from "./leaderboard";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const StreakAndLeaderboardSheet = ({
  children,
  props,
}: {
  children: React.ReactNode;
  props?: ComponentProps<typeof Sheet>;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet modal open={open} onOpenChange={setOpen} {...props}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <ChevronsRightIcon />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="gap-0 p-0" showCloseButton={false}>
        <SheetHeader className="border-b px-5 py-4 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-0.5">
            <SheetTitle className="text-base font-semibold">
              Streaks & Leaderboard
            </SheetTitle>
            <SheetDescription className="text-xs">
              Your activity and ranking overview
            </SheetDescription>
          </div>

          <SheetClose asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-5">
            <Leaderboard />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
