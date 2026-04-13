import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  CirclePlusIcon,
  FolderIcon,
  Loader2,
  LucideIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useWorkspaceFolders } from "@/app/hooks/use-workspace-folders";
import { CreateFolderDialog } from "@/app/dashboard/students/workspace/_components/create-folder-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavDocuments({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { folders, createFolder, isCreating } = useWorkspaceFolders();

  const handleCreateFolder = (name: string) => {
    createFolder(name, {
      onSuccess: (res) => {
        if (res.success) {
          setIsDialogOpen(false);
        }
      },
    });
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupContent className="flex flex-col">
          <SidebarGroupLabel className="flex items-center justify-between">
            <Link
              href="/dashboard/students/workspace"
              className="hover:text-foreground transition-colors"
            >
              Workspace
            </Link>
            <Button
              variant="ghost"
              size="icon-xs"
              className=""
              disabled={isMobile || isCreating}
              onClick={() => setIsDialogOpen(true)}
            >
              {isCreating ? (
                <Loader2 className="!size-4 animate-spin" />
              ) : (
                <CirclePlusIcon className="!size-4" />
              )}
            </Button>
          </SidebarGroupLabel>
          <Separator className="ml-2 bg-green-600 max-w-20" />
          <SidebarMenu className="mt-2">
            {/* Dynamic Folders */}
            {folders.map((folder: any) => (
              <SidebarMenuItem
                key={folder.id}
                className="flex items-center justify-between"
              >
                <SidebarMenuButton
                  tooltip={folder.name}
                  asChild
                  isActive={pathname.includes(folder.id)}
                >
                  <Link href={`/dashboard/students/workspace/${folder.id}`}>
                    <FolderIcon />
                    <span className="truncate">{folder.name}</span>
                  </Link>
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <MoreVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <PencilIcon />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        <Trash2Icon />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <CreateFolderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateFolder}
        isLoading={isCreating}
      />
    </>
  );
}
