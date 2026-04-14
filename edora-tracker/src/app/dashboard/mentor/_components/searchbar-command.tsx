"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/command";
import { SearchIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { MentorDashboardPaths } from "@/lib/mentor-dashboard-paths";

export function CommandManyItems() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

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

  const handleSelect = (url: string, external?: boolean) => {
    setOpen(false);
    if (external) {
      window.open(url, "_blank");
    } else {
      router.push(url);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full shrink-0 max-w-[600px] justify-start text-muted-foreground"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <Kbd>ctrl+K</Kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search pages and actions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {/* Main Navigation */}
            <CommandGroup heading="Navigation">
              {MentorDashboardPaths.navMain.map((item) => (
                <CommandItem
                  key={item.url}
                  onSelect={() => handleSelect(item.url, (item as any).external)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  {(item as any).external && (
                    <span className="ml-auto text-[10px] text-muted-foreground uppercase tracking-wider">
                      External
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Utilities */}
            <CommandGroup heading="Utilities">
              {MentorDashboardPaths.utilities.map((item) => (
                <CommandItem
                  key={item.url}
                  onSelect={() => handleSelect(item.url, (item as any).external)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  {(item as any).external && (
                    <span className="ml-auto text-[10px] text-muted-foreground uppercase tracking-wider">
                      External
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Workspace */}
            <CommandGroup heading="Workspace">
              {MentorDashboardPaths.navWorkspace.map((item) => (
                <CommandItem
                  key={item.url}
                  onSelect={() => handleSelect(item.url)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
