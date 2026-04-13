"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  BellIcon,
  CalendarIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
  ClipboardListIcon,
  MessageSquareIcon,
} from "lucide-react";
import { Kbd } from "@/components/ui/kbd";

export function CommandManyItems() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full shrink-0 max-w-[600px] justify-start text-muted-foreground"
      >
        <SearchIcon className=" h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <Kbd>ctrl+K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem>
                <HomeIcon />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <UsersIcon />
                <span>Mentees</span>
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CalendarIcon />
                <span>Schedule</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <MessageSquareIcon />
                <span>Messages</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FolderIcon />
                <span>Workspace</span>
                <CommandShortcut>⌘W</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Mentor Actions">
              <CommandItem>
                <UsersIcon />
                <span>View All Mentees</span>
              </CommandItem>
              <CommandItem>
                <CalendarIcon />
                <span>Schedule Session</span>
              </CommandItem>
              <CommandItem>
                <ClipboardListIcon />
                <span>Assign Task</span>
              </CommandItem>
              <CommandItem>
                <FileTextIcon />
                <span>Review Progress</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem>
                <UserIcon />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCardIcon />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SettingsIcon />
                <span>Settings</span>
              </CommandItem>
              <CommandItem>
                <BellIcon />
                <span>inbox</span>
              </CommandItem>
              <CommandItem>
                <HelpCircleIcon />
                <span>Help & Support</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
